import express from 'express';
import pg from 'pg';
import bodyParser from 'body-parser';
import axios from 'axios';
 

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


app.get("/", (req, res)=>{
    res.render("index.ejs");
})

app.post("/search", async (req, res)=>{
    const searchText = req.body.search;

    // formatting the request to create an appropriate link 
    const searchQuery = searchText.toLowerCase().split(' ').join('+');
    console.log(searchQuery);

    // fetching book data
    const result = await axios.get(`https://openlibrary.org/search.json?q=${searchQuery}`);

    // console.log(result.data.docs[0])

    // generating image url
    const imageId = result.data.docs[0].cover_i
    const imageUrl = `https://covers.openlibrary.org/b/id/${imageId}-L.jpg`
    // console.log(imageUrl)

    res.render("index.ejs", {
        data : true,
        imageUrl,
    });
})

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}...`)
})