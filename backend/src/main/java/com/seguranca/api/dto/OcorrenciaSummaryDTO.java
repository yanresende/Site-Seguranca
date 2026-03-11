package com.seguranca.api.dto;

import java.time.LocalDate;
import java.time.LocalTime;

// Usando um Record para um DTO conciso e imutável
public record OcorrenciaSummaryDTO(
    Long id,
    String rua,
    String bairro,
    String cidade,
    String uf,
    String numero,
    String cep,
    LocalDate dataAcionamento,
    LocalDate dataVandalismo,
    LocalTime horaAcionamento,
    LocalTime horaQueda,
    String causaReal,
    String observacoes,
    String filmagem,
    String fonte,
    String rota,
    String status,
    String fotografico
) {}
