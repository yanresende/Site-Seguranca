package com.clinica.api.controller;

import com.clinica.api.model.Ocorrencia;
import com.clinica.api.repository.OcorrenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ocorrencias")
@CrossOrigin(origins = "*") // Permite que o React acesse este backend
public class OcorrenciaController {

    @Autowired
    private OcorrenciaRepository repository;

    // Listar todas
    @GetMapping
    public List<Ocorrencia> listar() {
        return repository.findAll();
    }

    // Criar nova
    @PostMapping
    public Ocorrencia criar(@RequestBody Ocorrencia ocorrencia) {
        return repository.save(ocorrencia);
    }
    
    // Buscar por ID
    @GetMapping("/{id}")
    public Ocorrencia buscarPorId(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }
}