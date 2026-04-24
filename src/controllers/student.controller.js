import { readData, writeData } from '../data/db.js';

const STUDENT_ID_PATTERN = /^EST\d{5}$/;

export const createStudent = (req, res) => {
  try {
    const { id, name, email = '' } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'El id del estudiante es obligatorio (formato: EST00001-EST99999)' });
    }
    
    if (!name) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    // Validar formato del ID
    const cleanId = id.trim().toUpperCase();
    if (!STUDENT_ID_PATTERN.test(cleanId)) {
      return res.status(400).json({ error: 'Formato de ID inválido. Debe ser EST seguido de 5 dígitos (ej: EST00001)' });
    }

    const data = readData();
    
    // Verificar que no exista el ID
    const existingStudent = data.students.find(s => s.id === cleanId);
    if (existingStudent) {
      return res.status(409).json({ error: 'El ID de estudiante ya existe' });
    }
    
    const newStudent = {
      id: cleanId,
      name,
      email,
      createdAt: new Date().toISOString()
    };
    
    data.students.push(newStudent);
    writeData(data);
    
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear estudiante' });
  }
};

export const listStudents = (req, res) => {
  try {
    const data = readData();
    res.json(data.students);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar estudiantes' });
  }
};

export const getStudentById = (req, res) => {
  try {
    const { id } = req.params;
    const data = readData();
    const cleanId = id.trim().toUpperCase();
    
    const student = data.students.find(s => s.id.toUpperCase() === cleanId);
    
    if (!student) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estudiante' });
  }
};
