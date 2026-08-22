package com.keval.portfolio.dto;

/**
 * Immutable Java Record for Google OAuth2 Sign-In payloads containing Google ID token / credential.
 */
public record GoogleAuthRequest(
        String credential,
        String email,
        String name,
        String picture
) {}
