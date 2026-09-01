const STORAGE_KEY_USER = "gamehub_user";
const STORAGE_KEY_ACCOUNTS = "gamehub_accounts_list";
const STORAGE_KEY_FAVS = "gamehub_favorites";

function obterTodasContas() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    if (!raw) {
      const contaInicial = {
        id: "jonathan_default",
        nome: "Jonathan Alexandre",
        email: "jonathanalexandre2910@gmail.com",
        foto: "img/avatar-jonathan.png",
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

function obterUsuarioLogado() {
  try {
    const dados = localStorage.getItem(STORAGE_KEY_USER);
    if (!dados) return null;
    return JSON.parse(dados);
  } catch (e) {
    return null;
  }
}

function ativarConta(usuario) {
  if (!usuario) return;

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

function fazerLogout() {
  localStorage.removeItem(STORAGE_KEY_USER);
  atualizarInterfaceAuth();
  if (window.location.pathname.includes("perfil")) {
    window.location.reload();
  }
}

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

function cadastrarOuTrocarContaManual(nome, email, fotoPersonalizada = null) {
  if (!nome || !email) return false;

  const isEn = document.documentElement.lang === "en" || window.location.pathname.includes("_en.html");
  const emailLimpo = email.trim().toLowerCase();
  const nomeLimpo = nome.trim();

  const novoUsuario = {
    id: "usr_" + Date.now(),
    nome: nomeLimpo,
    email: emailLimpo,
    foto: fotoPersonalizada || (emailLimpo.includes("jonathan") ? "img/avatar-jonathan.png" : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(nomeLimpo)}`),
    criadoEm: new Date().toLocaleDateString(isEn ? "en-US" : "pt-BR", { month: "short", year: "numeric" })
  };

  ativarConta(novoUsuario);
  return true;
}

function atualizarFotoPerfil(base64Image) {
  const user = obterUsuarioLogado();
  if (user) {
    user.foto = base64Image;
    ativarConta(user);
  }
}

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

function atualizarInterfaceAuth() {
  const usuario = obterUsuarioLogado();
  const menuPerfil = document.querySelector(".header .nav a[href*='perfil']");
  const isEn = document.documentElement.lang === "en" || window.location.pathname.includes("_en.html");

  if (menuPerfil) {
    if (usuario) {
      menuPerfil.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 7px;">
          ${usuario.foto ? `<img src="${usuario.foto}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover; border: 1px solid var(--laranja);" />` : `<span style="display:inline-block; width:20px; height:20px; line-height:20px; border-radius:50%; background:var(--laranja); color:#fff; font-size:11px; text-align:center;">${usuario.nome.charAt(0).toUpperCase()}</span>`}
          ${usuario.nome.split(" ")[0]}
        </span>
      `;
    } else {
      menuPerfil.textContent = isEn ? "Sign In / Profile" : "Entrar / Perfil";
    }
  }

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
      fichaNome.textContent = isEn ? "Guest User" : "Visitante";
      fichaNivel.textContent = isEn ? "Connect with your email" : "Conecte com seu e-mail";
      if (fichaAvatar) fichaAvatar.textContent = "?";
      if (fichaStatsCount) fichaStatsCount.textContent = "0";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarInterfaceAuth();
});
