package com.rythufresh.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rythufresh.entity.Admin;
import com.rythufresh.repository.AdminRepository;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ================= LOGIN =================

    public boolean login(String username, String password) {

        Optional<Admin> admin =
                adminRepository.findByUsername(username.trim());

        if (admin.isEmpty()) {
            System.out.println("ADMIN NOT FOUND: " + username);
            return false;
        }

        System.out.println("ADMIN FOUND: " +
                admin.get().getUsername());

        boolean match = passwordEncoder.matches(
                password,
                admin.get().getPassword()
        );

        System.out.println("PASSWORD MATCH: " + match);

        return match;
    }

    // ================= FIND BY EMAIL =================

    public Optional<Admin> findByEmail(String email) {
        return adminRepository.findByEmail(email.trim());
    }

    // ================= RESET PASSWORD =================

    public boolean resetPassword(
            String email,
            String newPassword) {

        if (email == null || newPassword == null) {
            return false;
        }

        Optional<Admin> admin =
                adminRepository.findByEmail(email.trim());

        if (admin.isEmpty()) {
            return false;
        }

        admin.get().setPassword(
                passwordEncoder.encode(newPassword)
        );

        adminRepository.save(admin.get());

        return true;
    }
}