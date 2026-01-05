# 🌐 Civic-Eye Frontend

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-6+-CA4245?style=flat&logo=react-router&logoColor=white)](https://reactrouter.com/)

A modern, responsive dashboard for citizens to report issues and for authorities to manage them in real-time.

## ✨ Features

- **📢 Report Portal:** Easy-to-use form for citizens to submit issues with photos and locations.
- **📊 Authority Dashboard:** Comprehensive view for officials to track, verify, and resolve complaints.
- **🔎 Live Tracking:** Real-time status updates for submitted complaints.
- **🛡️ AI Verification:** Visual indicators of report authenticity and priority.
- **📱 Responsive Design:** Optimized for mobile and desktop using Tailwind CSS.

## 🛠️ Tech Stack

- **Library:** React.js
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** React Hooks

## 📦 Project Structure

```text
frontend/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Main application views
│   ├── App.js        # Main component & routing
│   └── index.js      # Entry point
├── tailwind.config.js # Styling configuration
├── package.json      # Dependencies
└── .gitignore        # Git ignore rules
```

## 🚀 Running Locally

1. **Clone & Navigate:**
   ```bash
   git clone https://github.com/Mohit-cmd-jpg/civic-eye-frontend.git
   cd civic-eye-frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000
   ```

4. **Start Application:**
   ```bash
   npm start
   ```

## 📄 License
This project is open-source under the MIT License.

Made with ❤️ by Mohit Bindal
