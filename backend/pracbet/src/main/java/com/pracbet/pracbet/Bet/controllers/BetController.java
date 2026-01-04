package com.pracbet.pracbet.Bet.controllers;

import com.pracbet.pracbet.Bet.dtos.BetInputDto;
import com.pracbet.pracbet.Bet.dtos.BetResponseListByUserIdDto;
import com.pracbet.pracbet.Bet.services.BetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Stream;

@RestController
@RequestMapping("/bet")
public class BetController {

    private final BetService betService;

    public BetController(BetService betService) {
        this.betService = betService;
    }

    @PostMapping
    public ResponseEntity<Void> createBet(@RequestBody BetInputDto betInputDto){
       return betService.createBet(betInputDto);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Stream<BetResponseListByUserIdDto>> listAllBetsByUserId(@PathVariable Long userId){
        return betService.listAllBetsByUserId(userId);
    }
}
