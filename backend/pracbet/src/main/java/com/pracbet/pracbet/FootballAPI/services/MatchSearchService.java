package com.pracbet.pracbet.FootballAPI.services;

import com.pracbet.pracbet.FootballAPI.entities.MatchesEntity;
import com.pracbet.pracbet.FootballAPI.repositories.MatchesRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class MatchSearchService {

    private final MatchesRepository matchesRepository;
    private final RestTemplate restTemplate;

    @Value("${api.football.key}")
    private String apiKey;

    @Value("${api.football.host}")
    private String apiHost;

    private static final List<Integer> MAIN_LEAGUES = List.of(
            2,   //Champions League
            5,   // UEFA Nations League
            34,  // World Cup - Qualification South America
            39,  // Premier League (Inglaterra)
            140, // La Liga (Espanha)
            78,  // Bundesliga (Alemanha)
            135, // Serie A (Itália)
            61,  // Ligue 1 (França)
            88,  // Eredivisie (Países Baixos)
            94,  // Primeira Liga (Portugal)
            203,  // Süper Lig (Turquia)
            71    // Série A (Brasil)
    );

    public MatchSearchService(MatchesRepository matchesRepository, RestTemplate restTemplate) {
        this.matchesRepository = matchesRepository;
        this.restTemplate = restTemplate;
    }

    @Scheduled(cron = "05 41 02 * * ?")
    public void fetchAndSaveMatches() {

        String url = "https://api-football-v1.p.rapidapi.com/v3/fixtures?date=2025-12-27";//LocalDate.now();

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-rapidapi-key", apiKey);
        headers.set("x-rapidapi-host", apiHost);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonResponse = objectMapper.readTree(response.getBody());
                JsonNode matchesArray = jsonResponse.get("response");

                if (matchesArray != null) {
                    for (JsonNode match : matchesArray) {

                        JsonNode leagueObj = match.get("league");
                        int leagueId = leagueObj.get("id").asInt();

                        if (!MAIN_LEAGUES.contains(leagueId)) {
                            continue;
                        }

                        JsonNode fixture = match.get("fixture");
                        long fixtureId = fixture.get("id").asLong();
                        LocalDateTime matchDate = LocalDateTime.parse(
                                fixture.get("date").asText(),
                                DateTimeFormatter.ISO_DATE_TIME
                        );

                        matchDate = matchDate.atOffset(ZoneOffset.UTC).plusHours(-3).toLocalDateTime();

                        JsonNode status = fixture.get("status");
                        String matchStatus = status.get("short").asText();

                        JsonNode teams = match.get("teams");
                        JsonNode homeTeam = teams.get("home");
                        JsonNode awayTeam = teams.get("away");

                        String leagueName = leagueObj.get("name").asText();
                        String country = leagueObj.get("country").asText();
                        String homeTeamName = homeTeam.get("name").asText();
                        String awayTeamName = awayTeam.get("name").asText();
                        String imgHomeTeam = homeTeam.get("logo").asText();
                        String imgAwayTeam = awayTeam.get("logo").asText();

                        Optional<MatchesEntity> existingMatch = matchesRepository.findByFixtureId(fixtureId);

                        MatchesEntity matchEntity;
                        if (existingMatch.isPresent()) {
                            matchEntity = existingMatch.get();
                            matchEntity.setMatchDate(matchDate);
                            matchEntity.setStatusMatch(matchStatus);
                            matchEntity.setLeague(leagueName);
                            matchEntity.setCountry(country);
                            matchEntity.setHomeTeam(homeTeamName);
                            matchEntity.setAwayTeam(awayTeamName);
                            matchEntity.setImgHomeTeam(imgHomeTeam);
                            matchEntity.setImgAwayTeam(imgAwayTeam);
                        } else {
                            matchEntity = new MatchesEntity(
                                    fixtureId, matchDate, matchStatus, leagueName, country,
                                    homeTeamName, awayTeamName, imgHomeTeam, imgAwayTeam
                            );
                        }

                        matchesRepository.save(matchEntity);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}