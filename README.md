# AuthKit — Full Stack Authentication System

> A production-style signup/login system with bcrypt password security and JWT token authentication.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-%23000000?style=flat)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

## What this is

A web app where users can register, log in, and access a protected profile page. Passwords are hashed with bcrypt before saving to the database. Authentication is handled via JWT tokens stored in the browser.

## Tech Stack

| Layer    | Technology                                         |
| -------- | -------------------------------------------------- |
| Frontend | React (Vite), Tailwind CSS, React Router v6, Axios |
| Backend  | Node.js, Express.js                                |
| Database | MongoDB with Mongoose                              |
| Auth     | bcrypt (hashing), jsonwebtoken (JWT)               |

## Local Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET
npm run dev
# Server runs on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

> If you want to override the API URL for the frontend, create `frontend/.env` and add `VITE_API_URL=http://localhost:5000/api/auth`.

## Environment Variables

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/authkit
JWT_SECRET=replace_this_with_a_long_random_string
```

- `PORT`: port where the backend listens (default 5000).
- `MONGO_URI`: connection string for MongoDB (local or Atlas).
- `JWT_SECRET`: secret used to sign JWT tokens — keep it safe.

## API Reference

| Method | Endpoint           | Auth         | Body                                       | Response                                    |
| ------ | ------------------ | ------------ | ------------------------------------------ | ------------------------------------------- |
| POST   | /api/auth/register | None         | `{name, email, password, confirmPassword}` | `{message: "User registered successfully"}` |
| POST   | /api/auth/login    | None         | `{email, password}`                        | `{message, token, user: {name, email}}`     |
| GET    | /api/auth/profile  | Bearer token | —                                          | `{message: "Welcome, Alex", user}`          |

Example curl — register:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex","email":"alex@example.com","password":"secret123","confirmPassword":"secret123"}'
```

Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"secret123"}'
```

Profile (replace <token>):

```bash
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/auth/profile
```

## How JWT Auth Works

- Login returns a token which the frontend stores in `localStorage` as `auth_token`.
- Protected routes include `Authorization: Bearer <token>` header on requests.
- Backend middleware decodes the token using `jwt.verify()` and attaches the user ID to the request.
- If the token is missing or invalid, the backend responds with `401 Unauthorized`.

## Database Schema

```js
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  createdAt: Date (default: now)
}
```

## Folder Structure

```
auth-project/
├── backend/
│   ├── server.js
│   ├── routes/auth.js
│   ├── middleware/authMiddleware.js
│   ├── models/User.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       │   └── ProtectedRoute.jsx
│       └── pages/
│           ├── Auth.jsx
│           └── Profile.jsx
├── .gitignore
└── README.md
```

## License

MIT
