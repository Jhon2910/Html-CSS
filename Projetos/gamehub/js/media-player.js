/**
 * ===================================================================
 * GAMEHUB RESILIENT MEDIA ENGINE
 * Motor de reprodução de trailers e backgrounds de alta performance
 * Suporte a HTML5 Nativo (MP4/WebM), Embeds Seguros e Pôster Fallback
 * ===================================================================
 */

class GameHubMediaPlayer {
  constructor(containerId, options = {}) {
    this.container = typeof containerId === "string" ? document.getElementById(containerId) : containerId;
    this.options = {
      autoplay: options.autoplay || false,
      muted: options.muted !== undefined ? options.muted : false,
      loop: options.loop || false,
      controls: options.controls !== undefined ? options.controls : true,
      poster: options.poster || "https://cdn2.steamgriddb.com/grid/6703fa1a9aa669046522c079ce851cf5.png",
      titulo: options.titulo || "Trailer Oficial",
      isEn: options.isEn || false,
      ...options
    };
  }

  /**
   * Extrai o ID limpo do vídeo do YouTube caso uma URL completa seja informada
   */
  static extrairYoutubeId(url) {
    if (!url) return "";
    const match = url.match(/(?:embed\/|v=|vi\/|youtu\.be\/|\/v\/|watch\?v=|&v=)([\w-]{11})/);
    return (match && match[1]) ? match[1] : (url.length === 11 ? url : "");
  }

  /**
   * Renderiza vídeo nativo HTML5 (MP4/WebM via CDN com aceleração de hardware)
   */
  renderizarVideoNativo(videoUrl) {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="gamehub-media-frame">
        <video 
          class="gamehub-html5-player"
          ${this.options.controls ? "controls" : ""}
          ${this.options.autoplay ? "autoplay" : ""}
          ${this.options.muted ? "muted" : ""}
          ${this.options.loop ? "loop" : ""}
          playsinline
          poster="${this.options.poster}"
          preload="metadata"
        >
          <source src="${videoUrl}" type="video/webm">
          <source src="${videoUrl}" type="video/mp4">
          ${this.options.isEn ? 'Your browser does not support HTML5 video.' : 'Seu navegador não suporta a reprodução deste vídeo.'}
        </video>
      </div>
    `;
  }

  /**
   * Renderiza player incorporado com youtube-nocookie, sandbox e permissions policy
   */
  renderizarEmbed(youtubeIdOuUrl, linkDireto = "") {
    if (!this.container) return;

    const videoId = GameHubMediaPlayer.extrairYoutubeId(youtubeIdOuUrl);

    if (!videoId) {
      this.renderizarPosterFallback(linkDireto);
      return;
    }

    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      enablejsapi: "1",
      origin: window.location.origin && window.location.origin !== "null" ? window.location.origin : "https://youtube-nocookie.com"
    });

    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;

    this.container.innerHTML = `
      <div class="gamehub-media-frame">
        <iframe
          src="${embedUrl}"
          title="${this.options.titulo}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>
    `;
  }

  /**
   * Pôster interativo de alta resolução com botão direto quando a incorporação for restrita
   */
  renderizarPosterFallback(linkDireto = "") {
    if (!this.container) return;

    const urlDestino = linkDireto || "https://www.youtube.com";

    this.container.innerHTML = `
      <div class="gamehub-media-frame gamehub-poster-fallback" style="background-image: url('${this.options.poster}');">
        <div class="gamehub-poster-overlay">
          <a href="${urlDestino}" target="_blank" rel="noopener noreferrer" class="gamehub-play-btn-large" title="${this.options.isEn ? 'Watch Trailer' : 'Assistir Trailer'}">
            <i class="fa-solid fa-play"></i>
          </a>
          <span class="gamehub-poster-titulo">${this.options.titulo}</span>
          <a href="${urlDestino}" target="_blank" rel="noopener noreferrer" class="btn-assistir-externo">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> ${this.options.isEn ? 'Watch on Official Source' : 'Assistir no Canal Oficial'}
          </a>
        </div>
      </div>
    `;
  }

  /**
   * Roteador de mídia inteligente
   */
  carregarMidia(fonteVideo, linkFallback = "") {
    if (!fonteVideo) {
      this.renderizarPosterFallback(linkFallback);
      return;
    }

    const fonte = fonteVideo.trim();

    // Se for arquivo de vídeo direto (.mp4, .webm, .m3u8, CDN da Steam)
    if (fonte.endsWith(".mp4") || fonte.endsWith(".webm") || fonte.includes("/video/") || fonte.includes("steamstatic.com")) {
      this.renderizarVideoNativo(fonte);
    } 
    // Se for YouTube
    else if (fonte.includes("youtube") || fonte.includes("youtu.be") || fonte.length === 11) {
      this.renderizarEmbed(fonte, linkFallback);
    } 
    // Fallback padrão
    else {
      this.renderizarPosterFallback(linkFallback);
    }
  }
}

// Exportação global
window.GameHubMediaPlayer = GameHubMediaPlayer;
