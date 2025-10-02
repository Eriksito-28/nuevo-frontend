const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/estudiantes', (_, res) => res.sendFile(path.join(__dirname, 'public/estudiantes.html')));
app.get('/cursos', (_, res) => res.sendFile(path.join(__dirname, 'public/cursos.html')));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🌐 Frontend corriendo en http://localhost:${PORT}`);
});