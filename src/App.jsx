import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import Home from './pages/Home';
import Profile from './pages/Profile'
import UpdatePassword from './pages/UpdatePassword'
import ShowProgram from './pages/ShowProgram'
import DersEkle from './pages/DersEkle'

export default function App() {
  return (
    <>
      <Header />
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/updatepassword" element={<UpdatePassword />} />
        <Route path="/dersekle" element={<DersEkle />} />
        <Route path="/showprogram" element={<ShowProgram />} />
      </Routes>
      
      <Footer />
    </>
  );
}