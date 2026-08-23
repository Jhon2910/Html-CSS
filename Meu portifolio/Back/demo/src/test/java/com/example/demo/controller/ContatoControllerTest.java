package com.example.demo.controller;

import com.example.demo.model.Mensagem;
import com.example.demo.repository.MensagemRepository;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ContatoControllerTest {

    @Test
    void listarMensagensReturnsMessagesFromRepository() {
        MensagemRepository repository = mock(MensagemRepository.class);
        ContatoController controller = new ContatoController();
        List<Mensagem> mensagens = List.of(new Mensagem());
        when(repository.findAll()).thenReturn(mensagens);
        ReflectionTestUtils.setField(controller, "mensagemRepository", repository);

        List<Mensagem> resultado = controller.listarMensagens();

        assertSame(mensagens, resultado);
        verify(repository).findAll();
    }

    @Test
    void receberMensagemSavesAndReturnsContact() {
        MensagemRepository repository = mock(MensagemRepository.class);
        ContatoController controller = new ContatoController();
        Mensagem contato = new Mensagem();
        when(repository.save(contato)).thenReturn(contato);
        ReflectionTestUtils.setField(controller, "mensagemRepository", repository);

        Mensagem resultado = controller.receberMensagem(contato);

        assertSame(contato, resultado);
        verify(repository).save(contato);
    }
}