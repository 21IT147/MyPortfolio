package com.keval.portfolio.controller;

import com.keval.portfolio.model.User;
import com.keval.portfolio.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/super")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminController {

    private final UserRepository userRepository;
    private final ProfileInfoRepository profileInfoRepository;
    private final SkillRepository skillRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final EducationRepository educationRepository;
    private final NoteRepository noteRepository;
    private final ContactMessageRepository contactMessageRepository;

    public SuperAdminController(
            UserRepository userRepository,
            ProfileInfoRepository profileInfoRepository,
            SkillRepository skillRepository,
            ExperienceRepository experienceRepository,
            ProjectRepository projectRepository,
            EducationRepository educationRepository,
            NoteRepository noteRepository,
            ContactMessageRepository contactMessageRepository) {
        this.userRepository = userRepository;
        this.profileInfoRepository = profileInfoRepository;
        this.skillRepository = skillRepository;
        this.experienceRepository = experienceRepository;
        this.projectRepository = projectRepository;
        this.educationRepository = educationRepository;
        this.noteRepository = noteRepository;
        this.contactMessageRepository = contactMessageRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    @Transactional
    public ResponseEntity<?> deleteUserById(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // Cascading deletion of user's portfolio data across repositories
        profileInfoRepository.deleteByUserId(id);
        skillRepository.deleteByUserId(id);
        experienceRepository.deleteByUserId(id);
        projectRepository.deleteByUserId(id);
        educationRepository.deleteByUserId(id);
        noteRepository.deleteByUserId(id);
        contactMessageRepository.deleteByUserId(id);
        
        userRepository.deleteById(id);

        return ResponseEntity.ok("User ID " + id + " and all associated portfolio data deleted successfully.");
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setRole(role.toUpperCase().startsWith("ROLE_") ? role.toUpperCase() : "ROLE_" + role.toUpperCase());
                    userRepository.save(user);
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
