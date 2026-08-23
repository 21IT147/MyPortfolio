package com.keval.portfolio.repository;

import com.keval.portfolio.model.User;
import org.springframework.data.repository.ListCrudRepository;
import java.util.Optional;

public interface UserRepository extends ListCrudRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
