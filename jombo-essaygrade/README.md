# EssayGrade AI — Frontend Prototype

AI-powered essay assessment system. Final year project prototype.

## Running Locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Framework: **Vite** (auto-detected)
4. Click **Deploy** — done!

## Demo Credentials

| Role    | Email                        | Password   |
|---------|------------------------------|------------|
| Teacher | teacher@essaygrade.com       | demo1234   |
| Student | student@essaygrade.com       | demo1234   |

## Project Structure

```
src/
  App.jsx              ← Root: wires login + dashboards
  main.jsx             ← React entry point
  LoginPage.jsx        ← Login screen with role-based routing
  TeacherDashboard.jsx ← Teacher portal
  StudentDashboard.jsx ← Student portal (includes mock AI grader)
  mockAiGrade.js       ← Standalone AI grading simulation
index.html
vite.config.js
package.json
```

## Notes

- No backend required — fully self-contained frontend prototype
- AI grading is simulated locally with realistic heuristics
- All data is in-memory (resets on page refresh)
