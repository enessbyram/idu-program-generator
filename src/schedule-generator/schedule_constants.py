DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"]

SLOTS = [
    ("Lesson I", "08:30", "09:15"),
    ("Lesson II", "09:25", "10:10"),
    ("Lesson III", "10:20", "11:05"),
    ("Lesson IV", "11:15", "12:00"),
    ("Lesson V", "12:30", "13:15"),
    ("Lesson VI", "13:25", "14:10"),
    ("Lesson VII", "14:20", "15:05"),
    ("Lesson VIII", "15:15", "16:00"),
    ("Lesson IX", "16:10", "16:55"),
    ("Lesson X", "17:05", "17:50"),
    ("Lesson XI", "18:00", "18:45")
]

AVAILABLE_SLOT_INDEXES = list(range(1, 11))

ROOMS = {
    "A202": 60,
    "A203": 60,
    "A209": 80,
    "A211": 80,
    "C307": 50,
    "AL01": 68,
    "AL06": 65,
    "AL05": 150
}

def is_valid_day_for_course(course_code, day):
    if course_code.startswith("USEC"):
        return day == "Cuma"
    elif course_code.startswith("FORM"):
        return day in ["Pazartesi", "Cuma"]
    else:
        return day in ["Salı", "Çarşamba", "Perşembe", "Pazartesi", "Cuma"]
