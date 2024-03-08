import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv';

// RAW QUERIES (e.g. `node createDatabase.js`)
//dotenv.config({path: '../.env'});
// SERVER (e.g. `node app.js`)
dotenv.config();

const connectionString = process.env.ATLAS_URI;
const client = new MongoClient(connectionString);
let conn;
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}
let db = conn.db("Notion");
export default db;