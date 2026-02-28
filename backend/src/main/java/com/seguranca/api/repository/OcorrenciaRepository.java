package com.seguranca.api.repository;

import com.seguranca.api.model.Ocorrencia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {
    
    @Query("SELECT o FROM Ocorrencia o WHERE " +
           "(:status = 'Todos' OR o.status = :status) AND " +
           "(LOWER(o.rua) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(o.bairro) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(o.cidade) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Ocorrencia> findWithFiltersAndPagination(
        @Param("searchTerm") String searchTerm,
        @Param("status") String status,
        Pageable pageable);

    @Query("SELECT COUNT(o) FROM Ocorrencia o WHERE o.dataAcionamento BETWEEN :inicio AND :fim")
    long countByDateRange(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query("SELECT o.status, COUNT(o) FROM Ocorrencia o WHERE o.dataAcionamento BETWEEN :inicio AND :fim GROUP BY o.status")
    List<Object[]> countByStatusInDateRange(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query("SELECT o.bairro, COUNT(o) FROM Ocorrencia o WHERE o.dataAcionamento BETWEEN :inicio AND :fim GROUP BY o.bairro ORDER BY COUNT(o) DESC")
    List<Object[]> countByBairroInDateRange(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query("SELECT o.dataAcionamento, COUNT(o) FROM Ocorrencia o WHERE o.dataAcionamento BETWEEN :inicio AND :fim GROUP BY o.dataAcionamento ORDER BY o.dataAcionamento ASC")
    List<Object[]> countByData(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query("SELECT EXTRACT(HOUR FROM o.horaAcionamento), COUNT(o) FROM Ocorrencia o WHERE o.dataAcionamento BETWEEN :inicio AND :fim GROUP BY EXTRACT(HOUR FROM o.horaAcionamento)")
    List<Object[]> countByHoraInDateRange(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query("SELECT o.fonte, COUNT(o) FROM Ocorrencia o WHERE o.dataAcionamento BETWEEN :inicio AND :fim GROUP BY o.fonte")
    List<Object[]> countByFonteInDateRange(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);
}