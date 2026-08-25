package com.gamehub.service;

import com.gamehub.dto.UsuarioRequestDTO;
import com.gamehub.dto.UsuarioResponseDTO;
import com.gamehub.model.Usuario;
import com.gamehub.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public UsuarioResponseDTO cadastrarUsuario(UsuarioRequestDTO dto) {
        if (dto.email() == null || dto.email().trim().isEmpty() ||
            dto.senha() == null || dto.senha().trim().isEmpty() ||
            dto.nome() == null || dto.nome().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Todos os campos (nome, e-mail e senha) são obrigatórios.");
        }

        String emailNormalizado = dto.email().trim().toLowerCase();

        // Validação da unicidade de e-mail
        if (usuarioRepository.existsByEmail(emailNormalizado)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este e-mail já está cadastrado no sistema.");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome().trim());
        usuario.setEmail(emailNormalizado);
        usuario.setSenha(dto.senha()); // Dica: em produção com Spring Security, use BCryptPasswordEncoder

        Usuario salvo = usuarioRepository.save(usuario);

        return new UsuarioResponseDTO(salvo.getId(), salvo.getNome(), salvo.getEmail(), salvo.getDataCadastro());
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
            .map(u -> new UsuarioResponseDTO(u.getId(), u.getNome(), u.getEmail(), u.getDataCadastro()))
            .toList();
    }

    public UsuarioResponseDTO buscarPorId(Long id) {
        Usuario u = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado com ID: " + id));
        return new UsuarioResponseDTO(u.getId(), u.getNome(), u.getEmail(), u.getDataCadastro());
    }
}
