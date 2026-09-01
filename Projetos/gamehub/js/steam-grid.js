/**
 * ===================================================================
 * GAMEHUB STEAM GRID & CAPSULE ENGINE (SEM LOGIN / ZERO API KEYS)
 * Gera capas verticais 600x900 e fundos 1080p direto dos servidores da Steam
 * ===================================================================
 */

const SteamGridEngine = {
  // Base CDN oficial de alta velocidade da Steam
  CDN_BASE: "https://cdn.cloudflare.steamstatic.com/steam/apps",

  /**
   * Retorna a URL da capa vertical 600x900 em alta definição
   * @param {number|string} appId - Steam App ID
   */
  obterCapaVertical(appId) {
    if (!appId) return "https://cdn2.steamgriddb.com/grid/6703fa1a9aa669046522c079ce851cf5.png";
    return `${this.CDN_BASE}/${appId}/library_600x900_2x.jpg`;
  },

  /**
   * Retorna a URL da imagem de cabeçalho panorâmico (Hero 1080p)
   * @param {number|string} appId - Steam App ID
   */
  obterFundoHero(appId) {
    if (!appId) return "https://images8.alphacoders.com/134/1340156.jpeg";
    return `${this.CDN_BASE}/${appId}/page_bg_generated_v6b.jpg`;
  },

  /**
   * Retorna a URL da logo transparente do jogo
   * @param {number|string} appId - Steam App ID
   */
  obterLogo(appId) {
    if (!appId) return "";
    return `${this.CDN_BASE}/${appId}/logo.png`;
  },

  /**
   * Retorna o link direto da página do jogo na Loja Steam
   * @param {number|string} appId - Steam App ID
   */
  obterLinkLoja(appId) {
    if (!appId) return "https://store.steampowered.com";
    return `https://store.steampowered.com/app/${appId}`;
  },

  /**
   * Gera um fallback elegante com gradiente caso o jogo não exista na Steam
   * @param {string} nomeJogo - Nome do jogo
   */
  obterFallback(nomeJogo) {
    return `https://placehold.co/600x900/171a21/66c0f4?text=${encodeURIComponent(nomeJogo || "GameHub")}`;
  },

  /**
   * Renderiza uma grade interativa de jogos Steam em qualquer container HTML
   * @param {string|HTMLElement} containerId - Elemento alvo
   * @param {Array} listaJogos - Lista de { id: appId, name: "Nome" }
   */
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

// Exportação global para uso no site
window.SteamGridEngine = SteamGridEngine;
