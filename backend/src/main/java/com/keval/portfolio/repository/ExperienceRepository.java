package com.keval.portfolio.repository;

import com.keval.portfolio.model.Experience;
import org.springframework.data.repository.ListCrudRepository;
import java.util.List;

public interface ExperienceRepository extends ListCrudRepository<Experience, Long> {
    List<Experience> findAllByOrderByDisplayOrderAsc();
    List<Experience> findByUserUsernameOrderByDisplayOrderAsc(String username);
    List<Experience> findByUserIdOrderByDisplayOrderAsc(Long userId);
    void deleteByUserId(Long userId);
}
