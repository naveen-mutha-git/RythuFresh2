package com.rythufresh.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rythufresh.entity.Vegetable;

@Repository
public interface VegetableRepository extends JpaRepository<Vegetable, Integer> {

}