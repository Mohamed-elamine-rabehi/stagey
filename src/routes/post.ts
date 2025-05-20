import express from 'express';
import { PostController } from '../controller/postController';
import { authMiddleware } from '../middleware/auth';


const router = express.Router();

// Public routes
router.get('/', PostController.fetchPosts);
router.get('/search', PostController.searchPosts);
router.get('/:postId/company', PostController.getPostWithCompany);

// Company protected routes
router.post('/', authMiddleware('company'), PostController.createPost);
router.put('/:postId', authMiddleware('company'), PostController.updatePost);
router.delete('/:postId', authMiddleware('company'), PostController.deletePost);
// New route for fetching posts by the authenticated company
router.get('/company/posts', authMiddleware('company'), PostController.fetchCompanyPosts);
export default router;