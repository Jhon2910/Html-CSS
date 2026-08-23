document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:8080/api/projetos")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(projetos => {
            const container = document.getElementById("projetos-container");
            container.innerHTML = "";

            projetos.forEach(projeto => {
                const card = document.createElement("div");
                card.classList.add("card", "projeto");

                card.innerHTML = `
                    <i class="fa-solid fa-code"></i>
                    <h3>${projeto.nome}</h3>
                    <p>${projeto.descricao}</p>
                    <span>${projeto.tecnologias}</span>
                `;

                container.appendChild(card);
            });
        })
        .catch(error => console.error("Erro ao carregar projetos:", error));

    document.getElementById("form-contato").addEventListener("submit", (event) => {
        event.preventDefault();

        const contato = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            assunto: document.getElementById("assunto").value,
            mensagem: document.getElementById("mensagem").value
        };

        fetch("http://localhost:8080/api/contatos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contato)
        })
            .then(response => {
                if (response.ok) {
                    alert("Mensagem enviada com sucesso!");
                    document.getElementById("form-contato").reset();
                } else {
                    alert("Erro ao enviar mensagem.");
                }
            })
            .catch(error => console.error("Erro:", error));
    });
});
