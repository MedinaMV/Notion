import { Router } from 'express';
import collectionController from '../controllers/collection.controller.js';

const router = Router();

router.post('/createCollection', collectionController.createCollection);

router.delete('/:id/deleteCollection', collectionController.deleteCollection);

router.get('/getAllCollections/:id', collectionController.getAllCollections);

router.post('/:collectionId/addNote/:noteId', collectionController.collectionAddNote);

router.get('/:id/getNotesByCollection', collectionController.getNotesByCollection);

export { router };