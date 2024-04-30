import Collection from "../models/Collection.js";
import Note from "../models/Note.js";

const collectionController = {};

collectionController.createCollection = async (req, res) => {
    const { name } = req.body;
    const { userId } = req.cookies;
    if(!name || !userId) {
        res.status(400).send({ok: false, message: 'Bad Request'});
        return;
    }
    const newCollection = new Collection({name: name,user: userId});
    await newCollection.save();
    return res.status(201).send({ ok: true, _id: newCollection.id });
};

collectionController.deleteCollection = async (req, res) => {
    const { id } = req.params;
    try{
        if(!id) {
            return res.status(400).send({ok: false, message: 'Bad Request'});
        }
        await Collection.findByIdAndDelete(id);
        return res.status(202).send({ok: true})
    }catch(err){
        return res.status(500).json({ error: err.message });
    }
};

collectionController.getAllCollections = async (req, res) => {
    const { userId } = req.cookies;
    if(!userId) {
        return res.status(400).send({ok: false, message: 'Bad Request'});
    }
    const allCollections = await Collection.find({user: userId});
    if (!allCollections || allCollections.length === 0) {
        return res.status(404).json({ message: 'No collections found' });
    }
    return res.status(200).json({ collections: allCollections });
};

collectionController.collectionAddNote = async (req, res) => {
    const { noteId, collectionId } = req.params;

    if(!noteId || !collectionId){
        return res.status(400).send({ok: false, message: 'Bad Request'});
    } 

    const collection = await Collection.findById(collectionId);
    if(collection) {
        const note = await Note.findById(noteId);
        collection.notes.push({id: note.id, title: note.title});
        collection.save();
        return res.status(200).send({ok: true});
    }
    return res.status(403).send({ok: false, message: 'Forbidden!'});
};

collectionController.collectionDeleteNote = async (req, res) => {

};


collectionController.getNotesByCollection = async (req, res) => {
    const { id } = req.params;

    if(!id) {
        return res.status(400).send({ok: false, message: 'Bad Request'});
    }

    const collection = await Collection.findById(id);
    if(!collection) {
        return res.status(400).send({ok: false, message: 'No collection found'});
    }

    const allNotes = collection.notes;
    return res.status(200).send({ok: true, notes: allNotes});
};

/* TODO: Cristian
*
*  Añadir a la lista "shared" el id del usuario al que se le desea compartir la colección.
*  
*/
collectionController.shareCollection = async (req, res) => {
    const { collectionId, userId } = req.body;

    const collection = await Collection.findById(collectionId);
    if (!collection) {
        return res.status(404).send({ ok: false, message: 'Collection not found' });
    }

    if (!collection.shared.includes(userId)) {
        collection.shared.push({ user: userId });        
        await collection.save();
    }

    return res.status(200).send({ ok: true, message: 'Collection shared successfully' });
};

/* TODO: Cristian
*
*  Devolver todas las colecciones que hayan sido compartidas con el usuario indicado.
*  
*/
collectionController.getSharedCollections = async (req, res) => {
    const { userId } = req.cookies;
    const { friend } = req.body;

    const sharedCollections = await Collection.find({ 'shared.user': userId, 'user': friend });
    if (!sharedCollections || sharedCollections.length === 0) {
        return res.status(404).send({ok: false, message: 'No shared collections found'});
    }

    return res.status(200).send({ok: true, collections: sharedCollections});
};


export default collectionController;