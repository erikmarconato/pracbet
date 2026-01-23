package com.pracbet.pracbet.User.controllers;

import com.pracbet.pracbet.User.dtos.RankingsResponseDto;
import com.pracbet.pracbet.User.services.UserRankingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ranking")
@CrossOrigin
public class UserRankingController {

    private final UserRankingService userRankingService;

    public UserRankingController(UserRankingService userRankingService) {
        this.userRankingService = userRankingService;
    }

    @GetMapping  // /ranking?userId=iddousuario
    public ResponseEntity<RankingsResponseDto> getRankings(@RequestParam(required = false) Long userId) {
        return userRankingService.getTopRankings(userId);
    }


}
