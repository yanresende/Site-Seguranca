package com.seguranca.api.controller;

import com.seguranca.api.dto.LoginRequest;
import com.seguranca.api.dto.LoginResponse;
import com.seguranca.api.model.Usuario;
import com.seguranca.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${FRONTEND_URL:*}")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // 1. Busca o usuário pelo email
        return usuarioRepository.findByEmail(request.getEmail())
                .map(usuario -> {
                    // 2. Verifica se a senha bate (comparação simples)
                    if (usuario.getSenha().equals(request.getSenha())) {
                        
                        // 3. Gera um token falso (UUID) apenas para o frontend funcionar
                        // Em produção, aqui entraria a lógica do JWT
                        String token = UUID.randomUUID().toString();
                        
                        return ResponseEntity.ok(new LoginResponse(token, usuario));
                    }
                    return ResponseEntity.status(401).body(new ErrorResponse("Senha incorreta."));
                })
                .orElse(ResponseEntity.status(404).body(new ErrorResponse("Usuário não encontrado.")));
    }

    // Classe interna auxiliar para retornar erros em JSON
    static class ErrorResponse {
        private String message;
        public ErrorResponse(String message) {
            this.message = message;
        }
        public String getMessage() { return message; }
    }
}