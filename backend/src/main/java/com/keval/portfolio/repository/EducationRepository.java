package com.keval.portfolio.repository;

import com.keval.portfolio.model.Education;
import org.springframework.data.repository.ListCrudRepository;
import java.util.List;

public interface EducationRepository extends ListCrudRepository<Education, Long> {
    List<Education> findAllByOrderByDisplayOrderAsc();
    List<Education> findByUserUsernameOrderByDisplayOrderAsc(String username);
    List<Education> findByUserIdOrderByDisplayOrderAsc(Long userId);
    void deleteByUserId(Long userId);
}
