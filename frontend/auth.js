// Função para registrar um novo usuário
// Função para registrar um novo usuário
document.getElementById('registerForm').addEventListener('submit', async function (event) {
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

            // Verifique se data.message está definido antes de usá-lo
            const errorMessage = data.message || 'An unknown error occurred.';
            document.getElementById('errorModalBody').innerText = `Error: ${errorMessage}`;

            // Inicialize e exiba o modal de erro
            const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
            errorModal.show();
        }
    } catch (error) {
        console.error("Error registering user:", error);

        // Exibe o erro capturado no catch
        document.getElementById('errorModalBody').innerText = `Error: ${error.message || 'An unknown error occurred.'}`;
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
    }
});
