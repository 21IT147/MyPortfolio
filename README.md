# 🚀 Full-Stack Enterprise Portfolio & Admin CMS Engine

![Java 25](https://img.shields.io/badge/Java-25_Modern_Features-orange.svg?style=for-the-badge&logo=openjdk)
![Spring Boot 3](https://img.shields.io/badge/Spring_Boot-3.2.3-green.svg?style=for-the-badge&logo=springboot)
![Gradle](https://img.shields.io/badge/Gradle-8.6-blue.svg?style=for-the-badge&logo=gradle)
![React.js](https://img.shields.io/badge/React.js-18.2-cyan.svg?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.1-purple.svg?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC.svg?style=for-the-badge&logo=tailwind-css)
![MySQL 8.0](https://img.shields.io/badge/MySQL-8.0_Workbench-00758F.svg?style=for-the-badge&logo=mysql)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas_Cloud-47A248.svg?style=for-the-badge&logo=mongodb)
![JWT Auth](https://img.shields.io/badge/Security-Spring_Security_JWT-red.svg?style=for-the-badge&logo=jsonwebtokens)

> An enterprise-grade, database-configurable portfolio platform engineered with a **Spring Boot 3 (Gradle, Java 25 Records & Switch Expressions)** REST API backend and a modern **React.js SPA (Vite + React Router v6)** frontend. Features an authenticated Admin Dashboard to manage profile content, skills, projects, markdown articles, and contact inquiries dynamically without touching source code or re-deploying applications.

---

## 🌟 Key System Features

- ⚡ **Database-Configurable Portfolio**: Every text block, project card, skill chip, career timeline entry, and article is driven directly by database entities.
- 🔐 **Spring Security + JWT Auth**: Stateless token authorization protecting `/api/v1/admin/**` management routes. Public visitors have unauthenticated read-only access (`/api/v1/public/**`).
- 🛠️ **Gradle Build Automation**: Built with Gradle 8.6 toolchain supporting multi-profile database environments.
- 🗄️ **Multi-Database System**:
  - **MySQL 8.0 Local**: Configured for local development using MySQL Workbench (`root` / `keval@mysql2504`).
  - **MongoDB Atlas Cloud**: Configured for cloud deployments via `spring.data.mongodb.uri`.
- 📝 **Interactive Admin Panel (`/admin`)**:
  - Dashboard overview counters.
  - Profile metadata & resume download URL editor.
  - Skills & category manager with proficiency percentages.
  - Project case studies manager with GitHub/Demo link configuration.
  - Markdown Notes editor with real-time draft/publish toggling.
  - Contact inbox manager to review user inquiries.
- 🧪 **Full Test Coverage (JUnit 5, Mockito & Vitest)**: Complete backend unit test suite + frontend component tests.

---

## 🏗️ System Architecture & Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor Visitor as Public Visitor
    actor Admin as Portfolio Owner
    participant React as React.js SPA (Vite - Port 3000)
    participant Spring as Spring Boot API (Gradle - Port 8085)
    participant DB as MySQL 8.0 / MongoDB Atlas

    Visitor->>React: Browse http://localhost:3000/
    React->>Spring: GET /api/v1/public/profile, /skills, /projects
    Spring->>DB: Query JPA / Mongo Repositories
    DB-->>Spring: Return active records
    Spring-->>React: 200 OK JSON Payload
    React-->>Visitor: Render Dynamic UI

    Admin->>React: Visit http://localhost:3000/admin/login
    React->>Spring: POST /api/v1/auth/login {"username":"admin","password":"..."}
    Spring-->>React: Return Signed JWT Bearer Token
    Admin->>React: Edit Profile / Add Skill / Publish Note
    React->>Spring: PUT/POST /api/v1/admin/* (Authorization: Bearer <JWT>)
    Spring->>DB: Save updated entity
    DB-->>Spring: Transaction Committed
    Spring-->>React: Updated Object
    React-->>Admin: Show Success Toast / Live Update
```

---

## 🗄️ Database Configurations & Profiles

### 1. MySQL 8.0 Local Workbench Setup (`spring.profiles.active=mysql`)
Configured in `src/main/resources/application-mysql.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/portfolio_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=keval@mysql2504
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
```

### 2. MongoDB Atlas Cloud Database Setup (`spring.profiles.active=mongodb`)
Configured in `src/main/resources/application-mongodb.properties`:
```properties
spring.data.mongodb.uri=mongodb+srv://myAtlasDBUser:doAhRtrOrMztWcXT@developmentclustrer.w06y2m1.mongodb.net/portfolio_db?appName=DevelopmentClustrer
```

### ☁️ Free Cloud MySQL Alternatives for Production
1. **Aiven for MySQL**: Offers a free tier managed MySQL cluster with SSL.
2. **PlanetScale**: Serverless MySQL platform.
3. **Supabase / Neon**: Free cloud PostgreSQL databases (compatible with Spring Data JPA with dialect adjustment).
4. **Railway / Render**: Free managed relational databases.

---

## 📘 How to Build This Full-Stack Platform From Scratch (Interview Guide)

Use this step-by-step breakdown during interview discussions to explain how you architected this application from scratch:

### Step 1: Bootstrapping Spring Boot with Gradle
1. Create project with Spring Initializr or write `build.gradle` specifying Java 17, Spring Web, Spring Data JPA, Spring Security, MySQL Connector, Lombok, and JWT dependencies (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`).
2. Define `PortfolioApplication.java` with `@SpringBootApplication`.

### Step 2: Designing Domain Entities & Persistence Repositories
1. Define JPA entities (`User`, `ProfileInfo`, `Skill`, `Experience`, `Project`, `Education`, `Note`, `ContactMessage`).
2. Create Spring Data interfaces extending `JpaRepository<Entity, Long>`.
3. Implement `DataSeeder` implementing `CommandLineRunner` to seed default records on startup if database is empty.

### Step 3: Implementing JWT Security Chain
1. **`JwtTokenProvider`**: Uses HMAC SHA-256 (`Keys.hmacShaKeyFor`) to sign and parse tokens containing username and role claims.
2. **`JwtAuthenticationFilter`**: Extends `OncePerRequestFilter`. Intercepts incoming `Authorization: Bearer <token>` headers and populates `SecurityContextHolder`.
3. **`SecurityConfig`**: Configures stateless session management, CORS mapping for frontend ports, permits `/api/v1/public/**` and `/api/v1/auth/**`, and restricts `/api/v1/admin/**` to `ROLE_ADMIN`.

### Step 4: Building REST Controllers
1. `AuthController`: `POST /api/v1/auth/login` validates credentials against `AuthenticationManager` and issues JWT.
2. `PublicPortfolioController`: Unauthenticated endpoints returning portfolio content and accepting contact messages (`POST /api/v1/public/contact`).
3. `AdminController`: Protected CRUD endpoints (`POST`, `PUT`, `DELETE`) for profile editing, skill management, project updates, and inbox review.

### Step 5: Building React.js SPA Frontend (Vite)
1. Initialize Vite React app (`npm create vite@latest frontend -- --template react-ts`).
2. Setup React Router v6 in `App.tsx` defining public routes (`/`, `/notes`, `/notes/:slug`) and admin routes (`/admin/login`, `/admin/dashboard`, `/admin/profile`, `/admin/skills`, `/admin/projects`, `/admin/experience`, `/admin/notes`, `/admin/messages`).
3. Build Axios client in `src/lib/api.ts` with a request interceptor automatically attaching `localStorage.getItem('admin_jwt_token')`.
4. Style components with Tailwind CSS glassmorphism cards and Lucide icons.

---

## 🧪 Testing & Quality Assurance

### Backend Tests (JUnit 5 & Mockito)
- **Command**: `cd backend && gradle test`
- Tests JWT token creation & validation, `AuthController` login flow, `PublicPortfolioController` responses, and `AdminController` CRUD operations.

### Frontend UI Tests (Vitest & React Testing Library)
- **Command**: `cd frontend && npm run test`
- Tests component rendering, input state changes, and form submit events.

---

## 🚀 Running the Project Locally

### 1. Start Spring Boot Backend
```bash
cd backend
# Build and run with Gradle
gradle bootRun
```
*Backend URL*: `http://localhost:8085`

### 2. Start React.js Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend URL*: `http://localhost:3000`  
*Admin Credentials*: `admin` / `admin123`
