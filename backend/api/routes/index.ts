import roomRouter from './roomRoute.js';
import { Router } from 'express';
const router = Router();

router.use('/api/v1/',roomRouter);

export default router;
