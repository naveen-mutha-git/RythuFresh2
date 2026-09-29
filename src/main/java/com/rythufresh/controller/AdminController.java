package com.rythufresh.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rythufresh.repository.CustomerRepository;
import com.rythufresh.repository.OrderRepository;
import com.rythufresh.repository.VegetableRepository;
import com.rythufresh.service.AdminService;


@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private AdminService adminService;

    @Autowired
    private VegetableRepository vegetableRepository;

    @Autowired
    private CustomerRepository customerRepository;


    // ================= ADMIN LOGIN =================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestParam String username,
            @RequestParam String password) {

        boolean success =
                adminService.login(username, password);

        if (success) {

            return ResponseEntity.ok(
                    "Login successful"
            );
        }

        return ResponseEntity
                .status(401)
                .body("Invalid username or password");
    }

 // ================= ADMIN FORGOT PASSWORD =================

    @PutMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestParam String email,
            @RequestParam String newPassword) {

        if (email == null || email.trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Email is required");
        }

        if (newPassword == null ||
                newPassword.length() < 6) {

            return ResponseEntity
                    .badRequest()
                    .body("Password must contain at least 6 characters");
        }

        boolean success =
                adminService.resetPassword(
                        email.trim(),
                        newPassword
                );

        if (success) {

            return ResponseEntity.ok(
                    "Password reset successfully"
            );
        }

        return ResponseEntity
                .status(404)
                .body("Admin email not found");
    }
    // ================= DASHBOARD =================

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {

        // Total vegetables
        long vegetableCount =
                vegetableRepository.count();


        // Total customers
        long customerCount =
                customerRepository.count();


        // Total orders
        long orderCount =
                orderRepository.count();


        // ================= TODAY =================

        LocalDate today =
                LocalDate.now();

        LocalDateTime startOfDay =
                today.atStartOfDay();

        LocalDateTime endOfDay =
                today.plusDays(1)
                     .atStartOfDay()
                     .minusNanos(1);


        // Today's order count
        long todayOrderCount =
                orderRepository.countByOrderDateBetween(
                        startOfDay,
                        endOfDay
                );


        // ================= ORDER STATUS =================

        long pendingOrders =
                orderRepository.countByOrderStatusIgnoreCase(
                        "Pending"
                );


        long deliveredOrders =
                orderRepository.countByOrderStatusIgnoreCase(
                        "Delivered"
                );


        // ================= REVENUE =================

        Double totalRevenue =
                orderRepository.getTotalRevenueExcludingStatus(
                        "Cancelled"
                );


        Double todayRevenue =
                orderRepository.getTodayRevenueExcludingStatus(
                        startOfDay,
                        endOfDay,
                        "Cancelled"
                );


        // ================= RESPONSE =================

        return ResponseEntity.ok(
                new DashboardResponse(
                        vegetableCount,
                        customerCount,
                        orderCount,
                        todayOrderCount,
                        pendingOrders,
                        deliveredOrders,
                        totalRevenue,
                        todayRevenue
                )
        );
    }


    // ================= DASHBOARD RESPONSE =================

    public static class DashboardResponse {

        private long vegetableCount;

        private long customerCount;

        private long orderCount;

        private long todayOrderCount;

        private long pendingOrders;

        private long deliveredOrders;

        private Double totalRevenue;

        private Double todayRevenue;


        public DashboardResponse(
                long vegetableCount,
                long customerCount,
                long orderCount,
                long todayOrderCount,
                long pendingOrders,
                long deliveredOrders,
                Double totalRevenue,
                Double todayRevenue) {

            this.vegetableCount = vegetableCount;
            this.customerCount = customerCount;
            this.orderCount = orderCount;
            this.todayOrderCount = todayOrderCount;
            this.pendingOrders = pendingOrders;
            this.deliveredOrders = deliveredOrders;
            this.totalRevenue = totalRevenue;
            this.todayRevenue = todayRevenue;
        }


        public long getVegetableCount() {
            return vegetableCount;
        }


        public long getCustomerCount() {
            return customerCount;
        }


        public long getOrderCount() {
            return orderCount;
        }


        public long getTodayOrderCount() {
            return todayOrderCount;
        }


        public long getPendingOrders() {
            return pendingOrders;
        }


        public long getDeliveredOrders() {
            return deliveredOrders;
        }


        public Double getTotalRevenue() {
            return totalRevenue;
        }


        public Double getTodayRevenue() {
            return todayRevenue;
        }
    }
}