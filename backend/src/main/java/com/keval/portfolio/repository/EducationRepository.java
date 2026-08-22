package com.keval.portfolio.repository;

import com.keval.portfolio.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findAllByOrderByDisplayOrderAsc();
    List<Education> findByUserUsernameOrderByDisplayOrderAsc(String username);
    List<Education> findByUserIdOrderByDisplayOrderAsc(Long userId);
    void deleteByUserId(Long userId);
}
