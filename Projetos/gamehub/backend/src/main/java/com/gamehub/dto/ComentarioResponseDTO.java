package com.gamehub.dto;

import java.time.LocalDateTime;

public record ComentarioResponseDTO(
    Long id,
    String texto,
    LocalDateTime dataCriacao,
    Long jogoId,
    Long usuarioId,
    String nomeUsuario
) {}
