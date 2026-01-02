package com.pracbet.pracbet.Bet.services.settlement.factory;

import com.pracbet.pracbet.Bet.services.settlement.strategies.BetSettlementStrategy;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class BetSettlementFactory {

    private final Map<String, BetSettlementStrategy> strategies = new HashMap<>();

    public BetSettlementFactory(List<BetSettlementStrategy> strategyList) {
        for (BetSettlementStrategy strategy : strategyList) {
            String key = strategy.getClass()
                    .getAnnotation(Service.class)
                    .value();
            strategies.put(key, strategy);
        }
    }

    public BetSettlementStrategy getStrategy(String marketName) {
        return strategies.get(marketName);
    }
}

