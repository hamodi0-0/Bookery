import express from 'express';
import pg from 'pg';
import bodyParser from 'body-parser';
import axios from 'axios';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

const db = new pg.Client({
    user : 'postgres',
    host : 'localhost',
    database : 'bookery',
    password : 'hamodi750',
    port : 5432
  });

  db.connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res)=>{
    res.render("index.ejs");
})

app.post("/search", async (req, res) => {
    const text = req.body.text?.toLowerCase().split(" ").join("+");
  
    if (!text) return res.status(400).json({ error: "No search input provided" });
  
    try {
      const result = await axios.get(`https://openlibrary.org/search.json?q=${text}`);
      const suggestions = result.data.docs.slice(0, 5);
  
      res.json({ suggestions }); // JSON response for frontend
    } catch (err) {
      console.error("Search error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
  });
  

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}...`)
})