# Stage 1: Extract Stage
FROM eclipse-temurin:21-jre-alpine AS builder
WORKDIR extracted
ADD target/*.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

# Stage 2: Runtime Stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder extracted/dependencies/ .
COPY --from=builder extracted/spring-boot-loader/ .
COPY --from=builder extracted/snapshot-dependencies/ .
COPY --from=builder extracted/application/ .
EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]