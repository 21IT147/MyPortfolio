package com.keval.portfolio.dto;

/**
 * Immutable Java Record for user registration payloads.
 */
public record RegisterRequest(
        String username,
        String password,
        String email
) {}
