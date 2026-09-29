package com.rythufresh.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rythufresh.entity.Order;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    // ================= TODAY'S ORDERS =================

    long countByOrderDateBetween(
            LocalDateTime start,
            LocalDateTime end
    );


    // ================= CUSTOMER ORDERS =================

    List<Order> findByMobileOrderByOrderDateDesc(
            String mobile
    );


    // ================= PENDING ORDERS =================

    long countByOrderStatusIgnoreCase(
            String status
    );


    // ================= TOTAL REVENUE =================
    // Cancelled orders are NOT counted as revenue

    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE LOWER(o.orderStatus) <> LOWER(:status)
    """)
    Double getTotalRevenueExcludingStatus(
            @Param("status") String status
    );


    // ================= TODAY'S REVENUE =================
    // Cancelled orders are NOT counted as revenue

    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE o.orderDate BETWEEN :start
        AND :end
        AND LOWER(o.orderStatus) <> LOWER(:status)
    """)
    Double getTodayRevenueExcludingStatus(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("status") String status
    );
}