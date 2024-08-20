// Função para registrar um novo usuário
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        console.log("Register Response Data:", data); // Log da resposta

        const messageDiv = document.getElementById('registerMessage');

        if (response.ok) {
            messageDiv.innerHTML = `<div class="alert alert-success">Registration successful!</div>`;
        } else {
            console.log("Register Error Data:", data); // Log dos dados de erro
            document.getElementById('errorModalBody').innerText = `Error: ${data.message}`;
            const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
            errorModal.show();
        }
    } catch (error) {
        console.error("Error registering user:", error);
        document.getElementById('errorModalBody').innerText = `Error: ${error.message}`;
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
    }
});

