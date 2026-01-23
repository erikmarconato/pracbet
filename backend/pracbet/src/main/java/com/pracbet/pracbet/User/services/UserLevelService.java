package com.pracbet.pracbet.User.services;

import com.pracbet.pracbet.User.entities.UserEntity;
import com.pracbet.pracbet.User.exceptions.CheckIfTheUserExistsException;
import com.pracbet.pracbet.User.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserLevelService {


    private final UserRepository userRepository;

    public UserLevelService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void addXp(Long userId, int amount) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new CheckIfTheUserExistsException("User not found"));

        user.setXp(user.getXp() + amount);

        while (user.getXp() >= requiredXp(user.getLevel())) {
            int needed = requiredXp(user.getLevel());
            user.setXp(user.getXp() - needed);
            user.setLevel(user.getLevel() + 1);
        }

        userRepository.save(user);
    }

    private int requiredXp(int level) {
        return level * 100;
    }

    public int getRequiredXp(int level) {
        return requiredXp(level);
    }
}

