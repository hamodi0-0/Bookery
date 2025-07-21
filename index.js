import express from 'express';
import pg from 'pg';
import bodyParser from 'body-parser';
import axios from 'axios';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2"
import session from "express-session";
import env from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;
const saltRounds = 10;
env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
  db.connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res)=>{
  if (req.isAuthenticated()) {
    res.render("index.ejs");
  } else {
    res.redirect("/login");
  }
})

app.get("/view", async (req, res)=>{
  if (req.isAuthenticated()) {
    res.render("index.ejs", {
      modal : true,
      title : req.query.title,
      author : req.query.author,
      image : req.query.imgSrc
    })
  } else {
    res.redirect("/login");
  }
});

app.get("/reviews", async (req, res)=>{
  if (req.isAuthenticated()) {
    const result = await db.query(`SELECT * FROM reviews;`)
    const reviews = result.rows;
  res.render("reviews.ejs", {reviews});
  } else {
    res.redirect("/login");
  }
});

app.get("/delete", async (req, res)=>{
  if (req.isAuthenticated()) {
    const id = req.query.reviewId
  await db.query(`
    DELETE FROM reviews
    WHERE id = $1;
    `,[id])
  res.redirect("/reviews")
  } else {
    res.redirect("/login");
  }
  
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect("/");
  });
});


/////// AUTHENTICATION /////////

app.get("/auth/google",
  passport.authenticate("google", {
    scope : ["profile", "email"]
  })
);

app.get(
  "/auth/google/callback", 
  passport.authenticate("google", {
  successRedirect : "/",
  failureRedirect : "/login"
})
);


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



passport.use("google", new GoogleStrategy({
  clientID : process.env.GOOGLE_CLIENT_ID,
  clientSecret : process.env.GOOGLE_CLIENT_SECRET,
  callbackURL : process.env.GOOGLE_CALLBACK_URL,
  userProfileURL : "https://www.googleapis.com/oauth2/v3/userinfo"
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    console.log(profile);
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      profile.email,
    ]);
    if (result.rows.length === 0) {
      const newUser = await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
        [profile.email, "google"]
      );
      return cb(null, newUser.rows[0]);
    } else {
      return cb(null, result.rows[0]);
    }
  } catch (err) {
    return cb(err);
  }

})
);

passport.serializeUser((user, cb) => {
  cb(null, user.id); 
});

passport.deserializeUser(async (id, cb) => {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  cb(null, result.rows[0]);
});

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}...`)
})