import express from "express";
import dotnev from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import { router as notesRouter } from './routes/notes.routes.js'
import { router as userRouter } from './routes/user.routes.js'

const app = express();
dotnev.config();

// Settings
app.set('port', process.env.PORT || 8080)
app.use(cors({ credentials: true, origin: true, }));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(express.json());

// Routes
app.use('/notes', notesRouter);
app.use('/user', userRouter);

export default app;