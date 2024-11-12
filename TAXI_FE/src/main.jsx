import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import TaxiManagement from './TaxiManagement.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';


createRoot(document.getElementById('root')).render(
  <>
    <ToastContainer />
    <App />
  </>
);
