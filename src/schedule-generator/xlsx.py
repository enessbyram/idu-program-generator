import json
import pandas as pd
from collections import defaultdict

# JSON dosyasını yükle
with open("src/final_schedule.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Slot saatleri
slot_times = {
    "1": "08:30 - 09:15", "2": "09:25 - 10:10", "3": "10:20 - 11:05",
    "4": "11:15 - 12:00", "5": "12:30 - 13:15", "6": "13:25 - 14:10",
    "7": "14:20 - 15:05", "8": "15:15 - 16:00", "9": "16:10 - 16:55",
    "10": "17:05 - 17:50", "11": "18:00 - 18:45"
}

# Bölüm eşleşmeleri (anahtarlar normalize edilecek)
departments = {
    "ElektrikElektronik": "EEE",
    "Makine": "MAC",
    "İnşaat": "CIV",
    "Endüstri": "IE",
    "Biyomedikal": "BME"
}

# Sabitler
gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"]
siniflar = ["1. Sınıf", "2. Sınıf", "3. Sınıf", "4. Sınıf"]
all_lessons = {dep_code: defaultdict(lambda: defaultdict(dict)) for dep_code in departments.values()}

# Verileri işle
for day, rooms in data.items():
    for room, slots in rooms.items():
        for slot, lesson in slots.items():
            # Bölüm belirleme (USEC varsa hocaField üzerinden)
            bolum_kodu = None

            if lesson["bolum"] == "UniElectiveCourse":
                normalized_field = lesson["hocaField"].replace(" ", "").replace("-", "").lower()
                for keyword, dep_code in departments.items():
                    if keyword.lower() in normalized_field:
                        bolum_kodu = dep_code
                        break
            else:
                for keyword, dep_code in departments.items():
                    if keyword in lesson["bolum"]:
                        bolum_kodu = dep_code
                        break

            if bolum_kodu is None:
                continue  # eşleşme yoksa atla

            # Slot ve sınıf bilgisi
            time_str = slot_times.get(slot, f"Slot {slot}")
            grade_digit = lesson["dersKodu"].split()[1][0]
            grade = f"{grade_digit}. Sınıf"

            # Ders metni oluştur
            ders_bilgisi = (
                f'{lesson["dersKodu"]} {lesson["dersAdi"]} ({room}) \n'
                f'{lesson["hocaTitle"]} {lesson["hocaAdi"]} {lesson["hocaSoyadi"].strip()}'
            )

            all_lessons[bolum_kodu][day][time_str][grade] = ders_bilgisi

# Excel dosyası üret
for dep_code, lessons in all_lessons.items():
    rows = []
    for day in gunler:
        if day in lessons:
            for time in sorted(lessons[day]):
                row = {"Gün": day, "Saat": time}
                for s in siniflar:
                    row[s] = lessons[day][time].get(s, "")
                rows.append(row)

    df = pd.DataFrame(rows)
    filename = f"{dep_code}_Ders_Programi_2025_2026.xlsx"
    df.to_excel(filename, index=False)
    print(f"✅ {filename} oluşturuldu!")
