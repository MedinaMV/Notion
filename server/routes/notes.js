import express from 'express';
import Note from '../models/notes.js'
import connectDB from "../database.js";
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const router = express.Router();
connectDB();

/*  
 *
    Method to create a Note. 
    In order to create a Note is mandatory to have a Title.
 *
 */
router.post('/create', async (req, res) => {
    try{
        const { title } = req.body;
        if(!title) {
            res.status(400).json({ error: "No title found" });
        }
        const newNote = new Note({ title });
        await newNote.save();
    }catch(err){
        res.status(500).send({ message: err });
    }
    res.status(201).send({ message: 'Note inserted succefully!' });
});

/*  
 *
    Method for adding an Image to an existing Note. 
    It's necesary to obtain the ID of the Note from the request and search it on the Database.
 *
 */
router.post('/addImage', async (req, res) => {
    const noteId = req.body.noteId;
    if(!noteId) {
        res.status(400).send({ message: 'No note selected' })
    }
    const note = await Note.findById(noteId);
    const { image } = req.files;
    if(!image) {
        res.status(400).send({ message: 'No image attached!' })
    }
    const destinationPath = path.join(__dirname, '..', 'upload', image.name)
    image.mv(destinationPath);
    note.images.push(destinationPath);
    await note.save();
    res.status(200).send();
});

/*  
 *
    Method for adding a Paragraph to an existing Note. 
    It's necesary to obtain the ID of the Note from the request and search it on the Database.
 *
 */
router.post('/addParagraph', async (req, res) => {
    const noteId = req.body.noteId;
    if(!noteId) {
        res.status(400).send({ message: 'No note selected' })
    }
    const note = await Note.findById(noteId);
    const paragraph = req.body.paragraph;
    if(!paragraph){
        res.status(400).send({ message: 'No paragraph received' })
    }
    note.paragraphs.push(paragraph)
    await note.save();
    res.status(200).send();
});

/*  
 *
    Method for updating a Note.
    It's necesary to obtain the ID of the Note from the request and search it on the Database.
    TODO Alejandro.
 *
 */
router.get('/updateNote', (req, res) => {

});

/*  
 *
    Method for deleting a Note.
    It's necesary to obtain the ID of the Note from the request and search it on the Database.
    TODO Cristian.
 *
 */
router.get('/deleteNote', (req, res) => {

});

/*  
 *
    Method for listing all Notes.
    TODO Cristian.
 *
 */
router.get('/getAll', (req, res) => {

});

/*  
 *
    Method for list a especific Note.
    TODO Cristian.
 *
 */
router.get('/getNote', (req, res) => {

});

export { router };