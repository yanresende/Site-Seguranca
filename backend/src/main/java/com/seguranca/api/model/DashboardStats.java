package com.seguranca.api.model;

import java.util.Map;

public class DashboardStats {
    private long totalOcorrencias;
    private long concluidos;
    private Map<String, Long> porStatus;
    private Map<String, Long> porBairro;
    private Map<String, Long> porData;
    private Map<Integer, Long> porHora;
    private Map<String, Long> porFonte;

    public DashboardStats() {}

    public long getTotalOcorrencias() { return totalOcorrencias; }
    public void setTotalOcorrencias(long totalOcorrencias) { this.totalOcorrencias = totalOcorrencias; }

    public long getConcluidos() { return concluidos; }
    public void setConcluidos(long concluidos) { this.concluidos = concluidos; }

    public Map<String, Long> getPorStatus() { return porStatus; }
    public void setPorStatus(Map<String, Long> porStatus) { this.porStatus = porStatus; }

    public Map<String, Long> getPorBairro() { return porBairro; }
    public void setPorBairro(Map<String, Long> porBairro) { this.porBairro = porBairro; }

    public Map<String, Long> getPorData() { return porData; }
    public void setPorData(Map<String, Long> porData) { this.porData = porData; }

    public Map<Integer, Long> getPorHora() { return porHora; }
    public void setPorHora(Map<Integer, Long> porHora) { this.porHora = porHora; }

    public Map<String, Long> getPorFonte() { return porFonte; }
    public void setPorFonte(Map<String, Long> porFonte) { this.porFonte = porFonte; }
}