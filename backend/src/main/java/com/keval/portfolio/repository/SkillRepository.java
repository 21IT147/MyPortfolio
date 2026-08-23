package com.keval.portfolio.repository;

import com.keval.portfolio.model.Skill;
import org.springframework.data.repository.ListCrudRepository;
import java.util.List;

public interface SkillRepository extends ListCrudRepository<Skill, Long> {
    List<Skill> findAllByOrderByDisplayOrderAsc();
    List<Skill> findByUserUsernameOrderByDisplayOrderAsc(String username);
    List<Skill> findByUserIdOrderByDisplayOrderAsc(Long userId);
    void deleteByUserId(Long userId);
}
