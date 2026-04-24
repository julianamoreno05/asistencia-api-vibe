# Auditoría

## Hallazgo 1 — Validación del formato de código de estudiante
- **Severidad:** media
- **Archivo/línea:** src/controllers/student.controller.js, línea 3, 18-21
- **Descripción:** El endpoint POST /api/estudiantes requiere que el `id` sea proporcionado por el cliente y valida que siga el patrón EST\d{5}.
- **Evidencia:** Patrón `STUDENT_ID_PATTERN = /^EST\d{5}$/` valida en línea 18-21. Rechaza con status 400 si no cumple formato.
- **Impacto:** Corregido. IDs de estudiante garantizados con formato válido.

## Hallazgo 2 — Rechazo de fechas futuras
- **Severidad:** media
- **Archivo/línea:** src/controllers/attendance.controller.js, línea 8
- **Descripción:** El campo `date` del POST /api/asistencias no valida que la fecha sea igual o anterior a hoy. Se permite cualquier formato de fecha.
- **Evidencia:** POST con `date: "2099-12-31"` se registra correctamente (debería rechazar).
- **Impacto:** Asistencias falsificadas con fechas futuras distorsionan reportes.

## Hallazgo 3 — Validación del enum de estado
- **Severidad:** baja
- **Archivo/línea:** src/controllers/attendance.controller.js, línea 3-6, 12-14
- **Descripción:** Sí hay validación. Define `ALLOWED_STATUSES = ['presente', 'ausente', 'justificada']` y rechaza valores inválidos con status 400.
- **Evidencia:** POST con `status: "retrasado"` retorna `error: "Estado inválido. Valores permitidos: presente, ausente, justificada"`.
- **Impacto:** Sin riesgo.

## Hallazgo 4 — Try/catch en rutas y controladores
- **Severidad:** baja
- **Archivo/línea:** src/controllers/student.controller.js, línea 3-27; src/controllers/attendance.controller.js, línea 6-36
- **Descripción:** Todos los controladores implementan try/catch correctamente.
- **Evidencia:** Cada función (createStudent, registerAttendance, getAbsenteeismReport) envuelve la lógica en try/catch y devuelve status 500 en error.
- **Impacto:** Bien implementado, reduce fallos silenciosos.

## Hallazgo 5 — Códigos HTTP correctos
- **Severidad:** baja
- **Archivo/línea:** src/controllers/student.controller.js, línea 6, 23, 27, 45; src/controllers/attendance.controller.js, línea 11-14, 20-22, 36
- **Descripción:** Se usan códigos HTTP apropiados: 201 (Created), 400 (Bad Request), 404 (Not Found), 500 (Error).
- **Evidencia:** 201 al crear estudiante (línea 23), 400 si falta nombre (línea 6), 404 si estudiante no existe (línea 45).
- **Impacto:** Bien implementado.

## Hallazgo 6 — CORS configurado permisivamente
- **Severidad:** alta
- **Archivo/línea:** src/server.js, línea 10
- **Descripción:** CORS está habilitado globalmente con `app.use(cors())`, lo que permite todas las origins (`*`). En producción, esto es riesgoso.
- **Evidencia:** Cualquier dominio puede hacer requests al API. No hay restricción.
- **Impacto:** Vulnerabilidad CSRF, acceso desde cualquier origen no autorizado.

## Hallazgo 7 — Escapado básico de entradas
- **Severidad:** baja
- **Archivo/línea:** src/controllers/student.controller.js, línea 40; src/controllers/attendance.controller.js, línea 16
- **Descripción:** Hay limpieza básica con `trim()` y `toUpperCase()`.
- **Evidencia:** Línea 40 en student.controller.js: `const cleanId = id.trim().toUpperCase();`
- **Impacto:** Protección básica contra espacios y mayúsculas, pero no valida formato.

## Hallazgo 8 — Parametrización de consultas
- **Severidad:** baja
- **Archivo/línea:** src/data/db.js
- **Descripción:** No aplica (usa archivo JSON, no base de datos SQL).
- **Evidencia:** Almacenamiento en data.json con `fs.readFileSync()` y `JSON.parse()`.
- **Impacto:** Sin riesgo de SQL injection, pero sin validación de esquema.

## Hallazgo 9 — Rate limiting
- **Severidad:** alta
- **Archivo/línea:** src/server.js (no existe)
- **Descripción:** No hay rate limiting implementado. API vulnerable a ataques DoS/fuerza bruta.
- **Evidencia:** Sin middleware como `express-rate-limit`.
- **Impacto:** Cualquiera puede hacer miles de requests sin restricción.

## Hallazgo 10 — Acceso a datos sin autenticación
- **Severidad:** crítica
- **Archivo/línea:** src/routes/student.routes.js, línea 6-7; src/routes/attendance.routes.js, línea 6-7
- **Descripción:** Todas las rutas son públicas sin autenticación. Cualquiera puede leer nombres, emails y registros de asistencia.
- **Evidencia:** GET /api/estudiantes devuelve lista completa; GET /api/asistencias/estudiantes/:id devuelve asistencias sin verificar identidad.
- **Impacto:** Exposición de datos personales. Incumple regulaciones de privacidad.

## Hallazgo 11 — Regulaciones de habeas data
- **Severidad:** crítica
- **Archivo/línea:** src/server.js (no existe endpoint)
- **Descripción:** No hay mecanismo para que estudiantes soliciten/eliminen/corrijan sus datos personales (derecho a habeas data).
- **Evidencia:** No hay DELETE /api/estudiantes/:id ni endpoint de solicitud de datos.
- **Impacto:** Incumple GDPR, LGPD y leyes de protección de datos personales en Colombia.

## Hallazgo 12 — Separación de responsabilidades
- **Severidad:** baja
- **Archivo/línea:** src/routes/, src/controllers/, src/data/
- **Descripción:** Bien estructurado en capas: rutas, controladores y lógica de datos separadas.
- **Evidencia:** student.routes.js delega a student.controller.js; controller llama a db.js. Patrón MVC respetado.
- **Impacto:** Bien implementado, facilita mantenimiento.

## Hallazgo 13 — Nombres descriptivos
- **Severidad:** baja
- **Archivo/línea:** src/controllers/attendance.controller.js, línea 6, 57; src/data/db.js, línea 21
- **Descripción:** Funciones y variables tienen nombres claros.
- **Evidencia:** `registerAttendance`, `getAbsenteeismReport`, `generateStudentId` son autodescriptivos.
- **Impacto:** Bien implementado, código legible.

## Hallazgo 14 — Paquetes innecesarios o vulnerables
- **Severidad:** baja
- **Archivo/línea:** package.json
- **Descripción:** Solo 2 dependencias necesarias: express (framework) y cors (middleware CORS).
- **Evidencia:** "express": "^4.19.2", "cors": "^2.8.5". Sin paquetes innecesarios.
- **Impacto:** Bien dimensionado. Ejecutar `npm audit` para verificar vulnerabilidades conocidas.

## Hallazgo 15 — Variables de entorno
- **Severidad:** media
- **Archivo/línea:** src/server.js, línea 8
- **Descripción:** Puerto configurable: `const PORT = process.env.PORT || 3000;`
- **Evidencia:** Usa `process.env.PORT` con fallback a 3000.
- **Impacto:** Bien implementado para el puerto. Pero falta `.env.example` y no hay otras configuraciones (DB, autenticación).

## Hallazgo 16 — Archivo .env.example
- **Severidad:** media
- **Archivo/línea:** Raíz del proyecto (no existe)
- **Descripción:** Falta `.env.example` documentando variables esperadas.
- **Evidencia:** No hay .env.example en la raíz.
- **Impacto:** Nuevos developers no saben qué variables configurar.

## Hallazgo 17 — Hardcodeo de rutas
- **Severidad:** baja
- **Archivo/línea:** src/data/db.js, línea 5
- **Descripción:** Rutas de archivos hardcodeadas. `DATA_FILE = path.join(__dirname, 'data.json')`
- **Evidencia:** No se puede cambiar la ubicación de data.json sin modificar código.
- **Impacto:** Poco flexible, pero aceptable para pequeños proyectos.

## Hallazgo 18 — Registros duplicados de asistencia
- **Severidad:** alta
- **Archivo/línea:** src/controllers/attendance.controller.js, línea 28
- **Descripción:** Se puede registrar la misma asistencia múltiples veces (mismo studentId + date + status).
- **Evidencia:** `data.attendance.push(record);` sin verificar si ya existe. POST duplicado con EST00001 + 2026-04-20 + presente se acepta.
- **Impacto:** Duplicados distorsionan reportes de ausentismo y conteos totales.

## Hallazgo 19 — Pruebas automatizadas
- **Severidad:** media
- **Archivo/línea:** src/ (no hay archivos .test.js ni .spec.js)
- **Descripción:** Cero pruebas automatizadas. No hay Jest, Mocha, o framework de testing.
- **Evidencia:** No existen archivos como `student.controller.test.js` o `attendance.test.js`.
- **Impacto:** Sin cobertura de tests, cambios futuros pueden romper funcionalidad sin detectarse.

## Hallazgo 20 — Documentación del README
- **Severidad:** media
- **Archivo/línea:** README.md
- **Descripción:** README existe pero está en formato UTF-16 (binario), no es legible como texto plano.
- **Evidencia:** Al intentar abrir, muestra caracteres binarios en lugar de texto.
- **Impacto:** Falta documentación de cómo instalar, ejecutar y usar la API.

## Hallazgo 21 — Comentarios en el código
- **Severidad:** baja
- **Archivo/línea:** src/server.js, línea 12-18; src/data/db.js, línea 21
- **Descripción:** Hay comentarios útiles en middleware y funciones auxiliares.
- **Evidencia:** Middleware de logs con comentario descriptivo; función generateStudentId documentada.
- **Impacto:** Bien implementado.

---

## Resumen de Hallazgos

| # | Tipo | Severidad | Estado |
|---|------|-----------|--------|
| 1 | Validación de studentId | Media | Implementado |
| 2 | Rechazo de fechas futuras | Media |  No hay validación |
| 3 | Enum de estado | Baja | Implementado |
| 4 | Try/catch | Baja | Implementado |
| 5 | Códigos HTTP | Baja | Implementado |
| 6 | CORS permisivo | Alta | Abierto a todas origins |
| 7 | Escapado de entradas | Baja | Implementado básicamente |
| 8 | Parametrización SQL | Baja | N/A (usa JSON) |
| 9 | Rate limiting | Alta | No implementado |
| 10 | Acceso sin autenticación | **Crítica** | Todas rutas públicas |
| 11 | Habeas data | **Crítica** | Sin mecanismo |
| 12 | Separación de capas | Baja | Implementado |
| 13 | Nombres descriptivos | Baja | Implementado |
| 14 | Dependencias | Baja | Solo necesarias |
| 15 | Variables de entorno | Media | Parcial (puerto sí) |
| 16 | .env.example | Media | Falta |
| 17 | Hardcodeo rutas | Baja | Presente |
| 18 | Duplicados de asistencia | **Alta** | Se permite |
| 19 | Pruebas automatizadas | Media | Cero tests |
| 20 | README | Media | Falta |
| 21 | Comentarios útiles | Baja | Presentes |