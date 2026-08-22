package com.keval.portfolio.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "profile_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    private String fullName;
    private String eyebrow;
    private String title;
    
    @Column(length = 2000)
    private String summary;
    
    @Column(length = 4000)
    private String aboutText;

    private String avatarUrl;
    private String resumeUrl;

    private Integer yearsExperience;
    private Integer projectsCompleted;
    private Integer technologiesMastered;

    private String githubUrl;
    private String linkedinUrl;
    private String email;
    private String location;

    // Theme Customization Fields
    private String primaryColor;
    private String accentColor;
    private String themePreset;
}
