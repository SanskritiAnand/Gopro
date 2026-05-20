# WHAT I BUILT

## What did I build?

I built a polished authentication app called AuthKit. It lets users create an account, log in with email and password, and access a protected profile page that only works when they are signed in.

## Why does any website need a login system?

A login system keeps private information safe. It makes sure people can only see their own account and not someone else’s data.

## How does registration work? (Step by step, no code)

[You fill form] → [Browser checks fields] → [Sent to server] → [Password scrambled] → [Saved in database]

1. The user fills out the form with name, email, password, and confirm password.
2. The browser checks that fields are filled, email looks valid, password is strong enough, and passwords match.
3. The app sends the data to the backend server.
4. The server scrambles the password using bcrypt so it is not stored as plain text.
5. The server saves the user record to MongoDB.

## How does login work?

[Enter email + password] → [Server checks account] → [Password check] → [Token issued] → [Stored in browser]

1. The user enters their email and password and clicks continue.
2. The backend finds the user account by email.
3. The server compares the entered password with the hashed password.
4. If it matches, the server gives the browser a JWT token.
5. The browser stores the token and uses it to access the protected profile page.

## What is bcrypt? (Explain like I'm 12)

bcrypt is like a special shredder for passwords. When you type a password, the app shreds it and saves only the shredded version. Later, when you log in, your password is shredded again and compared to the saved shredded version. If they match, you get in.

## What is a JWT token? (Explain like I'm 12)

A JWT token is like a wristband at a concert. Once you sign in, the website gives you a wristband. Every time you visit a protected page, the site checks your wristband instead of asking you to log in again.

## What is MongoDB?

MongoDB is a database system that stores information like user accounts in a flexible way. It works like a filing cabinet where each user gets a document with name, email, and hashed password.

## What does the backend do?

The backend is the part that handles the data safely. It receives requests from the website, checks the information, hashes passwords, creates JWT tokens, and only lets requests through if the user is authenticated.

## What I learned building this

- How to keep passwords safe by hashing them with bcrypt
- How token-based authentication works with JWT
- How to connect a React frontend to a Node.js backend
- How to protect pages so only signed-in users can access them
- How to validate data on both the frontend and backend
- How to organize a full stack project into separate frontend and backend folders
