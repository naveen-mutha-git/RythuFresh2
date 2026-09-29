package com.rythufresh.service;

import com.rythufresh.entity.Order;
import com.rythufresh.repository.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;


    // ================= SAVE ORDER =================

    public Order saveOrder(Order order) {

        order.setOrderDate(LocalDateTime.now());
        order.setOrderStatus("Pending");

        return orderRepository.save(order);
    }


    // ================= GET ALL ORDERS =================

    public List<Order> getAllOrders() {

        return orderRepository.findAll();
    }


    // ================= GET ORDER BY ID =================

    public Order getOrderById(Long id) {

        return orderRepository.findById(id).orElse(null);
    }


    // ================= GET CUSTOMER ORDER HISTORY =================

    public List<Order> getOrdersByMobile(String mobile) {

        return orderRepository
                .findByMobileOrderByOrderDateDesc(mobile);
    }


    // ================= UPDATE ORDER =================

    public Order updateOrder(Order order) {

        return orderRepository.save(order);
    }


    // ================= DELETE ORDER =================

    public void deleteOrder(Long id) {

        orderRepository.deleteById(id);
    }


    // ================= CANCEL ORDER =================

    public Order cancelOrder(Long id) {

        Order order = orderRepository.findById(id)
                .orElse(null);

        if (order == null) {
            return null;
        }

        String status = order.getOrderStatus();

        // Customer can cancel only before preparation
        if ("Pending".equalsIgnoreCase(status)
                || "Confirmed".equalsIgnoreCase(status)) {

            order.setOrderStatus("Cancelled");

            return orderRepository.save(order);
        }

        return order;
    }


    // ================= UPDATE ORDER STATUS =================

    public Order updateStatus(Long id, String status) {

        Order order = orderRepository.findById(id)
                .orElse(null);

        if (order == null) {
            return null;
        }

        order.setOrderStatus(status);

        return orderRepository.save(order);
    }
}