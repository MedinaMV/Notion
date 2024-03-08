import express from 'express';
import db from '../database.js'

const router = express.Router();

router.post('/create', (req,res) => {
    var obj = { user: "user_example", text: "Hello, I'm testing" };
    db.collection("Notes").insertOne(obj, function(err, res) {
        if(err){
            res.status(500).json({ error: err.message });
        }else {
            res.status(201).json({ message: "Note inserted!" });
            res.end('Note inserted!')
        }
    });
});

export { router };