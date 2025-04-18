import "./updateprofile.css";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import React, { useState } from 'react';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";

export default function UpdatePassword() {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const auth = getAuth();

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Hata!',
                text: 'Yeni şifreler eşleşmiyor!',
            });
            return;
        }

        const user = auth.currentUser;

        const credential = EmailAuthProvider.credential(user.email, currentPassword);

        try {
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);

            Swal.fire({
                icon: 'success',
                title: 'Şifre başarıyla güncellendi.',
                showConfirmButton: true
            });
            navigate('/profile');
        } catch (error) {
            let errorMessage = 'Şifre değiştirilemedi!';
            if (error.code === 'auth/wrong-password') {
                errorMessage = 'Mevcut şifreniz yanlış!';
            }
            Swal.fire({
                icon: 'error',
                title: 'Hata!',
                text: errorMessage,
            });
        }
    }

    return (
        <div className="updateprofile">
            <form className="updateprofile-form" onSubmit={handleUpdatePassword}>
                <div className="updateprofile-input">
                    <label htmlFor="oldPassword">Eski Şifre:</label>
                    <input
                        id="oldPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="updateprofile-input">
                    <label htmlFor="newPassword">Yeni Şifre:</label>
                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="updateprofile-input">
                    <label htmlFor="newPasswordAgain">Yeni Şifreyi Onayla:</label>
                    <input
                        id="newPasswordAgain"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="updateprofile-input">
                    <input
                        id="update"
                        type="submit"
                        value="Şifreyi Güncelle"
                    />
                </div>
            </form>
        </div>
    );
}
