// src/App.jsx
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BulkUpload from './pages/BlukUpload';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const LoginWrapper = () => <Login setIsLoggedIn={setIsLoggedIn} />;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LoginWrapper />} />
          <Route path="/login" element={<LoginWrapper />} />
          <Route
            path="/dashboard"
            element={isLoggedIn ? <Dashboard /> : <LoginWrapper />}
          />
          <Route
            path="/bulk-upload"
            element={isLoggedIn ? <BulkUpload /> : <LoginWrapper />}
          />
          <Route path="/about" element={<div>About</div>} />
          {/* <Route path="/contact" element={<div>Contact</div>} />
          <Route path="/privacy" element={<div>Privacy</div>} /> */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}