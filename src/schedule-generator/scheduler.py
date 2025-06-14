from schedule_constants import DAYS, SLOTS, AVAILABLE_SLOT_INDEXES, ROOMS
from schedule_constants import is_valid_day_for_course
import json

def save_schedule_as_json(schedule, file_path="./src/final_schedule.json"):
    output = {}
    for (day, slot_index, room), lesson in schedule.items():
        output.setdefault(day, {}).setdefault(room, {})[str(slot_index)] = lesson

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

def check_schedule_conflicts(schedule):
    teacher_schedule = {}
    student_schedule = {}

    for key, lesson in schedule.items():
        day, slot_index, room = key
        teacher_email = lesson.get("email", "bilinmeyen")
        ders_kodu = lesson.get("dersKodu", "")
        bolum = ders_kodu.strip()[:3] if len(ders_kodu.strip()) >= 3 else "???"
        duzey = ders_kodu.strip()[4] if len(ders_kodu.strip()) >= 5 else "?"
        sinif_kimligi = f"{lesson.get('bolum', bolum)}_{duzey}"

        if teacher_email not in teacher_schedule:
            teacher_schedule[teacher_email] = []
        if (day, slot_index) in teacher_schedule[teacher_email]:
            print(f"❌ Hoca Çakışması! {teacher_email} - {lesson['dersKodu']} {lesson['dersAdi']} {day} Slot {slot_index + 1}")
        else:
            teacher_schedule[teacher_email].append((day, slot_index))

        if sinif_kimligi not in student_schedule:
            student_schedule[sinif_kimligi] = []
        if (day, slot_index) in student_schedule[sinif_kimligi]:
            print(f"❌ Öğrenci Çakışması! {sinif_kimligi} - {lesson['dersKodu']} {lesson['dersAdi']} {day} Slot {slot_index + 1}")
        else:
            student_schedule[sinif_kimligi].append((day, slot_index))

def is_slot_available(schedule, teacher_busy_slots, day, slot_index, room, required_slots, teacher_email, sinif_kimligi, student_busy_slots):
    for i in range(required_slots):
        current_slot = slot_index + i
        if current_slot >= len(SLOTS):
            print(f"❌ Slot index {current_slot} sınırı aşıyor.")
            return False

        key = (day, current_slot, room)
        if key in schedule:
            print(f"❌ Oda dolu: {day}, Slot {current_slot + 1}, Oda: {room}")
            return False

        if (day, current_slot) in teacher_busy_slots.get(teacher_email, set()):
            print(f"❌ Hoca dolu: {teacher_email} - {day} Slot {current_slot + 1}")
            return False

        if (day, current_slot) in student_busy_slots.get(sinif_kimligi, set()):
            print(f"❌ Öğrenci dolu: {sinif_kimligi} - {day} Slot {current_slot + 1}")
            return False

    return True


def calculate_teacher_idle_score(schedule, teacher_email):
    slots_by_day = {}
    for (day, slot_index, room), lesson in schedule.items():
        if lesson.get("email") == teacher_email:
            slots_by_day.setdefault(day, []).append(slot_index)

    idle_score = 0
    for slots in slots_by_day.values():
        if len(slots) <= 1:
            continue
        sorted_slots = sorted(slots)
        gaps = [b - a - 1 for a, b in zip(sorted_slots, sorted_slots[1:])]
        idle_score += sum(gaps)
    return idle_score

def force_place_lesson(lesson, schedule, teacher_busy_slots, student_busy_slots):
    required_slots = int(lesson.get("dersSaati", 1))
    expected_students = int(lesson.get("expectedStudent", 0))
    teacher_email = lesson.get("email")
    ders_kodu = lesson.get("dersKodu", "")
    bolum = ders_kodu.strip()[:3] if len(ders_kodu.strip()) >= 3 else "???"
    duzey = ders_kodu.strip()[4] if len(ders_kodu.strip()) >= 5 else "?"
    sinif_kimligi = f"{bolum}_{duzey}"

    best_option = None
    best_idle_score = float("inf")

    for day in DAYS:
        if not is_valid_day_for_course(ders_kodu, day):
            continue

        for slot_index in AVAILABLE_SLOT_INDEXES:
            if slot_index + required_slots > len(SLOTS):
                continue

            room_candidates = sorted(ROOMS.items(), key=lambda x: abs(x[1] - expected_students))

            for room, capacity in room_candidates:
                conflict = False
                for i in range(required_slots):
                    key = (day, slot_index + i, room)
                    if key in schedule:
                        conflict = True
                        break
                if conflict:
                    continue

                temp_schedule = schedule.copy()
                for i in range(required_slots):
                    key = (day, slot_index + i, room)
                    temp_schedule[key] = lesson

                idle_score = calculate_teacher_idle_score(temp_schedule, teacher_email)

                if idle_score < best_idle_score:
                    best_idle_score = idle_score
                    best_option = (day, slot_index, room)

    if best_option:
        day, slot_index, room = best_option
        for i in range(required_slots):
            key = (day, slot_index + i, room)
            schedule[key] = lesson
            teacher_busy_slots.setdefault(teacher_email, set()).add((day, slot_index + i))
            student_busy_slots.setdefault(sinif_kimligi, set()).add((day, slot_index + i))
        print(f"⚠️ Zorla Yerleştirildi: {lesson['dersKodu']} - {lesson['dersAdi']} @ {day}, Slot {slot_index + 1}, Oda: {room} (Fallback)")
        return True
    else:
        print(f"❌ Zorla da yerleştirilemedi: {lesson['dersKodu']} - {lesson['dersAdi']}")
        return False

def schedule_lessons(lessons):
    schedule = {}
    teacher_busy_slots = {}
    student_busy_slots = {}

    lessons.sort(key=lambda x: (int(x.get("expectedStudent", 0)), int(x.get("dersSaati", 1))), reverse=True)

    for lesson in lessons:
        required_slots = int(lesson.get("dersSaati", 1))
        expected_students = int(lesson.get("expectedStudent", 0))
        teacher_email = lesson.get("email")
        ders_kodu = lesson.get("dersKodu", "")
        bolum = ders_kodu.strip()[:3] if len(ders_kodu.strip()) >= 3 else "???"
        duzey = ders_kodu.strip()[4] if len(ders_kodu.strip()) >= 5 else "?"
        sinif_kimligi = f"{bolum}_{duzey}"

        if not teacher_email:
            print(f"Email eksik: {lesson['dersKodu']} - {lesson['dersAdi']}")
            continue

        teacher_busy_slots.setdefault(teacher_email, set())
        student_busy_slots.setdefault(sinif_kimligi, set())
        placed = False
        best_option = None
        best_idle_score = float("inf")

        for day in DAYS:
            if not is_valid_day_for_course(lesson['dersKodu'], day):
                continue

            for slot_index in AVAILABLE_SLOT_INDEXES:
                if slot_index + required_slots > len(SLOTS):
                    continue

                suitable_rooms = [r for r in ROOMS.items() if r[1] >= expected_students]
                suitable_rooms.sort(key=lambda x: x[1])
                fallback_rooms = [r for r in ROOMS.items() if r[1] < expected_students]
                fallback_rooms.sort(key=lambda x: abs(x[1] - expected_students))
                room_candidates = suitable_rooms + fallback_rooms

                for room, capacity in room_candidates:
                    if lesson['dersKodu'] == "IE 401":
                        print(f"🎯 Deneniyor -> Gün: {day}, Slot: {slot_index}, Oda: {room}")

                    if is_slot_available(schedule, teacher_busy_slots, day, slot_index, room, required_slots, teacher_email, sinif_kimligi, student_busy_slots):
                        temp_schedule = schedule.copy()
                        for i in range(required_slots):
                            key = (day, slot_index + i, room)
                            temp_schedule[key] = lesson

                        idle_score = calculate_teacher_idle_score(temp_schedule, teacher_email)
                        if idle_score < best_idle_score:
                            best_idle_score = idle_score
                            best_option = (day, slot_index, room)
                    elif lesson['dersKodu'] == "IE 401":
                        print(f"❌ UYGUN DEĞİL -> {day}, Slot {slot_index}-{slot_index+required_slots-1}, Oda: {room}")

        if best_option:
            day, slot_index, room = best_option
            for i in range(required_slots):
                key = (day, slot_index + i, room)
                schedule[key] = lesson
                teacher_busy_slots[teacher_email].add((day, slot_index + i))
                student_busy_slots[sinif_kimligi].add((day, slot_index + i))
            placed = True

        if not placed:
            print(f"⚠️ DERS YERLEŞEMEDİ (Normal): {lesson['dersKodu']} - {lesson['dersAdi']}")
            print(f"⛔ Öğrenci Sayısı: {expected_students}, Saat: {required_slots}, Hoca: {teacher_email}")
            # Buraya force place fonksiyonunu da çağırabilirsin istersen
            # force_place_lesson(lesson, schedule, teacher_busy_slots, student_busy_slots)

    return schedule

def print_empty_slots(schedule):
    for day in DAYS:
        for slot_index in AVAILABLE_SLOT_INDEXES:
            for room in ROOMS.keys():
                if (day, slot_index, room) not in schedule:
                    print(f"Boş: {day}, Slot {slot_index + 1}, Oda {room}")
