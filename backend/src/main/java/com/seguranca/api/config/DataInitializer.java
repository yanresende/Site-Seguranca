package com.seguranca.api.config;

import com.seguranca.api.model.Usuario;
import com.seguranca.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {
        // Se não houver usuários, cria um padrão
        if (usuarioRepository.count() == 0) {
            Usuario admin = new Usuario();
            admin.setNome("Agente Silva");
            admin.setEmail("agente.silva@sentinela.com");
            admin.setSenha("123456"); // Senha padrão
            admin.setCargo("Admin");
            usuarioRepository.save(admin);
            System.out.println(">>> USUÁRIO PADRÃO CRIADO: agente.silva@sentinela.com / 123456 <<<");
        }
    }
}