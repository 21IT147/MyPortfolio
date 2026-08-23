# Stage 1: Build Gradle Jar Container
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew bootJar --no-daemon

# Stage 2: Run Lightweight JRE Container
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "-Dserver.port=8085", "app.jar"]
