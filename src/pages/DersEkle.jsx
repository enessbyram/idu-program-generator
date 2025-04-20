import "./dersEkle.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHammer, faTrash } from "@fortawesome/free-solid-svg-icons";
import { db, auth } from '../firebase';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const [tumDersler, setTumDersler] = useState({});
  const [seciliKod, setSeciliKod] = useState('');
  const [seciliAd, setSeciliAd] = useState('');
  const [donemler, setDonemler] = useState([]);
  const [formValues, setFormValues] = useState({
    donem: '2025 - 2026 Güz Dönemi',
    dersKodu: '',
    dersSaati: '',
    expectedStudent: ''
  });
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const getPrefixFromKod = (kod) => {
    const upperKod = kod.toUpperCase();
    const match = Object.keys(prefixToCollection).find(prefix =>
      upperKod.startsWith(prefix)
    );
    return match || null;
  };

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

  const prefixToCollection = useMemo(() => ({
    BME: "BiyomedikalMuh",
    EEE: "ElektrikElektronikMuh",
    CIV: "InsaatMuh",
    IE: "EndustriMuh",
    MAC: "MakineMuh"
  }), []);

  const dersDokumanlari = useMemo(() => [
    db.collection("Izmir Demokrasi Universitesi").doc("Faculties").collection("MuhendislikFac").doc("Muhendislik").collection("Biyomedikal").doc("BiyomedikalDers"),
    db.collection("Izmir Demokrasi Universitesi").doc("Faculties").collection("MuhendislikFac").doc("Muhendislik").collection("İnsaat").doc("İnsaatDers"),
    db.collection("Izmir Demokrasi Universitesi").doc("Faculties").collection("MuhendislikFac").doc("Muhendislik").collection("Makine").doc("MakineDers"),
    db.collection("Izmir Demokrasi Universitesi").doc("Faculties").collection("MuhendislikFac").doc("Muhendislik").collection("ElektrikElektronik").doc("ElektrikElektronikDers"),
    db.collection("Izmir Demokrasi Universitesi").doc("Faculties").collection("MuhendislikFac").doc("Muhendislik").collection("Endustri").doc("EndustriDers")
  ], []);

  const getCurrentTeacherInfo = async () => {
    const currentUserEmail = auth.currentUser.email;

    const teacherRef = db
      .collection("Izmir Demokrasi Universitesi")
      .doc("Faculties")
      .collection("MuhendislikFac")
      .doc("Muhendislik")
      .collection("Teachers");

    const snapshot = await teacherRef
      .where("mail", "==", currentUserEmail)
      .get();

    if (!snapshot.empty) {
      return snapshot.docs[0].data();
    } else {
      console.warn("Hoca bilgisi bulunamadı.");
      return null;
    }
  };

  const fetchTeacherEntries = useCallback(async (email) => {
    if (!formValues.donem) {
      return;
    }

    const allEntries = [];

    for (let col of Object.values(prefixToCollection)) {
      const snapshot = await db
        .collection("Izmir Demokrasi Universitesi")
        .doc("Faculties")
        .collection("MuhendislikFac")
        .doc("Entries")
        .collection(formValues.donem)
        .doc("Entries")
        .collection(col)
        .where("email", "==", email)
        .get();

      snapshot.forEach(doc => {
        allEntries.push({ id: doc.id, ...doc.data(), bolum: col });
      });
    }

    setEntries(allEntries);
  }, [prefixToCollection, formValues.donem]);

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const teacher = await getCurrentTeacherInfo();
    if (!teacher) return;

    const dersKodu = formValues.dersKodu.toUpperCase();
    const prefix = getPrefixFromKod(dersKodu);
    const entryCollection = prefixToCollection[prefix];

    if (!entryCollection) {
      alert("Geçersiz ders kodu!");
      return;
    }

    if (!formValues.donem) {
      alert("Lütfen bir dönem seç!");
      return;
    }

    if (editingEntry) {
      await db
        .collection("Izmir Demokrasi Universitesi")
        .doc("Faculties")
        .collection("MuhendislikFac")
        .doc("Entries")
        .collection(formValues.donem)
        .doc("Entries")
        .collection(editingEntry.bolum)
        .doc(editingEntry.id)
        .update({
          dersKodu: formValues.dersKodu,
          dersSaati: formValues.dersSaati,
          expectedStudent: formValues.expectedStudent,
          timestamp: new Date()
        });

      alert("Kayıt güncellendi 🔁");
    } else {
      await db
        .collection("Izmir Demokrasi Universitesi")
        .doc("Faculties")
        .collection("MuhendislikFac")
        .doc("Entries")
        .collection(formValues.donem)
        .doc("Entries")
        .collection(entryCollection)
        .add({
          ...formValues,
          dersAdi: seciliAd,
          hocaAdi: teacher.name,
          hocaSoyadi: teacher.surname,
          hocaTitle: teacher.title,
          email: teacher.mail,
          timestamp: new Date()
        });

      alert("Kayıt başarılı 🎉");
    }

    await fetchTeacherEntries(teacher.mail);

    setFormValues({ dersKodu: '', dersSaati: '', expectedStudent: '' });
    setSeciliKod('');
    setEditingEntry(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTeacherEntries(user.email, setEntries);
      }
    });

    return () => unsubscribe();
  }, [fetchTeacherEntries]);

  useEffect(() => {
    const fetchDersler = async () => {
      const tumVeriler = {};
      for (const docRef of dersDokumanlari) {
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          Object.assign(tumVeriler, docSnap.data());
        }
      }
      setTumDersler(tumVeriler);
    };

    fetchDersler();
  }, [dersDokumanlari]);

  useEffect(() => {
    if (seciliKod in tumDersler) {
      setSeciliAd(tumDersler[seciliKod]);
    } else {
      setSeciliAd('');
    }
  }, [seciliKod, tumDersler]);

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        const email = auth.currentUser.email;
        await fetchTeacherEntries(email);
      }
    };

    fetchData();
  }, [fetchTeacherEntries]);

  const handleDelete = async (entry) => {
    const confirmDelete = window.confirm(`"${entry.dersKodu}" dersini silmek istediğine emin misin?`);
    if (!confirmDelete) return;

    try {
      await db
        .collection("Izmir Demokrasi Universitesi")
        .doc("Faculties")
        .collection("MuhendislikFac")
        .doc("Entries")
        .collection(formValues.donem)
        .doc("Entries")
        .collection(entry.bolum)
        .doc(entry.id)
        .delete();

      await fetchTeacherEntries(entry.email);

      alert("Kayıt silindi 🧹");
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Kayıt silinirken bir hata oluştu 😞");
    }
  };

  return (
    <div className="home">
      <div className="entry-part">
        <form className="home-form" onSubmit={handleFormSubmit}>
          <div className="home-input">
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
              {donemler.map((donem, index) => (
                <option key={index} value={donem} />
              ))}
            </datalist>
          </div>
          <div className="home-input">
            <label htmlFor="dersKodu">Ders Kodu:</label>
            <input
              type="text"
              id="dersKodu"
              list="tumDersKodlari"
              value={formValues.dersKodu}
              onChange={(e) => {
                setFormValues({ ...formValues, dersKodu: e.target.value });
                setSeciliKod(e.target.value);
              }}
            />
            <datalist id="tumDersKodlari">
              {Object.keys(tumDersler).map((kod) => (
                <option key={kod} value={kod} />
              ))}
            </datalist>
          </div>
          <div className="home-input">
            <label htmlFor="dersAdi">Ders Adı:</label>
            <input type="text" id="dersAdi" value={seciliAd} readOnly />
          </div>
          <div className="home-input">
            <label htmlFor="dersSaati">Ders Süresi:</label>
            <input
              type="number"
              id="dersSaati"
              value={formValues.dersSaati}
              onChange={(e) => setFormValues({ ...formValues, dersSaati: e.target.value })}
            />
          </div>
          <div className="home-input">
            <label htmlFor="expectedStudent">Beklenen Öğrenci Sayısı:</label>
            <input
              type="number"
              id="expectedStudent"
              value={formValues.expectedStudent}
              onChange={(e) => setFormValues({ ...formValues, expectedStudent: e.target.value })}
            />
          </div>
          <div className="home-input">
            <input
              type="submit"
              id='kayit'
              value="Kaydet"
              style={{ cursor: "pointer" }}
              onClick={handleFormSubmit}
            />
          </div>
        </form>
      </div>
      <div className="result-part">
        <table>
          <thead>
            <tr>
              <th>Ders Kodu</th>
              <th>Ders Adı</th>
              <th>Ders Saati</th>
              <th>Beklenen Öğrenci Sayısı</th>
              <th>Düzenle</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.dersKodu}</td>
                <td>{entry.dersAdi}</td>
                <td>{entry.dersSaati}</td>
                <td>{entry.expectedStudent}</td>
                <td>
                  <FontAwesomeIcon
                    style={{ cursor: "pointer", marginRight: "10px" }}
                    icon={faHammer}
                    onClick={() => {
                      setFormValues({
                        dersKodu: entry.dersKodu,
                        dersSaati: entry.dersSaati,
                        expectedStudent: entry.expectedStudent
                      });
                      setSeciliKod(entry.dersKodu);
                      setEditingEntry(entry);
                    }}
                  />
                  <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    icon={faTrash}
                    onClick={() => handleDelete(entry)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}