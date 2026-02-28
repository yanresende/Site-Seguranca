package com.seguranca.api.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

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

    @Column(name = "dataAcionamento")
    private LocalDate dataAcionamento;

    private LocalDate dataVandalismo;

    @Column(name = "horaAcionamento")
    private LocalTime horaAcionamento;

    private LocalTime horaQueda;

    private String causaReal;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    private String filmagem;
    private String fonte;
    private String status;
    private String fotografico;

    @OneToMany(mappedBy = "ocorrencia", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Visita> visitas = new ArrayList<>();

    public void addVisita(Visita visita) {
        visitas.add(visita);
        visita.setOcorrencia(this);
    }

    public void removeVisita(Visita visita) {
        visitas.remove(visita);
        visita.setOcorrencia(null);
    }

    // ===== SETTERS =====

    public void setRua(String rua) {
        this.rua = rua;
    }

    public void setfotografico(String fotografico) {
        this.fotografico = fotografico;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public void setCausaReal(String causaReal) {
        this.causaReal = causaReal;
    }

    public void setFonte(String fonte) {
        this.fonte = fonte;
    }

    public void setHoraQueda(LocalTime horaQueda) {
        this.horaQueda = horaQueda;
    }



    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }

    public void setDataAcionamento(LocalDate dataAcionamento) {
        this.dataAcionamento = dataAcionamento;
    }

    public void setHoraAcionamento(LocalTime horaAcionamento) {
        this.horaAcionamento = horaAcionamento;
    }

    public void setFilmagem(String filmagem) {
        this.filmagem = filmagem;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    // ===== GETTERS (exemplo básico) =====

    public Long getId() {
        return id;
    }

    public String getRua() {
        return rua;
    }

    public String getNumero() {
        return numero;
    }

    public String getBairro() {
        return bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public String getUf() {
        return uf;
    }

    public String getCep() {
        return cep;
    }

    public LocalDate getDataAcionamento() {
        return dataAcionamento;
    }

    public String getStatus() {
        return status;
    }

    public LocalTime getHoraAcionamento() {
        return horaAcionamento;
    }

    public String getFilmagem() {
        return filmagem;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public List<Visita> getVisitas() {
        return visitas;
    }

    public String getFonte() {
        return fonte;
    }

    public String getFotografico() {
        return fotografico;
    }
}