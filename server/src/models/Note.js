import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    paragraphs: [{
        type: { type: String, default: 'paragraph' },
        content: { type: String },
        order: { type: Number, required: true }
    }],
    images: [{
        type: { type: String, default: 'image' },
        content: { type: String },
        order: { type: Number, required: true }
    }],
    lists: [{
        type: { type: String, default: 'list' },
        items: [{ content: { type: String } }],
        order: { type: Number, required: true }
    }],
    user: { type: String, required: true }
});

export default mongoose.model('Notes', NoteSchema);