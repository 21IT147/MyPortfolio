package com.keval.portfolio.repository;

import com.keval.portfolio.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findAllByOrderByCreatedAtDesc();
    List<Note> findByPublishedTrueOrderByCreatedAtDesc();
    Optional<Note> findBySlug(String slug);
    List<Note> findByUserUsernameAndPublishedTrueOrderByCreatedAtDesc(String username);
    List<Note> findByUserIdOrderByCreatedAtDesc(Long userId);
    void deleteByUserId(Long userId);
}
