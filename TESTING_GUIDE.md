# Automated Testing & Verification Guide

This document outlines the testing architecture, unit test suites, fail-point boundary conditions, and regression verification procedures for both the **Spring Boot 3 Gradle Backend** and **React.js SPA Frontend**.

---

## 1. Backend Automated Testing Suite (JUnit 5 & Mockito)

### Test Architecture
- **Framework**: JUnit 5 (Jupiter) & Mockito framework integrated via Gradle (`./gradlew test`).
- **Location**: `backend/src/test/java/com/keval/portfolio/`

### Test Coverage & Classes
1. **`security/JwtTokenProviderTest.java`**:
   - `testGenerateToken()`: Verifies HMAC SHA-256 JWT signature creation.
   - `testValidateAndGetUsername()`: Validates token claims and username extraction (`admin`).
   - `testInvalidToken()`: Validates rejection of tampered or malformed JWT strings.
2. **`controller/AuthControllerTest.java`**:
   - `testAuthenticateUser_Success()`: Mocks Spring Security `AuthenticationManager` and verifies 200 OK + JWT payload on valid credentials (`admin` / `admin123`).
3. **`controller/PublicPortfolioControllerTest.java`**:
   - `testGetProfile_Success()`: Verifies unauthenticated GET `/api/v1/public/profile` response.
   - `testGetPublishedNotes()`: Verifies published articles retrieval.
   - `testSubmitContactMessage()`: Mocks contact message saving in repository.
4. **`controller/AdminControllerTest.java`**:
   - `testGetAdminStats()`: Verifies dashboard stats payload.
   - `testCreateSkill()`: Verifies skill creation and ID generation.
   - `testDeleteSkill()`: Verifies 204 No Content deletion status.

### Execution Command
```bash
cd backend
gradle test
```

---

## 2. Frontend Automated UI Testing Suite (Vitest & React Testing Library)

### Test Architecture
- **Framework**: Vitest + React Testing Library + happy-dom environment.
- **Location**: `frontend/src/test/`

### Test Coverage & Files
1. **`HeroSection.test.tsx`**:
   - Tests rendering of developer name, title, experience badges (`2+ Years`), and projects delivered (`12+ Delivered`).
2. **`ContactSection.test.tsx`**:
   - Tests form input elements rendering and interactive typing state updates (`fireEvent.change`).

### Execution Command
```bash
cd frontend
npm run test
```

---

## 3. Multi-Phase Testing Workflow

### Phase 1: Unit Testing
- Execute `./gradlew test` for Java backend unit tests.
- Execute `npm run test` for React component unit tests.

### Phase 2: Fail Points & Boundary Testing
1. **JWT Expiration / Malformed Tokens**:
   - Send requests with header `Authorization: Bearer invalid-token`.
   - Verified result: 401 Unauthorized / Security Context rejection.
2. **Database Fallback / Port Conflict Handling**:
   - If port 8080 is occupied, application cleanly shifts to port 8085.
   - Database auto-creates tables if not existing (`createDatabaseIfNotExist=true`).
3. **Unauthenticated Admin Access Attempt**:
   - Access `/admin/dashboard` directly without JWT token in `localStorage`.
   - Verified result: Redirects to `/admin/login`.

### Phase 3: Regression Testing
1. Execute full Gradle build: `./gradlew build`.
2. Build production React SPA bundle: `npm run build`.
3. Launch backend API (`http://localhost:8085`) and frontend client (`http://localhost:3000`).
4. Perform end-to-end user actions (submit contact message → log in to admin panel → view message in inbox → edit profile title → verify live update on public home page).
