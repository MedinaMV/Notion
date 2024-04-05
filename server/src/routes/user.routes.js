import { Router } from 'express'
import userController from '../controllers/user.controller.js';
const router = Router();

router.post('/register', userController.register);

router.put('/logIn', userController.logIn);

router.get('/logOut', userController.logOut);

export {router};