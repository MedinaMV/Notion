import { Router } from 'express';
import Authentication from '../middleware/adminAuth.middleware.js';
import adminController from '../controllers/admin.controller.js';
const router = Router();

router.get('/getAllUsers', Authentication ,adminController.getAllUsers);

router.delete('/removeUser/:userId', Authentication ,adminController.removeUser);

router.get('/getAllUserNotes/:userId', Authentication ,adminController.getAllUserNotes);

router.get('/getAllUserNotes/:userId', Authentication ,adminController.getAllUserNotes);

router.get('/getAllUserCollections/:userId', Authentication ,adminController.getAllUserCollections);

router.get('/getAllUserFriends/:userId', Authentication ,adminController.getAllUserFriends);

router.post('/createNote/:userId', Authentication ,adminController.createNote);

router.delete('/removeNote/:id', Authentication ,adminController.removeNote);

router.post('/createCollection/:userId', Authentication ,adminController.createCollection);

router.delete('/removeCollection/:id', Authentication ,adminController.removeCollection);

router.post('/addFriends/:userId', Authentication ,adminController.addFriends);

router.delete('/removeFriends/:userId', Authentication ,adminController.removeFriends);

export { router };