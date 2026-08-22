package com.keval.portfolio.dto;

/**
 * Immutable Java Record for authentication response payloads containing JWT token metadata.
 */
public record AuthResponse(
        String token,
        String username,
        String role
) {}
