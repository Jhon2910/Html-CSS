package com.gamehub.dto;

import java.math.BigDecimal;

public record JogoResponseDTO(
    Long id,
    String nome,
    String nome_en,
    String categoria,
    String categoria_en,
    String imagem,
    String fundo,
    BigDecimal nota,
    Boolean lancado,
    String desenvolvedora,
    String lancamento,
    String plataformas,
    String idiomas,
    String idiomas_en,
    Boolean dublado,
    Boolean legendado,
    String trailer,
    String trailerUrl,
    String descricaoCurta,
    String descricaoCurta_en,
    String descricaoLonga,
    String descricaoLonga_en
) {}
