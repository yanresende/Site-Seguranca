package com.seguranca.api.repository;

import com.seguranca.api.model.Visita;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitaRepository extends JpaRepository<Visita, Long> {
}