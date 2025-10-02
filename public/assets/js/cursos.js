const API = 'http://localhost:4000/api';

const form = document.getElementById('cursoForm');
const table = document.getElementById('cursosTable');

async function cargarCursos() {
  const res = await axios.get(`${API}/cursos`);
  table.innerHTML = '';
  res.data.forEach(curso => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${curso.nombre}</td>
      <td>${curso.detalle}</td>
      <td>
        <button class="btn btn-sm btn-primary me-2" onclick="editarCurso(${curso.id})">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarCurso(${curso.id})">🗑️</button>
      </td>
    `;
    table.appendChild(row);
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  if (!form.nombre.value.trim()) {
    mostrarMensaje('El nombre del curso es obligatorio.', 'danger');
    return;
  }

  const curso = {
    nombre: form.nombre.value,
    detalle: form.detalle.value
  };

  const id = form.id.value;
  try {
    if (id) {
      await axios.put(`${API}/cursos/${id}`, curso);
      mostrarMensaje('Curso actualizado correctamente.', 'success');
    } else {
      await axios.post(`${API}/cursos`, curso);
      mostrarMensaje('Curso creado correctamente.', 'success');
    }
    form.reset();
    cargarCursos();
  } catch (err) {
    mostrarMensaje('Error al guardar el curso.', 'danger');
  }
});

async function editarCurso(id) {
  const res = await axios.get(`${API}/cursos/${id}`);
  const curso = res.data;
  form.id.value = curso.id;
  form.nombre.value = curso.nombre;
  form.detalle.value = curso.detalle;
}

async function eliminarCurso(id) {
  if (confirm('¿Seguro que deseas eliminar este curso?')) {
    try {
      await axios.delete(`${API}/cursos/${id}`);
      mostrarMensaje('Curso eliminado correctamente.', 'success');
      cargarCursos();
    } catch {
      mostrarMensaje('Error al eliminar el curso.', 'danger');
    }
  }
}

function mostrarMensaje(texto, tipo = 'success') {
  const alertContainer = document.getElementById('alertContainer');
  alertContainer.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${texto}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

cargarCursos();