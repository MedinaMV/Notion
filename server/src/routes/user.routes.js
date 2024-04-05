import { Router } from 'express'
import userController from '../controllers/user.controller.js';
const router = Router();

router.post('/register', userController.register);

router.post('/logIn', userController.logIn);

router.post('/logOut', userController.logOut);

export {router};