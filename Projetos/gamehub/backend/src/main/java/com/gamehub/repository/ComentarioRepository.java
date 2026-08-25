package com.gamehub.repository;

import com.gamehub.model.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {

    // Buscar comentários de um jogo específico ordenados pelo mais recente
    List<Comentario> findByJogoIdOrderByDataCriacaoDesc(Long jogoId);

    // Buscar comentários feitos por um determinado usuário
    List<Comentario> findByUsuarioIdOrderByDataCriacaoDesc(Long usuarioId);
}
