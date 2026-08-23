package com.keval.portfolio.repository;

import com.keval.portfolio.model.ContactMessage;
import org.springframework.data.repository.ListCrudRepository;
import java.util.List;

public interface ContactMessageRepository extends ListCrudRepository<ContactMessage, Long> {
    List<ContactMessage> findAllByOrderByReceivedAtDesc();
    List<ContactMessage> findByUserUsernameOrderByReceivedAtDesc(String username);
    List<ContactMessage> findByUserIdOrderByReceivedAtDesc(Long userId);
    long countByReadFalse();
    long countByUserIdAndReadFalse(Long userId);
    void deleteByUserId(Long userId);
}
