package com.keval.portfolio.config;

import com.keval.portfolio.model.*;
import com.keval.portfolio.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProfileInfoRepository profileInfoRepository;
    private final SkillRepository skillRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final EducationRepository educationRepository;
    private final NoteRepository noteRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            UserRepository userRepository,
            ProfileInfoRepository profileInfoRepository,
            SkillRepository skillRepository,
            ExperienceRepository experienceRepository,
            ProjectRepository projectRepository,
            EducationRepository educationRepository,
            NoteRepository noteRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileInfoRepository = profileInfoRepository;
        this.skillRepository = skillRepository;
        this.experienceRepository = experienceRepository;
        this.projectRepository = projectRepository;
        this.educationRepository = educationRepository;
        this.noteRepository = noteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Super Admin User if not present
        User adminUser = userRepository.findByUsername("admin").orElseGet(() -> {
            var admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("keval.sheth@example.com");
            admin.setRole("ROLE_SUPER_ADMIN");
            return userRepository.save(admin);
        });

        // Always ensure admin has ROLE_SUPER_ADMIN
        if (!"ROLE_SUPER_ADMIN".equals(adminUser.getRole())) {
            adminUser.setRole("ROLE_SUPER_ADMIN");
            userRepository.save(adminUser);
        }
        System.out.println(">>> Initialized Super Admin user: admin / admin123 (ROLE_SUPER_ADMIN)");

        // 2. Seed Profile Info if empty
        if (profileInfoRepository.count() == 0) {
            var profile = new ProfileInfo();
            profile.setUser(adminUser);
            profile.setFullName("Keval Sheth");
            profile.setEyebrow("JAVA 25 & FULLSTACK DEVELOPER");
            profile.setTitle("Building High-Performance Enterprise Microservices & Modern Web Applications");
            profile.setSummary("Software Engineer passionate about Java 21/25 features, Spring Boot microservices, high-concurrency database design, and intuitive frontend web experiences.");
            profile.setAboutText("""
                I am an Associate Java Developer specializing in modern Java 25 features (Records, Switch Expressions, Pattern Matching, Sealed Classes) with hands-on experience designing robust RESTful APIs, scalable microservices architectures, and data persistence models using Spring Boot, Hibernate, MySQL 8.0, and MongoDB. I enjoy building sleek, modern user interfaces that seamlessly connect with high-throughput backend services.
                """);
            profile.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80");
            profile.setResumeUrl("/C:/Portfolio/Resume/14062026/Keval_Sheth.pdf");
            profile.setYearsExperience(2);
            profile.setProjectsCompleted(12);
            profile.setTechnologiesMastered(15);
            profile.setEmail("keval.sheth@example.com");
            profile.setGithubUrl("https://github.com/kevalsheth");
            profile.setLinkedinUrl("https://linkedin.com/in/kevalsheth");
            profile.setLocation("India");
            profile.setPrimaryColor("#3b82f6");
            profile.setAccentColor("#8b5cf6");
            profile.setThemePreset("Midnight Dark");
            profileInfoRepository.save(profile);
            System.out.println(">>> Initialized Profile Info");
        } else {
            // Ensure existing profile info has user linked
            profileInfoRepository.findAll().forEach(p -> {
                if (p.getUser() == null) {
                    p.setUser(adminUser);
                    profileInfoRepository.save(p);
                }
            });
        }

        // 3. Seed Skills if empty
        if (skillRepository.count() == 0) {
            var skills = List.of(
                new Skill(null, adminUser, "Java 17 / 21 / 25", getNormalizedCategory("backend"), 95, "java", 1),
                new Skill(null, adminUser, "Spring Boot 3 & Security", getNormalizedCategory("backend"), 90, "spring", 2),
                new Skill(null, adminUser, "Spring Security & JWT", getNormalizedCategory("backend"), 88, "security", 3),
                new Skill(null, adminUser, "Spring Data JPA / Hibernate", getNormalizedCategory("backend"), 90, "database", 4),
                new Skill(null, adminUser, "RESTful API Architecture", getNormalizedCategory("backend"), 92, "api", 5),
                new Skill(null, adminUser, "MySQL 8.0 / MongoDB Atlas", getNormalizedCategory("databases"), 88, "mysql", 6),
                new Skill(null, adminUser, "React.js / Vite SPA", getNormalizedCategory("frontend"), 85, "react", 7),
                new Skill(null, adminUser, "TypeScript / JavaScript", getNormalizedCategory("frontend"), 88, "js", 8),
                new Skill(null, adminUser, "Tailwind CSS / HTML5", getNormalizedCategory("frontend"), 90, "css", 9),
                new Skill(null, adminUser, "Docker & Containerization", getNormalizedCategory("tools"), 80, "docker", 10),
                new Skill(null, adminUser, "Git & GitHub Workflow", getNormalizedCategory("tools"), 92, "git", 11),
                new Skill(null, adminUser, "Gradle 8.6 Build Automation", getNormalizedCategory("tools"), 88, "tool", 12)
            );
            skillRepository.saveAll(skills);
            System.out.println(">>> Initialized Skills");
        }

        // 4. Seed Experience if empty
        if (experienceRepository.count() == 0) {
            var experiences = List.of(
                new Experience(null, adminUser, "Tech Solutions Inc.", "Associate Java Developer", "2023 - Present",
                    "Architected and deployed Spring Boot RESTful microservices using modern Java features (Records, Switch pattern matching). Integrated OAuth2/JWT authentication, optimized MySQL 8.0 queries reducing latency by 35%, and spearheaded front-to-back dynamic dashboard modules.",
                    true, "CURRENT ROLE", "Java 25, Spring Boot, MySQL 8.0, Gradle, React.js", 1),
                new Experience(null, adminUser, "Innovate Tech", "Java Developer Intern", "2022 - 2023",
                    "Developed backend API endpoints using Spring Data JPA, wrote automated unit tests with JUnit 5 and Mockito, and collaborated on frontend client UI integration.",
                    false, "INTERNSHIP", "Java 17, Spring Boot, MySQL, REST APIs, Git", 2)
            );
            experienceRepository.saveAll(experiences);
            System.out.println(">>> Initialized Experiences");
        }

        // 5. Seed Projects if empty
        if (projectRepository.count() == 0) {
            var projects = List.of(
                new Project(null, adminUser, "Dynamic Enterprise Portfolio CMS",
                    "Full-stack database-driven portfolio platform with Spring Boot Gradle backend, Java Records, JWT security, and React.js SPA Admin Panel.",
                    "A state-of-the-art full-stack platform allowing instant content customization directly from an authenticated admin dashboard without code redeployment.",
                    "https://my-portfolio-eight-omega-96.vercel.app/", "https://github.com/kevalsheth/portfolio",
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
                    "Java 25, Spring Boot, Gradle, React.js, MySQL 8.0, MongoDB", true, 1),
                new Project(null, adminUser, "Microservices E-Commerce Gateway",
                    "Scalable Spring Cloud microservices architecture with API Gateway, Eureka discovery, and Resilience4j circuit breakers.",
                    "Built high-throughput payment and inventory microservices using Spring Cloud, Kafka event streams, and Docker deployment containers.",
                    "https://github.com/kevalsheth/ecommerce-gateway", "https://github.com/kevalsheth/ecommerce-gateway",
                    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
                    "Java 25, Spring Boot, Gradle, Docker, Kafka, MySQL", true, 2),
                new Project(null, adminUser, "Interactive Java & Tech Knowledge Notes Hub",
                    "Markdown-powered technical documentation & notes engine with real-time live preview and tag filtering.",
                    "A developer-centric documentation hub for Java 25 features, Spring Security patterns, and system design notes.",
                    "https://my-portfolio-eight-omega-96.vercel.app/notes.html", "https://github.com/kevalsheth/notes-hub",
                    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
                    "Java 25, Spring Boot, React.js, Markdown", false, 3)
            );
            projectRepository.saveAll(projects);
            System.out.println(">>> Initialized Projects");
        }

        // 6. Seed Education if empty
        if (educationRepository.count() == 0) {
            var eduList = List.of(
                new Education(null, adminUser, "Bachelor of Technology in Information Technology",
                    "Gujarat Technological University", "2019 - 2023", "First Class with Distinction",
                    "Specialized in Software Engineering, Database Management Systems, Data Structures & Algorithms, and Distributed Systems.", 1)
            );
            educationRepository.saveAll(eduList);
            System.out.println(">>> Initialized Education");
        }

        // 7. Seed Notes if empty
        if (noteRepository.count() == 0) {
            var note1 = new Note();
            note1.setUser(adminUser);
            note1.setTitle("Spring Boot 3 & Security with Java 25 Complete Guide");
            note1.setSlug("spring-boot-3-java-25-guide");
            note1.setCategory("Java & Spring Boot");
            note1.setPublished(true);
            note1.setContent("""
                # Spring Boot 3 & Spring Security JWT Implementation with Java 25 Features

                Spring Security 6 in Spring Boot 3 introduces functional configuration using lambdas and modern Java features.

                ## Modern Java Features Used
                1. **Java Records**: DTO payloads like `record AuthRequest(String username, String password) {}` provide immutable data carriers.
                2. **Switch Expressions**: Category mapping using modern arrow switch syntax.
                3. **Text Blocks**: Clean multi-line Markdown text formatting without string concatenation.

                ```java
                public record AuthResponse(String token, String username, String role) {}

                // Modern Switch Expression
                String category = switch (type.toLowerCase()) {
                    case "backend" -> "Backend Engineering";
                    case "frontend" -> "Frontend UI";
                    case "databases" -> "Databases & Storage";
                    default -> "DevOps & Tools";
                };
                ```
                """);
            noteRepository.save(note1);
            System.out.println(">>> Initialized Sample Notes");
        }
    }

    private String getNormalizedCategory(String rawType) {
        return switch (rawType.toLowerCase()) {
            case "backend", "api", "java" -> "Backend";
            case "frontend", "ui", "react" -> "Frontend";
            case "database", "databases", "mysql", "mongodb" -> "Databases";
            case "devops", "tools", "docker", "git" -> "DevOps & Tools";
            default -> "General";
        };
    }
}
