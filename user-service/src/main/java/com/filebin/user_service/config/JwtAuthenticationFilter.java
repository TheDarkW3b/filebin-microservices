package com.filebin.user_service.config;

import com.filebin.user_service.utils.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/v1/user/login") ||
                path.startsWith("/api/v1/user/register") ||
                path.startsWith("/images/") ||
                path.startsWith("/actuator/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authorizationHeader = request.getHeader("Authorization");

        // Validate Authorization header
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            setJsonErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                    "Authentication required. Please login.");
            return;
        }

        String token = authorizationHeader.substring(7); // Remove "Bearer " prefix

        try {
            String userId = jwtUtils.extractId(token);

            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = ((CustomUserDetailService) userDetailsService).loadUserById(userId);

                if (jwtUtils.validateToken(token, userDetails)) {
                    // Set SecurityContext
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    log.info("Context set for user :-  {}", userId);

                    request.setAttribute("token", authorizationHeader);
                    request.setAttribute("userId", userId);
                } else {
                    setJsonErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                            "Invalid JWT token. Please log in again.");
                    return;
                }
            }
        } catch (Exception e) {
            log.error("JWT EXCEPTION {}", e.getMessage());

            setJsonErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                    "Token has expired or is invalid.");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void setJsonErrorResponse(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write(String.format("{\"message\": \"%s\"}", message));
    }
}
