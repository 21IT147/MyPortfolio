package com.keval.portfolio.repository;

import com.keval.portfolio.model.Project;
import org.springframework.data.repository.ListCrudRepository;
import java.util.List;

public interface ProjectRepository extends ListCrudRepository<Project, Long> {
    List<Project> findAllByOrderByDisplayOrderAsc();
    List<Project> findByUserUsernameOrderByDisplayOrderAsc(String username);
    List<Project> findByUserIdOrderByDisplayOrderAsc(Long userId);
    void deleteByUserId(Long userId);
}
