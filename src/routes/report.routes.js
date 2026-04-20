import { Router } from 'express';
import { getAbsenteeismReport } from '../controllers/attendance.controller.js';

const router = Router();

router.get('/ausentismo', getAbsenteeismReport);

export default router;
