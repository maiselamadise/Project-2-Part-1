# Project 2 Part 1 - Library API

A REST API for managing a library's **books** and **authors**, built with Node.js, Express, and MongoDB (Mongoose).

- **Live API base URL:** `https://YOUR-RENDER-APP.onrender.com` *(replace after deploying to Render)*
- **GitHub repo:** *(add your repo link here)*

## Tech Stack
- Node.js / Express
- MongoDB Atlas + Mongoose
- express-validator (validation)
- CORS enabled

## Data Model

### Author (`/api/authors`)
| Field       | Type     | Required | Notes                          |
|-------------|----------|----------|---------------------------------|
| name        | String   | Yes      | Author's full name              |
| bio         | String   | No       | Short biography                 |
| birthYear   | Number   | No       | 1000–current year               |
| nationality | String   | No       |                                  |
| website     | String   | No       | Must be a valid URL if provided |

### Book (`/api/books`)
| Field         | Type     | Required | Notes                                         |
|---------------|----------|----------|------------------------------------------------|
| title         | String   | Yes      |                                                  |
| author        | ObjectId | Yes      | Must reference an existing Author's `_id`       |
| isbn          | String   | Yes      | Must be unique                                  |
| genre         | String   | Yes      |                                                  |
| publishedYear | Number   | Yes      | 1000–current year                               |
| pages         | Number   | Yes      | Must be ≥ 1                                     |
| rating        | Number   | No       | 0–5, defaults to 0                              |
| description   | String   | No       |                                                  |
| inStock       | Boolean  | No       | Defaults to true                                |

Both models automatically include `createdAt` and `updatedAt` timestamps.

## Setup (Local Development)

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your own MongoDB Atlas connection string:
   ```bash
   cp .env.example .env
   ```
3. Run the server:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3000`.

**Note:** `.env` is included in `.gitignore` and must never be committed. When deploying, add `MONGO_URI` and `PORT` as environment variables in the Render dashboard instead.

## Endpoints

### Authors

| Method | Endpoint            | Description             |
|--------|----------------------|--------------------------|
| GET    | `/api/authors`       | Get all authors          |
| GET    | `/api/authors/:id`   | Get a single author      |
| POST   | `/api/authors`       | Create a new author      |
| PUT    | `/api/authors/:id`   | Update an existing author|
| DELETE | `/api/authors/:id`   | Delete an author         |

**POST /api/authors** — Request body:
```json
{
  "name": "George Orwell",
  "bio": "English novelist and essayist.",
  "birthYear": 1903,
  "nationality": "British",
  "website": "https://www.orwellfoundation.com"
}
```

**Success response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "66f0c2a1e4b0a1a2b3c4d5e6",
    "name": "George Orwell",
    "bio": "English novelist and essayist.",
    "birthYear": 1903,
    "nationality": "British",
    "website": "https://www.orwellfoundation.com",
    "createdAt": "2026-09-22T10:00:00.000Z",
    "updatedAt": "2026-09-22T10:00:00.000Z"
  }
}
```

### Books

| Method | Endpoint           | Description                          |
|--------|----------------------|---------------------------------------|
| GET    | `/api/books`        | Get all books (author info populated) |
| GET    | `/api/books/:id`    | Get a single book                     |
| POST   | `/api/books`        | Create a new book                     |
| PUT    | `/api/books/:id`    | Update an existing book               |
| DELETE | `/api/books/:id`    | Delete a book                         |

**POST /api/books** — Request body:
```json
{
  "title": "1984",
  "author": "66f0c2a1e4b0a1a2b3c4d5e6",
  "isbn": "978-0-452-28423-4",
  "genre": "Dystopian Fiction",
  "publishedYear": 1949,
  "pages": 328,
  "rating": 4.8,
  "description": "A dystopian social science fiction novel.",
  "inStock": true
}
```

**Success response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "66f0c3b2e4b0a1a2b3c4d5e7",
    "title": "1984",
    "author": "66f0c2a1e4b0a1a2b3c4d5e6",
    "isbn": "978-0-452-28423-4",
    "genre": "Dystopian Fiction",
    "publishedYear": 1949,
    "pages": 328,
    "rating": 4.8,
    "description": "A dystopian social science fiction novel.",
    "inStock": true,
    "createdAt": "2026-09-22T10:05:00.000Z",
    "updatedAt": "2026-09-22T10:05:00.000Z"
  }
}
```

**PUT /api/books/:id** — Request body (any subset of fields):
```json
{
  "rating": 4.9,
  "inStock": false
}
```

**DELETE /api/books/:id** — Success response (200):
```json
{
  "success": true,
  "message": "Book deleted",
  "data": { "_id": "66f0c3b2e4b0a1a2b3c4d5e7", "title": "1984", "...": "..." }
}
```

## Validation & Error Handling

- All required fields are validated with `express-validator` before hitting the database.
- IDs in the URL are validated as proper MongoDB ObjectIds.
- Creating/updating a book confirms the referenced `author` ID actually exists.
- Mongoose-level validation (field types, min/max, required) provides a second layer of protection.
- All errors are funneled through a centralized error handler and returned as JSON:
  ```json
  { "success": false, "message": "Descriptive error message" }
  ```

**Example error responses:**

| Scenario                          | Status | Message                                              |
|------------------------------------|--------|-------------------------------------------------------|
| Missing required field             | 400    | "Title is required"                                   |
| Invalid ObjectId in URL             | 400    | "Invalid ID format"                                   |
| Duplicate ISBN                      | 400    | "Duplicate value for field \"isbn\": ... already exists" |
| Book/Author not found               | 404    | "Book not found" / "Author not found"                 |
| Unknown route                       | 404    | "Route not found - /api/xyz"                          |

## Testing the API

All routes were tested with Postman / Thunder Client:
1. Create an author (`POST /api/authors`), copy the returned `_id`.
2. Create a book (`POST /api/books`) using that author `_id`.
3. Fetch all books (`GET /api/books`) and confirm the author is populated.
4. Update the book (`PUT /api/books/:id`).
5. Delete the book (`DELETE /api/books/:id`) and confirm it's gone via `GET /api/books`.

## Deployment

- Hosted on **Render** as a Web Service.
- Environment variables (`MONGO_URI`) are configured in the Render dashboard, not committed to source control.
- MongoDB database is hosted on MongoDB Atlas.
