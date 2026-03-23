import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage    from './Student/landingPage'
import LoginPage      from './Student/loginPage'
import Results        from './Student/Results'

// ── Simple auth guard ──────────────────────────────────────────────────────
function PrivateRoute({ children }) {
  const user = localStorage.getItem('user')
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"         element={<LandingPage />} />
        <Route path="/login"    element={<LoginPage />} />

        {/* Protected — student dashboard / results */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Results />
          </PrivateRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
