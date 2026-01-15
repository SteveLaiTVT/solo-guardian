import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// DONE(B): Initialize i18n before App component - TASK-013
import './i18n';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
