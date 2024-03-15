import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    paragraphs: [{
        content: { type: String },
        creation_time: { type: Date, default: Date.now }
    }],
    images: [{
        content: { type: String },
        creation_time: { type: Date, default: Date.now}
    }],
    lists: [{
        items: [{ type: String }],
        creation_time: { type: Date, default: Date.now }
    }]
});

export default mongoose.model('Notes', noteSchema);