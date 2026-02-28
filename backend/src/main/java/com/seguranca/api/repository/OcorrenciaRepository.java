package com.seguranca.api.repository;

import com.seguranca.api.model.Ocorrencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {
    // Métodos de consulta personalizados podem ser adicionados aqui
}