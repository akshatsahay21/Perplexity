# Perplexity-Inspired AI Search Chat App

A full-stack AI search and chat application inspired by Perplexity. It combines authentication, persistent conversations, AI-generated responses, internet search, and a polished chat interface into one MERN-style project.

> This is an independent learning project and is not affiliated with Perplexity.
> LIVE LINK -
> https://perplexity-pied.vercel.app/login

## Screenshots

### Dashboard


<img width="1919" height="906" alt="Screenshot 2026-05-09 012820" src="https://github.com/user-attachments/assets/8a3c9638-3122-4fcc-8e06-e556900272ee" />


### AI Response View


<img width="1914" height="896" alt="Screenshot 2026-05-09 012845" src="https://github.com/user-attachments/assets/5db72adf-086e-4840-bf50-c3093e79ba93" />


### Demo Login


<img width="1887" height="889" alt="Screenshot 2026-05-09 012935" src="https://github.com/user-attachments/assets/ef1008d2-8201-4de0-ac90-350044c4956c" />


## Features

- User registration with email verification
- Login with JWT cookie-based authentication
- Protected dashboard route for authenticated users
- Demo credentials displayed on the login page for deployed previews
- Persistent user-specific chat history
- AI-generated chat titles for new conversations
- AI responses rendered with Markdown support
- Internet search integration for up-to-date answers
- Conversation history sidebar
- Open previous chats and load saved messages
- Delete chats from both frontend state and MongoDB
- Logout flow that clears the server-side auth cookie
- Responsive dark themed chat UI
- Theme toggle with local preference storage
- Socket.IO setup for realtime capabilities
- Configurable frontend and backend URLs for local development and deployment

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, Redux Toolkit, React Router, Axios, Tailwind CSS |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Authentication | JWT, HTTP-only cookies, bcryptjs |
| AI | LangChain, Mistral AI |
| Search | Tavily Search API |
| Email | Nodemailer with Gmail OAuth2 |
| Realtime | Socket.IO |

## Project Structure

```text
Perplexity/
  Backend/
    server.js
    src/
      app.js
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      sockets/
      validators/
  Frontend/
    src/
      app/
      features/
        auth/
        chat/
```

## Core Flow

1. A user registers with username, email, and password.
2. The backend sends an email verification link.
3. After verification, the user can log in.
4. The backend stores a JWT in an HTTP-only cookie.
5. The frontend restores the session with `/api/auth/get-me`.
6. The user sends a chat message.
7. The backend saves the user message, generates an AI response, saves it, and returns it.
8. The frontend displays the conversation and keeps chat history available in the sidebar.

## API Routes

### Auth

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/get-me
GET  /api/auth/verify-email
```

### Chats

```text
GET    /api/chats
POST   /api/chats/message
GET    /api/chats/:chatId/messages
DELETE /api/chats/delete/:chatId
```

## Local Setup

### Backend

```bash
cd Backend
npm install
npm run dev
```

Create a `Backend/.env` file with:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
MISTRAL_API_KEY=your_mistral_api_key
TAVILY_API_KEY=your_tavily_api_key
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_USER=your_google_email
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Optional `Frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Demo Account

The login page includes demo credentials for deployed previews:

```text
Email: akshatsahay353@gmail.com
Password: 123456
```

Make sure this user exists and is verified in the deployed database.

## Deployment Notes

- Set `FRONTEND_URL` to your deployed frontend URL.
- Set `BACKEND_URL` to your deployed backend URL.
- Set `VITE_API_URL` to your deployed backend URL.
- Keep `.env` files out of GitHub.
- Use secure cookies in production.
- Make sure the demo user is created and verified in production.

## What I Learned

This project helped me understand how frontend state, backend APIs, authentication, database models, email verification, and LLM tool-calling work together in a full-stack AI application.
