import { Router } from 'express'
import userController from '../controllers/user.controller.js';
import Authentication from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', userController.register);

router.put('/logIn', userController.logIn);

router.put('/addFriend', Authentication, userController.addFriend);

router.get('/getAllFriends', Authentication, userController.getAllFriends);

router.put('/manageFriendRequest', Authentication, userController.manageFriendRequest);

router.get('/getAllFriendRequests', Authentication, userController.getAllFriendRequests);

export {router};