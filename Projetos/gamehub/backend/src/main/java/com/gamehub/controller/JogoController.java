package com.gamehub.controller;

import com.gamehub.dto.JogoResponseDTO;
import com.gamehub.model.Jogo;
import com.gamehub.repository.JogoRepository;
import com.gamehub.service.IgdbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jogos")
@CrossOrigin(origins = "*") // Permite chamadas de qualquer frontend
public class JogoController {

    @Autowired
    private IgdbService igdbService;

    @Autowired
    private JogoRepository jogoRepository;

    /**
     * GET /api/jogos: Retorna lista de jogos da IGDB API (ou do banco de dados local)
     */
    @GetMapping
    public ResponseEntity<List<JogoResponseDTO>> listarJogos(@RequestParam(defaultValue = "50") int limite) {
        List<JogoResponseDTO> jogosIgdb = igdbService.listarJogosPopulares(limite);

        if (jogosIgdb != null && !jogosIgdb.isEmpty()) {
            return ResponseEntity.ok(jogosIgdb);
        }

        // Fallback para os jogos cadastrados no banco de dados local
        List<JogoResponseDTO> fallback = jogoRepository.findAll().stream()
            .map(this::converterEntidadeParaDTO)
            .toList();

        return ResponseEntity.ok(fallback);
    }

    /**
     * GET /api/jogos/{id}: Retorna detalhes de um jogo por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<JogoResponseDTO> buscarPorId(@PathVariable Long id) {
        JogoResponseDTO jogoIgdb = igdbService.buscarJogoPorId(id);
        if (jogoIgdb != null) {
            return ResponseEntity.ok(jogoIgdb);
        }

        return jogoRepository.findById(id)
            .map(j -> ResponseEntity.ok(converterEntidadeParaDTO(j)))
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/jogos/busca?q=termo: Busca jogos na IGDB por nome
     */
    @GetMapping("/busca")
    public ResponseEntity<List<JogoResponseDTO>> buscarPorNome(@RequestParam String q) {
        List<JogoResponseDTO> resultado = igdbService.buscarJogosPorNome(q);
        return ResponseEntity.ok(resultado);
    }

    private JogoResponseDTO converterEntidadeParaDTO(Jogo j) {
        return new JogoResponseDTO(
            j.getId(),
            j.getNome(),
            j.getNomeEn(),
            j.getCategoria(),
            j.getCategoriaEn(),
            j.getImagem(),
            j.getFundo(),
            j.getNota(),
            j.getLancado(),
            j.getDesenvolvedora(),
            j.getLancamento(),
            j.getPlataformas(),
            j.getIdiomas(),
            j.getIdiomasEn(),
            j.getDublado(),
            j.getLegendado(),
            j.getTrailer(),
            j.getTrailerUrl(),
            j.getDescricaoCurta(),
            j.getDescricaoCurtaEn(),
            j.getDescricaoLonga(),
            j.getDescricaoLongaEn()
        );
    }
}
