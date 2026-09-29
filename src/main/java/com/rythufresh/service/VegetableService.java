package com.rythufresh.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rythufresh.entity.Vegetable;
import com.rythufresh.repository.VegetableRepository;

@Service
public class VegetableService {

    @Autowired
    private VegetableRepository repository;

    // Add Vegetable
    public Vegetable addVegetable(Vegetable vegetable) {
    	vegetable.setInStock(vegetable.getQuantity() > 0);
        return repository.save(vegetable);
    }

    // Get All Vegetables
    public List<Vegetable> getAllVegetables() {
        return repository.findAll();
    }

    // Get Vegetable By Id
    public Vegetable getVegetableById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    // Update Vegetable
    public Vegetable updateVegetable(Vegetable vegetable) {
    	   vegetable.setInStock(vegetable.getQuantity() > 0);
        return repository.save(vegetable);
    }

    // Delete Vegetable
    public void deleteVegetable(Integer id) {
        repository.deleteById(id);
    }
}