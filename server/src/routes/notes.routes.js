import { Router } from "express";
import noteController from "../controllers/notes.controller.js"

const router = Router();

router.post('/createNote/:user', noteController.createNote);

router.delete('/:id/deleteNote', noteController.deleteNote);

router.get('/getAllNotes/:user', noteController.getAllNotes);

router.get('/:id/getNote', noteController.getNote);

router.post('/:id/addImage', noteController.addImage);

router.post('/:id/:image_id/updateImage', noteController.updateImage);

router.post('/:id/addParagraph', noteController.addParagraph);

router.post('/:id/:element_id/editParagraph', noteController.editParagraph);

router.post('/:id/addList', noteController.addList);

router.post('/:id/:list_id/addListElement', noteController.addListElement);

export { router };