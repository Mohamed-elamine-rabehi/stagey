import express from 'express';
import { FavoriteController } from '../controller/favoriteControler';
import { authMiddleware } from '../middleware/auth';


const router = express.Router();

router.post('/:postId/toggle', authMiddleware('user'), FavoriteController.toggleFavorite);
router.get('/', authMiddleware('user'), FavoriteController.getUserFavorites);

export default router;