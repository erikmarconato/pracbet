package com.pracbet.pracbet.User.services;

import com.pracbet.pracbet.User.dtos.PlayerRankDto;
import com.pracbet.pracbet.User.dtos.RankingsResponseDto;
import com.pracbet.pracbet.User.entities.UserEntity;
import com.pracbet.pracbet.User.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class UserRankingService {

    private final UserRepository userRepository;

    public UserRankingService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ResponseEntity<RankingsResponseDto> getTopRankings(Long userId) {

        List<UserEntity> users = userRepository.findAll();

        // ============= RANKING POR PROFIT =============
        List<UserEntity> sortedProfitAll = users.stream()
                .sorted(Comparator.comparing(UserEntity::getTotalProfitUnits).reversed())
                .toList();

        Integer userProfitPosition = null;
        if (userId != null) {
            for (int i = 0; i < sortedProfitAll.size(); i++) {
                if (sortedProfitAll.get(i).getId().equals(userId)) {
                    userProfitPosition = i + 1;
                    break;
                }
            }
        }

        List<PlayerRankDto> profitRanking = sortedProfitAll.stream()
                .limit(100)
                .map(user -> new PlayerRankDto(
                        user.getId(),
                        user.getUsername(),
                        user.getLevel(),
                        user.getTotalProfitUnits(),
                        user.getRoiPercentage(),
                        user.getTotalBets(),
                        user.getTotalBetsWon(),
                        user.getTotalBetsLost(),
                        sortedProfitAll.indexOf(user) + 1
                ))
                .toList();



        // ============= RANKING POR ROI =============
        List<UserEntity> sortedRoiAll = users.stream()
                .sorted(Comparator.comparing(UserEntity::getRoiPercentage).reversed())
                .toList();

        Integer userRoiPosition = null;
        if (userId != null) {
            for (int i = 0; i < sortedRoiAll.size(); i++) {
                if (sortedRoiAll.get(i).getId().equals(userId)) {
                    userRoiPosition = i + 1;
                    break;
                }
            }
        }

        List<PlayerRankDto> roiRanking = sortedRoiAll.stream()
                .limit(100)
                .map(user -> new PlayerRankDto(
                        user.getId(),
                        user.getUsername(),
                        user.getLevel(),
                        user.getTotalProfitUnits(),
                        user.getRoiPercentage(),
                        user.getTotalBets(),
                        user.getTotalBetsWon(),
                        user.getTotalBetsLost(),
                        sortedRoiAll.indexOf(user) + 1
                ))
                .toList();



        // ============= RANKING POR BETS WON =============
        List<UserEntity> sortedWinsAll = users.stream()
                .sorted(Comparator.comparing(UserEntity::getTotalBetsWon).reversed())
                .toList();

        Integer userWinsPosition = null;
        if (userId != null) {
            for (int i = 0; i < sortedWinsAll.size(); i++) {
                if (sortedWinsAll.get(i).getId().equals(userId)) {
                    userWinsPosition = i + 1;
                    break;
                }
            }
        }

        List<PlayerRankDto> winsRanking = sortedWinsAll.stream()
                .limit(100)
                .map(user -> new PlayerRankDto(
                        user.getId(),
                        user.getUsername(),
                        user.getLevel(),
                        user.getTotalProfitUnits(),
                        user.getRoiPercentage(),
                        user.getTotalBets(),
                        user.getTotalBetsWon(),
                        user.getTotalBetsLost(),
                        sortedWinsAll.indexOf(user) + 1
                ))
                .toList();



        // ============= RESPONSE =============
        RankingsResponseDto response = new RankingsResponseDto(
                userProfitPosition,
                userRoiPosition,
                userWinsPosition,
                profitRanking,
                roiRanking,
                winsRanking
        );

        return ResponseEntity.ok(response);
    }


}
