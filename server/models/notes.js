import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    paragraphs: [{
        type: { type: String, default: 'paragraph' },
        content: { type: String },
        creation_time: { type: Date, default: Date.now }
    }],
    images: [{
        type: { type: String, default: 'image' },
        content: { type: String },
        creation_time: { type: Date, default: Date.now}
    }],
    lists: [{
        type: { type: String, default: 'list' },
        items: [{ content: { type: String } }],
        creation_time: { type: Date, default: Date.now }
    }]
});

export default mongoose.model('Notes', noteSchema);