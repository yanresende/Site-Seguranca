package com.clinica.api.repository;

import com.clinica.api.model.Ocorrencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {
    // O Spring cria automaticamente métodos como save(), findAll(), deleteById()
}
