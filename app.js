const apiUrl = 'http://localhost:8080/api/gorras/'; // Cambia esto si tu backend corre en otro puerto o URL.

// Limpia la tabla antes de llenar con nuevos datos
function limpiarTabla() {
    document.getElementById('output').innerHTML = '';
}

// Función para agregar una fila a la tabla
function agregarFilaTabla(gorra) {
    const tableBody = document.getElementById('output');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${gorra.id}</td>
        <td>${gorra.nombre}</td>
        <td>${gorra.color}</td>
        <td>${gorra.precio}</td>
        <td>${gorra.cantidad}</td>
        <td>${gorra.imagenUrl}</td>
    `;

    tableBody.appendChild(row);
}

async function buscarGorra() {
    // Obtiene el ID del campo de entrada
    const id = document.getElementById('gorraId').value.trim();

    if (!id) {
        alert('Por favor, ingrese un ID.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/gorras/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const gorra = await response.json();
            mostrarGorra(gorra);
        } else {
            alert('Gorra no encontrada.');
        }
    } catch (error) {
        alert(`Error en la solicitud: ${error}`);
    }
}

function mostrarGorra(gorra) {
    // Limpia la tabla de salida
    const outputTable = document.getElementById('output');
    outputTable.innerHTML = ''; // Limpiar el contenido previo

    // Crea una fila para la gorra
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${gorra.id}</td>
        <td>${gorra.nombre}</td>
        <td>${gorra.color}</td>
        <td>${gorra.precio}</td>
        <td>${gorra.cantidad}</td>
        <td>${gorra.imagenUrl}</td>
    `;
    outputTable.appendChild(row);
}


async function listarGorras() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    limpiarTabla(); // Limpiar la tabla antes de mostrar los resultados
    data.forEach(gorra => agregarFilaTabla(gorra));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('insertarBtn').addEventListener('click', insertarGorra);
});

async function insertarGorra() {
    const nombre = document.getElementById('nombre').value;
    const color = document.getElementById('color').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const cantidad = parseInt(document.getElementById('cantidad').value, 10);
    const imagenUrl = document.getElementById('imagenUrl').value;

    const gorraData = {
        nombre: nombre,
        color: color,
        precio: precio,
        cantidad: cantidad,
        imagenUrl: imagenUrl
    };

    const outputElement = document.getElementById('output');

    try {
        const response = await fetch('http://localhost:8080/api/gorras/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gorraData)
        });

        if (!response.ok) {
            throw new Error('Error al insertar la gorra');
        }

        const data = await response.json();
        console.log('Gorra insertada:', data);
        outputElement.value = JSON.stringify(data, null, 2);

    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        outputElement.value = 'Error: ' + error.message;
    }
}

async function actualizarGorra() {
    const id = document.getElementById('gorraId').value;
    const gorra = JSON.parse(document.getElementById('input').value);
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gorra)
    });
    const data = await response.json();
    limpiarTabla();
    agregarFilaTabla(data);
}

async function eliminarGorra() {
    // Obtiene el ID del campo de entrada
    const id = document.getElementById('gorraId').value.trim();

    if (!id) {
        alert('Por favor, ingrese un ID.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/gorras/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Gorra eliminada con éxito.');
            // Opcional: Puedes listar las gorras después de eliminar una
            listarGorras();
        } else {
            const error = await response.text();
            alert(`Error al eliminar la gorra: ${error}`);
        }
    } catch (error) {
        alert(`Error en la solicitud: ${error}`);
    }
}

