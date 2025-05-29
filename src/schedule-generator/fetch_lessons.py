import firebase_admin
from firebase_admin import credentials, firestore
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(BASE_DIR, "serviceAccountKey.json")

try:
    cred = credentials.Certificate(json_path)
    firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Firebase başlatılamadı! Hata: {e}")
    sys.exit(1)

db = firestore.client()

donem = "2025 - 2026 Güz Dönemi"

bolumler = [
    "BiyomedikalMuh",
    "ElektrikElektronikMuh",
    "InsaatMuh",
    "EndustriMuh",
    "MakineMuh",
    "UniElectiveCourse"
]

def get_all_lessons():
    tum_dersler = []
    for bolum in bolumler:
        dersler_ref = db.collection("Izmir Demokrasi Universitesi") \
                        .document("Faculties") \
                        .collection("MuhendislikFac") \
                        .document("Entries") \
                        .collection(donem) \
                        .document("Entries") \
                        .collection(bolum)
        docs = dersler_ref.stream()
        for doc in docs:
            data = doc.to_dict()
            data["bolum"] = bolum  # Bölüm bilgisini ekle
            tum_dersler.append(data)
    return tum_dersler

if __name__ == "__main__":
    print("🔥 Tüm bölümlerden dersler çekiliyor...\n")
    dersler = get_all_lessons()
    for ders in dersler:
        print(f"{ders.get('dersKodu', 'Kodu yok')} - {ders.get('dersAdi', 'İsimsiz')} ({ders.get('hocaAdi')} {ders.get('hocaSoyadi')}) - Bölüm: {ders.get('bolum')}")
        print(f"  Süre: {ders.get('dersSaati')} saat, Beklenen öğrenci: {ders.get('expectedStudent')}")
        print("-" * 40)
    print(f"\n✅ Toplam {len(dersler)} ders bulundu.")
