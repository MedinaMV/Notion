import Note from '../models/Note.js'

const noteController = {};

noteController.createNote = async (req, res) => {
    try{
        const { user } = req.params;
        const { title } = req.body;
        if(!title) {
            res.status(400).json({ error: "No title found" });
        }
        const newNote = new Note({ title, user });
        await newNote.save();
        res.status(201).json({ message: 'Note inserted successfully!', _id: newNote.id });
    }catch(err){
        res.status(500).send({ message: err });
    }
};
// En tu archivo notes.controller.js
noteController.addAssociatedNote = async (req, res) => {
    const noteId = req.params.id;
    const associatedNoteId = req.params.associatedNoteId;

    if(!noteId || !associatedNoteId) {
        return res.status(400).send({ message: 'Both noteId and associatedNoteId are required' });
    }

    const note = await Note.findById(noteId);
    const associatedNote = await Note.findById(associatedNoteId);

    if(!note || !associatedNote) {
        return res.status(404).send({ message: 'Note not found' });
    }

    note.associatedNotes.push({items: associatedNoteId});
    await note.save();

    // Fetch the note again along with the associated notes
    const updatedNote = await Note.findById(noteId).populate('associatedNotes.items');

    res.status(200).send(updatedNote);
};
noteController.addImage = async (req, res) => {
    const noteId = req.params.id;
    if(!noteId) {
        res.status(400).send({ message: 'No note selected' })
    }
    const note = await Note.findById(noteId);

    note.images.push({});
    note.save();

    res.status(200).send({ ok: true, _id: note.images[note.images.length - 1]._id });
};

noteController.updateImage = async (req, res) => {
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
};

noteController.addParagraph = async (req, res) => {
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
};

noteController.addList = async (req, res) => {
    const noteId = req.params.id;
    if(!noteId) {
        res.status(400).send({ message: 'No note selected' });
    }else {
        const note = await Note.findById(noteId);
        note.lists.push({});
        await note.save();
        res.status(200).send({ message: 'List inserted successfully', _id: note.lists[note.lists.length - 1].id});
    }
};

noteController.addListElement = async (req, res) => {
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
};

noteController.editParagraph = async (req, res) => {
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
};

noteController.deleteNote = async (req, res) => {
    try {
       const Id = req.params.id;
       if (!Id) {
           return res.status(400).json({ message: 'No note ID provided' });
       }
       await Note.findByIdAndDelete(Id);
       res.status(200).json({ message: 'Note deleted successfully' });
   } catch (err) {
       res.status(500).json({ error: err.message });
   }
};

noteController.getAllNotes = async (req, res) => {
    try {
        const { user } = req.params;
        const allNotes = await Note.find({user: user}, '_id title');
        if (!allNotes || allNotes.length === 0) {
            return res.status(404).json({ message: 'No notes found' });
        }
        res.status(200).json({ notes: allNotes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

noteController.getNote = async (req, res) => {
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
};

export default noteController;