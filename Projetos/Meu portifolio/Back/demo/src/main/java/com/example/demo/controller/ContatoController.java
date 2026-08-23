package com.example.demo.controller;

import com.example.demo.model.Mensagem;
import com.example.demo.repository.MensagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/contatos")
@CrossOrigin(origins = "*") // Libera o acesso para o front-end
public class ContatoController {

    @Autowired
    private MensagemRepository mensagemRepository;

    @GetMapping
    public List<Mensagem> listarMensagens() {
        return mensagemRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    @PostMapping
    public Mensagem receberMensagem(@RequestBody Mensagem mensagem) {
        System.out.println("Mensagem recebida de: " + mensagem.getNome());
        return mensagemRepository.save(mensagem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirMensagem(@PathVariable Long id) {
        if (mensagemRepository.existsById(id)) {
            mensagemRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
