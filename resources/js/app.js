document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("loginButton");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const mascotasSection = document.getElementById("mascotasSection");

    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    let currentUser = null; // Usuario actualmente logueado

    // Manejar el clic en el botón de Iniciar Sesión
    loginButton.addEventListener("click", () => {
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        if (email && password) {
            const user = registeredUsers.find(user => user.email === email);

            if (user) {
                if (user.password === password) {
                    currentUser = user; // Establecer el usuario actual
                    loginForm.style.display = "none";
                    registerForm.style.display = "none";
                    document.getElementById("getterSafeSection").style.display = "none";
                    mascotasSection.style.display = "block";

                    // Cargar las mascotas del usuario actual
                    cattleArray = currentUser.cattleArray || [];
                    updateTable();
                    updateCharts();
                } else {
                    alert("Contraseña incorrecta");
                }
            } else {
                alert("Este correo no está registrado");
            }
        } else {
            alert("Por favor, completa todos los campos.");
        }
    });

    // Controlador para el botón "Registrarse"
    const registerButton = document.getElementById("registerButton");
    registerButton.addEventListener("click", function () {
        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        if (registeredUsers.find(user => user.email === email)) {
            alert("Este correo ya ha sido registrado");
        } else if (name && email && password) {
            alert("Registro exitoso");
            registeredUsers.push({ name, email, password, cattleArray: [] });
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        } else {
            alert("Por favor, completa todos los campos");
        }
    });

    document.getElementById("showRegister").addEventListener("click", function () {
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("registerForm").style.display = "block";
    });

    document.getElementById("showLogin").addEventListener("click", function () {
        document.getElementById("registerForm").style.display = "none";
        document.getElementById("loginForm").style.display = "block";
    });

    const cattleForm = document.getElementById('cattleForm');
    const tableBody = document.getElementById('tableBody');
    const submitBtn = document.getElementById('submitBtn');
    const updateBtn = document.getElementById('updateBtn');

    const ctxHealth = document.getElementById('healthChart').getContext('2d');
    const ctxBreed = document.getElementById('breedChart').getContext('2d');

    let cattleArray = [];
    let currentEditIndex = null;

    const healthChart = new Chart(ctxHealth, {
        type: 'bar',
        data: {
            labels: ['Sano', 'Enfermo'],
            datasets: [{
                label: 'Cantidad de Mascotas por Estado de Salud',
                data: [0, 0],
                backgroundColor: ['#4CAF50', '#F44336']
            }]
        },
        options: {
            responsive: true
        }
    });

    const breedChart = new Chart(ctxBreed, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                label: 'Cantidad de Mascotas por Raza',
                data: [],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }]
        },
        options: {
            responsive: true
        }
    });

    submitBtn.addEventListener('click', function () {
        const mascotaID = document.getElementById('mascotaID').value;
        const name = document.getElementById('name').value;
        const breed = document.getElementById('breed').value;
        const age = document.getElementById('age').value;
        const healthStatus = document.getElementById('healthStatus').value;

        if (!mascotaID || !name || !breed || !age || !healthStatus) {
            alert("Por favor completa todos los campos.");
            return;
        }

        const idIsNumber = !isNaN(Number(mascotaID));
        const breedIsText = isNaN(Number(breed));
        const nameIsText = isNaN(Number(name));

        if (!idIsNumber || !breedIsText || !nameIsText) {
            alert("Formato de datos no válido");
            return;
        }

        const newMascota = { id: mascotaID, name, breed, age, healthStatus };
        cattleArray.push(newMascota);

        currentUser.cattleArray = cattleArray; // Actualizar las mascotas del usuario
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

        updateTable();
        updateCharts();
        cattleForm.reset();
    });

    function updateTable() {
        tableBody.innerHTML = '';

        cattleArray.forEach((mascota, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${mascota.id}</td>
                <td>${mascota.name}</td>
                <td>${mascota.breed}</td>
                <td>${mascota.age}</td>
                <td>${mascota.healthStatus}</td>
                <td>
                    <button onclick="editRow(${index})">Editar</button>
                    <button onclick="deleteRow(${index})">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function updateCharts() {
        const healthCounts = { sano: 0, enfermo: 0 };
        const breedCounts = {};

        cattleArray.forEach(mascota => {
            if (mascota.healthStatus.toLowerCase() === 'sano') {
                healthCounts.sano++;
            } else if (mascota.healthStatus.toLowerCase() === 'enfermo') {
                healthCounts.enfermo++;
            }

            if (!breedCounts[mascota.breed]) {
                breedCounts[mascota.breed] = 0;
            }
            breedCounts[mascota.breed]++;
        });

        healthChart.data.datasets[0].data[0] = healthCounts.sano;
        healthChart.data.datasets[0].data[1] = healthCounts.enfermo;
        healthChart.update();

        breedChart.data.labels = Object.keys(breedCounts);
        breedChart.data.datasets[0].data = Object.values(breedCounts);
        breedChart.update();
    }

    function deleteRow(index) {
        cattleArray.splice(index, 1);
        currentUser.cattleArray = cattleArray;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        updateTable();
        updateCharts();
    }

    function editRow(index) {
        currentEditIndex = index;
        const mascota = cattleArray[index];
        document.getElementById('mascotaID').value = mascota.id;
        document.getElementById('name').value = mascota.name;
        document.getElementById('breed').value = mascota.breed;
        document.getElementById('age').value = mascota.age;
        document.getElementById('healthStatus').value = mascota.healthStatus;

        submitBtn.style.display = 'none';
        updateBtn.style.display = 'block';
    }

    updateBtn.addEventListener('click', function () {
        const mascotaID = document.getElementById('mascotaID').value;
        const name = document.getElementById('name').value;
        const breed = document.getElementById('breed').value;
        const age = document.getElementById('age').value;
        const healthStatus = document.getElementById('healthStatus').value;

        if (!mascotaID || !name || !breed || !age || !healthStatus) {
            alert("Por favor completa todos los campos.");
            return;
        }

        cattleArray[currentEditIndex] = { id: mascotaID, name, breed, age, healthStatus };
        currentUser.cattleArray = cattleArray;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

        currentEditIndex = null;
        updateBtn.style.display = 'none';
        submitBtn.style.display = 'block';

        updateTable();
        updateCharts();
        cattleForm.reset();
    });
});
``
