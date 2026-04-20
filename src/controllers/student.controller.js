import { readData, writeData, generateStudentId } from '../data/db.js';

export const createStudent = (req, res) => {
  try {
    const { name, email = '' } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const data = readData();
    
    const newStudent = {
      id: generateStudentId(),
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
