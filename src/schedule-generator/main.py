from fetch_lessons import get_all_lessons
from scheduler import schedule_lessons
from scheduler import save_schedule_as_json
from scheduler import check_schedule_conflicts
from scheduler import print_empty_slots

def remove_timestamps(schedule):
    for key, entry in schedule.items():
        if isinstance(entry, dict) and 'timestamp' in entry:
            del entry['timestamp']

if __name__ == "__main__":
    print("🎯 Dersler çekiliyor...")
    lessons = get_all_lessons()
    
    print("🧠 Dersler yerleştiriliyor...")
    final_schedule = schedule_lessons(lessons)

    for key, lesson in final_schedule.items():
        day, slot_index, room = key
        print(f"{day} - {room} - Slot {slot_index+1}: {lesson['dersKodu']} - {lesson['dersAdi']}")

    remove_timestamps(final_schedule)
    check_schedule_conflicts(final_schedule)
    save_schedule_as_json(final_schedule)
    # print_empty_slots(final_schedule)
    print("📁 JSON dosyası oluşturuldu: final_schedule.json")