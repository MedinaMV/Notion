import { Router } from 'express';
import collectionController from '../controllers/collection.controller.js';
import Authentication from '../middleware/auth.middleware.js';

const router = Router();

router.post('/createCollection', Authentication, collectionController.createCollection);

router.delete('/:id/deleteCollection', Authentication, collectionController.deleteCollection);

router.get('/getAllCollections', Authentication, collectionController.getAllCollections);

router.post('/:collectionId/addNote/:noteId', Authentication, collectionController.collectionAddNote);

router.get('/:id/getNotesByCollection', Authentication, collectionController.getNotesByCollection);

router.put('/shareCollection', Authentication, collectionController.shareCollection);

router.get('/getSharedCollections/:friendId', Authentication, collectionController.getSharedCollections);

export { router };