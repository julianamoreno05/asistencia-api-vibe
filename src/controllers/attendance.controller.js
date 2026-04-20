import { readData, writeData } from '../data/db.js';

const ALLOWED_STATUSES = ['presente', 'ausente', 'justificada'];

export const registerAttendance = (req, res) => {
  try {
    const { studentId, date, status } = req.body;
    
    if (!studentId || !date || !status) {
      return res.status(400).json({ error: 'studentId, date y status son obligatorios' });
    }
    
    if (!ALLOWED_STATUSES.includes(status.toLowerCase())) {
      return res.status(400).json({ error: `Estado inválido. Valores permitidos: ${ALLOWED_STATUSES.join(', ')}` });
    }
    
    const data = readData();
    const cleanStudentId = studentId.trim().toUpperCase();
    
    // Verificar si el estudiante existe
    const studentExists = data.students.some(s => s.id.toUpperCase() === cleanStudentId);
    if (!studentExists) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    
    const record = {
      id: Date.now().toString(),
      studentId: cleanStudentId,
      date,
      status: status.toLowerCase(),
      createdAt: new Date().toISOString()
    };
    
    data.attendance.push(record);
    writeData(data);
    
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar asistencia' });
  }
};

export const getStudentAttendance = (req, res) => {
  try {
    const { id } = req.params;
    const data = readData();
    const cleanId = id.trim().toUpperCase();
    
    // Verificar que el estudiante existe
    const student = data.students.find(s => s.id.toUpperCase() === cleanId);
    if (!student) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    
    const studentRecords = data.attendance.filter(a => a.studentId.toUpperCase() === cleanId);
    res.json(studentRecords);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las asistencias' });
  }
};

export const getAbsenteeismReport = (req, res) => {
  try {
    const data = readData();
    
    const report = data.students.map(student => {
      // Filtrar ausencias para este estudiante
      const absences = data.attendance.filter(a => a.studentId === student.id && a.status === 'ausente');
      
      return {
        studentId: student.id,
        name: student.name,
        totalAbsences: absences.length,
        absenceDates: absences.map(a => a.date)
      };
    });
    
    // Ordenar por quienes tienen mas faltas
    report.sort((a, b) => b.totalAbsences - a.totalAbsences);
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Error al generar el reporte de ausentismos' });
  }
};
