package com.codify.codify_lms.controller;

import com.codify.codify_lms.model.Module;
import com.codify.codify_lms.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/modules")
@CrossOrigin(origins = "*")
public class ModuleController {

    @Autowired
    private ModuleRepository moduleRepository;

    // POST: Tambah satu module (perbaikan di sini)
    @PostMapping
    public ResponseEntity<Module> createModule(@RequestBody Module module) {
        if (module.getId() == null) {
            module.setId(UUID.randomUUID());
        }
        module.setCreatedAt(Instant.now());
        module.setUpdatedAt(Instant.now());

        Module saved = moduleRepository.save(module);
        return ResponseEntity.ok(saved);
    }

    // GET: Ambil semua module (tidak diubah)
    @GetMapping
    public ResponseEntity<List<Module>> getAllModules() {
        return ResponseEntity.ok(moduleRepository.findAll());
    }
}