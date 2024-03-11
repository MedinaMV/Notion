//import { MongoClient } from "mongodb";
import { mongoose } from "mongoose"
import * as dotenv from 'dotenv';

// RAW QUERIES (e.g. `node createDatabase.js`)
//dotenv.config({path: '../.env'});
// SERVER (e.g. `node app.js`)
dotenv.config();

export default function connectDB() {
  const url = process.env.ATLAS_URI;
 
  try {
    mongoose.connect(url);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  return;
}