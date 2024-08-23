// Función para registrar un nuevo usuario
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
        console.log("Register Response Data:", data); // Log de la respuesta

        const messageDiv = document.getElementById('registerMessage');

        if (response.ok) {
            messageDiv.innerHTML = `<div class="alert alert-success">Registration successful!</div>`;
        } else {
            console.log("Register Error Data:", data); // Log de los datos de error

            const errorMessage = data.message || 'An unknown error occurred.';
            document.getElementById('errorModalBody').innerText = `Error: ${errorMessage}`;

            const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
            errorModal.show();
        }
    } catch (error) {
        console.error("Error registering user:", error);

        document.getElementById('errorModalBody').innerText = `Error: ${error.message || 'An unknown error occurred.'}`;
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
    }
});

// Función para iniciar sesión
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("Login Response Data:", data); // Log de la respuesta

        const messageDiv = document.getElementById('loginMessage');

        if (response.ok) {
            messageDiv.innerHTML = `<div class="alert alert-success">Login successful!</div>`;

            // Almacenar el userId en localStorage
            localStorage.setItem('userId', data.userId);
            console.log("Stored userId:", localStorage.getItem('userId'));
            localStorage.setItem('token', data.token);

            // Redirige al usuario a la página de dashboard o a la página principal
            window.location.href = '/home.html'; // Cambia a la URL deseada
        } else {
            console.log("Login Error Data:", data); // Log de los datos de error

            const errorMessage = data.message || 'An unknown error occurred.';
            document.getElementById('errorModalBody').innerText = `Error: ${errorMessage}`;

            const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
            errorModal.show();
        }
    } catch (error) {
        console.error("Error logging in:", error);

        document.getElementById('errorModalBody').innerText = `Error: ${error.message || 'An unknown error occurred.'}`;
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
    }
});
