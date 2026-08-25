package com.gamehub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ComentarioRequestDTO(
    @NotBlank(message = "O texto do comentário não pode estar vazio.")
    String texto,

    @NotNull(message = "O ID do jogo é obrigatório.")
    Long jogoId,

    @NotNull(message = "O ID do usuário é obrigatório.")
    Long usuarioId
) {}
