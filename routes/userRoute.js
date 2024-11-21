import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/details', userController.getdetails);
router.patch('/update', userController.updatedetails);

export default router;
