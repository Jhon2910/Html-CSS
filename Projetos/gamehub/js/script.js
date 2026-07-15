function configurarMenuMobile() {
  const botaoMenu = document.querySelector(".menu-toggle");
  const menuNav = document.querySelector(".nav");

  if (!botaoMenu || !menuNav) return;

  botaoMenu.addEventListener("click", function () {
    menuNav.classList.toggle("aberto");
  });
}


function criarCardJogo(jogo) {
  return `
    <a href="jogo.html?id=${jogo.id}" class="card-jogo">
      <div class="card-jogo-capa">
        <span class="card-jogo-categoria">${jogo.categoria}</span>
        <img src="${jogo.imagem}" alt="${jogo.nome}" class="card-img">
      </div>
      <div class="card-jogo-corpo">
        <h3>${jogo.nome}</h3>
        <p>${jogo.descricaoCurta}</p>
        <div class="card-jogo-nota">
          <span>⭐ <span class="nota">${jogo.nota}</span></span>
          <span>${jogo.desenvolvedora}</span>
        </div>
      </div>
    </a>
  `;
}




function mostrarJogos(jogos, idDoElemento) {
  const elemento = document.getElementById(idDoElemento);
  if (!elemento) return;

  if (jogos.length === 0) {
    elemento.innerHTML = `<p style="color: var(--texto-fraco)">Nenhum jogo encontrado nessa categoria.</p>`;
    return;
  }

  elemento.innerHTML = jogos.map(criarCardJogo).join("");
}

function configurarFiltros() {
  const botoesFiltro = document.querySelectorAll(".filtro-btn");
  if (botoesFiltro.length === 0) return;

  botoesFiltro.forEach(function (botao) {
    botao.addEventListener("click", function () {
      botoesFiltro.forEach(function (b) {
        b.classList.remove("ativo");
      });
  
      botao.classList.add("ativo");

      const categoriaEscolhida = botao.dataset.categoria;

      let jogosFiltrados;
      if (categoriaEscolhida === "todos") {
        jogosFiltrados = listaDeJogos;
      } else {
        jogosFiltrados = listaDeJogos.filter(function (jogo) {
          return jogo.categoria === categoriaEscolhida;
        });
      }

      mostrarJogos(jogosFiltrados, "grade-jogos-catalogo");
    });
  });
}

function criarCardNoticia(noticia) {
  return `
    <article class="card-noticia">
      <div class="card-noticia-data">${noticia.data}</div>
      <h3>${noticia.titulo}</h3>
      <p>${noticia.resumo}</p>
    </article>
  `;
}


function mostrarNoticias(noticias, idDoElemento) {
  const elemento = document.getElementById(idDoElemento);
  if (!elemento) return;

  elemento.innerHTML = noticias.map(criarCardNoticia).join("");


}


function pegarParametroDaURL(nomeDoParametro) {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get(nomeDoParametro);
}


function criarPaginaJogo(jogo) {
  return `
    <div class="jogo-pagina">
      <div class="jogo-info">
        <div class="jogo-capa-wrapper">
          <img src="${jogo.imagem}" alt="${jogo.nome}">
        </div>

        <div>
          <h1>${jogo.nome}</h1>
          <p>⭐ <span class="nota">${jogo.nota}</span> de avaliação dos jogadores</p>

          <div class="jogo-tags">
            <span class="jogo-tag">${jogo.categoria}</span>
            <span class="jogo-tag">${jogo.plataformas}</span>
          </div>

          <p class="jogo-descricao">${jogo.descricao}</p>

          <a href="catalogo.html" class="btn btn-secundario">← Voltar ao catálogo</a>
        </div>
      </div>

      <div class="jogo-lateral">
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
      </div>
    </div>
  `;
}


function mostrarPaginaJogo() {
  const elemento = document.getElementById("pagina-jogo");
  if (!elemento) return;

  const idDoJogo = pegarParametroDaURL("id");
  const jogo = listaDeJogos.find(function (j) {
    return String(j.id) === String(idDoJogo);
  });

  if (!jogo) {
    elemento.innerHTML = `<p style="color: var(--texto-fraco)">Jogo não encontrado.</p>`;
    return;
  }

  elemento.innerHTML = criarPaginaJogo(jogo);
}


function configurarFormularioContato() {
  const formulario = document.getElementById("form-contato");
  if (!formulario) return;

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault(); 

    const nome = document.getElementById("campo-nome").value.trim();
    const email = document.getElementById("campo-email").value.trim();
    const mensagem = document.getElementById("campo-mensagem").value.trim();
    const statusMensagem = document.getElementById("status-formulario");

    if (nome === "" || email === "" || mensagem === "") {
      statusMensagem.textContent = "Preencha todos os campos antes de enviar.";
      statusMensagem.style.color = "#ff5c39";
      statusMensagem.classList.add("mostrar");
      return;
    }

    
    statusMensagem.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada com sucesso.`;
    statusMensagem.style.color = "#3ddc97";
    statusMensagem.classList.add("mostrar");

    formulario.reset();
  });
}


document.addEventListener("DOMContentLoaded", function () {
  configurarMenuMobile();
  configurarFiltros();
  configurarFormularioContato();

  if (document.getElementById("grade-jogos-destaque")) {
    mostrarJogos(listaDeJogos.slice(0, 4), "grade-jogos-destaque");
  }

  if (document.getElementById("grade-jogos-catalogo")) {
    mostrarJogos(listaDeJogos, "grade-jogos-catalogo");
  }

  if (document.getElementById("grade-noticias-destaque")) {
    mostrarNoticias(listaDeNoticias.slice(0, 3), "grade-noticias-destaque");
  }
  if (document.getElementById("grade-noticias-completa")) {
    mostrarNoticias(listaDeNoticias, "grade-noticias-completa");
  }

  mostrarPaginaJogo();
});