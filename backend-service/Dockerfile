# Stage 1: Build jar
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Copy jar & run
FROM openjdk:17
WORKDIR /app
COPY --from=builder /app/target/*.jar backend-service.jar
EXPOSE 7080
ENTRYPOINT ["java", "-jar", "backend-service.jar"]
