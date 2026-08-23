package com.keval.portfolio.model;

import jakarta.persistence.*;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "experiences")
@Document(collection = "experiences")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Experience {

    @Id
    @org.springframework.data.annotation.Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String company;
    private String role;
    private String period;

    @Column(length = 2000)
    private String description;

    private Boolean current;
    private String badgeText;
    private String techStack;
    private Integer displayOrder;
}
