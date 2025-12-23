package com.pracbet.pracbet.FootballAPI.services;

import com.pracbet.pracbet.FootballAPI.entities.MatchesEntity;
import com.pracbet.pracbet.FootballAPI.entities.OddsEntity;
import com.pracbet.pracbet.FootballAPI.repositories.MatchesRepository;
import com.pracbet.pracbet.FootballAPI.repositories.OddsRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.HttpClientErrorException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Set;

@Service
public class OddsSearchService {

    private final RestTemplate restTemplate;
    private final MatchesRepository matchesRepository;
    private final OddsRepository oddsRepository;
    private final ObjectMapper objectMapper;

    @Value("${api.football.key}")
    private String apiKey;

    @Value("${api.football.host}")
    private String apiHost;

    private static final Set<String> ALLOWED_BETS = Set.of(
            "Match Winner",
            "Goals Over/Under",
            "Both Teams Score",
            "Double Chance",
            "Corners 1x2",
            "Corners Over Under",
            "Cards Over/Under",
            "Total ShotOnGoal",
            "Shot On Target 1x2"
    );

    public OddsSearchService(RestTemplate restTemplate, MatchesRepository matchesRepository, OddsRepository oddsRepository, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.matchesRepository = matchesRepository;
        this.oddsRepository = oddsRepository;
        this.objectMapper = objectMapper;
    }

    @Scheduled(cron = "20 52 23 * * ?")
    public void fetchOddsForMatches() {
        List<MatchesEntity> matches = matchesRepository.findByStatusMatchAndOddsUploaded("NS", false);

        if (matches.isEmpty()) {
            return;
        }

        int maxRetries = 3;
        int retryDelay = 60000;

        int totalPages = 1;
        boolean success = false;
        int attempt = 0;

        while (attempt < maxRetries && !success) {
            try {
                String url = "https://api-football-v1.p.rapidapi.com/v3/odds?date=" + "2025-12-27" + "&page=1&bookmaker=8";
                HttpHeaders headers = new HttpHeaders();
                headers.set("x-rapidapi-key", apiKey);
                headers.set("x-rapidapi-host", apiHost);
                HttpEntity<String> entity = new HttpEntity<>(headers);

                ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
                totalPages = getTotalPagesFromResponse(response.getBody());

                for (int page = 1; page <= totalPages; page++) {
                    fetchAndProcessOdds(page, matches);
                }

                for (MatchesEntity match : matches) {
                    match.markOddsAsUploaded(true);
                    matchesRepository.save(match);
                }

                success = true;
            } catch (HttpClientErrorException.TooManyRequests e) {
                attempt++;
                System.out.println("Erro 429: Muitas requisições. Tentativa " + attempt + " de " + maxRetries + ". Aguardando " + (retryDelay / 1000) + " segundos...");
                try {
                    Thread.sleep(retryDelay);
                } catch (InterruptedException ex) {
                    Thread.currentThread().interrupt();
                }
            } catch (Exception e) {
                e.printStackTrace();
                break;
            }
        }
    }

    private void fetchAndProcessOdds(int page, List<MatchesEntity> matches) {
        try {
            String pageUrl = "https://api-football-v1.p.rapidapi.com/v3/odds?date=2025-12-27" /*+ LocalDate.now()*/ + "&page=" + page + "&bookmaker=8";
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-rapidapi-key", apiKey);
            headers.set("x-rapidapi-host", apiHost);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> pageResponse = restTemplate.exchange(pageUrl, HttpMethod.GET, entity, String.class);
            processOddsForMatches(pageResponse.getBody(), matches);
        } catch (HttpClientErrorException.TooManyRequests e) {
            System.out.println("Erro 429 na página " + page + ". Aguardando 60s antes de tentar novamente...");
            try {
                Thread.sleep(60000);
                fetchAndProcessOdds(page, matches);
            } catch (InterruptedException ex) {
                Thread.currentThread().interrupt();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private int getTotalPagesFromResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            return root.path("paging").path("total").asInt();
        } catch (Exception e) {
            e.printStackTrace();
            return 1;
        }
    }

    private void processOddsForMatches(String responseBody, List<MatchesEntity> matches) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode responseArray = root.path("response");

            if (responseArray.isArray() && responseArray.size() > 0) {
                for (JsonNode leagueNode : responseArray) {
                    JsonNode fixtureNode = leagueNode.path("fixture");
                    Long fixtureId = fixtureNode.path("id").asLong();

                    for (MatchesEntity match : matches) {
                        if (!fixtureId.equals(match.getFixtureId())) {
                            continue;
                        }

                        JsonNode bookmakersArray = leagueNode.path("bookmakers");
                        for (JsonNode bookmakerNode : bookmakersArray) {
                            JsonNode betsArray = bookmakerNode.path("bets");

                            for (JsonNode betNode : betsArray) {

                                String betType = betNode.path("name").asText();
                                if (!ALLOWED_BETS.contains(betType)) {
                                    continue;
                                }

                                JsonNode valuesArray = betNode.path("values");
                                for (JsonNode valueNode : valuesArray) {
                                    String outcome = valueNode.path("value").asText();
                                    double odd = valueNode.path("odd").asDouble();

                                    OddsEntity oddsEntity = new OddsEntity();
                                    oddsEntity.setMatch(match);
                                    oddsEntity.setBetType(betType);
                                    oddsEntity.setValue(outcome);
                                    oddsEntity.setOdd(odd);

                                    oddsRepository.save(oddsEntity);
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
