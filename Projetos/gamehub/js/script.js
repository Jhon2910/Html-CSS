
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

  const listaDeNoticias = [
  {
    data: "18 JUN 2026",
    titulo: "GTA VI bate recordes de jogadores simultâneos",
    resumo:
      "A Rockstar Games anunciou novos números impressionantes de Grand Theft Auto VI, que já se tornou um dos maiores lançamentos da história dos videogames.",
  },
  {
    data: "15 JUN 2026",
    titulo: "Resident Evil 9 recebe novo trailer",
    resumo:
      "A Capcom revelou novas cenas de gameplay e confirmou mais detalhes sobre a próxima grande entrada da franquia Resident Evil.",
  },
  {
    data: "12 JUN 2026",
    titulo: "Valve confirma novo console portátil",
    resumo:
      "Após o sucesso do Steam Deck, a Valve apresentou oficialmente seu novo dispositivo portátil com hardware atualizado e maior autonomia de bateria.",
  },
  {
    data: "09 JUN 2026",
    titulo: "PlayStation 5 ultrapassa nova marca de vendas",
    resumo:
      "O PS5 continua dominando o mercado de consoles e alcançou mais uma marca histórica em unidades vendidas mundialmente.",
  },
  {
    data: "06 JUN 2026",
    titulo: "Escassez de memória RAM preocupa fabricantes",
    resumo:
      "A crescente demanda por inteligência artificial e data centers está pressionando a produção de memória RAM e elevando os preços do mercado.",
  },
  {
    data: "03 JUN 2026",
    titulo: "Forza Horizon 6 recebe atualização gratuita",
    resumo:
      "Novos carros, eventos sazonais e melhorias de desempenho chegam ao mais recente jogo de corrida da Playground Games.",
  },
  {
    data: "31 MAI 2026",
    titulo: "Mortal Kombat 1 anuncia novo lutador DLC",
    resumo:
      "A NetherRealm Studios confirmou a chegada de um personagem muito pedido pela comunidade para o elenco do jogo.",
  },
  {
    data: "28 MAI 2026",
    titulo: "Marvel's Spider-Man 2 ganha expansão",
    resumo:
      "A Insomniac Games revelou uma expansão inédita com novas missões, trajes e vilões para Peter Parker e Miles Morales.",
  },
  {
    data: "24 MAI 2026",
    titulo: "God of War Ragnarök alcança marco histórico",
    resumo:
      "O título da Santa Monica Studio ultrapassou mais uma importante marca de vendas e continua entre os jogos mais populares da PlayStation.",
  },
  {
    data: "20 MAI 2026",
    titulo: "Resident Evil 4 Remake supera expectativas",
    resumo:
      "A Capcom divulgou novos números de vendas e confirmou que o remake continua sendo um dos maiores sucessos recentes da empresa.",
  }
];

}


function pegarParametroDaURL(nomeDoParametro) {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get(nomeDoParametro);
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
});
