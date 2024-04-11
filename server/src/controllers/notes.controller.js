import Note from '../models/Note.js'
import Collection from '../models/Collection.js';

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

noteController.addImage = async (req, res) => {
    const { id } = req.params;
    if(!id) {
        res.status(400).send({ message: 'No note selected' })
    }
    const note = await Note.findById(id);
    const length  = note.paragraphs.length + note.images.length + note.lists.length;
    note.images.push({order: length+1});
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
    const { id } = req.params;
    if(!id) {
        res.status(400).send({ message: 'No note selected' });
    }else {
        const note = await Note.findById(id);
        const length  = note.paragraphs.length + note.images.length + note.lists.length;
        note.paragraphs.push({content: '', order: length+1});
        await note.save();
        const lastParagraph = note.paragraphs[note.paragraphs.length-1];
        res.status(200).send({ message: 'Paragraph inserted correctly', _id: lastParagraph.id});
    }
};

noteController.addList = async (req, res) => {
    const { id } = req.params;
    if(!id) {
        res.status(400).send({ message: 'No note selected' });
    }else {
        const note = await Note.findById(id);
        const length  = note.paragraphs.length + note.images.length + note.lists.length;
        note.lists.push({content: [], order: length+1});
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
       const collections = await Collection.find({
        'notes': {
          $elemMatch: {
            id: Id
          }
        }
      });

      collections.forEach(async (element) => {
        await Collection.updateOne(
            { _id: element.id },
            { $pull: { notes: { id: Id } } }
        );
      })
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

        const sortedElements = allElements.sort((a, b) => b.order - a.order).reverse();

        res.status(200).json({ elements: sortedElements });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

noteController.moveNoteElements = async (req, res) => {
    const { id } = req.params;
    const { sourceId, destinationId, sourceType, destinationType } = req.body;

    if(!id || !sourceId || !destinationId || !sourceType || !destinationType) {
        res.status(400).send({ok: false, message: 'Bad request'});
        return;
    }

    const note = await Note.findById(id);

    let sourceElement;
    if(sourceType === 'paragraph'){
        sourceElement = searchParagraphs(note,sourceId); 
    } else if(sourceType === 'image') {
        sourceElement = searchImages(note,sourceId); 
    }else {
        sourceElement = searchList(note,sourceId); 
    };

    let destinationElement;
    if(destinationType === 'paragraph'){
        destinationElement = searchParagraphs(note,destinationId); 
    } else if(destinationType === 'image') {
        destinationElement = searchImages(note,destinationId); 
    }else {
        destinationElement = searchList(note,destinationId); 
    };

    const one = sourceElement.order;
    sourceElement.order = destinationElement.order;
    destinationElement.order = one;

    if (sourceElement.type === "paragraph") {
        note.paragraphs.push(sourceElement);
    } else if (sourceElement.type === 'image') {
        note.images.push(sourceElement);
    } else if (sourceElement.type === 'list') { 
        note.lists.push(sourceElement);
    }

    if (destinationElement.type === "paragraph") {
        note.paragraphs.push(destinationElement);
    } else if (destinationElement.type === 'image') {
        note.images.push(destinationElement);
    } else if (destinationElement.type === 'list') { 
        note.lists.push(destinationElement);
    }
    await note.save();
    
    res.status(200).send({ok: true, message: 'All ok'});
}

function searchParagraphs(note, id) {
    return note.paragraphs.find((element) => {
        if(element.id === id) {
            note.paragraphs.splice(note.paragraphs.indexOf(element),1);
            console.log(`\n\nsearch Para: ${element}`);
            return element;
        }
    });
}

function searchImages(note, id) {
    return note.images.find((element) => {
        if(element.id === id ) {
            note.images.splice(note.images.indexOf(element),1);
            console.log(`\n\nsearch img: ${element}`);
            return element;
        }
    });
}

function searchList(note, id) {
    return note.lists.find((element) => {
        if(element.id === id) {
            note.lists.splice(note.lists.indexOf(element),1);
            console.log(`\n\nsearch list: ${element}`);
            return element;
        }
    });
}

export default noteController;