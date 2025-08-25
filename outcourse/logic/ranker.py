def rank_courses(courses, tags):
    scored = []
    for course in courses:
        score = sum(tag.lower() in course["title"].lower() for tag in tags)
        scored.append((score, course))
    
    scored.sort(key=lambda x: x[0], reverse=True)
    return [c for _, c in scored]
