import express from 'express';
import { CompanyController } from '../controller/companyController';
import { authMiddleware } from '../middleware/auth';


const router = express.Router();

router.put('/profile', authMiddleware('company'), CompanyController.updateProfile);
router.get('/posts', authMiddleware('company'), CompanyController.getCompanyPosts);

export default router;