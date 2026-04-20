import { Router } from 'express';
import { createStudent, listStudents, getStudentById } from '../controllers/student.controller.js';

const router = Router();

router.post('/', createStudent);
router.get('/', listStudents);
router.get('/:id', getStudentById);

export default router;
