package com.example.demo.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class ContatoTest {

    @Test
    void defaultConstructorInitializesSubmissionDate() {
        Mensagem contato = new Mensagem();

        assertNotNull(contato.getDataEnvio());
    }

    @Test
    void accessorsPreserveValues() {
        Mensagem contato = new Mensagem();
        LocalDateTime dataEnvio = LocalDateTime.of(2026, 8, 21, 12, 30);

        contato.setId(4L);
        contato.setNome("Ana");
        contato.setEmail("ana@example.com");
        contato.setAssunto("Contato");
        contato.setMensagem("Ola");
        contato.setDataEnvio(dataEnvio);

        assertEquals(4L, contato.getId());
        assertEquals("Ana", contato.getNome());
        assertEquals("ana@example.com", contato.getEmail());
        assertEquals("Contato", contato.getAssunto());
        assertEquals("Ola", contato.getMensagem());
        assertEquals(dataEnvio, contato.getDataEnvio());
    }
}