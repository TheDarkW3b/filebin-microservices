package com.filebin.api_gateway.filters;

import com.filebin.api_gateway.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter implements WebFilter {

    private final JwtUtils jwtUtils;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        log.info("Request Path: {}", path);

        // Allow public endpoints to bypass the filter
        if (path.startsWith("/api/v1/user/login") ||
                path.startsWith("/api/v1/user/register") ||
                path.startsWith("/images/") ||
                path.startsWith("/eureka/") ||
                path.startsWith("/actuator/")) {
            return chain.filter(exchange);
        }

        String authorizationHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return setJsonErrorResponse(exchange, HttpStatus.UNAUTHORIZED, "Authentication required. Please login.");
        }

        String token = authorizationHeader.substring(7); // Remove "Bearer " prefix

        try {
            String userId = jwtUtils.extractId(token);

            if (userId != null && jwtUtils.validateToken(token)) {
                // Token is valid, proceed to next filter
                return chain.filter(exchange);
            } else {
                return setJsonErrorResponse(exchange, HttpStatus.UNAUTHORIZED, "Invalid JWT token. Please log in again.");
            }
        } catch (Exception e) {
            return setJsonErrorResponse(exchange, HttpStatus.UNAUTHORIZED, "Token has expired or is invalid.");
        }
    }

    private Mono<Void> setJsonErrorResponse(ServerWebExchange exchange, HttpStatus status, String message) {
        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().add(HttpHeaders.CONTENT_TYPE, "application/json");

        byte[] response = String.format("{\"message\": \"%s\"}", message).getBytes();
        return exchange.getResponse().writeWith(Mono.just(exchange.getResponse().bufferFactory().wrap(response)));
    }
}
