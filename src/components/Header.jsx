import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './header.css';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "../firebase";

export default function Header() {
    const [currentUser, setCurrentUser] = useState(null)
    const navigate = useNavigate()
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [teachers, setTeachers] = useState([]);

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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
        })
        return () => unsubscribe()
    })

    const handleLogoClick = () => {
        if (currentUser) {
            navigate('./home')
        } else {
            navigate('./')
        }
    }

    const handleProfileClick = () => {
        setDropdownVisible(!dropdownVisible)
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setCurrentUser(null);
            setDropdownVisible(false);
            navigate('./');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.profile-container')) {
                setDropdownVisible(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <header>
            <div className="logo">
                <img
                    src="https://github.com/enessbyram/idu-program-generator/blob/main/public/img/IDU_LOGO.png?raw=true"
                    alt="logo"
                    onClick={handleLogoClick}
                    style={{ cursor: 'pointer' }}
                />
            </div>
            <nav>
                <div className="welcome-container">
                    {auth.currentUser && <p>Hoşgeldiniz Sayın</p>}
                    {auth.currentUser && (() => {
                        const matchedTeacher = teachers.find(teacher => teacher.mail === auth.currentUser.email);
                        return matchedTeacher ? (
                            <p>
                                {matchedTeacher.title} {matchedTeacher.name} {matchedTeacher.surname}
                            </p>
                        ) : null;
                    })()}
                    <p>IDU Program Oluşturma Uygulaması</p>
                </div>
                {auth.currentUser && <div className="profile-container" onClick={handleProfileClick}>
                    <div id="profile">
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                    {dropdownVisible && (
                        <ul className="dropdown-menu">
                            <li onClick={() => navigate('./profile')}>Profilim</li>
                            <li onClick={handleLogout}>Çıkış Yap</li>
                        </ul>
                    )}
                </div>}
            </nav>
        </header>
    );
}