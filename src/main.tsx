import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Background.tsx'
import SunMoon from './sun.tsx'
import './index.css'



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <SunMoon/>
  </React.StrictMode>,
)
