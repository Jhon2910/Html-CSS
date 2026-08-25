// =======================================================
// GAMEHUB AUTH & USER PROFILE ENGINE (LOGOUT & PERSISTENCE)
// =======================================================

const STORAGE_KEY_USER = "gamehub_user";
const STORAGE_KEY_FAVS = "gamehub_favorites";

// 1. Obter usuário logado atual (Sem forçar login automático ao deslogar)
function obterUsuarioLogado() {
  try {
    const dados = localStorage.getItem(STORAGE_KEY_USER);
    if (!dados) return null;
    return JSON.parse(dados);
  } catch (e) {
    return null;
  }
}

// 2. Salvar usuário logado
function salvarUsuario(usuario) {
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(usuario));
  atualizarInterfaceAuth();
}

// 3. Fazer logout definitivo
function fazerLogout() {
  localStorage.removeItem(STORAGE_KEY_USER);
  atualizarInterfaceAuth();
  if (window.location.pathname.includes("perfil")) {
    window.location.reload();
  }
}

// 4. Gerenciamento de Favoritos / Biblioteca
function obterFavoritos() {
  try {
    const favs = localStorage.getItem(STORAGE_KEY_FAVS);
    return favs ? JSON.parse(favs) : [1, 2, 80, 103];
  } catch (e) {
    return [1, 2, 80, 103];
  }
}

function alternarFavorito(jogoId) {
  let favs = obterFavoritos();
  const idNum = Number(jogoId);

  if (favs.includes(idNum)) {
    favs = favs.filter(id => id !== idNum);
  } else {
    favs.push(idNum);
  }

  localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favs));
  return favs.includes(idNum);
}

function ehFavorito(jogoId) {
  const favs = obterFavoritos();
  return favs.includes(Number(jogoId));
}

// 5. Login Rápido com Conta Google
function conectarComGoogle(nome, email) {
  const usuario = {
    nome: nome || "Jonathan Alexandre",
    email: email || "jonathanalexandre2910@gmail.com",
    foto: "img/avatar-jonathan.png",
    provedor: "google",
    criadoEm: "fev. de 2026"
  };

  salvarUsuario(usuario);
  return usuario;
}

// 6. Login manual por formulário (Nome e E-mail)
function loginManual(nome, email) {
  if (!nome || !email) return false;

  const usuario = {
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    foto: "img/avatar-jonathan.png",
    provedor: "email",
    criadoEm: "fev. de 2026"
  };

  salvarUsuario(usuario);
  return true;
}

// 7. Atualizar Avatar Personalizado
function atualizarFotoPerfil(base64Image) {
  const user = obterUsuarioLogado();
  if (user) {
    user.foto = base64Image;
    salvarUsuario(user);
  }
}

// 8. Atualizar Header e Elementos Visuais em todas as páginas
function atualizarInterfaceAuth() {
  const usuario = obterUsuarioLogado();
  const menuPerfil = document.querySelector(".header .nav a[href*='perfil']");

  if (menuPerfil) {
    if (usuario) {
      menuPerfil.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 7px;">
          ${usuario.foto ? `<img src="${usuario.foto}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover; border: 1px solid var(--laranja);" />` : `<span style="display:inline-block; width:20px; height:20px; line-height:20px; border-radius:50%; background:var(--laranja); color:#fff; font-size:11px; text-align:center;">${usuario.nome.charAt(0).toUpperCase()}</span>`}
          ${usuario.nome.split(" ")[0]}
        </span>
      `;
    } else {
      menuPerfil.textContent = document.documentElement.lang === "en" ? "Sign In / Profile" : "Entrar / Perfil";
    }
  }

  // Atualiza ficha na Home se existir
  const fichaNome = document.querySelector(".ficha-nome");
  const fichaNivel = document.querySelector(".ficha-nivel");
  const fichaAvatar = document.querySelector(".ficha-avatar");
  const fichaStatsCount = document.getElementById("ficha-total-jogos");

  if (fichaNome && fichaNivel) {
    if (usuario) {
      fichaNome.textContent = usuario.nome;
      fichaNivel.textContent = usuario.email;
      if (fichaAvatar) {
        if (usuario.foto) {
          fichaAvatar.innerHTML = `<img src="${usuario.foto}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />`;
        } else {
          fichaAvatar.textContent = usuario.nome.charAt(0).toUpperCase();
        }
      }
      if (fichaStatsCount) {
        fichaStatsCount.textContent = obterFavoritos().length;
      }
    } else {
      fichaNome.textContent = document.documentElement.lang === "en" ? "Guest User" : "Visitante";
      fichaNivel.textContent = document.documentElement.lang === "en" ? "Connect your account" : "Conecte sua conta";
      if (fichaAvatar) fichaAvatar.textContent = "?";
      if (fichaStatsCount) fichaStatsCount.textContent = "0";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarInterfaceAuth();
});
