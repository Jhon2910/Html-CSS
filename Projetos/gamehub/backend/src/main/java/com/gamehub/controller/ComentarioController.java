package com.gamehub.controller;

import com.gamehub.dto.ComentarioRequestDTO;
import com.gamehub.dto.ComentarioResponseDTO;
import com.gamehub.service.ComentarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comentarios")
@CrossOrigin(origins = "*") // Permite chamadas do frontend
public class ComentarioController {

    @Autowired
    private ComentarioService comentarioService;

    @PostMapping
    public ResponseEntity<ComentarioResponseDTO> adicionar(@Valid @RequestBody ComentarioRequestDTO dto) {
        ComentarioResponseDTO response = comentarioService.adicionarComentario(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/jogo/{jogoId}")
    public ResponseEntity<List<ComentarioResponseDTO>> listarPorJogo(@PathVariable Long jogoId) {
        return ResponseEntity.ok(comentarioService.listarPorJogo(jogoId));
    }
}
