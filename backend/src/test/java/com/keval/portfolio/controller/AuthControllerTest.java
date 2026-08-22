package com.keval.portfolio.controller;

import com.keval.portfolio.dto.AuthRequest;
import com.keval.portfolio.dto.AuthResponse;
import com.keval.portfolio.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should return 200 OK and JWT token upon successful admin authentication")
    void testAuthenticateUser_Success() {
        // Java Record instantiation
        AuthRequest req = new AuthRequest("admin", "admin123");

        doReturn(Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")))
                .when(authentication).getAuthorities();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(tokenProvider.generateToken("admin", "ROLE_ADMIN"))
                .thenReturn("mock-jwt-token-12345");

        ResponseEntity<AuthResponse> response = authController.authenticateUser(req);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        
        // Java Record accessors
        AuthResponse resBody = response.getBody();
        assertEquals("mock-jwt-token-12345", resBody.token());
        assertEquals("admin", resBody.username());
        assertEquals("ROLE_ADMIN", resBody.role());
    }
}
