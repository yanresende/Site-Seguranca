package com.seguranca.api.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "visitas")
public class Visita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_visita")
    private LocalDate dataVisita;

    @Column(name = "hora_visita")
    private LocalTime horaVisita;

    @Column(name = "registro_visita")
    private String registroVisita;

    @ManyToOne
    @JoinColumn(name = "ocorrencia_id")
    @JsonBackReference
    private Ocorrencia ocorrencia;

    // ===== CONSTRUTOR VAZIO (OBRIGATÓRIO PARA JPA) =====
    public Visita() {
    }

    // ===== SETTERS =====

    public void setDataVisita(LocalDate dataVisita) {
        this.dataVisita = dataVisita;
    }

    public void setHoraVisita(LocalTime horaVisita) {
        this.horaVisita = horaVisita;
    }

    public void setRegistroVisita(String registroVisita) {
        this.registroVisita = registroVisita;
    }

    public void setOcorrencia(Ocorrencia ocorrencia) {
        this.ocorrencia = ocorrencia;
    }

    // ===== GETTERS =====

    public Long getId() {
        return id;
    }

    public LocalDate getDataVisita() {
        return dataVisita;
    }

    public LocalTime getHoraVisita() {
        return horaVisita;
    }

    public String getRegistroVisita() {
        return registroVisita;
    }

    public Ocorrencia getOcorrencia() {
        return ocorrencia;
    }
}