# Book Review Web App

A Node.js web application where users can search for books, write reviews, and view their own submissions. Authenticated using Google OAuth and PostgreSQL as the database.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/book-review-app.git
cd book-review-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up PostgreSQL

Create a database and a `users` table:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT
);
```

Create a `reviews` table with user-specific association:

```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  review TEXT,
  stars INTEGER,
  cover_link TEXT,
  author TEXT,
  title TEXT,
  email VARCHAR(100)
);
```

### 4. Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PG_USER=your_pg_user
PG_HOST=your_pg_host
PG_DATABASE=your_database_name
PG_PASSWORD=your_pg_password
PG_PORT=5432

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

SESSION_SECRET=your_secret_key
```

> You must set these variables to use the app securely with PostgreSQL and Google OAuth.

### 5. Run the app

```bash
nodemon index.js
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Authentication

- Users log in using **Google OAuth 2.0**
- Upon login, their Google email is stored in the `users` table
- Sessions are maintained using `express-session` and `passport`

---

## Features

- Google OAuth login flow
- Authenticated users can:
  - Search books using the Open Library API
  - Add reviews (title, author, rating, review text)
  - View and delete **their own reviews**

---

## User-Specific Data

All reviews are filtered by the logged-in user's email. A user can **only see or delete their own reviews**.

---

## Dependencies

- express
- pg (PostgreSQL)
- passport
- passport-google-oauth2
- express-session
- dotenv
- axios
- ejs
- body-parser

---
