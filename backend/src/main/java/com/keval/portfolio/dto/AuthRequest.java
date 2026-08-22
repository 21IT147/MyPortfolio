package com.keval.portfolio.dto;

/**
 * Immutable Java Record for authentication request payloads.
 */
public record AuthRequest(
        String username,
        String password
) {}
