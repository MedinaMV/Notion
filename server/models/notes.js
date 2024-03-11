import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    paragraphs: [{ type: String }],
    images: [{ type: String }]
});

export default mongoose.model('Notes', noteSchema);