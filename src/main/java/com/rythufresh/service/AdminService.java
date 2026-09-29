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

    public boolean login(
            String username,
            String password) {

        Optional<Admin> admin =
                adminRepository.findByUsername(username);

        if (admin.isEmpty()) {
            return false;
        }

        return passwordEncoder.matches(
                password,
                admin.get().getPassword()
        );
    }


    // ================= FIND BY EMAIL =================

    public Optional<Admin> findByEmail(String email) {

        return adminRepository.findByEmail(email);
    }

//================= RESET PASSWORD =================

public boolean resetPassword(
     String email,
     String newPassword) {

 if (email == null || newPassword == null) {
     return false;
 }

 Optional<Admin> admin =
         adminRepository.findByEmail(
                 email.trim()
         );

 if (admin.isEmpty()) {
     return false;
 }

 admin.get().setPassword(
         passwordEncoder.encode(newPassword)
 );

 adminRepository.saveAndFlush(
         admin.get()
 );

 return true;
}
}