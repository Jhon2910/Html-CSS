package com.example.demo.controller;

import com.example.demo.model.Projeto;
import com.example.demo.repository.ProjetoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ProjetoControllerTest {

    @Test
    void listarProjetosReturnsProjectsFromRepository() {
        ProjetoRepository repository = mock(ProjetoRepository.class);
        ProjetoController controller = new ProjetoController();
        List<Projeto> projetos = List.of(new Projeto("GameHub", "Projeto web", "JavaScript"));
        when(repository.findAll()).thenReturn(projetos);
        ReflectionTestUtils.setField(controller, "projetoRepository", repository);

        List<Projeto> resultado = controller.listarProjetos();

        assertSame(projetos, resultado);
        verify(repository).findAll();
    }

    @Test
    void criarProjetoSavesAndReturnsProject() {
        ProjetoRepository repository = mock(ProjetoRepository.class);
        ProjetoController controller = new ProjetoController();
        Projeto projeto = new Projeto("GameHub", "Projeto web", "JavaScript");
        when(repository.save(projeto)).thenReturn(projeto);
        ReflectionTestUtils.setField(controller, "projetoRepository", repository);

        Projeto resultado = controller.criarProjeto(projeto);

        assertSame(projeto, resultado);
        verify(repository).save(projeto);
    }
}