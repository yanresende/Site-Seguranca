package com.seguranca.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.seguranca.api.model.Ocorrencia;
import com.seguranca.api.repository.OcorrenciaRepository;

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