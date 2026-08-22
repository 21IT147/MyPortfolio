package com.keval.portfolio.controller;

import com.keval.portfolio.model.*;
import com.keval.portfolio.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PublicPortfolioControllerTest {

    @Mock private ProfileInfoRepository profileInfoRepository;
    @Mock private SkillRepository skillRepository;
    @Mock private ExperienceRepository experienceRepository;
    @Mock private ProjectRepository projectRepository;
    @Mock private EducationRepository educationRepository;
    @Mock private NoteRepository noteRepository;
    @Mock private ContactMessageRepository contactMessageRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private PublicPortfolioController publicPortfolioController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should return public profile info")
    void testGetProfile_Success() {
        ProfileInfo profile = new ProfileInfo();
        profile.setId(1L);
        profile.setFullName("Keval Sheth");

        when(profileInfoRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.of(profile));

        ResponseEntity<ProfileInfo> response = publicPortfolioController.getProfile();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("Keval Sheth", response.getBody().getFullName());
    }

    @Test
    @DisplayName("Should return published notes list")
    void testGetPublishedNotes() {
        Note note = new Note();
        note.setId(1L);
        note.setTitle("Java 25 Guide");
        note.setPublished(true);

        when(noteRepository.findByPublishedTrueOrderByCreatedAtDesc()).thenReturn(List.of(note));

        ResponseEntity<List<Note>> response = publicPortfolioController.getPublishedNotes();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Java 25 Guide", response.getBody().get(0).getTitle());
    }

    @Test
    @DisplayName("Should save contact submission")
    void testSubmitContactMessage() {
        ContactMessage msg = new ContactMessage();
        msg.setName("Alice");
        msg.setEmail("alice@example.com");
        msg.setMessage("Interested in consulting.");

        ContactMessage savedMsg = new ContactMessage();
        savedMsg.setId(10L);
        savedMsg.setName("Alice");

        when(profileInfoRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.empty());
        when(contactMessageRepository.save(any(ContactMessage.class))).thenReturn(savedMsg);

        ResponseEntity<ContactMessage> response = publicPortfolioController.submitContactMessage(msg);

        assertEquals(201, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(10L, response.getBody().getId());
    }
}
