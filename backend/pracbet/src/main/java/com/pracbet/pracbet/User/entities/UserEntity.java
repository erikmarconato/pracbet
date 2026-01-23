package com.pracbet.pracbet.User.entities;

import com.pracbet.pracbet.Bet.entities.BetEntity;
import com.pracbet.pracbet.User.enums.UserRoleEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private UserRoleEnum role;

    @OneToMany(mappedBy = "user")
    private List<BetEntity> bets;

    @Column(name = "balance")
    private BigDecimal balance;

    @Column(name = "total_bets")
    private int totalBets = 0;

    @Column(name = "total_bets_won")
    private int totalBetsWon = 0;

    @Column(name = "total_bets_lost")
    private int totalBetsLost = 0;

    @Column(name = "total_stake_units")
    private Integer totalStakeUnits = 0;

    @Column(name = "total_profit_units", precision = 18, scale = 2)
    private BigDecimal totalProfitUnits = BigDecimal.valueOf(0);

    @Column(name = "roi_percentage", precision = 10, scale = 2)
    private BigDecimal roiPercentage = BigDecimal.valueOf(0);

    @Column(nullable = false)
    private int level = 1;

    @Column(nullable = false)
    private int xp = 0;


    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active")
    private Boolean isActive;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.role == UserRoleEnum.ADMIN) {
            return List.of(
                    new SimpleGrantedAuthority("ROLE_ADMIN"),
                    new SimpleGrantedAuthority("ROLE_USER"));
        }
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
