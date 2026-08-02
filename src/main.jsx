import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PreLoaderProvider } from './context/PreLoaderContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PreLoaderProvider>
    <App />
    </PreLoaderProvider>
  </StrictMode>,
)
