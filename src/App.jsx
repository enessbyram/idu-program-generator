import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from './pages/Profile';
import UpdatePassword from './pages/UpdatePassword';
import ShowProgram from './pages/ShowProgram';
import DersEkle from './pages/DersEkle';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null; // ya da loading animasyonu vs.

  return (
    <>
      <Header />

      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" replace /> : <Login />}
        />
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/" replace />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/" replace />}
        />
        <Route
          path="/updatepassword"
          element={user ? <UpdatePassword /> : <Navigate to="/" replace />}
        />
        <Route
          path="/dersekle"
          element={user ? <DersEkle /> : <Navigate to="/" replace />}
        />
        <Route
          path="/showprogram"
          element={user ? <ShowProgram /> : <Navigate to="/" replace />}
        />
      </Routes>

      <Footer />
    </>
  );
}
