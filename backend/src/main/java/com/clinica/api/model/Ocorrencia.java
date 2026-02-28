package com.clinica.api.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "ocorrencias")
public class Ocorrencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String rua;
    private String bairro;
    private String cidade;
    private String uf;
    private String numero;
    private String cep;

    @Column(name = "data_acionamento")
    private LocalDate dataAcionamento;

    @Column(name = "hora_acionamento")
    private LocalTime horaAcionamento;

    private String causaReal;
    
    @Column(columnDefinition = "TEXT")
    private String observacoes;

    private String filmagem; // "Sim" ou "Não"

    // Construtores, Getters e Setters são obrigatórios aqui
    // (Você pode usar o Lombok @Data se tiver configurado, senão crie manualmente)
}
