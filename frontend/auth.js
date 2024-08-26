// auth.js

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

        if (!response.ok) {
            const contentType = response.headers.get('Content-Type');
            let errorText = await response.text();
            if (contentType && contentType.includes('application/json')) {
                const errorData = JSON.parse(errorText);
                errorText = errorData.message || 'An unknown error occurred.';
            }
            throw new Error(errorText);
        }

        const data = await response.json();
        console.log("Register Response Data:", data);

        const messageDiv = document.getElementById('registerMessage');
        messageDiv.innerHTML = `<div class="alert alert-success">Registration successful!</div>`;
    } catch (error) {
        console.error("Error registering user:", error);

        document.getElementById('errorModalBody').innerText = `Error: ${error.message || 'An unknown error occurred.'}`;
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
    }
});

async function handleLogin(email, password) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const contentType = response.headers.get('Content-Type');
            let errorText = await response.text();
            if (contentType && contentType.includes('application/json')) {
                const errorData = JSON.parse(errorText);
                errorText = errorData.message || 'An unknown error occurred.';
            }
            throw new Error(errorText);
        }

        const data = await response.json();

        // Almacenar el userId, token y rol de admin en localStorage
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAdmin', data.isAdmin); // Almacenar el rol de admin

        // Redirige al usuario a la página de dashboard o a la página principal
        window.location.href = '/home.html';
    } catch (error) {
        console.error("Error logging in:", error);

        document.getElementById('errorModalBody').innerText = `Error: ${error.message || 'An unknown error occurred.'}`;
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
    }
}


// Asocia la función handleLogin con el formulario de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    handleLogin(email, password);
});


