const SteamGridEngine = {
  CDN_BASE: "https://cdn.cloudflare.steamstatic.com/steam/apps",

  obterCapaVertical(appId) {
    if (!appId) return "https://cdn2.steamgriddb.com/grid/6703fa1a9aa669046522c079ce851cf5.png";
    return `${this.CDN_BASE}/${appId}/library_600x900_2x.jpg`;
  },

  obterFundoHero(appId) {
    if (!appId) return "https://images8.alphacoders.com/134/1340156.jpeg";
    return `${this.CDN_BASE}/${appId}/page_bg_generated_v6b.jpg`;
  },

  obterLogo(appId) {
    if (!appId) return "";
    return `${this.CDN_BASE}/${appId}/logo.png`;
  },

  obterLinkLoja(appId) {
    if (!appId) return "https://store.steampowered.com";
    return `https://store.steampowered.com/app/${appId}`;
  },

  obterFallback(nomeJogo) {
    return `https://placehold.co/600x900/171a21/66c0f4?text=${encodeURIComponent(nomeJogo || "GameHub")}`;
  },

  renderizarGradeSteam(containerId, listaJogos) {
    const container = typeof containerId === "string" ? document.getElementById(containerId) : containerId;
    if (!container || !Array.isArray(listaJogos)) return;

    container.innerHTML = `
      <div class="steam-grid-wrapper">
        ${listaJogos.map(jogo => `
          <a href="${this.obterLinkLoja(jogo.id)}" target="_blank" rel="noopener noreferrer" class="steam-card-item" title="Ver ${jogo.name} na Loja Steam">
            <div class="steam-capa-box">
              <img 
                src="${this.obterCapaVertical(jogo.id)}" 
                alt="${jogo.name}" 
                loading="lazy" 
                onerror="this.onerror=null;this.src='${this.obterFallback(jogo.name)}';" 
              />
              <div class="steam-badge-overlay"><i class="fa-brands fa-steam"></i> Steam</div>
            </div>
            <div class="steam-card-info">
              <h4>${jogo.name}</h4>
              <span>Abrir na Loja <i class="fa-solid fa-arrow-up-right-from-square"></i></span>
            </div>
          </a>
        `).join("")}
      </div>
    `;
  }
};

window.SteamGridEngine = SteamGridEngine;
