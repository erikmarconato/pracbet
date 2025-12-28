package com.pracbet.pracbet.ExportAPI.controllers;

import com.pracbet.pracbet.ExportAPI.dtos.MatchesDto;
import com.pracbet.pracbet.ExportAPI.services.MatchesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matches")
@CrossOrigin
public class MatchesController {

    private final MatchesService matchesService;

    public MatchesController(MatchesService matchesService) {
        this.matchesService = matchesService;
    }

    @GetMapping("/{date}")
    public List<MatchesDto> listMatchesByDate(@PathVariable String date) {
        return matchesService.listMatchesByDate(date);
    }
}
