document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});

async function loadUsers() {
    try {
        const response = await fetch('/api/auth/users'); // Asegúrate de que esta sea la URL correcta
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

function displayUsers(users) {
    const usersTableBody = document.querySelector('#usersTable tbody');
    usersTableBody.innerHTML = ''; // Limpia la tabla actual

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.userID}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>
                <button class="btn btn-delete" onclick="deleteUser(${user.userID})">Delete</button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
}

async function deleteUser(userId) {
    try {
        const response = await fetch(`/api/auth/user/${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        loadUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}
