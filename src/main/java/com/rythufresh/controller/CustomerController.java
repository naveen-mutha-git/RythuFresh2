package com.rythufresh.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rythufresh.entity.Customer;
import com.rythufresh.service.CustomerService;

@RestController
@RequestMapping("/customer")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerService customerService;


    // ================================
    // REGISTER
    // ================================

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Customer customer) {

        Customer existing =
                customerService.findByEmail(customer.getEmail());

        if (existing != null) {

            Map<String, Object> response = new HashMap<>();

            response.put("success", false);
            response.put("message", "Email already registered");

            return ResponseEntity.ok(response);
        }

        Customer saved =
                customerService.register(customer);

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("message", "Registration successful");
        response.put("id", saved.getId());
        response.put("fullName", saved.getFullName());
        response.put("email", saved.getEmail());
        response.put("phone", saved.getPhone());
        response.put("address", saved.getAddress());

        return ResponseEntity.ok(response);
    }


    // ================================
    // LOGIN
    // ================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> loginData) {

        String email = loginData.get("email");
        String password = loginData.get("password");

        Map<String, Object> response = new HashMap<>();

        if (email == null || password == null ||
                email.trim().isEmpty() ||
                password.trim().isEmpty()) {

            response.put("success", false);
            response.put("message", "Email and password are required");

            return ResponseEntity.ok(response);
        }

        Customer customer =
                customerService.login(
                        email.trim(),
                        password
                );

        if (customer == null) {

            response.put("success", false);
            response.put("message", "Invalid Email or Password");

            return ResponseEntity.ok(response);
        }

        response.put("success", true);
        response.put("message", "Login Successful");
        response.put("id", customer.getId());
        response.put("fullName", customer.getFullName());
        response.put("email", customer.getEmail());
        response.put("phone", customer.getPhone());
        response.put("address", customer.getAddress());

        return ResponseEntity.ok(response);
    }


    // ================================
    // GET ALL CUSTOMERS
    // ================================

    @GetMapping("/all")
    public List<Customer> getAllCustomers() {

        return customerService.findAllCustomers();
    }


    // ================================
    // GET CUSTOMER BY ID
    // ================================

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getCustomerById(
            @PathVariable Long id) {

        Customer customer =
                customerService.findCustomerById(id);

        if (customer == null) {

            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(customer);
    }


    // ================================
    // UPDATE CUSTOMER
    // ================================

    @PutMapping("/id/{id}")
    public ResponseEntity<?> updateCustomer(
            @PathVariable Long id,
            @RequestBody Customer customer) {

        Customer existing =
                customerService.findCustomerById(id);

        if (existing == null) {

            return ResponseEntity.notFound().build();
        }

        existing.setFullName(customer.getFullName());
        existing.setEmail(customer.getEmail());
        existing.setPhone(customer.getPhone());
        existing.setAddress(customer.getAddress());

        Customer updated =
                customerService.updateCustomer(existing);

        return ResponseEntity.ok(updated);
    }


    // ================================
    // CHANGE PASSWORD
    // ================================

    @PutMapping("/id/{id}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> data) {

        String currentPassword =
                data.get("currentPassword");

        String newPassword =
                data.get("newPassword");

        boolean changed =
                customerService.changePassword(
                        id,
                        currentPassword,
                        newPassword
                );

        Map<String, Object> response = new HashMap<>();

        response.put("success", changed);

        if (changed) {

            response.put(
                    "message",
                    "Password changed successfully"
            );

        } else {

            response.put(
                    "message",
                    "Current password is incorrect"
            );
        }

        return ResponseEntity.ok(response);
    }


    // ================================
    // FORGOT PASSWORD
    // ================================

    @PutMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> data) {

        String email =
                data.get("email");

        String newPassword =
                data.get("newPassword");

        boolean reset =
                customerService.resetPassword(
                        email,
                        newPassword
                );

        Map<String, Object> response = new HashMap<>();

        response.put("success", reset);

        if (reset) {

            response.put(
                    "message",
                    "Password reset successfully"
            );

        } else {

            response.put(
                    "message",
                    "Email not registered"
            );
        }

        return ResponseEntity.ok(response);
    }
}