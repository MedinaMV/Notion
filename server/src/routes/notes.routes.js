import { Router } from "express";
import noteController from "../controllers/notes.controller.js";
import Authentication from "../middleware/auth.middleware.js";

const router = Router();

router.post('/createNote', Authentication, noteController.createNote);

router.delete('/:id/deleteNote', Authentication, noteController.deleteNote);

router.get('/getAllNotes', Authentication, noteController.getAllNotes);

router.get('/:id/getNote', Authentication, noteController.getNote);

router.post('/:id/addImage', Authentication, noteController.addImage);

router.post('/:id/:image_id/updateImage', Authentication, noteController.updateImage);

router.post('/:id/addParagraph', Authentication, noteController.addParagraph);

router.post('/:id/:element_id/editParagraph', Authentication, noteController.editParagraph);

router.post('/:id/addList', Authentication, noteController.addList);

router.post('/:id/:list_id/addListElement', Authentication, noteController.addListElement);

router.post('/:id/moveNoteElements', Authentication, noteController.moveNoteElements);

router.put('/shareNote', Authentication, noteController.shareNote);

router.get('/getSharedNotes',  noteController.getSharedNotes);

export { router };