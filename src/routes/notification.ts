import express from 'express';
import { NotificationController } from '../controller/notificationController';
import { authMiddleware } from '../middleware/auth';


const router = express.Router();

router.get('/', authMiddleware('user'), NotificationController.getUserNotifications);
router.patch('/:notificationId/read', authMiddleware('user'), NotificationController.markAsRead);

export default router;