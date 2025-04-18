import './home.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // kendi firebase config dosyana göre ayarla
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

export default function Home() {
  const [setCurrentUser] = useState(null); // düzeltildi
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/');
      }
    });
  
    return () => unsubscribe(); // temizlik
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
    }
  };

  return (
    <div className="home-container">
      <div className="upper">
        <h1>👋 Hoşgeldiniz!</h1>
        <p>Sizi burada görmek harika 😍</p>
        <p>Aşağıdaki menüden başlayabilirsiniz 🤓</p>
      </div>
      <div className="lower">
        <h3>Yapmak istediğiniz işlemi seçiniz.</h3>
        <div className="buttons">
          <button onClick={() => navigate('/profile')}>Profilime Git</button>
          <button onClick={() => navigate('/dersekle')}>Ders Ekle</button>
          <button onClick={() => navigate('/showprogram')}>Programı Görüntüle</button>
          <button onClick={handleLogout}>Çıkış Yap</button>
        </div>
      </div>
    </div>
  );
}
