package com.rythufresh.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "vegetable")
public class Vegetable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "telugu_name")
    private String teluguName;

    @Column(name = "price")
    private double price;

    @Column(name = "unit")
    private String unit;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "in_stock")
    private boolean inStock;

    @Column(name = "quantity")
    private int quantity;

    // NEW FIELD
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // NEW FIELD
    @Column(name = "health_benefits", columnDefinition = "TEXT")
    private String healthBenefits;

    public Vegetable() {
    }

    public Vegetable(Integer id,
                      String name,
                      String teluguName,
                      double price,
                      String unit,
                      String imageUrl,
                      boolean inStock,
                      int quantity,
                      String description,
                      String healthBenefits) {

        this.id = id;
        this.name = name;
        this.teluguName = teluguName;
        this.price = price;
        this.unit = unit;
        this.imageUrl = imageUrl;
        this.inStock = inStock;
        this.quantity = quantity;
        this.description = description;
        this.healthBenefits = healthBenefits;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTeluguName() {
        return teluguName;
    }

    public void setTeluguName(String teluguName) {
        this.teluguName = teluguName;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isInStock() {
        return inStock;
    }

    public void setInStock(boolean inStock) {
        this.inStock = inStock;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    // NEW GETTER & SETTER

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHealthBenefits() {
        return healthBenefits;
    }

    public void setHealthBenefits(String healthBenefits) {
        this.healthBenefits = healthBenefits;
    }

}