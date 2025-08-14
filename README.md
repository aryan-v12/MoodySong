# 🎵 MoodDetect

> **Made with ❤️ by GhatakOps**

AI-powered mood detection that recommends music based on your facial expressions.

## ✨ Features

- 🤖 Real-time facial expression analysis
- 🎶 Mood-based music recommendations  
- 📱 Fully responsive design
- ⏯️ Smart audio playback with resume
- ❤️ Like and share functionality

## 🚀 Quick Start

### Backend Setup
```bash
cd Backend
npm install
npm start  # Runs on http://localhost:3000
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

## 🔧 API

**GET** `/songs?mood={mood}`
- Returns music recommendations for detected mood
- Moods: happy, sad, angry, surprised, fearful, disgusted, neutral

## 🎯 Tech Stack

**Frontend:** React.js, face-api.js, CSS3, Vite  
**Backend:** Node.js, Express.js, CORS

## 📱 Responsive Design

Works seamlessly on mobile, tablet, and desktop devices.

## 🔒 Privacy

- All facial analysis happens locally in browser
- No facial data is stored or transmitted
- Camera access only for real-time detection

---

**Made with ❤️ by GhatakOps**
