package com.keval.portfolio.controller;

import com.keval.portfolio.model.Skill;
import com.keval.portfolio.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AdminControllerTest {

    @Mock private ProfileInfoRepository profileInfoRepository;
    @Mock private SkillRepository skillRepository;
    @Mock private ExperienceRepository experienceRepository;
    @Mock private ProjectRepository projectRepository;
    @Mock private EducationRepository educationRepository;
    @Mock private NoteRepository noteRepository;
    @Mock private ContactMessageRepository contactMessageRepository;

    @InjectMocks private AdminController adminController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should return admin stats map")
    void testGetAdminStats() {
        when(skillRepository.count()).thenReturn(10L);
        when(experienceRepository.count()).thenReturn(2L);
        when(projectRepository.count()).thenReturn(5L);
        when(noteRepository.count()).thenReturn(3L);
        when(contactMessageRepository.countByReadFalse()).thenReturn(2L);
        when(contactMessageRepository.count()).thenReturn(5L);

        ResponseEntity<Map<String, Object>> response = adminController.getAdminStats();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(10L, response.getBody().get("totalSkills"));
        assertEquals(2L, response.getBody().get("unreadMessages"));
    }

    @Test
    @DisplayName("Should create skill successfully")
    void testCreateSkill() {
        Skill skill = new Skill(null, null, "GraphQL", "Backend", 80, "graphql", 1);
        Skill savedSkill = new Skill(1L, null, "GraphQL", "Backend", 80, "graphql", 1);

        when(skillRepository.save(any(Skill.class))).thenReturn(savedSkill);

        ResponseEntity<Skill> response = adminController.createSkill(skill);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("GraphQL", response.getBody().getName());
    }

    @Test
    @DisplayName("Should delete skill by ID")
    void testDeleteSkill() {
        doNothing().when(skillRepository).deleteById(1L);

        ResponseEntity<Void> response = adminController.deleteSkill(1L);

        assertEquals(204, response.getStatusCode().value());
        verify(skillRepository, times(1)).deleteById(1L);
    }
}
