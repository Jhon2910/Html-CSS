
document.addEventListener("DOMContentLoaded", function () {
  const idDoJogo = Number(pegarParametroDaURL("id"));

  const jogo = listaDeJogos.find(function (item) {
    return item.id === idDoJogo;
  });

  const containerJogo = document.getElementById("conteudo-jogo");
  
  if (!jogo) {
    containerJogo.innerHTML = `
      <div class="container" style="padding: 64px 0; text-align: center;">
        <h1>Jogo não encontrado</h1>
        <p style="color: var(--texto-fraco); margin: 12px 0 24px;">
          Não encontramos esse jogo no catálogo.
        </p>
        <a href="catalogo.html" class="btn btn-primario">Voltar ao catálogo</a>
      </div>
    `;
    return;
  }

  document.title = jogo.nome + " — GameHub";

  containerJogo.innerHTML = `
<div class="container">
  <div class="jogo-pagina">

    <div class="jogo-info">

      <div class="jogo-capa-wrapper">
        <img
          src="${jogo.imagem}"
          alt="${jogo.nome}"
        />
      </div>

      <div>
        <h1>${jogo.nome}</h1>

        <span>
          ⭐ <span class="nota">${jogo.nota}</span> de avaliação dos jogadores
        </span>

        <div class="jogo-tags">
          <span class="jogo-tag">${jogo.categoria}</span>
          <span class="jogo-tag">${jogo.plataformas}</span>
        </div>

        <p class="jogo-descricao">${jogo.descricaoLonga}</p>

        <a href="catalogo.html" class="btn btn-secundario">
          ← Voltar ao catálogo
        </a>
      </div>

    </div>

    <aside class="jogo-lateral">
      <div class="jogo-lateral-linha">
        <span>Desenvolvedora</span>
        <span>${jogo.desenvolvedora}</span>
      </div>

      <div class="jogo-lateral-linha">
        <span>Lançamento</span>
        <span>${jogo.lancamento}</span>
      </div>

      <div class="jogo-lateral-linha">
        <span>Categoria</span>
        <span>${jogo.categoria}</span>
      </div>

      <div class="jogo-lateral-linha">
        <span>Plataformas</span>
        <span>${jogo.plataformas}</span>
      </div>

      <div class="jogo-trailer">
        <h2>Trailer</h2>

        <iframe
          width="100%"
          height="500"
          src="${jogo.trailer}"
          title="Trailer de ${jogo.nome}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>
      </div>
    </aside>

  </div>
</div>
`;
});
