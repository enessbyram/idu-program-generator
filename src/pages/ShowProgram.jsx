import './showprogram.css';
import { useState, useEffect } from 'react';
import dersVerisi from '../final_schedule.json'; // JSON dosyasını import et
import { db, auth } from '../firebase';

const saatler = [
    "08.30 - 09.15", "09.25 - 10.10", "10.20 - 11.05",
    "11.15 - 12.00", "12.30 - 13.15", "13.25 - 14.10",
    "14.20 - 15.05", "15.15 - 16.00", "16.10 - 16.55",
    "17.05 - 17.50", "18.00 - 18.45"
];

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];

export default function ShowProgram() {
    const [tablo, setTablo] = useState({});
    const [donemler, setDonemler] = useState([]);
    const [formValues, setFormValues] = useState({ donem: '' });
    const [currentEmail, setCurrentEmail] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentEmail(user.email);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchDonemler = async () => {
            try {
                // Entries dökümanını alıyoruz
                const docRef = await db
                    .collection("Izmir Demokrasi Universitesi")
                    .doc("Faculties")
                    .collection("MuhendislikFac")
                    .doc("Entries")
                    .get();

                if (docRef.exists) {
                    const data = docRef.data();

                    // Döküman içindeki field'ları alıyoruz
                    const donemAdlari = Object.values(data) || [];

                    console.log("Firestore'dan gelen dönemler:", donemAdlari);
                    setDonemler(donemAdlari);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Dönemleri çekerken hata oluştu:", error);
            }
        };

        fetchDonemler();
    }, []);

    useEffect(() => {
        const tempTablo = {};

        gunler.forEach(gun => {
            tempTablo[gun] = Array(11).fill("");
        });

        Object.entries(dersVerisi).forEach(([gun, salonlar]) => {
            Object.entries(salonlar).forEach(([salon, dersler]) => {
                Object.entries(dersler).forEach(([slotStr, ders]) => {
                    const slot = parseInt(slotStr) - 1;

                    if (
                        ders.donem === formValues.donem &&
                        ders.email === currentEmail // <-- Giriş yapan hocaya ait mi?
                    ) {
                        const dersBilgisi = `${ders.dersKodu} - ${ders.dersAdi} - (${salon})`;
                        if (tempTablo[gun]) {
                            tempTablo[gun][slot] = dersBilgisi;
                        }
                    }
                });
            });
        });

        setTablo(tempTablo);
    }, [formValues.donem, currentEmail]);

    return (
        <div className="showprogram-container">
            <div className="showprogram-input">
                <label htmlFor="donem">Dönem Seçiniz:</label>
                <input
                    type="text"
                    id="donem"
                    list="tumDonemler"
                    value={formValues.donem}
                    onChange={(e) =>
                        setFormValues({ ...formValues, donem: e.target.value })
                    }
                />
                <datalist id="tumDonemler">
                    {[...donemler]
                        .sort((a, b) => a.localeCompare(b, 'tr', { numeric: true }))
                        .map((donem, index) => (
                            <option key={index} value={donem} />
                        ))}
                </datalist>
            </div>
            <table className='showprogram-table'>
                <thead>
                    <tr>
                        <td>Günler / Saatler</td>
                        {gunler.map((gun, idx) => (
                            <td key={idx}>{gun}</td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {saatler.map((saat, i) => (
                        <tr key={i}>
                            <td>{saat}</td>
                            {gunler.map((gun, j) => (
                                <td key={j}>
                                    {tablo[gun] && tablo[gun][i]
                                        ? tablo[gun][i]
                                        : ""}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
