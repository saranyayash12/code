package com.example.demo.controller;

import com.example.demo.entity.Watch;
import com.example.demo.repo.WatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/watches")
public class WatchController {

    @Autowired
    private WatchRepository watchRepository;

    @GetMapping
    public List<Watch> getAllWatches() {
        return watchRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Watch> getWatchById(@PathVariable Long id) {
        Optional<Watch> watch = watchRepository.findById(id);
        return watch.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Watch createWatch(@RequestBody Watch watch) {
        return watchRepository.save(watch);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Watch> updateWatch(@PathVariable Long id, @RequestBody Watch watchDetails) {
        return watchRepository.findById(id)
                .map(existingWatch -> {
                    existingWatch.setBrand(watchDetails.getBrand());
                    existingWatch.setModel(watchDetails.getModel());
                    existingWatch.setDescription(watchDetails.getDescription());
                    existingWatch.setPrice(watchDetails.getPrice());
                    existingWatch.setStockQuantity(watchDetails.getStockQuantity());
                    existingWatch.setImageUrl(watchDetails.getImageUrl());
                    return ResponseEntity.ok(watchRepository.save(existingWatch));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWatch(@PathVariable Long id) {
        return watchRepository.findById(id)
                .map(watch -> {
                    watchRepository.delete(watch);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

