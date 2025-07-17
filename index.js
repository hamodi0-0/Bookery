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

const reviews = [];

app.get("/", (req, res)=>{
    res.render("index.ejs");
})

app.post("/search", async (req, res) => {
    const text = req.body.text?.toLowerCase().split(" ").join("+");
    
    if (!text) return res.status(400).json({ error: "No search input provided" });
    
    try {
      const result = await axios.get(`https://openlibrary.org/search.json?q=${text}&limit=5`);
      const suggestions = result.data.docs.slice(0, 5);
      // console.log(suggestions)

      res.json({ suggestions }); // JSON response for frontend
    } catch (err) {
      console.error("Search error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
  });
  
  app.get("/view", async (req, res)=>{
    res.render("index.ejs", {
      modal : true,
      title : req.query.title,
      author : req.query.author,
      image : req.query.imgSrc
    })

  });

  app.post("/add", async (req, res)=>{
    const {review, rating, image, author, title} = req.body;
    await db.query(`
      INSERT INTO reviews
      (review, stars, cover_link, author, title)
      VALUES($1, $2, $3, $4, $5);
      `,
      [review, rating,  image.split('L').join('M'), author, title]
    );

    res.redirect("/reviews");
  })

  app.get("/reviews", async (req, res)=>{
    const result = await db.query(`SELECT * FROM reviews;`)
    const reviews = result.rows;
    res.render("reviews.ejs", {reviews});
  });

  app.get("/delete", async (req, res)=>{
    const id = req.query.reviewId
    await db.query(`
      DELETE FROM reviews
      WHERE id = $1;
      `,[id])
    res.redirect("/reviews")
  })
  

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}...`)
})