# 🎙️ Text-to-Speech AI Generator

An AI-powered full-stack application for **Text-to-Speech, AI-powered translation, and real-time conversation**.

## 🚀 Live Demo

* https://text-to-speech-ai-generator-backend-xi.vercel.app/login

## ✨ Features

* 🗣️ Text-to-Speech conversion
* 🌍 Multilingual support — English, Hindi, Spanish
* 🤖 AI-powered translation using Google Gemini
* 🎙️ Voice generation using ElevenLabs
* 🔊 Audio playback and download
* 💬 Real-time conversation using **Socket.io**
* 🟢 Online/offline user status
* 📨 Real-time message delivery
* 🎨 Responsive modern UI
* 🌙 Theme support

## 🛠️ Tech Stack

**Frontend**

* React.js
* Vite
* Tailwind CSS
* Axios
* Socket.io Client

**Backend**

* Node.js
* Express.js
* REST APIs
* Socket.io

**AI & APIs**

* Google Gemini
* ElevenLabs

**Deployment**

* Vercel

## 🔄 Application Flow

### Text-to-Speech

```text
User Input
    ↓
React Frontend
    ↓
Express REST API
    ↓
Google Gemini → Translation
    ↓
ElevenLabs → Voice Generation
    ↓
Generated Audio
    ↓
Play / Download
```

### Real-Time Conversation

```text
User A
  ↓
Socket.io
  ↓
Node.js Server
  ↓
Socket.io
  ↓
User B
```

Messages are delivered in real time through persistent Socket.io connections, with online status and message events handled by the backend.

## 🔌 API Endpoints

| Method | Endpoint                   | Description         |
| ------ | -------------------------- | ------------------- |
| POST   | `/api/translate/generate`  | Translate text      |
| POST   | `/api/translate/voice`     | Generate speech     |
| GET    | `/api/conversation/users`  | Get users           |
| POST   | `/api/conversation/create` | Create conversation |

## ⚙️ Installation

```bash
git clone <your-repository-url>
cd Text-To-Speech-AI-Generator
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## 🔐 Environment Variables

### Backend

```env
PORT=5000
GEMINI_API_KEY=your_api_key
ELEVENLABS_API_KEY=your_api_key
FRONTEND_URL=http://localhost:5173
```

### Frontend

```env
VITE_API_URL=http://localhost:5000
```

> Never commit `.env` files or API keys to GitHub.

## 📌 Future Improvements

* User authentication
* Conversation history
* More languages and voices
* Speech-to-Text
* AI voice conversation
* Cloud storage for generated audio
* Message read receipts and typing indicators

## 👩‍💻 Author

**Ruchi**
Full Stack Web Developer
