package com.pracbet.pracbet.FootballAPI.services;

import com.pracbet.pracbet.FootballAPI.entities.MatchStatisticsEntity;
import com.pracbet.pracbet.FootballAPI.repositories.MatchStatisticsRepository;
import com.pracbet.pracbet.FootballAPI.entities.MatchesEntity;
import com.pracbet.pracbet.FootballAPI.repositories.MatchesRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MatchStatisticsSearchService {

    private final MatchesRepository matchesRepository;
    private final MatchStatisticsRepository matchStatisticsRepository;
    private final RestTemplate restTemplate;

    @Value("${api.football.key}")
    private String apiKey;

    @Value("${api.football.host}")
    private String apiHost;

    public MatchStatisticsSearchService(MatchesRepository matchesRepository, MatchStatisticsRepository matchStatisticsRepository, RestTemplate restTemplate) {
        this.matchesRepository = matchesRepository;
        this.matchStatisticsRepository = matchStatisticsRepository;
        this.restTemplate = restTemplate;
    }

    @Scheduled(cron = "10 41 02 * * ?")
    public void fetchAndSaveMatchStatistics() {
        List<MatchesEntity> finishedMatchesFT = matchesRepository.findByStatusMatch("FT"); //terminada em tempo normal
        List<MatchesEntity> finishedMatchesAET = matchesRepository.findByStatusMatch("AET"); //terminada em prorrogação
        List<MatchesEntity> finishedMatchesPEN = matchesRepository.findByStatusMatch("PEN"); //terminada em penalti
        List<Long> fixtureIds = new ArrayList<>();

        for (MatchesEntity match : finishedMatchesFT) {
            if (!match.isStatisticsUploaded()) {
                fixtureIds.add(match.getFixtureId());
            }
        }

        for (MatchesEntity match : finishedMatchesAET) {
            if (!match.isStatisticsUploaded()) {
                fixtureIds.add(match.getFixtureId());
            }
        }

        for (MatchesEntity match : finishedMatchesPEN) {
            if (!match.isStatisticsUploaded()) {
                fixtureIds.add(match.getFixtureId());
            }
        }

        if (fixtureIds.isEmpty()) {
            return;
        }

        List<List<Long>> fixtureIdChunks = partitionList(fixtureIds, 20);
        for (List<Long> fixtureIdChunk : fixtureIdChunks) {
            fetchStatisticsForFixtures(fixtureIdChunk);
        }
    }

    private List<List<Long>> partitionList(List<Long> list, int chunkSize) {
        List<List<Long>> partitions = new ArrayList<>();
        for (int i = 0; i < list.size(); i += chunkSize) {
            partitions.add(list.subList(i, Math.min(i + chunkSize, list.size())));
        }
        return partitions;
    }

    private void fetchStatisticsForFixtures(List<Long> fixtureIds) {
        String idsParam = String.join("-", fixtureIds.stream().map(String::valueOf).toArray(String[]::new));
        String url = "https://api-football-v1.p.rapidapi.com/v3/fixtures?ids=" + idsParam;

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-rapidapi-key", apiKey);
        headers.set("x-rapidapi-host", apiHost);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonResponse = objectMapper.readTree(response.getBody());
                JsonNode statisticsArray = jsonResponse.get("response");

                if (statisticsArray != null && statisticsArray.isArray()) {
                    for (JsonNode matchStatsNode : statisticsArray) {
                        long fixtureId = matchStatsNode.path("fixture").path("id").asLong();

                        Optional<MatchesEntity> matchOpt = matchesRepository.findByFixtureId(fixtureId);
                        if (matchOpt.isPresent()) {
                            MatchesEntity match = matchOpt.get();

                            JsonNode goalsNode = matchStatsNode.path("goals");
                            int homeGoals = goalsNode.path("home").asInt(0);
                            int awayGoals = goalsNode.path("away").asInt(0);

                            MatchStatisticsEntity matchStatistics = new MatchStatisticsEntity();
                            matchStatistics.setMatch(match);
                            matchStatistics.setHomeGoals(homeGoals);
                            matchStatistics.setAwayGoals(awayGoals);

                            JsonNode teams = matchStatsNode.path("teams");
                            boolean homeWinner = teams.path("home").path("winner").asBoolean(false);
                            matchStatistics.setHomeWinner(homeWinner);

                            boolean awayWinner = teams.path("away").path("winner").asBoolean(false);
                            matchStatistics.setAwayWinner(awayWinner);

                            JsonNode teamStats = matchStatsNode.path("statistics");
                            if (teamStats != null && teamStats.isArray()) {
                                for (JsonNode teamNode : teamStats) {
                                    String teamName = teamNode.path("team").path("name").asText();

                                    boolean isHomeTeam = match.isHomeTeam(teamName);
                                    boolean isAwayTeam = match.isAwayTeam(teamName);

                                    JsonNode stats = teamNode.path("statistics");
                                    for (JsonNode stat : stats) {
                                        String type = stat.path("type").asText();
                                        String valueString = stat.path("value").asText();
                                        Integer value = (valueString != null && valueString.matches("\\d+")) ? Integer.parseInt(valueString) : 0;

                                        if (isHomeTeam) {
                                            mapStatistics(type, value, matchStatistics, true);
                                        } else if (isAwayTeam) {
                                            mapStatistics(type, value, matchStatistics, false);
                                        }
                                    }
                                }
                            }

                            matchStatisticsRepository.save(matchStatistics);
                            match.setStatisticsUploaded(true);
                            matchesRepository.save(match);
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void mapStatistics(String type, Integer value, MatchStatisticsEntity matchStatistics, boolean isHome) {
        switch (type) {
            case "Shots on Goal" -> setStatisticValue(matchStatistics, value, isHome, "shotsOnGoal");
            case "Total Shots" -> setStatisticValue(matchStatistics, value, isHome, "totalShots");
            case "Fouls" -> setStatisticValue(matchStatistics, value, isHome, "fouls");
            case "Corner Kicks" -> setStatisticValue(matchStatistics, value, isHome, "corner");
            case "Offsides" -> setStatisticValue(matchStatistics, value, isHome, "offside");
            case "Yellow Cards" -> setStatisticValue(matchStatistics, value, isHome, "yellowCard");
            case "Red Cards" -> setStatisticValue(matchStatistics, value, isHome, "redCard");
            case "Goalkeeper Saves" -> setStatisticValue(matchStatistics, value, isHome, "goalkeeperSave");
            case "Total passes" -> setStatisticValue(matchStatistics, value, isHome, "totalPasses");
        }
    }

    private void setStatisticValue(MatchStatisticsEntity matchStatistics, Integer value, boolean isHome, String fieldName) {
        if (isHome) {
            switch (fieldName) {
                case "shotsOnGoal" -> matchStatistics.setHomeShotsOnGoal(value);
                case "totalShots" -> matchStatistics.setHomeTotalShots(value);
                case "fouls" -> matchStatistics.setHomeFouls(value);
                case "corner" -> matchStatistics.setHomeCorner(value);
                case "offside" -> matchStatistics.setHomeOffside(value);
                case "yellowCard" -> matchStatistics.setHomeYellowCard(value);
                case "redCard" -> matchStatistics.setHomeRedCard(value);
                case "goalkeeperSave" -> matchStatistics.setHomeGoalkeeperSave(value);
                case "totalPasses" -> matchStatistics.setHomeTotalPasses(value);
            }
        } else {
            switch (fieldName) {
                case "shotsOnGoal" -> matchStatistics.setAwayShotsOnGoal(value);
                case "totalShots" -> matchStatistics.setAwayTotalShots(value);
                case "fouls" -> matchStatistics.setAwayFouls(value);
                case "corner" -> matchStatistics.setAwayCorner(value);
                case "offside" -> matchStatistics.setAwayOffside(value);
                case "yellowCard" -> matchStatistics.setAwayYellowCard(value);
                case "redCard" -> matchStatistics.setAwayRedCard(value);
                case "goalkeeperSave" -> matchStatistics.setAwayGoalkeeperSave(value);
                case "totalPasses" -> matchStatistics.setAwayTotalPasses(value);
            }
        }
    }
}