package com.keval.portfolio.repository;

import com.keval.portfolio.model.ProfileInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProfileInfoRepository extends JpaRepository<ProfileInfo, Long> {
    Optional<ProfileInfo> findFirstByOrderByIdAsc();
    Optional<ProfileInfo> findByUserUsername(String username);
    Optional<ProfileInfo> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
