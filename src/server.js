import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/student.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import reportRoutes from './routes/report.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Middleware para ver logs por consola de todo lo que llega
app.use((req, res, next) => {
  console.log(`\n📌 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (Object.keys(req.body).length > 0) {
    console.log('   📦 Body de la petición:', JSON.stringify(req.body));
  }
  next();
});

// Rutas Principales
app.get('/api', (req, res) => {
  res.json({
    estudiantes: {
      crear: 'POST /api/estudiantes',
      listar_todos: 'GET /api/estudiantes',
      buscar_por_id: 'GET /api/estudiantes/:id'
    },
    asistencias: {
      registrar_asistencia: 'POST /api/asistencias',
      listar_por_estudiante: 'GET /api/asistencias/estudiantes/:id'
    },
    reportes: {
      ausentismo: 'GET /api/reportes/ausentismo'
    }
  });
});

app.use('/api/estudiantes', studentRoutes);
app.use('/api/asistencias', attendanceRoutes);
app.use('/api/reportes', reportRoutes);

// Manejo de rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor de la API de Asistencia corriendo en http://localhost:${PORT}`);
});
