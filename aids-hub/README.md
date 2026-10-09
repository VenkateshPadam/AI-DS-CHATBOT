# AI&DS Hub — Student Portal

A beginner-friendly Next.js web application starter for Artificial Intelligence and Data Science students. Includes a responsive dashboard and a StudyAI chatbot connected to the Groq API through a server-side route.

## Requirements

- Node.js 20.9 or newer
- npm
- A Groq API key from https://console.groq.com/keys

## Run on Windows

1. Extract the ZIP.
2. Open the extracted `aids-hub` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Copy `.env.example` to `.env.local`.
6. Open `.env.local` and replace `your_groq_api_key_here` with your Groq API key.
7. Start the development server:

   ```bash
   npm run dev
   ```

8. Open http://localhost:3000.

## API key safety

- Never place your API key in `app/page.tsx` or any browser-side code.
- Never commit `.env.local` or share it in screenshots.
- Review Groq's current API limits and terms of use.
- If you change environment variables, restart the development server.

## Included

- Responsive dashboard layout
- Subject cards for AI, Python, Machine Learning, and Data Science
- StudyAI chat UI and prompt suggestions
- Server-side Groq chat completions endpoint
- Basic request validation and error handling
- Example environment configuration

## Important limitations

This is the first working starter, not a complete production student information system. The dashboard's study materials, assignments, projects, profile, and navigation are demo UI only. Login, database persistence, file uploads, quiz scoring, official college data, rate limiting, and production deployment still need to be implemented before real students use it.

The default model is `llama-3.3-70b-versatile`; change `GROQ_MODEL` in `.env.local` to a model available to your Groq API account if needed.
