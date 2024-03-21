import express from "express";
import dotnev from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import { router as notesRouter } from './routes/notes.js'

const app = express();

app.use(cors({
    credentials: true,
    origin: true,
}));

app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(express.json());
app.use('/notes', notesRouter)

dotnev.config();

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log("Server is running on port", server.address().port));