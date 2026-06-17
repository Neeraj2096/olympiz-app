import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { env } from '@xenova/transformers'

env.allowLocalModels = false;
env.useBrowserCache = false;

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
