import { mongoose } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.ATLAS_URI;

export default function connectDB() {
  mongoose.connect(url)
    .then(() => console.log('Database is connected'))
    .catch(err => console.log(err))
  return;
}