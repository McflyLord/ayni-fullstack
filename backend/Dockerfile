# ---- Build stage ----
FROM maven:3.9.16-eclipse-temurin-25 AS build

WORKDIR /build

# Descarga dependencias en una capa separada para acelerar rebuilds.
COPY pom.xml ./
RUN mvn -B -ntp dependency:go-offline || true

COPY src ./src
RUN mvn -B -ntp -DskipTests package

# ---- Runtime stage ----
FROM eclipse-temurin:25-jre-alpine

WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
COPY --from=build /build/target/*.jar app.jar

USER spring:spring

EXPOSE 8080

# Railway inyecta PORT; Spring Boot escucha ahí. Si no existe, usa 8080.
ENTRYPOINT ["sh", "-c", "exec java -XX:MaxRAMPercentage=75 -Djava.security.egd=file:/dev/./urandom -jar app.jar --server.port=${PORT:-8080}"]
