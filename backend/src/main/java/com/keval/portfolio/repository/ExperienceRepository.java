package com.keval.portfolio.repository;

import com.keval.portfolio.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    List<Experience> findAllByOrderByDisplayOrderAsc();
    List<Experience> findByUserUsernameOrderByDisplayOrderAsc(String username);
    List<Experience> findByUserIdOrderByDisplayOrderAsc(Long userId);
    void deleteByUserId(Long userId);
}
