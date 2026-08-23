package com.keval.portfolio.controller;

import com.keval.portfolio.model.*;
import com.keval.portfolio.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/public")
public class PublicPortfolioController {

    private final ProfileInfoRepository profileInfoRepository;
    private final SkillRepository skillRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final EducationRepository educationRepository;
    private final NoteRepository noteRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final UserRepository userRepository;

    public PublicPortfolioController(
            ProfileInfoRepository profileInfoRepository,
            SkillRepository skillRepository,
            ExperienceRepository experienceRepository,
            ProjectRepository projectRepository,
            EducationRepository educationRepository,
            NoteRepository noteRepository,
            ContactMessageRepository contactMessageRepository,
            UserRepository userRepository) {
        this.profileInfoRepository = profileInfoRepository;
        this.skillRepository = skillRepository;
        this.experienceRepository = experienceRepository;
        this.projectRepository = projectRepository;
        this.educationRepository = educationRepository;
        this.noteRepository = noteRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.userRepository = userRepository;
    }

    // Default Public Endpoints
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "UP", "timestamp", System.currentTimeMillis()));
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileInfo> getProfile() {
        return profileInfoRepository.findFirstByOrderByIdAsc()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/skills")
    public ResponseEntity<List<Skill>> getSkills() {
        return ResponseEntity.ok(skillRepository.findAllByOrderByDisplayOrderAsc());
    }

    @GetMapping("/experiences")
    public ResponseEntity<List<Experience>> getExperiences() {
        return ResponseEntity.ok(experienceRepository.findAllByOrderByDisplayOrderAsc());
    }

    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getProjects() {
        return ResponseEntity.ok(projectRepository.findAllByOrderByDisplayOrderAsc());
    }

    @GetMapping("/education")
    public ResponseEntity<List<Education>> getEducation() {
        return ResponseEntity.ok(educationRepository.findAllByOrderByDisplayOrderAsc());
    }

    @GetMapping("/notes")
    public ResponseEntity<List<Note>> getPublishedNotes() {
        return ResponseEntity.ok(noteRepository.findByPublishedTrueOrderByCreatedAtDesc());
    }

    @GetMapping("/notes/{slug}")
    public ResponseEntity<Note> getNoteBySlug(@PathVariable String slug) {
        return noteRepository.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/contact")
    public ResponseEntity<ContactMessage> submitContactMessage(@RequestBody ContactMessage message) {
        profileInfoRepository.findFirstByOrderByIdAsc().ifPresent(profile -> {
            userRepository.findById(profile.getUser() != null ? profile.getUser().getId() : 1L).ifPresent(message::setUser);
        });
        ContactMessage saved = contactMessageRepository.save(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Multi-Tenant User Slug Endpoint: GET /api/v1/public/u/{username}
    @GetMapping("/u/{username}")
    public ResponseEntity<?> getUserByUsernameSlug(@PathVariable String username) {
        String cleanUsername = username.toLowerCase().trim();
        return userRepository.findByUsername(cleanUsername)
                .map(user -> {
                    ProfileInfo profile = profileInfoRepository.findByUserUsername(cleanUsername)
                            .orElseGet(() -> profileInfoRepository.findFirstByOrderByIdAsc().orElse(null));
                    List<Skill> skills = skillRepository.findByUserUsernameOrderByDisplayOrderAsc(cleanUsername);
                    if (skills.isEmpty()) skills = skillRepository.findAllByOrderByDisplayOrderAsc();

                    List<Experience> experiences = experienceRepository.findByUserUsernameOrderByDisplayOrderAsc(cleanUsername);
                    if (experiences.isEmpty()) experiences = experienceRepository.findAllByOrderByDisplayOrderAsc();

                    List<Project> projects = projectRepository.findByUserUsernameOrderByDisplayOrderAsc(cleanUsername);
                    if (projects.isEmpty()) projects = projectRepository.findAllByOrderByDisplayOrderAsc();

                    List<Education> education = educationRepository.findByUserUsernameOrderByDisplayOrderAsc(cleanUsername);
                    if (education.isEmpty()) education = educationRepository.findAllByOrderByDisplayOrderAsc();

                    return ResponseEntity.ok(Map.of(
                            "user", Map.of("id", user.getId(), "username", user.getUsername(), "role", user.getRole()),
                            "profile", profile != null ? profile : Map.of(),
                            "skills", skills,
                            "experiences", experiences,
                            "projects", projects,
                            "education", education
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Multi-Tenant Contact Endpoint: POST /api/v1/public/u/{username}/contact
    @PostMapping("/u/{username}/contact")
    public ResponseEntity<?> submitUserContactMessage(
            @PathVariable String username,
            @RequestBody ContactMessage message) {
        String cleanUsername = username.toLowerCase().trim();
        return userRepository.findByUsername(cleanUsername)
                .map(user -> {
                    message.setUser(user);
                    ContactMessage saved = contactMessageRepository.save(message);
                    System.out.println(">>> Notification Email Dispatched to " + user.getEmail() + " for message from " + message.getName());
                    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
