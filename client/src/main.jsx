import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './router/App.jsx'
import { Provider } from 'react-redux'
import store from './store/Store.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";


const GOOGLE_AUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={GOOGLE_AUTH_CLIENT_ID}>
        <App />
    </GoogleOAuthProvider>
  </Provider>
)
