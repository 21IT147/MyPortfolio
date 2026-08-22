package com.keval.portfolio.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String name;
    private String email;
    private String subject;

    @Column(length = 4000)
    private String message;

    private Boolean read = false;
    private LocalDateTime receivedAt;

    @PrePersist
    protected void onCreate() {
        receivedAt = LocalDateTime.now();
    }
}
