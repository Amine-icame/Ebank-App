import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";


// --- IMPORTS ---
import Accounts from "./components/Accounts";
import AdminDashboard from "./components/AdminDashboard";
import AdminMainDashboard from "./components/AdminMainDashboard";
import ClientDashboard from "./components/ClientDashboard";
import Customers from "./components/Customers";
import Login from "./components/Login";
import NewAccount from "./components/NewAccount";
import NewCustomer from "./components/NewCustomer";
import Register from "./components/Register";

import { isAdmin, isAuthenticated } from "./services/AuthService";

// --- AXIOS CONFIG ---
axios.interceptors.request.use((request) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
        request.headers.Authorization = "Bearer " + token;
    }
    return request;
}, (error) => Promise.reject(error));

// --- BARRE DE NAVIGATION INTELLIGENTE ---
function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideOnRoutes = ["/login", "/", "/register"];

  if (hideOnRoutes.includes(location.pathname)) return null;

  const handleLogout = () => {
      localStorage.removeItem("jwtToken");
      navigate("/login");
  };

  return (
    <nav className="modern-navbar">
      <div className="nav-inner">

        {/* Title dynamic */}
        <Link className="nav-title" to={isAdmin() ? "/customers" : "/client-dashboard"}>
          {isAdmin() ? "E-Bank Admin" : "E-Bank Client"}
        </Link>

        {/* Menu */}
        <ul className="nav-menu">

          {isAdmin() && (
            <>
              <li><Link className="nav-link" to="/customers">Gestion Clients</Link></li>
              <li><Link className="nav-link" to="/accounts">Gestion Comptes</Link></li>
              <li><Link className="nav-link" to="/new-account">Nouveau Compte</Link></li>
              <li><Link className="nav-link highlight" to="/admin-dashboard">Validations</Link></li>
            </>
          )}

          {!isAdmin() && (
            <>
              <li><Link className="nav-link" to="/client-dashboard">Mon Tableau de bord</Link></li>
              <li><Link className="nav-link" to="/accounts">Virements & Opérations</Link></li>
            </>
          )}

        </ul>

        {/* Logout */}
        {isAuthenticated() && (
          <button className="logout-btn" onClick={handleLogout}>
            Déconnexion
          </button>
        )}

      </div>
    </nav>
  );
}


// --- ROUTAGE ---
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Client */}
        <Route path="/client-dashboard" element={<ClientDashboard />} />

        {/* Partagé */}
        <Route path="/accounts" element={<Accounts />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminMainDashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/new-customer" element={<NewCustomer />} />
        <Route path="/new-account" element={<NewAccount />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="container mt-3">
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}


export default App;