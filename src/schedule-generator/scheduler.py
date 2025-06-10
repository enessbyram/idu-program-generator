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
            return False

        key = (day, current_slot, room)
        if key in schedule:
            return False

        if (day, current_slot) in teacher_busy_slots.get(teacher_email, set()):
            return False

        if (day, current_slot) in student_busy_slots.get(sinif_kimligi, set()):
            return False

    return True

def schedule_lessons(lessons):
    schedule = {}
    teacher_busy_slots = {}
    student_busy_slots = {}

    lessons.sort(key=lambda x: int(x.get("expectedStudent", 0)), reverse=True)

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
                    if is_slot_available(schedule, teacher_busy_slots, day, slot_index, room, required_slots, teacher_email, sinif_kimligi, student_busy_slots):
                        for i in range(required_slots):
                            key = (day, slot_index + i, room)
                            schedule[key] = lesson
                            teacher_busy_slots[teacher_email].add((day, slot_index + i))
                            student_busy_slots[sinif_kimligi].add((day, slot_index + i))
                        placed = True
                        break

                if placed:
                    break

            if placed:
                break

        if not placed:
            reasons = []
            for day in DAYS:
                if not is_valid_day_for_course(lesson['dersKodu'], day):
                    reasons.append(f"{day}: Geçersiz gün")
                    continue

                for slot_index in AVAILABLE_SLOT_INDEXES:
                    if slot_index + required_slots > len(SLOTS):
                        reasons.append(f"{day} slot {slot_index+1}: Slot taşması")
                        continue

                    suitable_rooms = [r for r in ROOMS.items()]
                    suitable_rooms.sort(key=lambda x: abs(x[1] - expected_students))  # yakın kapasiteye göre sırala

                    for room, capacity in suitable_rooms:
                        failed_reason = None

                        for i in range(required_slots):
                            current_slot = slot_index + i
                            key = (day, current_slot, room)

                            if key in schedule:
                                failed_reason = f"{day} {room} slot {current_slot+1}: Zaten dolu"
                                break
                            if (day, current_slot) in teacher_busy_slots.get(teacher_email, set()):
                                failed_reason = f"{day} slot {current_slot+1}: Hoca meşgul"
                                break
                            if (day, current_slot) in student_busy_slots.get(sinif_kimligi, set()):
                                failed_reason = f"{day} slot {current_slot+1}: Sınıf meşgul"
                                break

                        if failed_reason:
                            reasons.append(failed_reason)
                        else:
                            continue

            print(f"⚠️ DERS YERLEŞEMEDİ: {lesson['dersKodu']} - {lesson['dersAdi']}")
            print("  Nedenler:")
            for r in set(reasons):
                print("   -", r)

    return schedule
