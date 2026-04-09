package com.algo.Complaint_register.config;

import com.algo.Complaint_register.service.JwtUtil;
import com.algo.Complaint_register.service.UserDetailsServicesImp;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.stream.Collectors;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserDetailsServicesImp userDetailsServicesImp;

    public JwtRequestFilter(JwtUtil jwtUtil, UserDetailsServicesImp userDetailsServicesImp) {
        this.jwtUtil = jwtUtil;
        this.userDetailsServicesImp = userDetailsServicesImp;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;
        String roles = null; // Variable to hold roles from the token

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            username = jwtUtil.extractUsername(jwt);
            roles = jwtUtil.extractRoles(jwt); // Extract roles from the token
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsServicesImp.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, userDetails)) {
                // --- THIS IS THE CORRECTED PART ---
                // Create authorities from the roles string in the token
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null,
                        Arrays.stream(roles.split(","))
                                .map(SimpleGrantedAuthority::new)
                                .collect(Collectors.toList()));
                // --- END OF CORRECTION ---

                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
