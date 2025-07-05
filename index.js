import express from 'express';
import pg from 'pg';
import bodyParser from 'body-parser';
 

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


app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}...`)
})