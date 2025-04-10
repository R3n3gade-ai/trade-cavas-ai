import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { AppWrapper } from './AppWrapper.tsx'
import './index.css'

// Using StrictMode with proper suspense handling
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
)
