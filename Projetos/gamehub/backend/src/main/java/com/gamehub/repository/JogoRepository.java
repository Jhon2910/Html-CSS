package com.gamehub.repository;

import com.gamehub.model.Jogo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JogoRepository extends JpaRepository<Jogo, Long> {

    List<Jogo> findByCategoriaContainingIgnoreCase(String categoria);

    List<Jogo> findByNomeContainingIgnoreCase(String nome);
}
