package com.rythufresh.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // Static files
                .requestMatchers(
                    "/",
                    "/index.html",
                    "/login",
                    "/login.html",
                    "/register.html",
                    "/customer/**",
                    "/css/**",
                    "/js/**",
                    "/images/**",
                    "/static/**"
                ).permitAll()

                // Admin login
                .requestMatchers("/api/admin/login").permitAll()

                // Temporary - we will secure this properly next
                .requestMatchers("/api/admin/**").permitAll()

                // Everything else
                .anyRequest().permitAll()
            )

            // IMPORTANT: disable Spring's default login page
            .formLogin(form -> form.disable())

            // IMPORTANT: disable browser Basic Auth popup
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}