package com.filebin.api_gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // User-Images Route
                .route("user-images", r -> r.path("/images/**")
                        .uri("lb://USER-SERVICE"))

                // User-Service Routes
                .route("user-service", r -> r.path("/api/v1/user/**")
                        .uri("lb://USER-SERVICE"))

                // File-Service Routes
                .route("file-service", r -> r.path("/api/v1/file/**")
                        .uri("lb://FILE-SERVICE"))

                // Paste-Service Routes
                .route("paste-service", r -> r.path("/api/v1/paste/**")
                        .uri("lb://PASTE-SERVICE"))

                // Eureka Web UI Route
                .route("eureka-web", r -> r.path("/eureka/**")
                        .filters(f -> f.rewritePath("/eureka/(?!js|css|images)(.*)", "/$1"))
                        .uri("http://eureka:8761"))
                .build();
    }
}
