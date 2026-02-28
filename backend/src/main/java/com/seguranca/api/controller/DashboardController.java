package com.seguranca.api.controller;

import com.seguranca.api.model.DashboardStats;
import com.seguranca.api.repository.OcorrenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired
    private OcorrenciaRepository repository;

    @GetMapping("/stats")
    public DashboardStats getStats(@RequestParam(required = false) String inicio, 
                                   @RequestParam(required = false) String fim) {
        // Define datas padrão (últimos 30 dias) se não forem informadas
        LocalDate dataFim = (fim != null && !fim.isEmpty()) ? LocalDate.parse(fim) : LocalDate.now();
        LocalDate dataInicio = (inicio != null && !inicio.isEmpty()) ? LocalDate.parse(inicio) : dataFim.minusDays(30);

        DashboardStats stats = new DashboardStats();
        
        // 1. Total Geral
        stats.setTotalOcorrencias(repository.countByDateRange(dataInicio, dataFim));
        
        // 2. Estatísticas por Status
        List<Object[]> statusCounts = repository.countByStatusInDateRange(dataInicio, dataFim);
        Map<String, Long> statusMap = new HashMap<>();
        long concluidos = 0;
        for (Object[] row : statusCounts) {
            String status = (String) row[0];
            Long count = (Long) row[1];
            statusMap.put(status != null ? status : "Pendente", count);
            
            // Conta concluídos (considerando variações de escrita)
            if ("Concluido".equalsIgnoreCase(status) || "Concluida".equalsIgnoreCase(status)) {
                concluidos += count;
            }
        }
        stats.setPorStatus(statusMap);
        stats.setConcluidos(concluidos);

        // 3. Estatísticas por Bairro (Região)
        List<Object[]> bairroCounts = repository.countByBairroInDateRange(dataInicio, dataFim);
        Map<String, Long> bairroMap = new LinkedHashMap<>();
        for (Object[] row : bairroCounts) {
             bairroMap.put((String) row[0], (Long) row[1]);
        }
        stats.setPorBairro(bairroMap);

        // 4. Evolução Temporal (Gráfico de Barras)
        List<Object[]> dataCounts = repository.countByData(dataInicio, dataFim);
        Map<String, Long> dataMap = new LinkedHashMap<>();
        for (Object[] row : dataCounts) {
            dataMap.put(row[0].toString(), (Long) row[1]);
        }
        stats.setPorData(dataMap);

        // 5. Horários de Pico
        List<Object[]> horaCounts = repository.countByHoraInDateRange(dataInicio, dataFim);
        Map<Integer, Long> horaMap = new HashMap<>();
        for (Object[] row : horaCounts) {
            // O resultado de EXTRACT(HOUR) pode ser Double ou Integer dependendo do dialeto/DB
            Integer hour = ((Number) row[0]).intValue();
            Long count = (Long) row[1];
            horaMap.put(hour, count);
        }
        stats.setPorHora(horaMap);

        // 6. Ocorrências por Fonte
        List<Object[]> fonteCounts = repository.countByFonteInDateRange(dataInicio, dataFim);
        Map<String, Long> fonteMap = new HashMap<>();
        for (Object[] row : fonteCounts) {
            String fonte = (String) row[0];
            Long count = (Long) row[1];
            fonteMap.put(fonte != null && !fonte.isEmpty() ? fonte : "Não especificada", count);
        }
        stats.setPorFonte(fonteMap);

        return stats;
    }
}