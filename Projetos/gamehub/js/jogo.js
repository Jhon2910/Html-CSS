
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
    <img
      src="${jogo.imagem}"
      alt="${jogo.nome}"
      class="card-img"
      style="width:20%; height:20%; margin-left: 50px; margin-left: 100px;"
      
    />

    <div class="container">
      <div class="jogo-info">
        <div>
          <h1>${jogo.nome}</h1>
          <span>⭐ <span class="nota">${jogo.nota}</span> de avaliação dos jogadores</span>

          <div class="jogo-tags">
            <span class="jogo-tag">${jogo.categoria}</span>
            <span class="jogo-tag">${jogo.plataformas}</span>
          </div>

          <p class="jogo-descricao">${jogo.descricaoLonga}</p>

          <a href="catalogo.html" class="btn btn-secundario">← Voltar ao catálogo</a>
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
        </aside>
      </div>
    </div>
  `;
});
