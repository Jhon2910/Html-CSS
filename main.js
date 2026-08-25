document.addEventListener("DOMContentLoaded", () => {
    const isEnglish = document.documentElement.lang === "en";

    // Host dinâmico para backend local
    const host = window.location.hostname && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1" && window.location.protocol !== "file:"
        ? window.location.hostname
        : "localhost";
    const API_BASE_URL = `http://${host}:8080`;

    // 1. Alternador de Tema (Light / Dark)
    initTheme();

    // 2. Busca projetos do backend local se estiver ativo (apenas na página PT)
    if (!isEnglish) {
        fetchProjectsFromBackend(API_BASE_URL);
    }

    // 3. Gerenciamento do Formulário de Contato
    initContactForm(API_BASE_URL, isEnglish);
});

/* =======================================================
   THEME TOGGLE (LIGHT / DARK)
======================================================= */
function initTheme() {
    const themeBtn = document.getElementById("theme-toggle");
    if (!themeBtn) return;

    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute("data-theme", "dark");
        updateThemeIcon(true);
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        updateThemeIcon(false);
    }

    themeBtn.addEventListener("click", () => {
        const isCurrentDark = document.documentElement.getAttribute("data-theme") === "dark";
        const newTheme = isCurrentDark ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateThemeIcon(!isCurrentDark);
    });
}

function updateThemeIcon(isDark) {
    const themeBtn = document.getElementById("theme-toggle");
    if (!themeBtn) return;

    const icon = themeBtn.querySelector("i");
    if (!icon) return;

    if (isDark) {
        icon.className = "fa-regular fa-sun";
        themeBtn.title = "Mudar para modo claro";
    } else {
        icon.className = "fa-regular fa-moon";
        themeBtn.title = "Mudar para modo escuro";
    }
}

/* =======================================================
   BACKEND PROJECTS FETCH (OPCIONAL)
======================================================= */
function fetchProjectsFromBackend(apiBaseUrl) {
    fetch(`${apiBaseUrl}/api/projetos`)
        .then(res => {
            if (!res.ok) throw new Error("Erro na requisição");
            return res.json();
        })
        .then(projetos => {
            const container = document.getElementById("projetos-container");
            if (!container || !Array.isArray(projetos) || projetos.length === 0) return;

            container.innerHTML = "";

            projetos.forEach(projeto => {
                const article = document.createElement("article");
                article.className = "project-item";

                article.innerHTML = `
                    <div class="project-header">
                        <a href="https://github.com/Jhon2910" target="_blank" rel="noopener noreferrer" class="project-title">
                            ${escapeHtml(projeto.nome)} <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                    </div>
                    <p class="project-desc">${escapeHtml(projeto.descricao)}</p>
                    <div class="project-tags">
                        <span class="tag">${escapeHtml(projeto.tecnologias)}</span>
                    </div>
                `;

                container.appendChild(article);
            });
        })
        .catch(() => {
            // Mantém os projetos estáticos se o backend estiver offline
        });
}

/* =======================================================
   CONTACT FORM HANDLER
======================================================= */
function initContactForm(apiBaseUrl, isEnglish) {
    const form = document.getElementById("form-contato");
    if (!form) return;

    const btn = document.getElementById("btn-enviar");
    const feedback = document.getElementById("form-feedback");
    const originalText = btn ? btn.innerText : (isEnglish ? "Send Message" : "Enviar Mensagem");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (btn) {
            btn.disabled = true;
            btn.innerText = isEnglish ? "Sending..." : "Enviando...";
        }

        if (feedback) {
            feedback.className = "form-feedback";
            feedback.innerText = "";
        }

        // Envio secundário para backend local Spring Boot (se estiver rodando)
        const payload = {
            nome: document.getElementById("nome")?.value || "",
            email: document.getElementById("email")?.value || "",
            assunto: document.getElementById("assunto")?.value || "",
            mensagem: document.getElementById("mensagem")?.value || ""
        };

        fetch(`${apiBaseUrl}/api/contatos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).catch(() => {});

        // Envio principal para Formspree
        const formData = new FormData(form);

        try {
            const res = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: { "Accept": "application/json" }
            });

            if (res.ok) {
                form.reset();
                if (feedback) {
                    feedback.className = "form-feedback success";
                    feedback.innerText = isEnglish
                        ? "Message sent successfully! I'll get back to you soon."
                        : "Mensagem enviada com sucesso! Responderei em breve.";
                }
            } else {
                throw new Error("Erro no envio");
            }
        } catch (err) {
            if (feedback) {
                feedback.className = "form-feedback error";
                feedback.innerText = isEnglish
                    ? "Error sending message. Please send an email to jonathanalexandre2910@gmail.com directly."
                    : "Erro ao enviar mensagem. Por favor, envie diretamente para jonathanalexandre2910@gmail.com.";
            }
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerText = originalText;
            }
        }
    });
}

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
