🧑‍💻 AI-Powered Interview Assistant

A modern interview assistant powered by:

⚛️ Frontend: Vite + React + TailwindCSS + TypeScript
🗄 State Management: Context API with local persistence
🎨 UI: shadcn/ui + Tailwind
🤖 AI Workflow: Dynamic Q&A + Resume Parsing + Scoring

⚙️ Full Setup Instructions
🔹 Step 1: Clone the Repository
git clone https://github.com/Shreya-thakur0129/AI_Interview_Assignment-project-.git
cd AI_Interview_Assignment/project

🔹 Step 2: Install Dependencies
npm install

🔹 Step 3: Start Development Server
npm run dev


App will be available at:
👉 http://localhost:5173

📁 Folder Structure
project/
 ├── src/
 │   ├── components/       # UI components (chat, dashboard, resume upload, etc.)
 │   ├── context/          # React Context for global state
 │   ├── data/             # Static data (e.g., questions)
 │   ├── types/            # TypeScript types
 │   ├── utils/            # Utility functions (resume parsing, AI mock)
 │   ├── App.tsx           # Main app entry
 │   ├── main.tsx          # Vite entry
 │   └── index.css         # Global styles
 ├── index.html
 ├── package.json
 └── vite.config.ts

🛠️ Core Features

📄 Resume Upload (PDF/DOCX) → Extracts Name, Email, Phone

❓ Interview Flow → 6 Questions (2 Easy, 2 Medium, 2 Hard) with timers

📊 Interviewer Dashboard → Candidate list, scores, summaries, chat history

💾 Local Persistence → Restore state after refresh/close

🔄 Resume & Welcome Back Flow → Collect missing fields, resume session

🎨 Responsive UI with modern styling

🛠️ Tech Stack

Frontend: React + Vite + TypeScript

Styling: TailwindCSS + shadcn/ui

State Management: Context API

Tooling: ESLint + Prettier
