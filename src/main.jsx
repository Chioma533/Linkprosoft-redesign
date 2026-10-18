import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PreLoaderProvider } from './context/PreLoaderContext.jsx';
import { ThemeProvider } from './context/ThemeProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <PreLoaderProvider>
        <App />
      </PreLoaderProvider>
    </ThemeProvider>
  </StrictMode>,
)
