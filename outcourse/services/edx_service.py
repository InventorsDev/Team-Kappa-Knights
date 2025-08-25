import requests
from bs4 import BeautifulSoup

def search_classcentral_courses(tags, difficulty, max_results=10):
    query = " ".join(tags) + f" {difficulty}"
    url = f"https://www.classcentral.com/search?q={query}"
    
    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    
    courses = []
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        for card in soup.select("a.course-name", limit=max_results):
            title = card.text.strip()
            course_url = "https://www.classcentral.com" + card.get("href")
            
            courses.append({
                "title": title,
                "provider": "Class Central (edX/Coursera/etc)",
                "url": course_url,
                "is_free": True,  # CC filters free courses by default
                "difficulty": difficulty,
                "tags": tags,
                "duration_minutes": None,
                "author": None,
                "publish_date": None
            })
    return courses

print(search_classcentral_courses(["python", "data science"], "beginner", 5))