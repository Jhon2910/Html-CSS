// =======================================================
// GAMEHUB GAME DETAILS ENGINE (STORE LINKS & HIGH-RES ART)
// =======================================================

function pegarParametroDaURL(nomeDoParametro) {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get(nomeDoParametro);
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", function () {
  const isEn = document.documentElement.lang === "en" || window.location.pathname.includes("_en.html");
  const idDoJogo = Number(pegarParametroDaURL("id"));

  const containerJogo = document.getElementById("conteudo-jogo");
  if (!containerJogo) return;

  const jogo = typeof listaDeJogos !== "undefined" 
    ? listaDeJogos.find(item => item.id === idDoJogo) 
    : null;

  if (!jogo) {
    containerJogo.innerHTML = `
      <div class="container" style="padding: 80px 24px; text-align: center;">
        <i class="fa-solid fa-gamepad" style="font-size: 48px; color: var(--laranja); margin-bottom: 16px;"></i>
        <h1 style="font-size: 28px; margin-bottom: 12px; color: var(--texto);">${isEn ? 'Game not found' : 'Jogo não encontrado'}</h1>
        <p style="color: var(--texto-fraco); margin-bottom: 28px;">
          ${isEn ? 'We could not find this game in the catalog.' : 'Não encontramos esse jogo no catálogo do GameHub.'}
        </p>
        <a href="${isEn ? 'catalogo_en.html' : 'catalogo.html'}" class="btn btn-primario">
          ${isEn ? '← Back to catalog' : '← Voltar ao catálogo'}
        </a>
      </div>
    `;
    return;
  }

  // Traduções
  const nomeExibido = isEn ? (jogo.nome_en || jogo.nome) : jogo.nome;
  const categoriaExibida = isEn ? (jogo.categoria_en || jogo.categoria) : jogo.categoria;
  const descricaoLongaExibida = isEn 
    ? (jogo.descricaoLonga_en || jogo.descricaoLonga || jogo.descricaoCurta_en || jogo.descricaoCurta) 
    : (jogo.descricaoLonga || jogo.descricaoCurta || "Descrição indisponível.");

  document.title = `${nomeExibido} — GameHub`;
  const favoritado = typeof ehFavorito === "function" && ehFavorito(jogo.id);
  const trailerUrlDireta = jogo.trailerUrl || (jogo.trailer ? jogo.trailer.replace("embed/", "watch?v=") : "");

  // Links das Lojas Oficiais
  const termoBuscaLoja = encodeURIComponent(jogo.nome);
  const linkSteam = `https://store.steampowered.com/search/?term=${termoBuscaLoja}`;
  const linkPsn = `https://store.playstation.com/search/${termoBuscaLoja}`;
  const linkXbox = `https://www.xbox.com/search?q=${termoBuscaLoja}`;

  containerJogo.innerHTML = `
    <div class="container" style="padding: 40px 24px;">
      <div class="jogo-pagina">

        <div class="jogo-info">
          <div class="jogo-capa-wrapper">
            <img
              src="${jogo.imagem}"
              alt="${escapeHtml(nomeExibido)}"
              onerror="this.onerror=null;this.src='https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg';"
            />
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 14px;">
              <h1 style="font-size: 32px; line-height: 1.2; color: var(--texto);">${escapeHtml(nomeExibido)}</h1>
              
              <!-- BOTÃO SALVAR NA BIBLIOTECA -->
              <button id="btn-fav-jogo" class="btn-fav-jogo-action ${favoritado ? 'ativo' : ''}">
                <i class="${favoritado ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                <span id="btn-fav-jogo-texto">${favoritado ? (isEn ? 'Saved in Library' : 'Salvo na Biblioteca') : (isEn ? 'Save to Library' : 'Salvar na Biblioteca')}</span>
              </button>
            </div>

            <div style="color: var(--verde); font-weight: 600; font-size: 15px; margin-bottom: 14px;">
              ⭐ <span class="nota" style="font-size: 16px;">${jogo.nota}</span> ${isEn ? 'player rating' : 'de avaliação dos jogadores'}
            </div>

            <div class="jogo-tags" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;">
              <span class="jogo-tag" style="background: var(--bg-card); border: 1px solid var(--linha); padding: 4px 10px; border-radius: 4px; font-size: 12px; color: var(--verde); font-weight: 600;">${escapeHtml(categoriaExibida)}</span>
              <span class="jogo-tag" style="background: var(--bg-card); border: 1px solid var(--linha); padding: 4px 10px; border-radius: 4px; font-size: 12px; color: var(--texto-fraco);">${escapeHtml(jogo.plataformas)}</span>
            </div>

            <p class="jogo-descricao" style="line-height: 1.75; font-size: 15px; color: var(--texto); margin-bottom: 28px;">
              ${escapeHtml(descricaoLongaExibida)}
            </p>

            <!-- LINKS PARA DOWNLOAD NAS LOJAS OFICIAIS -->
            <div class="secao-lojas">
              <h3><i class="fa-solid fa-download" style="color: var(--laranja);"></i> ${isEn ? 'Get / Download on Official Stores' : 'Baixar / Comprar nas Lojas Oficiais'}</h3>
              <div class="lojas-grid">
                <a href="${linkSteam}" target="_blank" rel="noopener noreferrer" class="btn-loja btn-loja-steam">
                  <i class="fa-brands fa-steam"></i> Steam (PC)
                </a>
                <a href="${linkPsn}" target="_blank" rel="noopener noreferrer" class="btn-loja btn-loja-psn">
                  <i class="fa-brands fa-playstation"></i> PlayStation Store
                </a>
                <a href="${linkXbox}" target="_blank" rel="noopener noreferrer" class="btn-loja btn-loja-xbox">
                  <i class="fa-brands fa-xbox"></i> Xbox Store
                </a>
              </div>
            </div>

            <div style="margin-top: 24px;">
              <a href="${isEn ? 'catalogo_en.html' : 'catalogo.html'}" class="btn btn-secundario">
                ${isEn ? '← Back to catalog' : '← Voltar ao catálogo'}
              </a>
            </div>
          </div>
        </div>

        <aside class="jogo-lateral" style="background: var(--bg-card); border: 1px solid var(--linha); border-radius: 12px; padding: 24px; box-shadow: var(--shadow);">
          <div class="jogo-lateral-linha" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--linha); font-size: 13px;">
            <span style="color: var(--texto-fraco);">${isEn ? 'Developer' : 'Desenvolvedora'}</span>
            <strong style="color: var(--texto);">${escapeHtml(jogo.desenvolvedora)}</strong>
          </div>

          <div class="jogo-lateral-linha" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--linha); font-size: 13px;">
            <span style="color: var(--texto-fraco);">${isEn ? 'Release Date' : 'Lançamento'}</span>
            <strong style="color: var(--texto);">${escapeHtml(jogo.lancamento)}</strong>
          </div>

          <div class="jogo-lateral-linha" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--linha); font-size: 13px;">
            <span style="color: var(--texto-fraco);">${isEn ? 'Genre' : 'Categoria'}</span>
            <strong style="color: var(--texto);">${escapeHtml(categoriaExibida)}</strong>
          </div>

          <div class="jogo-lateral-linha" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--linha); font-size: 13px;">
            <span style="color: var(--texto-fraco);">${isEn ? 'Platforms' : 'Plataformas'}</span>
            <strong style="color: var(--texto); text-align: right; max-width: 160px;">${escapeHtml(jogo.plataformas)}</strong>
          </div>

          ${jogo.trailer ? `
            <div class="jogo-trailer" style="margin-top: 24px;">
              <h2 style="font-size: 16px; margin-bottom: 12px; color: var(--texto);">${isEn ? 'Official Trailer' : 'Trailer Oficial'}</h2>
              <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; border: 1px solid var(--linha); background: #000;">
                <iframe
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                  src="${jogo.trailer}"
                  title="Trailer de ${escapeHtml(nomeExibido)}"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen>
                </iframe>
              </div>

              ${trailerUrlDireta ? `
                <a href="${trailerUrlDireta}" target="_blank" rel="noopener noreferrer" class="btn-youtube-watch">
                  <i class="fa-brands fa-youtube"></i> ${isEn ? 'Watch on YouTube' : 'Assistir no YouTube'}
                </a>
              ` : ''}
            </div>
          ` : ''}
        </aside>

      </div>
    </div>
  `;

  const btnFav = document.getElementById("btn-fav-jogo");
  if (btnFav) {
    btnFav.addEventListener("click", function () {
      if (typeof alternarFavorito === "function") {
        const isFav = alternarFavorito(jogo.id);
        btnFav.classList.toggle("ativo", isFav);
        btnFav.innerHTML = `
          <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          <span>${isFav ? (isEn ? 'Saved in Library' : 'Salvo na Biblioteca') : (isEn ? 'Save to Library' : 'Salvar na Biblioteca')}</span>
        `;
        if (typeof atualizarInterfaceAuth === "function") {
          atualizarInterfaceAuth();
        }
      }
    });
  }
});
