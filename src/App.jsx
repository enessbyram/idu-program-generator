import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
  
      if (currentUser) {
        navigate("/home");
      } else {
        navigate("/");
      }
    });
  
    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      <Header />

      <Routes>
        <Route path="/idu-program-generator" element={<Navigate to="/" replace />} />

        <Route path="/" element={<Login />} />
        <Route path="/home" element={user ? <Home /> : <Login />} />
        <Route path="/profile" element={user ? <Profile /> : <Login />} />
        <Route path="/updatepassword" element={user ? <UpdatePassword /> : <Login />} />
        <Route path="/dersekle" element={user ? <DersEkle /> : <Login />} />
        <Route path="/showprogram" element={user ? <ShowProgram /> : <Login />} />
      </Routes>

      <Footer />
    </>
  );
}
