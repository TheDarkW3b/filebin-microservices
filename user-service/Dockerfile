# Stage 1: Extract Stage
FROM eclipse-temurin:21-jre-alpine AS builder
WORKDIR extracted
ADD target/*.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

# Stage 2: Runtime Stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Add OpenTelemetry Java agent
RUN wget https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/download/v1.29.0/opentelemetry-javaagent.jar -P /tmp

# Copy application layers from the builder stage
COPY --from=builder extracted/dependencies/ .
COPY --from=builder extracted/spring-boot-loader/ .
COPY --from=builder extracted/snapshot-dependencies/ .
COPY --from=builder extracted/application/ .

# Expose the application port
EXPOSE 8080

# Run the application with OpenTelemetry Java agent
ENTRYPOINT ["java", "-javaagent:/tmp/opentelemetry-javaagent.jar", "org.springframework.boot.loader.launch.JarLauncher"]
