import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import './login.css'
import { useEffect } from 'react';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/home");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  function signIn() {
    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email && !password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Mail adresiniz ve şifreniz boş!'
      });
      return;
    } else if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Mail adresiniz boş!'
      });
      return;
    } else if (!password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Şifreniz boş!'
      });
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const ref = db
          .collection("Izmir Demokrasi Universitesi")
          .doc("Faculties")
          .collection("MuhendislikFac")
          .doc("Muhendislik")
          .collection("Teachers");

        const snapshot = await ref.where("mail", "==", email).get();

        if (!snapshot.empty) {
          const teacherData = snapshot.docs[0].data();
          Swal.fire({
            icon: 'success',
            title: 'Giriş başarılı!',
            text: `Hoş geldiniz Sayın ${teacherData.title} ${teacherData.name} ${teacherData.surname}`,
            showConfirmButton: true
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Giriş başarılı!',
            text: `Hoş geldin ${email}`,
            showConfirmButton: true
          });
        }

        navigate('/home');
      })
      .catch((error) => {
        let errorMessage = "Giriş başarısız!";
        if (error.code === 'auth/user-not-found') {
          errorMessage = "Böyle bir kullanıcı bulunamadı!";
        } else if (error.code === 'auth/wrong-password') {
          errorMessage = "Şifre yanlış!";
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = "Geçersiz e-posta formatı!";
        }

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage
        });
      });
  }

  return (
    <article>
      <div className="login-container">
        <form className="login-form">
          <div className="login-input">
            <label htmlFor="username">Mailinizi Giriniz</label>
            <input type="text" id="username" placeholder="ali.veli@idu.edu.tr" required className="login-username" />
          </div>
          <div className="login-input">
            <label htmlFor="password">Şifrenizi Giriniz</label>
            <input type="password" id="password" placeholder="*********" required className="login-password" />
          </div>
          <div className="login-input">
            <input type="button" id="confirm" value="Giriş Yap" onClick={signIn} />
          </div>
        </form>
      </div>
    </article>
  );
}
