package com.keval.portfolio.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String title;
    private String shortDesc;

    @Column(length = 4000)
    private String fullDesc;

    private String demoUrl;
    private String githubUrl;
    private String imageUrl;
    private String tags;
    private Boolean featured;
    private Integer displayOrder;
}
