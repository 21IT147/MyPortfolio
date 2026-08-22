package com.keval.portfolio.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider();
        // Set test secret via reflection / helper
        org.springframework.test.util.ReflectionTestUtils.setField(
                jwtTokenProvider, "jwtSecret", "9a2f8c4e7b1d3a5f6e8c0b2d4f6a8c1e3b5d7f9a2c4e6b8d0a2c4e6b8d0a2c4e"
        );
        org.springframework.test.util.ReflectionTestUtils.setField(
                jwtTokenProvider, "jwtExpirationMs", 86400000L
        );
    }

    @Test
    @DisplayName("Should generate valid JWT token for admin user")
    void testGenerateToken() {
        String token = jwtTokenProvider.generateToken("admin", "ROLE_ADMIN");
        assertNotNull(token);
        assertTrue(token.length() > 20);
    }

    @Test
    @DisplayName("Should validate token and extract username correctly")
    void testValidateAndGetUsername() {
        String token = jwtTokenProvider.generateToken("admin", "ROLE_ADMIN");
        assertTrue(jwtTokenProvider.validateToken(token));

        String username = jwtTokenProvider.getUsernameFromToken(token);
        assertEquals("admin", username);
    }

    @Test
    @DisplayName("Should reject invalid or tampered JWT token")
    void testInvalidToken() {
        String fakeToken = "eyJhbGciOiJIUzI1NiJ9.invalidpayload.invalidsignature";
        assertFalse(jwtTokenProvider.validateToken(fakeToken));
    }
}
