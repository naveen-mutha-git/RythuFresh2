package com.rythufresh.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rythufresh.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestParam String username,
            @RequestParam String password) {

        boolean success =
                adminService.login(username, password);

        if (success) {
            return ResponseEntity.ok("Login successful");
        }

        return ResponseEntity
                .status(401)
                .body("Invalid username or password");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam String email,
            @RequestParam String newPassword) {

        boolean success =
                adminService.resetPassword(email, newPassword);

        if (success) {
            return ResponseEntity.ok("Password reset successful");
        }

        return ResponseEntity
                .status(404)
                .body("Admin email not found");
    }
}