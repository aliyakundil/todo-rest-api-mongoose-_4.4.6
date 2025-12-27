import { Router } from 'express';
import todoRoutes from './todos';
const router = Router();
router.use('/todos', todoRoutes);
router.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});
export default router;
