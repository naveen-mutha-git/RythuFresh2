package com.rythufresh.controller;

import com.rythufresh.entity.Order;
import com.rythufresh.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;


    // ================= PLACE ORDER =================

    @PostMapping
    public Order placeOrder(
            @RequestBody Order order) {

        return orderService.saveOrder(order);
    }


    // ================= GET ALL ORDERS =================

    @GetMapping
    public List<Order> getAllOrders() {

        return orderService.getAllOrders();
    }


    // ================= GET ORDER BY ID =================

    @GetMapping("/{id}")
    public Order getOrderById(
            @PathVariable Long id) {

        return orderService.getOrderById(id);
    }


    // ================= GET CUSTOMER ORDER HISTORY =================

    @GetMapping("/customer/{mobile}")
    public List<Order> getOrdersByCustomerMobile(
            @PathVariable String mobile) {

        return orderService.getOrdersByMobile(mobile);
    }


    // ================= UPDATE ORDER =================

    @PutMapping("/{id}")
    public Order updateOrder(
            @PathVariable Long id,
            @RequestBody Order order) {

        order.setId(id);

        return orderService.updateOrder(order);
    }


    // ================= DELETE ORDER =================

    @DeleteMapping("/{id}")
    public void deleteOrder(
            @PathVariable Long id) {

        orderService.deleteOrder(id);
    }

    // ================= CUSTOMER ORDER DETAILS =================

    @GetMapping("/customer/{mobile}/{id}")
    public Order getCustomerOrderById(
            @PathVariable String mobile,
            @PathVariable Long id) {

        Order order = orderService.getOrderById(id);

        if (order == null) {
            return null;
        }

        // Make sure this order belongs to the customer
        if (!order.getMobile().equals(mobile)) {
            return null;
        }

        return order;
    }


    // ================= CANCEL ORDER =================

    @PutMapping("/{id}/cancel")
    public Order cancelOrder(
            @PathVariable Long id) {

        return orderService.cancelOrder(id);
    }


    // ================= UPDATE STATUS =================

    @PatchMapping("/{id}/status")
    public Order updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return orderService.updateStatus(id, status);
    }

}