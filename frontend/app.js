const apiUrl = "http://localhost:3000/tweets"; // Ajusta o porto se necessário

async function fetchTweets() {
    try {
        const response = await fetch(apiUrl);
        const tweets = await response.json();
        const tweetsContainer = document.getElementById("tweets-container");
        tweetsContainer.innerHTML = ""; // Limpiar el contenedor existente

        // Mostrar los tweets más recientes primero
        tweets.reverse().forEach(tweet => {
            const tweetId = tweet.tweetId;
            const tweetContent = tweet.content;

            if (tweetId !== undefined) {
                const tweetDiv = document.createElement("div");
                tweetDiv.className = "tweet tweet-card";
                tweetDiv.id = `tweet-${tweetId}`;

                tweetDiv.innerHTML = `
                    <p>${tweetContent}</p>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-primary btn-sm me-2" onclick="editTweet(${tweetId}, '${tweetContent}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteTweet(${tweetId})">Excluir</button>
                    </div>
                `;

                // Agregar al inicio del contenedor
                tweetsContainer.prepend(tweetDiv);
            } else {
                console.error("Tweet ID é indefinido:", tweet);
            }
        });
    } catch (error) {
        console.error("Erro ao buscar tweets:", error);
    }
}



// Função para eliminar um tweet
async function deleteTweet(tweetId) {
    if (tweetId === undefined || tweetId === null) {
        console.error("ID do tweet é indefinido ou inválido");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${tweetId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Falha ao excluir tweet: ${errorData.message}`);
        }

        fetchTweets(); // Atualizar a lista de tweets
    } catch (error) {
        console.error("Erro ao excluir tweet:", error);
    }
}

async function createTweet() {
    const content = document.getElementById("tweetContent").value;
    const userId = 1; // Fornece un userId fijo para pruebas

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content, userId })
        });
        if (!response.ok) {
            throw new Error("Erro ao criar tweet");
        }
        const newTweet = await response.json();
        document.getElementById("tweetContent").value = "";

        // Crear un nuevo div para el tweet recién creado
        const tweetDiv = document.createElement("div");
        tweetDiv.className = "tweet tweet-card";
        tweetDiv.id = `tweet-${newTweet.tweetId}`;

        tweetDiv.innerHTML = `
            <p>${newTweet.content}</p>
            <div class="d-flex justify-content-end">
                <button class="btn btn-primary btn-sm me-2" onclick="editTweet(${newTweet.tweetId}, '${newTweet.content}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTweet(${newTweet.tweetId})">Excluir</button>
            </div>
        `;

        // Agregar al inicio del contenedor
        const tweetsContainer = document.getElementById("tweets-container");
        tweetsContainer.prepend(tweetDiv);

    } catch (error) {
        console.error("Erro ao criar tweet:", error);
    }
}



// Função para editar um tweet
function editTweet(tweetId, currentContent) {
    // Definir o conteúdo atual no modal
    document.getElementById('editTweetContent').value = currentContent;
    // Armazenar o ID do tweet no modal
    document.getElementById('editTweetModal').dataset.tweetId = tweetId;
    // Mostrar o modal
    const modal = new bootstrap.Modal(document.getElementById('editTweetModal'));
    modal.show();
}

// Função para salvar as alterações do tweet
function saveTweet() {
    const tweetId = document.getElementById('editTweetModal').dataset.tweetId;
    const newContent = document.getElementById('editTweetContent').value;

    if (tweetId && newContent) {
        updateTweet(tweetId, newContent);
        // Fechar o modal após salvar
        const modal = bootstrap.Modal.getInstance(document.getElementById('editTweetModal'));
        modal.hide();
    } else {
        alert("Conteúdo do tweet não pode estar vazio.");
    }
}


// Função para atualizar um tweet
async function updateTweet(tweetId, newContent) {
    try {
        const response = await fetch(`${apiUrl}/${tweetId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content: newContent })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Falha ao atualizar tweet: ${errorData.message}`);
        }
        const updatedTweet = await response.json();
        const tweetDiv = document.getElementById(`tweet-${tweetId}`);
        if (tweetDiv) {
            tweetDiv.querySelector("p").textContent = updatedTweet.content;
        }
    } catch (error) {
        console.error("Erro ao atualizar tweet:", error);
    }
}


// Inicializar a aplicação carregando os tweets ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    fetchTweets(); // Carregar tweets inicialmente

    // Atualizar os tweets a cada 10 segundos
    setInterval(fetchTweets, 10000);
});