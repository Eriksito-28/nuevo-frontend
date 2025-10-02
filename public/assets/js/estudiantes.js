const API = 'http://localhost:4000/api';

const form = document.getElementById('estudianteForm');
const table = document.getElementById('estudiantesTable');
const cursoSelect = document.getElementById('cursoId');

async function cargarCursos() {
  const res = await axios.get(`${API}/cursos`);
  cursoSelect.innerHTML = '<option value="">Selecciona un curso</option>';
  res.data.forEach(curso => {
    const option = document.createElement('option');
    option.value = curso.id;
    option.textContent = curso.nombre;
    cursoSelect.appendChild(option);
  });
}

async function cargarEstudiantes() {
  const res = await axios.get(`${API}/estudiantes`);
  table.innerHTML = '';
  res.data.forEach(est => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${est.nombre}</td>
      <td>${est.apellido}</td>
      <td>${est.edad}</td>
      <td>${est.grado}</td>
      <td>${est.seccion}</td>
      <td>${est.email}</td>
      <td>${est.direccion}</td>
      <td>${est.curso?.nombre || 'Sin curso'}</td>
      <td>
        <button class="btn btn-sm btn-primary me-2" onclick="editarEstudiante(${est.id})">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarEstudiante(${est.id})">🗑️</button>
      </td>
    `;
    table.appendChild(row);
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  if (!form.nombre.value.trim() || !form.email.value.trim() || !form.cursoId.value) {
    mostrarMensaje('Por favor completa nombre, email y curso.', 'danger');
    return;
  }

  const estudiante = {
    nombre: form.nombre.value,
    apellido: form.apellido.value,
    edad: parseInt(form.edad.value),
    grado: form.grado.value,
    seccion: form.seccion.value,
    direccion: form.direccion.value,
    email: form.email.value,
    cursoId: parseInt(form.cursoId.value)
  };

  const id = form.id.value;
  try {
    if (id) {
      await axios.put(`${API}/estudiantes/${id}`, estudiante);
      mostrarMensaje('Estudiante actualizado correctamente.', 'success');
    } else {
      await axios.post(`${API}/estudiantes`, estudiante);
      mostrarMensaje('Estudiante creado correctamente.', 'success');
    }
    form.reset();
    cargarEstudiantes();
  } catch (err) {
    mostrarMensaje('Error al guardar el estudiante.', 'danger');
  }
});

async function editarEstudiante(id) {
  const res = await axios.get(`${API}/estudiantes/${id}`);
  const est = res.data;
  form.id.value = est.id;
  form.nombre.value = est.nombre;
  form.apellido.value = est.apellido;
  form.edad.value = est.edad;
  form.grado.value = est.grado;
  form.seccion.value = est.seccion;
  form.direccion.value = est.direccion;
  form.email.value = est.email;
  form.cursoId.value = est.cursoId;
}

async function eliminarEstudiante(id) {
  if (confirm('¿Seguro que deseas eliminar este estudiante?')) {
    try {
      await axios.delete(`${API}/estudiantes/${id}`);
      mostrarMensaje('Estudiante eliminado correctamente.', 'success');
      cargarEstudiantes();
    } catch {
      mostrarMensaje('Error al eliminar el estudiante.', 'danger');
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
cargarEstudiantes();