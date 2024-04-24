import express from "express";
import dotnev from "dotenv";
import cors from "cors";
import session from 'express-session';
import connectMongo from 'connect-mongodb-session';
import fileUpload from "express-fileupload";
import { router as notesRouter } from './routes/notes.routes.js';
import { router as userRouter } from './routes/user.routes.js';
import { router as collectionRouter } from './routes/collection.routes.js';

const app = express();
dotnev.config();

//app.set("trust proxy", 1);

// Settings
app.set('port', process.env.PORT || 8080)
app.use(cors({ credentials: true, origin: true, }));

const mongoDBStore = connectMongo(session);

const store = new mongoDBStore({
    uri: process.env.ATLAS_URI,
    collection: 'sessions'
});

store.on('error', function (error) {
    console.log(error);
});

// Middlewares
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {
        secure: false, // In production, ALWAYS TRUE
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: false,
    saveUninitialized: false
}));

app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(express.json());

// Routes
app.use('/notes', notesRouter);
app.use('/user', userRouter);
app.use('/collection', collectionRouter);

export default app;