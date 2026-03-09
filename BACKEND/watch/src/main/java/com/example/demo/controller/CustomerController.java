package com.example.demo.controller;


import com.example.demo.entity.Customer;
import com.example.demo.repo.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    // Register a new customer
    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody Customer customer) {
        if (customerRepository.findByEmail(customer.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Email already registered."));
        }

        Customer savedCustomer = customerRepository.save(customer);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully.");
        response.put("customer", savedCustomer);

        return ResponseEntity.ok(response);
    }

    // Customer login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        return customerRepository.findByEmailAndPassword(email, password)
                .map(customer -> ResponseEntity.ok("Login successful! Welcome, " + customer.getName()))
                .orElse(ResponseEntity.status(401).body("Invalid email or password."));
    }

    // View all customers
    @GetMapping("/customers")
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // View customer by ID
    @GetMapping("/customers/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable Long id) {
        return customerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update mobile number by customer ID
    @PutMapping("/customers/{id}/mobile")
    public ResponseEntity<?> updateMobileNumber(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newMobileNumber = request.get("mobileNumber");

        Optional<Customer> optionalCustomer = customerRepository.findById(id);
        if (optionalCustomer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Customer customer = optionalCustomer.get();
        customer.setMobileNumber(newMobileNumber);
        customerRepository.save(customer);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Mobile number updated successfully.");
        response.put("customer", customer);

        return ResponseEntity.ok(response);
    }
}
