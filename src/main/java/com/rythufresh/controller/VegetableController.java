package com.rythufresh.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.rythufresh.entity.Vegetable;
import com.rythufresh.service.VegetableService;

@RestController
@RequestMapping("/vegetables")
@CrossOrigin(origins = "*")
public class VegetableController {

    @Autowired
    private VegetableService service;

    // Add Vegetable
    @PostMapping("/add")
    public Vegetable addVegetable(@RequestBody Vegetable vegetable) {
        return service.addVegetable(vegetable);
    }

    // Get All Vegetables
    @GetMapping("/all")
    public List<Vegetable> getAllVegetables() {
        return service.getAllVegetables();
    }

    // Get Vegetable By Id
    @GetMapping("/{id}")
    public Vegetable getVegetableById(@PathVariable Integer id) {
        return service.getVegetableById(id);
    }

    // Update Vegetable
    @PutMapping("/update")
    public Vegetable updateVegetable(@RequestBody Vegetable vegetable) {
        return service.updateVegetable(vegetable);
    }

    // Delete Vegetable
    @DeleteMapping("/delete/{id}")
    public String deleteVegetable(@PathVariable Integer id) {
        service.deleteVegetable(id);
        return "Vegetable Deleted Successfully";
    }
}