import express from 'express';
import Note from '../models/notes.js'
import connectDB from "../database.js";

const router = express.Router();
connectDB();

/*  
 *
    Method to create a Note. 
    In order to create a Note is mandatory to have a Title.
    It must return the ID of the new Note.
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
        res.status(201).json({ message: 'Note inserted successfully!', _id: newNote.id });
    }catch(err){
        res.status(500).send({ message: err });
    }
});

/*  
 *
    Method for adding an Image to an existing Note. 
    It's necesary to obtain the ID of the Note from the request and search it on the Database.
 *
 */
router.post('/:id/addImage', async (req, res) => {
    const noteId = req.params.id;
    if(!noteId) {
        res.status(400).send({ message: 'No note selected' })
    }
    const note = await Note.findById(noteId);

    note.images.push({});
    note.save();

    res.status(200).send({ ok: true, _id: note.images[note.images.length - 1]._id });
});

router.post('/:id/:image_id/updateImage', async (req, res) => {
    const noteId = req.params.id;
    if(!noteId) {
        res.status(400).send({ message: 'No note selected' });
    }else {
        const note = await Note.findById(noteId);
        const { image } = req.files;
        const imageId = req.params.image_id;
        if(!image || !imageId) {
            res.status(400).send({ message: 'No image attached!' })
        }

        var formdata = new FormData();
        const blob = new Blob([image.data]);
        formdata.append("image", blob, image.name);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        const request = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.BB_KEY}`, requestOptions);
        const response = await request.json();

        note.images.map(element => {
            if(element.id === imageId){
                element.content = response.data.image.url;
            }
        })
        note.save();

        res.status(200).send({ ok: true, url: response.data.image.url });
    }
});

/*  
 *
    Method for adding a Paragraph to an existing Note. 
    It's necesary to obtain the ID of the Note from the request and search it on the Database.
 *
 */
router.post('/:id/addParagraph', async (req, res) => {
    const noteId = req.params.id;
    if(!noteId) {
        res.status(400).send({ message: 'No note selected' });
    }else {
        const note = await Note.findById(noteId);
        note.paragraphs.push({content: ''});
        await note.save();
        const lastParagraph = note.paragraphs.reduce((elementGreaterTimestamp, actualElement) => {
            if (actualElement.creation_time > elementGreaterTimestamp.creation_time) {
                return actualElement;
            } else {
                return elementGreaterTimestamp;
            }
        });
        res.status(200).send({ message: 'Paragraph inserted correctly', _id: lastParagraph.id});
    }
});

/*
 *
    Method for adding a list to a specific Note.
 *
*/
router.post('/:id/addList', async (req, res) => {
    const noteId = req.params.id;
    if(!noteId) {
        res.status(400).send({ message: 'No note selected' });
    }else {
        const note = await Note.findById(noteId);
        note.lists.push({});
        await note.save();
        res.status(200).send({ message: 'List inserted successfully', _id: note.lists[note.lists.length - 1].id});
    }
});

/*
 *
    Method for adding a element to a list of a specific Note.
 *
*/
router.post('/:id/:list_id/addListElement', async (req, res) => {
    const noteId = req.params.id;
    const listId = req.params.list_id;
    if(!noteId) {
        res.status(400).send({ message: 'No note selected' });
    }
    if(!req.body.element) {
        res.status(400).send({ message: 'No element sent!' });
    }
    const { element } = req.body;
    const note = await Note.findById(noteId);
    note.lists.find((list) => list.id === listId).items.push({content: element});
    await note.save();
    res.status(200).send({ message: 'Element inserted successfully to the list' });
});

/*
 *
    Method for updating an existing paragraph of a specific Note.
 *
*/
router.post('/:id/:element_id/editParagraph', async (req, res) => {
    const noteId = req.params.id;
    const element_id = req.params.element_id;
    const { paragraph } = req.body;
    if(!noteId || !element_id) {
        res.status(400).send({ message: 'No note or paragraph selected' });
    }else {
        const note = await Note.findById(noteId);
        note.paragraphs.map(element => {
            if(element.id === element_id){
                element.content = paragraph;
            }
        });
        note.save();
        res.status(200).send({message: 'Paragraph updated correctly'});
    }
});

/*  
 *
    Method for deleting a Note.
    It's necesary to obtain the ID of the Note from the request and search it on the Database.
    TODO Cristian.
 *
 */
router.delete('/:id/delete', async (req, res) => {
     try {
        const Id = req.params.id;
        if (!Id) {
            return res.status(400).json({ message: 'No note ID provided' });
        }
        const note = await Note.findById(Id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        await note.deleteOne();
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/*  
 *
    Method for listing all Notes.
    TODO Cristian.
 *
 */
    router.get('/getAll', async (req, res) => {
        try {
            const allNotes = await Note.find({}, '_id title');
            if (!allNotes || allNotes.length === 0) {
                return res.status(404).json({ message: 'No notes found' });
            }
            res.status(200).json({ notes: allNotes });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

/*  
 *
    Method for list a especific Note.
    TODO Cristian.
 *
 */
    router.get('/:id/getNote', async (req, res) => {
        try {
            const noteId = req.params.id;
            const note = await Note.findById(noteId);
            if (!note) {
                return res.status(404).json({ message: 'Note not found' });
            }
    
            const allElements = [
                ...note.paragraphs.map(paragraph => ({ ...paragraph._doc })),
                ...note.images.map(image => ({ ...image._doc })),
                ...note.lists.map(list => ({ ...list._doc }))
            ];
    
            const sortedElements = allElements.sort((a, b) => b.creation_time - a.creation_time).reverse();
    
            res.status(200).json({ elements: sortedElements });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

export { router };