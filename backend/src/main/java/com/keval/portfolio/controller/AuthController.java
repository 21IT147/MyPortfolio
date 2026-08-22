package com.keval.portfolio.controller;

import com.keval.portfolio.dto.AuthRequest;
import com.keval.portfolio.dto.AuthResponse;
import com.keval.portfolio.dto.GoogleAuthRequest;
import com.keval.portfolio.dto.RegisterRequest;
import com.keval.portfolio.model.ProfileInfo;
import com.keval.portfolio.model.User;
import com.keval.portfolio.repository.ProfileInfoRepository;
import com.keval.portfolio.repository.UserRepository;
import com.keval.portfolio.security.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final ProfileInfoRepository profileInfoRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            UserRepository userRepository,
            ProfileInfoRepository profileInfoRepository,
            PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.profileInfoRepository = profileInfoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.username(),
                        authRequest.password()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_ADMIN");

        String jwt = tokenProvider.generateToken(authRequest.username(), role);
        return ResponseEntity.ok(new AuthResponse(jwt, authRequest.username(), role));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.findByUsername(registerRequest.username()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Username '" + registerRequest.username() + "' is already taken!");
        }

        var user = new User();
        user.setUsername(registerRequest.username().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(registerRequest.password()));
        user.setEmail(registerRequest.email());
        user.setRole("ROLE_ADMIN");

        userRepository.save(user);

        // Auto-create initial ProfileInfo for the new portfolio user
        var profile = new ProfileInfo();
        profile.setUser(user);
        profile.setFullName(user.getUsername());
        profile.setEyebrow("PORTFOLIO OWNER");
        profile.setTitle("Enterprise Java & Fullstack Developer");
        profile.setSummary("Welcome to my database-driven portfolio platform!");
        profile.setAboutText("Biography information for " + user.getUsername());
        profile.setEmail(user.getEmail());
        profile.setYearsExperience(1);
        profile.setProjectsCompleted(5);
        profile.setTechnologiesMastered(10);
        profile.setPrimaryColor("#3b82f6");
        profile.setAccentColor("#8b5cf6");
        profile.setThemePreset("Midnight Dark");
        profileInfoRepository.save(profile);

        String jwt = tokenProvider.generateToken(user.getUsername(), user.getRole());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(jwt, user.getUsername(), user.getRole()));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> authenticateGoogleUser(@RequestBody GoogleAuthRequest googleRequest) {
        String email = googleRequest.email();
        String username = email.split("@")[0].replaceAll("[^a-zA-Z0-9_]", "_").toLowerCase();

        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            // Auto-provision Google User
            user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setEmail(email);
            user.setRole("ROLE_ADMIN");
            user.setGoogleId(googleRequest.credential() != null ? googleRequest.credential().substring(0, Math.min(20, googleRequest.credential().length())) : "GOOGLE_OAUTH");
            user.setAvatarUrl(googleRequest.picture());
            userRepository.save(user);

            var profile = new ProfileInfo();
            profile.setUser(user);
            profile.setFullName(googleRequest.name() != null ? googleRequest.name() : username);
            profile.setEyebrow("GOOGLE AUTHORIZED PORTFOLIO");
            profile.setTitle("Software Engineer");
            profile.setSummary("Google authenticated enterprise portfolio user.");
            profile.setAboutText("Portfolio biography for " + user.getUsername());
            profile.setAvatarUrl(googleRequest.picture());
            profile.setEmail(email);
            profile.setYearsExperience(2);
            profile.setProjectsCompleted(8);
            profile.setTechnologiesMastered(12);
            profile.setPrimaryColor("#3b82f6");
            profile.setAccentColor("#8b5cf6");
            profile.setThemePreset("Midnight Dark");
            profileInfoRepository.save(profile);
        }

        String jwt = tokenProvider.generateToken(user.getUsername(), user.getRole());
        return ResponseEntity.ok(new AuthResponse(jwt, user.getUsername(), user.getRole()));
    }
}
