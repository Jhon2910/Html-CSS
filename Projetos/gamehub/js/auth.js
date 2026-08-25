// =======================================================
// GAMEHUB AUTH & MULTI-ACCOUNT GOOGLE API ENGINE
// =======================================================

const STORAGE_KEY_USER = "gamehub_user";
const STORAGE_KEY_ACCOUNTS = "gamehub_accounts_list";
const STORAGE_KEY_FAVS = "gamehub_favorites";

// 1. Obter lista de contas salvas
function obterTodasContas() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    if (!raw) {
      // Cria a conta padrão inicial de Jonathan Alexandre
      const contaInicial = {
        id: "jonathan_default",
        nome: "Jonathan Alexandre",
        email: "jonathanalexandre2910@gmail.com",
        foto: "img/avatar-jonathan.png",
        provedor: "google",
        criadoEm: "fev. de 2026"
      };
      const lista = [contaInicial];
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(lista));
      return lista;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// 2. Obter usuário ativo atual
function obterUsuarioLogado() {
  try {
    const dados = localStorage.getItem(STORAGE_KEY_USER);
    if (!dados) return null;
    return JSON.parse(dados);
  } catch (e) {
    return null;
  }
}

// 3. Salvar / Ativar conta
function ativarConta(usuario) {
  if (!usuario) return;

  // Atualiza ou insere na lista de contas salvas
  let contas = obterTodasContas();
  const index = contas.findIndex(c => c.email.toLowerCase() === usuario.email.toLowerCase());

  if (index >= 0) {
    contas[index] = { ...contas[index], ...usuario };
  } else {
    contas.push(usuario);
  }

  localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(contas));
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(usuario));
  atualizarInterfaceAuth();
}

// 4. Deslogar conta ativa
function fazerLogout() {
  localStorage.removeItem(STORAGE_KEY_USER);
  atualizarInterfaceAuth();
  if (window.location.pathname.includes("perfil")) {
    window.location.reload();
  }
}

// 5. Remover uma conta específica da lista
function removerContaSalva(email) {
  let contas = obterTodasContas();
  contas = contas.filter(c => c.email.toLowerCase() !== email.toLowerCase());
  localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(contas));

  const usuarioAtual = obterUsuarioLogado();
  if (usuarioAtual && usuarioAtual.email.toLowerCase() === email.toLowerCase()) {
    if (contas.length > 0) {
      ativarConta(contas[0]);
    } else {
      fazerLogout();
    }
  } else {
    if (window.location.pathname.includes("perfil")) {
      window.location.reload();
    }
  }
}

// 6. Login / Adicionar Nova Conta Google via Credencial Real (JWT / GSI)
function processarLoginGoogle(credentialJwt) {
  try {
    // Decodifica payload do JWT do Google sem precisar de bibliotecas pesadas
    const base64Url = credentialJwt.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const googleUser = JSON.parse(jsonPayload);

    const novoUsuario = {
      id: googleUser.sub || "google_" + Date.now(),
      nome: googleUser.name || "Usuário Google",
      email: googleUser.email,
      foto: googleUser.picture || "img/avatar-jonathan.png",
      provedor: "google",
      criadoEm: new Date().toLocaleDateString(document.documentElement.lang === "en" ? "en-US" : "pt-BR", { month: "short", year: "numeric" })
    };

    ativarConta(novoUsuario);
    window.location.reload();
    return novoUsuario;
  } catch (erro) {
    console.error("Erro ao decodificar credencial do Google:", erro);
    return null;
  }
}

// 7. Login / Adição Manual de Conta
function cadastrarOuTrocarContaManual(nome, email, fotoPersonalizada = null) {
  if (!nome || !email) return false;

  const novoUsuario = {
    id: "usr_" + Date.now(),
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    foto: fotoPersonalizada || (email.includes("jonathan") ? "img/avatar-jonathan.png" : "https://cdn-icons-png.flaticon.com/512/847/847969.png"),
    provedor: "manual",
    criadoEm: new Date().toLocaleDateString(document.documentElement.lang === "en" ? "en-US" : "pt-BR", { month: "short", year: "numeric" })
  };

  ativarConta(novoUsuario);
  return true;
}

// 8. Atualizar Foto da Conta Ativa
function atualizarFotoPerfil(base64Image) {
  const user = obterUsuarioLogado();
  if (user) {
    user.foto = base64Image;
    ativarConta(user);
  }
}

// 9. Gerenciamento de Favoritos
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

// 10. Atualização Visual Global no Header e Fichas
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

  // Ficha Home
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

// Inicializar Google Identity Services quando disponível na página
function inicializarGoogleIdentityClient() {
  if (typeof google !== "undefined" && google.accounts && google.accounts.id) {
    google.accounts.id.initialize({
      client_id: "892347192834-fakeclientid.apps.googleusercontent.com", // Suporta login real ou simulação
      callback: (res) => {
        if (res && res.credential) {
          processarLoginGoogle(res.credential);
        }
      },
      auto_select: false
    });

    const googleBtnContainer = document.getElementById("google-signin-btn-container");
    if (googleBtnContainer) {
      google.accounts.id.renderButton(googleBtnContainer, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "continue_with"
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarInterfaceAuth();
  setTimeout(inicializarGoogleIdentityClient, 500);
});
