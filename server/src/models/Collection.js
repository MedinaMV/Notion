import mongoose from 'mongoose';

const CollectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    notes: [{
        id: { type: String },
        title: { type: String }
    }],
    user: { type: String, required: true },
    shared: [{
        user: { type: String, required: true },
    }]
});

export default mongoose.model('Collection', CollectionSchema);