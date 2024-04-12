import { Router } from 'express'
import userController from '../controllers/user.controller.js';
const router = Router();

router.post('/register', userController.register);

router.put('/logIn', userController.logIn);

export {router};