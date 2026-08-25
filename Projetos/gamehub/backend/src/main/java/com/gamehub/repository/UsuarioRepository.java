package com.gamehub.repository;

import com.gamehub.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Busca customizada por e-mail para autenticação e validações
    Optional<Usuario> findByEmail(String email);

    // Validação rápida de duplicidade no banco
    boolean existsByEmail(String email);
}
