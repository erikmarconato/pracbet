package com.pracbet.pracbet.ExportAPI.services;

import com.pracbet.pracbet.ExportAPI.dtos.OddsDto;
import com.pracbet.pracbet.FootballAPI.repositories.OddsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MatchOddsService {

    @Autowired
    OddsRepository oddsRepository;

    public List<OddsDto> filterMatchById(Long id) {
        return oddsRepository.findByMatchId(id).stream()
                .map(odd -> new OddsDto(odd.getBetType(), odd.getValue(), odd.getOdd()))
                .toList();
    }
}
