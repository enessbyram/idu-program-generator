import { auth, db } from "../firebase";
import "./profile.css";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const getTeachers = async () => {
      try {
        const ref = db
          .collection("Izmir Demokrasi Universitesi")
          .doc("Faculties")
          .collection("MuhendislikFac")
          .doc("Muhendislik")
          .collection("Teachers");

        const snapshot = await ref.get();

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setTeachers(data);
      } catch (error) {
        console.error("Öğretmenleri çekerken hata:", error);
      }
    };

    getTeachers();
  }, []);

  const matchedTeacher =
    auth.currentUser &&
    teachers.find(teacher => teacher.mail === auth.currentUser.email);

  const handleUpdateBtn = () => {
    navigate('/updatepassword')
  }

  return (
    <div className="profile">
      <form className="profile-form">
        <div className="profile-input">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            readOnly
            placeholder={matchedTeacher ? matchedTeacher.name : ""}
          />
        </div>
        <div className="profile-input">
          <label htmlFor="surname">Surname:</label>
          <input
            id="surname"
            type="text"
            readOnly
            placeholder={matchedTeacher ? matchedTeacher.surname : ""}
          />
        </div>
        <div className="profile-input">
          <label htmlFor="mail">Email:</label>
          <input
            id="mail"
            type="text"
            readOnly
            placeholder={matchedTeacher ? matchedTeacher.mail : ""}
          />
        </div>
        <div className="profile-input">
          <input
            id="update"
            type="button"
            value="Update Password"
            onClick={handleUpdateBtn}
          />
        </div>
      </form>
    </div>
  );
}
