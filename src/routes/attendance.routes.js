import { Router } from 'express';
import { registerAttendance, getStudentAttendance } from '../controllers/attendance.controller.js';

const router = Router();

router.post('/', registerAttendance);
router.get('/estudiante/:id', getStudentAttendance);

export default router;
