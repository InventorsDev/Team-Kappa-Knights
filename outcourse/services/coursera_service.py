import requests

def search_coursera_courses(tags, difficulty, max_results=10):
    query = " ".join(tags) + f" {difficulty}"
    url = "https://api.coursera.org/api/courses.v1"
    
    params = {
        "q": "search",
        "query": query,
        "limit": max_results,
        "fields": "slug,name,description"
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    results = []
    for element in data.get("elements", []):
        results.append({
            "title": element.get("name"),
            "provider": "Coursera",
            "url": f"https://www.coursera.org/learn/{element.get('slug')}",
            "is_free": True,  # Coursera lets you audit free
            "difficulty": difficulty,
            "tags": tags,
            "duration_minutes": None,
            "author": None,
            "publish_date": None
        })
    return results


print(search_coursera_courses(["python", "data science"], "beginner", 5))