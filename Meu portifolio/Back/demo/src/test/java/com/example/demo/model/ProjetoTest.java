package com.example.demo.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class ProjetoTest {

    @Test
    void constructorAndAccessorsPreserveValues() {
        Projeto projeto = new Projeto("GameHub", "Projeto web", "HTML, CSS, JavaScript");

        assertNull(projeto.getId());
        assertEquals("GameHub", projeto.getNome());
        assertEquals("Projeto web", projeto.getDescricao());
        assertEquals("HTML, CSS, JavaScript", projeto.getTecnologias());

        projeto.setId(7L);
        projeto.setNome("Portfolio");
        projeto.setDescricao("Novo projeto");
        projeto.setTecnologias("Java, Spring");

        assertEquals(7L, projeto.getId());
        assertEquals("Portfolio", projeto.getNome());
        assertEquals("Novo projeto", projeto.getDescricao());
        assertEquals("Java, Spring", projeto.getTecnologias());
    }
}