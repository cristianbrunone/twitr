// Configuración para la API de tweets
const apiUrl = "http://localhost:3000/tweets"; // Ajusta el puerto si es necesario

async function fetchTweets() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
        console.error("No userId or token found in localStorage");
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching tweets: ${response.statusText}`);
        }

        const contentType = response.headers.get('Content-Type');
        let tweets;
        if (contentType && contentType.includes('application/json')) {
            tweets = await response.json();
        } else {
            const text = await response.text();
            throw new Error(`Expected JSON but received: ${text}`);
        }

        const tweetsContainer = document.getElementById("tweets-container");
        tweetsContainer.innerHTML = "";

        tweets.reverse().forEach(tweet => {
            const tweetId = tweet.tweetId;
            const tweetContent = tweet.content;
            const tweetUserId = tweet.userId;
            const tweetUserName = tweet.username; // Corregido

            const isOwner = String(tweetUserId) === String(userId);

            const editButton = isOwner
                ? `<button class="btn btn-primary btn-sm me-2" onclick="editTweet(${tweetId}, '${encodeURIComponent(tweetContent)}')">Editar</button>`
                : '';

            const deleteButton = isOwner
                ? `<button class="btn btn-danger btn-sm" onclick="deleteTweet(${tweetId})">Excluir</button>`
                : '';

            const tweetDiv = document.createElement("div");
            tweetDiv.className = "tweet tweet-card";
            tweetDiv.id = `tweet-${tweetId}`;
            tweetDiv.innerHTML = `
                <div class="d-flex">
                    <div class="me-3">
                        <img src="https://picsum.photos/50/50?random=${tweetUserId}" alt="Foto de Perfil" class="rounded-circle">
                    </div>
                    <div class="flex-grow-1">
                        <p><strong>${tweetUserName}</strong></p>
                        <p>${tweetContent}</p>
                    </div>
                </div>
                <div class="d-flex justify-content-end">
                    ${editButton}
                    ${deleteButton}
                </div>
            `;

            tweetsContainer.prepend(tweetDiv);

            // Llamar a updateUsernameLink con el nombre de usuario del tweet
            updateUsernameLink(tweetUserName);
        });
    } catch (error) {
        console.error("Error fetching tweets:", error);
    }
}

// Función para eliminar un tweet
async function deleteTweet(tweetId) {
    if (tweetId === undefined || tweetId === null) {
        console.error("Tweet ID is undefined or invalid");
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/${tweetId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to delete tweet: ${errorData.message}`);
        }

        fetchTweets(); // Actualizar la lista de tweets
    } catch (error) {
        console.error("Error deleting tweet:", error);
    }
}

// Función para crear un tweet
async function createTweet() {
    const content = document.getElementById("tweetContent").value;
    const token = localStorage.getItem('token');
    const userId = parseInt(localStorage.getItem('userId'), 10);

    if (!token || isNaN(userId)) {
        console.error("No token or invalid userId found in localStorage");
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ content, userId })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error creating tweet: ${errorData.message}`);
        }

        fetchTweets(); // Actualizar la lista de tweets
    } catch (error) {
        console.error("Error creating tweet:", error);
    }
}

// Función para mostrar el formulario de edición
function editTweet(tweetId, tweetContent) {
    document.getElementById('editTweetContent').value = decodeURIComponent(tweetContent);
    document.getElementById('editTweetModal').dataset.tweetId = tweetId;
    const editTweetModal = new bootstrap.Modal(document.getElementById('editTweetModal'));
    editTweetModal.show();
}

async function saveTweet() {
    const tweetId = document.getElementById('editTweetModal').dataset.tweetId;
    const content = document.getElementById('editTweetContent').value;
    const token = localStorage.getItem('token');

    if (!token || !tweetId) {
        console.error("No token or tweetId found");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${tweetId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error updating tweet: ${errorData.message}`);
        }

        fetchTweets(); // Actualizar la lista de tweets

        // Obtener la instancia del modal existente y ocultarla
        const editTweetModal = bootstrap.Modal.getInstance(document.getElementById('editTweetModal'));
        if (editTweetModal) {
            editTweetModal.hide();
        }

    } catch (error) {
        console.error("Error saving tweet:", error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Llama a esta función para configurar la imagen de perfil del usuario al cargar la página
    setupProfilePicture();
    // Inicializar la carga de tweets
    fetchTweets();
});

function setupProfilePicture() {
    const userId = localStorage.getItem('userId');
    if (userId) {
        // Reemplaza la URL de la imagen con una URL única basada en el userId
        const profilePic = document.querySelector('.rounded-circle'); // Suponiendo que el perfil usa esta clase
        if (profilePic) {
            profilePic.src = `https://picsum.photos/50/50?random=${userId}`;
        }
    }
}

function updateUsernameLink(username) {
    const usernameLink = document.querySelector('#username-link');

    if (usernameLink) {
        usernameLink.href = `user-profile.html?username=${encodeURIComponent(username)}`;
        usernameLink.textContent = username; // Opcional: actualizar el texto del enlace si es necesario
    }
}



