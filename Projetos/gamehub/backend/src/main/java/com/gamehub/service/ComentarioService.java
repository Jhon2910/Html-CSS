package com.gamehub.service;

import com.gamehub.dto.ComentarioRequestDTO;
import com.gamehub.dto.ComentarioResponseDTO;
import com.gamehub.model.Comentario;
import com.gamehub.model.Jogo;
import com.gamehub.model.Usuario;
import com.gamehub.repository.ComentarioRepository;
import com.gamehub.repository.JogoRepository;
import com.gamehub.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private JogoRepository jogoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public ComentarioResponseDTO adicionarComentario(ComentarioRequestDTO dto) {
        if (dto.texto() == null || dto.texto().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O texto do comentário não pode estar vazio.");
        }

        // 1. Busca e validação do Jogo
        Jogo jogo = jogoRepository.findById(dto.jogoId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Jogo não encontrado com ID: " + dto.jogoId()));

        // 2. Busca e validação do Usuário
        Usuario usuario = usuarioRepository.findById(dto.usuarioId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado com ID: " + dto.usuarioId()));

        // 3. Persistência
        Comentario comentario = new Comentario(dto.texto().trim(), jogo, usuario);
        Comentario salvo = comentarioRepository.save(comentario);

        return new ComentarioResponseDTO(
            salvo.getId(),
            salvo.getTexto(),
            salvo.getDataCriacao(),
            salvo.getJogo().getId(),
            salvo.getUsuario().getId(),
            salvo.getUsuario().getNome()
        );
    }

    public List<ComentarioResponseDTO> listarPorJogo(Long jogoId) {
        return comentarioRepository.findByJogoIdOrderByDataCriacaoDesc(jogoId).stream()
            .map(c -> new ComentarioResponseDTO(
                c.getId(),
                c.getTexto(),
                c.getDataCriacao(),
                c.getJogo().getId(),
                c.getUsuario().getId(),
                c.getUsuario().getNome()
            ))
            .toList();
    }
}
