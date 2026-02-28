package com.seguranca.api.config;

import com.seguranca.api.model.Ocorrencia;
import com.seguranca.api.model.Visita;
import com.seguranca.api.repository.OcorrenciaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalTime;

@Configuration
public class TestDatabaseSeeder {

    @Bean
    public CommandLineRunner initDatabase(OcorrenciaRepository repository) {
        return args -> {
            // Verifica se já existem dados para não duplicar a cada reinício
            if (repository.count() == 0) {

                // 1. Criar a Ocorrência
                Ocorrencia ocorrencia = new Ocorrencia();
                ocorrencia.setRua("Av. Paulista");
                ocorrencia.setNumero("1000");
                ocorrencia.setBairro("Bela Vista");
                ocorrencia.setCidade("São Paulo");
                ocorrencia.setUf("SP");
                ocorrencia.setCep("01310-100");
                ocorrencia.setDataAcionamento(LocalDate.now());
                ocorrencia.setHoraAcionamento(LocalTime.now());
                ocorrencia.setFilmagem("Sim");
                ocorrencia.setObservacoes("Registro de teste automático");
                ocorrencia.setStatus("Pendente");

                // 1. Criar a Ocorrência
                Ocorrencia ocorrencia2 = new Ocorrencia();
                ocorrencia2.setRua("Av. Paulista");
                ocorrencia2.setNumero("1000");
                ocorrencia2.setBairro("Bela Vista");
                ocorrencia2.setCidade("São Paulo");
                ocorrencia2.setUf("SP");
                ocorrencia2.setCep("01310-100");
                ocorrencia2.setDataAcionamento(LocalDate.now());
                ocorrencia2.setHoraAcionamento(LocalTime.now());
                ocorrencia2.setFilmagem("Sim");
                ocorrencia2.setObservacoes("Registro de teste automático");
                ocorrencia2.setStatus("Concluida");

                // 2. Criar Visitas
                Visita visita1 = new Visita();
                visita1.setDataVisita(LocalDate.now());
                visita1.setHoraVisita(LocalTime.now().minusHours(2));
                visita1.setRegistroVisita("Primeira visita técnica realizada.");
                visita1.setOcorrencia(ocorrencia); // Vínculo importante (ManyToOne)

                Visita visita2 = new Visita();
                visita2.setDataVisita(LocalDate.now().plusDays(1));
                visita2.setHoraVisita(LocalTime.of(14, 0));
                visita2.setRegistroVisita("Agendado retorno para manutenção.");
                visita2.setOcorrencia(ocorrencia); // Vínculo importante (ManyToOne)

                // 3. Adicionar visitas à lista da ocorrência
                // Como você configurou CascadeType.ALL, salvar a ocorrência salvará as visitas
                ocorrencia.getVisitas().add(visita1);
                ocorrencia.getVisitas().add(visita2);

                // 4. Salvar no Banco
                repository.save(ocorrencia);
                repository.save(ocorrencia2);

                System.out.println("Banco de dados populado com registro de teste!");
            }
        };
    }
}