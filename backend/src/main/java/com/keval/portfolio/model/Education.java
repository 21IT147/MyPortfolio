package com.keval.portfolio.model;

import jakarta.persistence.*;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "education")
@Document(collection = "education")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Education {

    @Id
    @org.springframework.data.annotation.Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String degree;
    private String institution;
    private String period;
    private String score;

    @Column(length = 2000)
    private String highlights;

    private Integer displayOrder;
}
