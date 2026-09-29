package com.rythufresh.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rythufresh.entity.Customer;
import com.rythufresh.repository.CustomerRepository;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // =====================================================
    // REGISTER
    // =====================================================

    public Customer register(Customer customer) {

        // HASH PASSWORD BEFORE SAVING
        customer.setPassword(
                passwordEncoder.encode(customer.getPassword())
        );

        return customerRepository.save(customer);
    }


    // =====================================================
    // FIND BY EMAIL
    // =====================================================

    public Customer findByEmail(String email) {

        return customerRepository
                .findByEmail(email)
                .orElse(null);
    }


    // =====================================================
    // LOGIN
    // =====================================================

    public Customer login(String email, String password) {

        Customer customer = customerRepository
                .findByEmail(email)
                .orElse(null);

        if (customer == null) {
            return null;
        }

        if (customer.getPassword() == null) {
            return null;
        }

        // COMPARE RAW PASSWORD WITH BCRYPT HASH
        if (!passwordEncoder.matches(
                password,
                customer.getPassword())) {

            return null;
        }

        return customer;
    }


    // =====================================================
    // GET ALL
    // =====================================================

    public List<Customer> findAllCustomers() {

        return customerRepository.findAll();
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    public Customer findCustomerById(Long id) {

        return customerRepository
                .findById(id)
                .orElse(null);
    }


    // =====================================================
    // UPDATE PROFILE
    // =====================================================

    public Customer updateCustomer(Customer customer) {

        return customerRepository.save(customer);
    }


    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    public boolean changePassword(
            Long id,
            String currentPassword,
            String newPassword) {

        Customer customer = customerRepository
                .findById(id)
                .orElse(null);

        if (customer == null) {
            return false;
        }

        // CHECK OLD PASSWORD
        if (customer.getPassword() == null ||
                !passwordEncoder.matches(
                        currentPassword,
                        customer.getPassword())) {

            return false;
        }

        // HASH NEW PASSWORD
        customer.setPassword(
                passwordEncoder.encode(newPassword)
        );

        customerRepository.saveAndFlush(customer);

        return true;
    }
 // =====================================================
 // RESET PASSWORD
 // =====================================================

 public boolean resetPassword(
         String email,
         String newPassword) {

     if (email == null || newPassword == null) {
         return false;
     }

     String cleanEmail =
             email.trim().toLowerCase();

     // Find customer directly from the table
     Customer customer =
             customerRepository
                     .findAll()
                     .stream()
                     .filter(c ->
                             c.getEmail() != null &&
                             c.getEmail()
                              .trim()
                              .equalsIgnoreCase(cleanEmail)
                     )
                     .findFirst()
                     .orElse(null);

     if (customer == null) {
         return false;
     }

     // Encode new password exactly like login expects
     customer.setPassword(
             passwordEncoder.encode(newPassword)
     );

     // Save and force database update
     customerRepository.saveAndFlush(customer);

     return true;
 }
 }

