# 🌐 Zero-Cost Full-Stack Cloud Deployment Guide

This guide provides step-by-step instructions for hosting your **Spring Boot 3 (Gradle)** backend, **React.js SPA** frontend, and **MySQL 8.0 / MongoDB Atlas** database for **100% FREE** on modern cloud platforms (**Vercel**, **Render**, and **MongoDB Atlas / Aiven**).

---

## 🏗️ Recommended 100% Free Hosting Stack Architecture

```mermaid
flowchart TD
    subgraph Frontend ["1. Frontend Hosting (Vercel)"]
        Vercel["React.js SPA (Vite Build)\nhttps://your-portfolio.vercel.app"]
    end

    subgraph Backend ["2. Backend API Hosting (Render / Railway)"]
        Render["Spring Boot 3 REST API (Gradle Jar)\nhttps://portfolio-backend.onrender.com:8085"]
    end

    subgraph Database ["3. Cloud Database Tier (Free)"]
        MongoAtlas["MongoDB Atlas M0 Cluster\n(512 MB Free Cloud Storage)"]
        MySQLAiven["Aiven / PlanetScale Cloud MySQL\n(Free Relational Cluster)"]
    end

    Vercel -- HTTP REST API / JWT --> Render
    Render -- Spring Data Mongo --> MongoAtlas
    Render -- Spring Data JPA --> MySQLAiven
```

---

## 🗄️ Step 1: Set Up Free Cloud Database (MongoDB Atlas / Aiven MySQL)

### Option A: Free Cloud MongoDB Atlas (Recommended for Zero-Config Deployment)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Click **Create Cluster** → Select **M0 Free Tier**.
3. Under **Database Access**, create a database user (e.g., username `myAtlasDBUser`, password `doAhRtrOrMztWcXT`).
4. Under **Network Access**, click **Add IP Address** → Choose **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Copy your connection string URI:
   ```properties
   mongodb+srv://myAtlasDBUser:doAhRtrOrMztWcXT@developmentclustrer.w06y2m1.mongodb.net/portfolio_db?appName=DevelopmentClustrer
   ```

### Option B: Free Cloud MySQL 8.0 (Aiven for MySQL)
1. Go to [Aiven.io](https://aiven.io/) and create a free tier MySQL database instance.
2. Note your JDBC connection details: `jdbc:mysql://<host>:<port>/portfolio_db?useSSL=true`.

---

## 🚀 Step 2: Deploy Spring Boot Backend to Render (Free Web Service)

[Render](https://render.com) provides free containerized web services for Spring Boot Java applications.

### Step 2.1: Create `Dockerfile` in `backend/`
Ensure a `Dockerfile` exists in `backend/` to containerize your Gradle Spring Boot app:
```dockerfile
# Stage 1: Build Jar with Gradle
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN ./gradlew bootJar --no-daemon

# Stage 2: Run Lightweight JRE Container
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "-Dserver.port=8085", "app.jar"]
```

### Step 2.2: Deploy on Render
1. Push your repository to **GitHub**.
2. Log in to [Render Dashboard](https://dashboard.render.com/) → Click **New +** → Select **Web Service**.
3. Connect your GitHub repository and select the `backend` root folder.
4. Set the following configuration:
   - **Name**: `portfolio-backend-api`
   - **Environment**: `Docker`
   - **Docker Context Path**: `./backend`
   - **DockerfilePath**: `./backend/Dockerfile`
5. Add **Environment Variables**:
   - `SPRING_PROFILES_ACTIVE` = `mongodb` (or `mysql`)
   - `SPRING_DATA_MONGODB_URI` = `mongodb+srv://myAtlasDBUser:doAhRtrOrMztWcXT@developmentclustrer.w06y2m1.mongodb.net/portfolio_db`
   - `APP_JWT_SECRET` = `9a2f8c4e7b1d3a5f6e8c0b2d4f6a8c1e3b5d7f9a2c4e6b8d0a2c4e6b8d0a2c4e`
6. Click **Create Web Service**. Render will build and deploy your Spring Boot API (e.g. `https://portfolio-backend-api.onrender.com`).

---

## ⚡ Step 3: Deploy React.js Frontend to Vercel

[Vercel](https://vercel.com) provides instant global edge deployments for Vite React applications.

### Step 3.1: Configure Production API URL in Frontend
Update `frontend/src/lib/api.ts` to read your backend URL from environment variables:
```typescript
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085/api/v1';
```

### Step 3.2: Create `vercel.json` in `frontend/`
Create `frontend/vercel.json` to configure single-page application routing rewrites:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Step 3.3: Deploy on Vercel
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard) → Click **Add New Project**.
2. Import your GitHub repository.
3. Select **Root Directory**: `frontend`.
4. Build settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL` = `https://portfolio-backend-api.onrender.com/api/v1`
6. Click **Deploy**. Vercel will build your SPA and give you a live production URL (e.g. `https://my-portfolio-eight-omega-96.vercel.app`).

---

## 🔒 Step 4: Configure CORS on Spring Boot Backend

Ensure `SecurityConfig.java` allows requests from your Vercel frontend URL:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of(
        "http://localhost:3000",
        "https://my-portfolio-eight-omega-96.vercel.app",
        "https://your-custom-domain.com"
    ));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

---

## ✅ Step 5: Post-Deployment Verification Checklist

1. **Public Portfolio Visit**: Open `https://my-portfolio-eight-omega-96.vercel.app` and verify dynamic data loading.
2. **User Slug Route Visit**: Open `https://my-portfolio-eight-omega-96.vercel.app/u/admin` to test multi-tenant portfolio slug routing.
3. **Contact Submission Test**: Submit a message on the contact form and verify in-app inbox logging.
4. **Admin Dashboard Login**: Visit `https://my-portfolio-eight-omega-96.vercel.app/admin/login` and log in with your credentials (`admin` / `admin123` or Google OAuth2).
5. **Theme Customization Test**: Change theme preset to **Neon Cyberpunk** on `/admin/profile` and verify instant persistence across the live website.
