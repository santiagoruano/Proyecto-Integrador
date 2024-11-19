const cattleForm = document.getElementById('cattleForm');
const tableBody = document.getElementById('tableBody');
const submitBtn = document.getElementById('submitBtn');
const updateBtn = document.getElementById('updateBtn');

//Graficas
const ctxHealth = document.getElementById('healthChart').getContext('2d');
const ctxBreed = document.getElementById('breedChart').getContext('2d');

let cattleArray = [];
let currentEditIndex = null;

// Inicializar gráfica 1
const healthChart = new Chart(ctxHealth, {
    type: 'bar',
    data: {
        labels: ['Sano', 'Enfermo'],
        datasets: [{
            label: 'Cantidad de Mascotas por Estado de Salud',
            data: [0, 0], // Se actualizará después
            backgroundColor: ['#4CAF50', '#F44336']
        }]
    },
    options: {
        responsive: true
    }
 });

 // Inicializar gráfica 2

 const breedChart = new Chart(ctxBreed, {
    type: 'pie',
    data: {
        labels: [], // Se actualizará después
        datasets: [{
            label: 'Cantidad de Mascotas por Raza',
            data: [], // Se actualizará después
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
    },
    options: {
        responsive: true
    }
 });

// Evento para agregar una nueva mascota
submitBtn.addEventListener('click', function () {
    const mascotaID = document.getElementById('mascotaID').value;
    const name = document.getElementById('name').value;
    const breed = document.getElementById('breed').value;
    const age = document.getElementById('age').value;
    const healthStatus = document.getElementById('healthStatus').value;

    // Validar que todos los campos estén completos
    if (!mascotaID || !name || !breed || !age || !healthStatus) {
        alert("Por favor completa todos los campos.");
        return;
    }

    // Validar formato de datos
    const idIsNumber = !isNaN(Number(mascotaID));
    const breedIsText = isNaN(Number(breed));
    const nameIsText = isNaN(Number(name));


    if (!idIsNumber || !breedIsText || !nameIsText) {
        alert("Formato de datos no válido");
        return;
    }

    // Crear el objeto de nueva mascota
    const newMascota = {
        id: mascotaID,
        name: name,
        breed: breed,
        age: age,
        healthStatus: healthStatus,
    };

    // Agregar a la lista de mascotas
    cattleArray.push(newMascota);

    // Actualizar la tabla y las gráficas
    updateTable();
    updateCharts();

    // Resetear el formulario
    cattleForm.reset();
});




// Función para actualizar la tabla con los datos del array
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

 
 // Función para actualizar las gráficas
function updateCharts() {
    const healthCounts = { sano: 0, enfermo: 0 };
    const breedCounts = {};
 
 
    cattleArray.forEach(mascota => {
        // Contar estado de salud
        if (mascota.healthStatus.toLowerCase() === 'sano') {
            healthCounts.sano++;
        } else if (mascota.healthStatus.toLowerCase() === 'enfermo') {
            healthCounts.enfermo++;
        }
 
 
        // Contar razas
        if (!breedCounts[mascota.breed]) {
            breedCounts[mascota.breed] = 0;
        }
        breedCounts[mascota.breed]++;
    });
 
 
    // Actualizar gráfica de salud
    healthChart.data.datasets[0].data[0] = healthCounts.sano;
    healthChart.data.datasets[0].data[1] = healthCounts.enfermo;
    healthChart.update();
 
 
    // Actualizar gráfica de razas
    breedChart.data.labels = Object.keys(breedCounts);
    breedChart.data.datasets[0].data = Object.values(breedCounts);
    breedChart.update();
 }
 
 
 // Función para eliminar un registro de la tabla y del array
 function deleteRow(index) {
    cattleArray.splice(index, 1);
    updateTable();
    updateCharts();
 }
 
 
 // Función para editar un registro de la tabla
 function editRow(index) {
    currentEditIndex = index;
    document.getElementById('mascotaID').value = cattleArray[index].id;
    document.getElementById('name').value = cattleArray[index].name;
    document.getElementById('breed').value = cattleArray[index].breed;
    document.getElementById('age').value = cattleArray[index].age;
    document.getElementById('healthStatus').value = cattleArray[index].healthStatus;
 
 
    submitBtn.style.display = 'none';
    updateBtn.style.display = 'block';
 }
 
 
 // Evento para actualizar el registro de la mascota
 updateBtn.addEventListener('click', function() {
    const mascotaID = document.getElementById('mascotaID').value;
    const name = document.getElementById('name').value;
    const breed = document.getElementById('breed').value;
    const age = document.getElementById('age').value;
    const healthStatus = document.getElementById('healthStatus').value;
 
 
    if (!mascotaID || !name || !breed || !age || !healthStatus) {
        alert("Por favor completa todos los campos.");
        return;
    }
 
 
    cattleArray[currentEditIndex] = {
        id: mascotaID,
        name: name,
        breed: breed,
        age: age,
        healthStatus: healthStatus
    };
 
 
    currentEditIndex = null;
    updateBtn.style.display = 'none';
    submitBtn.style.display = 'block';
 

    updateTable();
    updateCharts();
    cattleForm.reset();
 });

 document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("loginButton");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const mascotasSection = document.getElementById("mascotasSection");

    // Obtener los usuarios registrados desde el localStorage, o inicializar con un array vacío
    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    // Manejar el clic en el botón de Iniciar Sesión
    loginButton.addEventListener("click", () => {
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        if (email && password) {
            // Verificar si el correo está registrado
            const user = registeredUsers.find(user => user.email === email);

            if (user) {
                // Si el usuario existe, verificar la contraseña
                if (user.password === password) {
                    // Oculta el formulario de login/registro y muestra la sección de mascotas
                    loginForm.style.display = "none";
                    registerForm.style.display = "none";
                    document.getElementById("getterSafeSection").style.display = "none";
                    mascotasSection.style.display = "block";
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

        // Verificar si el correo ya ha sido registrado
        if (registeredUsers.find(user => user.email === email)) {
            alert("Este correo ya ha sido registrado");
        } else if (name && email && password) {
            // Si los campos son válidos y el correo no está registrado
            console.log(`Nombre: ${name}, Correo: ${email}, Contraseña: ${password}`);
            alert("Registro exitoso");
            // Registrar el usuario
            registeredUsers.push({ email, password });

            // Guardar los usuarios registrados en localStorage
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        } else {
            alert("Por favor, completa todos los campos");
        }
    });

    // Alternar entre formularios de login y registro
    document.getElementById("showRegister").addEventListener("click", function () {
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("registerForm").style.display = "block";
    });

    document.getElementById("showLogin").addEventListener("click", function () {
        document.getElementById("registerForm").style.display = "none";
        document.getElementById("loginForm").style.display = "block";
    });
});


 


 

 



