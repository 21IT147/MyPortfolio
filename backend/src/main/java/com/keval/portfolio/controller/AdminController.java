package com.keval.portfolio.controller;

import com.keval.portfolio.model.*;
import com.keval.portfolio.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final ProfileInfoRepository profileInfoRepository;
    private final SkillRepository skillRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final EducationRepository educationRepository;
    private final NoteRepository noteRepository;
    private final ContactMessageRepository contactMessageRepository;

    public AdminController(
            ProfileInfoRepository profileInfoRepository,
            SkillRepository skillRepository,
            ExperienceRepository experienceRepository,
            ProjectRepository projectRepository,
            EducationRepository educationRepository,
            NoteRepository noteRepository,
            ContactMessageRepository contactMessageRepository) {
        this.profileInfoRepository = profileInfoRepository;
        this.skillRepository = skillRepository;
        this.experienceRepository = experienceRepository;
        this.projectRepository = projectRepository;
        this.educationRepository = educationRepository;
        this.noteRepository = noteRepository;
        this.contactMessageRepository = contactMessageRepository;
    }

    // Dashboard Statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSkills", skillRepository.count());
        stats.put("totalExperiences", experienceRepository.count());
        stats.put("totalProjects", projectRepository.count());
        stats.put("totalNotes", noteRepository.count());
        stats.put("unreadMessages", contactMessageRepository.countByReadFalse());
        stats.put("totalMessages", contactMessageRepository.count());
        return ResponseEntity.ok(stats);
    }

    // Profile Management
    @PutMapping("/profile")
    public ResponseEntity<ProfileInfo> updateProfile(@RequestBody ProfileInfo profileInfo) {
        if (profileInfo.getId() == null) {
            ProfileInfo existing = profileInfoRepository.findAll().stream().findFirst().orElse(null);
            if (existing != null) {
                profileInfo.setId(existing.getId());
            }
        }
        return ResponseEntity.ok(profileInfoRepository.save(profileInfo));
    }

    // Cloudinary Resume Direct Upload
    @PostMapping("/resume/upload")
    public ResponseEntity<?> uploadResumeToCloudinary(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No file selected"));
        }
        try {
            String cloudinaryUrl = System.getenv("CLOUDINARY_URL");
            com.cloudinary.Cloudinary cloudinary;
            if (cloudinaryUrl != null && !cloudinaryUrl.isBlank()) {
                cloudinary = new com.cloudinary.Cloudinary(cloudinaryUrl);
            } else {
                cloudinary = new com.cloudinary.Cloudinary(com.cloudinary.utils.ObjectUtils.asMap(
                    "cloud_name", "wrvvyzjz",
                    "api_key", System.getenv("CLOUDINARY_API_KEY") != null ? System.getenv("CLOUDINARY_API_KEY") : "123456789",
                    "api_secret", System.getenv("CLOUDINARY_API_SECRET") != null ? System.getenv("CLOUDINARY_API_SECRET") : "secret"
                ));
            }

            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), com.cloudinary.utils.ObjectUtils.asMap(
                "resource_type", "auto",
                "public_id", "keval_sheth_resume",
                "overwrite", true
            ));

            String secureUrl = (String) uploadResult.get("secure_url");
            if (secureUrl == null) {
                secureUrl = (String) uploadResult.get("url");
            }

            ProfileInfo existing = profileInfoRepository.findAll().stream().findFirst().orElse(null);
            if (existing != null) {
                existing.setResumeUrl(secureUrl);
                profileInfoRepository.save(existing);
            }

            return ResponseEntity.ok(Map.of("url", secureUrl));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Cloudinary upload failed: " + e.getMessage()));
        }
    }

    // Skills CRUD
    @GetMapping("/skills")
    public ResponseEntity<List<Skill>> getAllSkills() {
        return ResponseEntity.ok(skillRepository.findAllByOrderByDisplayOrderAsc());
    }

    @PostMapping("/skills")
    public ResponseEntity<Skill> createSkill(@RequestBody Skill skill) {
        return ResponseEntity.ok(skillRepository.save(skill));
    }

    @PutMapping("/skills/{id}")
    public ResponseEntity<Skill> updateSkill(@PathVariable Long id, @RequestBody Skill skill) {
        skill.setId(id);
        return ResponseEntity.ok(skillRepository.save(skill));
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        skillRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Experience CRUD
    @GetMapping("/experiences")
    public ResponseEntity<List<Experience>> getAllExperiences() {
        return ResponseEntity.ok(experienceRepository.findAllByOrderByDisplayOrderAsc());
    }

    @PostMapping("/experiences")
    public ResponseEntity<Experience> createExperience(@RequestBody Experience experience) {
        return ResponseEntity.ok(experienceRepository.save(experience));
    }

    @PutMapping("/experiences/{id}")
    public ResponseEntity<Experience> updateExperience(@PathVariable Long id, @RequestBody Experience experience) {
        experience.setId(id);
        return ResponseEntity.ok(experienceRepository.save(experience));
    }

    @DeleteMapping("/experiences/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long id) {
        experienceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Project CRUD
    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectRepository.findAllByOrderByDisplayOrderAsc());
    }

    @PostMapping("/projects")
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.ok(projectRepository.save(project));
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project project) {
        project.setId(id);
        return ResponseEntity.ok(projectRepository.save(project));
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Education CRUD
    @GetMapping("/education")
    public ResponseEntity<List<Education>> getAllEducation() {
        return ResponseEntity.ok(educationRepository.findAllByOrderByDisplayOrderAsc());
    }

    @PostMapping("/education")
    public ResponseEntity<Education> createEducation(@RequestBody Education education) {
        return ResponseEntity.ok(educationRepository.save(education));
    }

    @PutMapping("/education/{id}")
    public ResponseEntity<Education> updateEducation(@PathVariable Long id, @RequestBody Education education) {
        education.setId(id);
        return ResponseEntity.ok(educationRepository.save(education));
    }

    @DeleteMapping("/education/{id}")
    public ResponseEntity<Void> deleteEducation(@PathVariable Long id) {
        educationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Notes CRUD
    @GetMapping("/notes")
    public ResponseEntity<List<Note>> getAllNotes() {
        return ResponseEntity.ok(noteRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping("/notes")
    public ResponseEntity<Note> createNote(@RequestBody Note note) {
        return ResponseEntity.ok(noteRepository.save(note));
    }

    @PutMapping("/notes/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note note) {
        note.setId(id);
        return ResponseEntity.ok(noteRepository.save(note));
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Contact Messages Management
    @GetMapping("/messages")
    public ResponseEntity<List<ContactMessage>> getMessages() {
        return ResponseEntity.ok(contactMessageRepository.findAllByOrderByReceivedAtDesc());
    }

    @PutMapping("/messages/{id}/read")
    public ResponseEntity<ContactMessage> markMessageAsRead(@PathVariable Long id) {
        return contactMessageRepository.findById(id).map(msg -> {
            msg.setRead(true);
            return ResponseEntity.ok(contactMessageRepository.save(msg));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        contactMessageRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
