FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

#Copy Maven Files First
COPY pom.xml .

#Download Dependencies
RUN apt-get update \
    && apt-get install -y maven \
    && rm -rf /var/liv/apt/lists/*

RUN mvn dependency:go-offline -DskipTests

#Copy source code
COPY src ./src

# Build application
RUN mvn clean package -DskipTests


# =========================================================
# Stage 2: Run the application
# =========================================================

FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the generated Spring Boot JAR
COPY --from=builder /app/target/*.jar app.jar

# Render and other hosting platforms use PORT
EXPOSE 8080

# Start Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]

