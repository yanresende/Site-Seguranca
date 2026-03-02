package com.seguranca.api.controller;

import com.seguranca.api.model.Ocorrencia;
import com.seguranca.api.model.Visita;
import com.seguranca.api.repository.OcorrenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ocorrencias")
@CrossOrigin(origins = "${FRONTEND_URL:*}") // Pega a URL do frontend das variáveis de ambiente ou usa '*' como fallback
public class OcorrenciaController {

    @Autowired
    private OcorrenciaRepository ocorrenciaRepository;

    // Endpoint para LISTAR ocorrências com paginação, filtro e ordenação
    @GetMapping
    public Page<Ocorrencia> getAllOcorrencias(
            @RequestParam(required = false, defaultValue = "") String searchTerm,
            @RequestParam(required = false, defaultValue = "Todos") String status,
            @PageableDefault(size = 10, sort = "dataAcionamento", direction = Sort.Direction.DESC) Pageable pageable) {
        return ocorrenciaRepository.findWithFiltersAndPagination(searchTerm, status, pageable);
    }

    // Endpoint para BUSCAR uma ocorrência por ID
    @GetMapping("/{id}")
    public ResponseEntity<Ocorrencia> getOcorrenciaById(@PathVariable Long id) {
        return ocorrenciaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint para CRIAR uma nova ocorrência
    @PostMapping
    public Ocorrencia createOcorrencia(@RequestBody Ocorrencia ocorrencia) {
        return ocorrenciaRepository.save(ocorrencia);
    }

    // Endpoint para ATUALIZAR uma ocorrência existente
    @PutMapping("/{id}")
    public ResponseEntity<Ocorrencia> updateOcorrencia(@PathVariable Long id, @RequestBody Ocorrencia ocorrenciaDetails) {
        return ocorrenciaRepository.findById(id)
                .map(existingOcorrencia -> {
                    // Atualiza todos os campos da ocorrência existente com os dados recebidos
                    existingOcorrencia.setRua(ocorrenciaDetails.getRua());
                    existingOcorrencia.setNumero(ocorrenciaDetails.getNumero());
                    existingOcorrencia.setBairro(ocorrenciaDetails.getBairro());
                    existingOcorrencia.setCidade(ocorrenciaDetails.getCidade());
                    existingOcorrencia.setUf(ocorrenciaDetails.getUf());
                    existingOcorrencia.setCep(ocorrenciaDetails.getCep());
                    existingOcorrencia.setDataAcionamento(ocorrenciaDetails.getDataAcionamento());
                    existingOcorrencia.setHoraAcionamento(ocorrenciaDetails.getHoraAcionamento());
                    existingOcorrencia.setDataVandalismo(ocorrenciaDetails.getDataVandalismo());
                    existingOcorrencia.setHoraQueda(ocorrenciaDetails.getHoraQueda());
                    existingOcorrencia.setCausaReal(ocorrenciaDetails.getCausaReal());
                    existingOcorrencia.setObservacoes(ocorrenciaDetails.getObservacoes());
                    existingOcorrencia.setFilmagem(ocorrenciaDetails.getFilmagem());
                    existingOcorrencia.setFonte(ocorrenciaDetails.getFonte());
                    existingOcorrencia.setFotografico(ocorrenciaDetails.getFotografico());
                    existingOcorrencia.setStatus(ocorrenciaDetails.getStatus());
                    existingOcorrencia.setRota(ocorrenciaDetails.getRota());

                    Ocorrencia updatedOcorrencia = ocorrenciaRepository.save(existingOcorrencia);
                    return ResponseEntity.ok(updatedOcorrencia);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint para ADICIONAR uma VISITA a uma ocorrência
    @PostMapping("/{id}/visitas")
    public ResponseEntity<Visita> addVisita(@PathVariable Long id, @RequestBody Visita visita) {
        return ocorrenciaRepository.findById(id)
                .map(ocorrencia -> {
                    visita.setOcorrencia(ocorrencia);
                    ocorrencia.getVisitas().add(visita);
                    Ocorrencia savedOcorrencia = ocorrenciaRepository.save(ocorrencia);
                    // Retorna a visita salva (que agora tem ID gerado)
                    return ResponseEntity.ok(savedOcorrencia.getVisitas().get(savedOcorrencia.getVisitas().size() - 1));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint para DELETAR uma VISITA de uma ocorrência
    @DeleteMapping("/{ocorrenciaId}/visitas/{visitaId}")
    public ResponseEntity<Void> deleteVisita(@PathVariable Long ocorrenciaId, @PathVariable Long visitaId) {
        return ocorrenciaRepository.findById(ocorrenciaId).map(ocorrencia -> {
            // Usa removeIf para encontrar e remover a visita da lista
            boolean removed = ocorrencia.getVisitas().removeIf(visita -> visita.getId().equals(visitaId));
            if (removed) {
                ocorrenciaRepository.save(ocorrencia);
                return ResponseEntity.noContent().<Void>build(); // Retorna HTTP 204 No Content (sucesso)
            }
            return ResponseEntity.notFound().<Void>build(); // Visita não encontrada na ocorrência
        }).orElse(ResponseEntity.notFound().build()); // Ocorrência não encontrada
    }

    // Endpoint para DELETAR uma OCORRÊNCIA inteira por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOcorrencia(@PathVariable Long id) {
        if (ocorrenciaRepository.existsById(id)) {
            ocorrenciaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Endpoint para ESTATÍSTICAS (Dashboard)
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(
            @RequestParam(required = false) String inicio,
            @RequestParam(required = false) String fim) {

        List<Ocorrencia> all = ocorrenciaRepository.findAll();

        // Filtrar por data de vandalismo se fornecido
        if (inicio != null && fim != null && !inicio.isEmpty() && !fim.isEmpty()) {
            LocalDate start = LocalDate.parse(inicio);
            LocalDate end = LocalDate.parse(fim);
            all = all.stream()
                    .filter(o -> o.getDataVandalismo() != null &&
                            !o.getDataVandalismo().isBefore(start) &&
                            !o.getDataVandalismo().isAfter(end))
                    .collect(Collectors.toList());
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOcorrencias", all.size());

        long concluidos = all.stream()
                .filter(o -> "Concluido".equalsIgnoreCase(o.getStatus()))
                .count();
        stats.put("concluidos", concluidos);

        // Por Status
        Map<String, Long> porStatus = all.stream()
                .filter(o -> o.getStatus() != null)
                .collect(Collectors.groupingBy(Ocorrencia::getStatus, Collectors.counting()));
        stats.put("porStatus", porStatus);

        // Por Hora (usando horaQueda para refletir o horário real do incidente)
        Map<String, Long> porHora = all.stream()
                .filter(o -> o.getHoraQueda() != null)
                .collect(Collectors.groupingBy(o -> {
                    String time = o.getHoraQueda().toString();
                    return time.length() >= 2 ? time.substring(0, 2) : "00";
                }, Collectors.counting()));
        stats.put("porHora", porHora);

        // Por Bairro
        Map<String, Long> porBairro = all.stream()
                .filter(o -> o.getBairro() != null)
                .collect(Collectors.groupingBy(Ocorrencia::getBairro, Collectors.counting()));
        stats.put("porBairro", porBairro);

        // Por Fonte
        Map<String, Long> porFonte = all.stream()
                .filter(o -> o.getFonte() != null)
                .collect(Collectors.groupingBy(Ocorrencia::getFonte, Collectors.counting()));
        stats.put("porFonte", porFonte);

        // Por Rota
        Map<String, Long> porRota = all.stream()
                .filter(o -> o.getRota() != null)
                .collect(Collectors.groupingBy(Ocorrencia::getRota, Collectors.counting()));
        stats.put("porRota", porRota);

        return ResponseEntity.ok(stats);
    }
}