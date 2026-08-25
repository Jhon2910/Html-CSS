package com.gamehub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_jogo")
public class Jogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(name = "nome_en", length = 150)
    private String nomeEn;

    @Column(nullable = false, length = 80)
    private String categoria;

    @Column(name = "categoria_en", length = 80)
    private String categoriaEn;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String imagem;

    @Column(columnDefinition = "TEXT")
    private String fundo;

    @Column(precision = 3, scale = 1)
    private BigDecimal nota;

    private Boolean lancado = true;

    @Column(length = 100)
    private String desenvolvedora;

    @Column(length = 20)
    private String lancamento;

    @Column(length = 200)
    private String plataformas;

    @Column(columnDefinition = "TEXT")
    private String idiomas;

    @Column(name = "idiomas_en", columnDefinition = "TEXT")
    private String idiomasEn;

    private Boolean dublado = false;
    private Boolean legendado = true;

    @Column(columnDefinition = "TEXT")
    private String trailer;

    @Column(name = "trailer_url", columnDefinition = "TEXT")
    private String trailerUrl;

    @Column(name = "descricao_curta", columnDefinition = "TEXT")
    private String descricaoCurta;

    @Column(name = "descricao_curta_en", columnDefinition = "TEXT")
    private String descricaoCurtaEn;

    @Column(name = "descricao_longa", columnDefinition = "TEXT")
    private String descricaoLonga;

    @Column(name = "descricao_longa_en", columnDefinition = "TEXT")
    private String descricaoLongaEn;

    @JsonIgnore
    @OneToMany(mappedBy = "jogo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comentario> comentarios = new ArrayList<>();

    public Jogo() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getNomeEn() { return nomeEn; }
    public void setNomeEn(String nomeEn) { this.nomeEn = nomeEn; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getCategoriaEn() { return categoriaEn; }
    public void setCategoriaEn(String categoriaEn) { this.categoriaEn = categoriaEn; }

    public String getImagem() { return imagem; }
    public void setImagem(String imagem) { this.imagem = imagem; }

    public String getFundo() { return fundo; }
    public void setFundo(String fundo) { this.fundo = fundo; }

    public BigDecimal getNota() { return nota; }
    public void setNota(BigDecimal nota) { this.nota = nota; }

    public Boolean getLancado() { return lancado; }
    public void setLancado(Boolean lancado) { this.lancado = lancado; }

    public String getDesenvolvedora() { return desenvolvedora; }
    public void setDesenvolvedora(String desenvolvedora) { this.desenvolvedora = desenvolvedora; }

    public String getLancamento() { return lancamento; }
    public void setLancamento(String lancamento) { this.lancamento = lancamento; }

    public String getPlataformas() { return plataformas; }
    public void setPlataformas(String plataformas) { this.plataformas = plataformas; }

    public String getIdiomas() { return idiomas; }
    public void setIdiomas(String idiomas) { this.idiomas = idiomas; }

    public String getIdiomasEn() { return idiomasEn; }
    public void setIdiomasEn(String idiomasEn) { this.idiomasEn = idiomasEn; }

    public Boolean getDublado() { return dublado; }
    public void setDublado(Boolean dublado) { this.dublado = dublado; }

    public Boolean getLegendado() { return legendado; }
    public void setLegendado(Boolean legendado) { this.legendado = legendado; }

    public String getTrailer() { return trailer; }
    public void setTrailer(String trailer) { this.trailer = trailer; }

    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }

    public String getDescricaoCurta() { return descricaoCurta; }
    public void setDescricaoCurta(String descricaoCurta) { this.descricaoCurta = descricaoCurta; }

    public String getDescricaoCurtaEn() { return descricaoCurtaEn; }
    public void setDescricaoCurtaEn(String descricaoCurtaEn) { this.descricaoCurtaEn = descricaoCurtaEn; }

    public String getDescricaoLonga() { return descricaoLonga; }
    public void setDescricaoLonga(String descricaoLonga) { this.descricaoLonga = descricaoLonga; }

    public String getDescricaoLongaEn() { return descricaoLongaEn; }
    public void setDescricaoLongaEn(String descricaoLongaEn) { this.descricaoLongaEn = descricaoLongaEn; }

    public List<Comentario> getComentarios() { return comentarios; }
    public void setComentarios(List<Comentario> comentarios) { this.comentarios = comentarios; }
}
