from googleapiclient.discovery import build
from decouple import config

API_KEY = config("YOUTUBE_API_KEY")
YOUTUBE = build("youtube", "v3", developerKey=API_KEY)

def search_youtube_courses(tags, difficulty, max_results=10):
    query = f"{' '.join(tags)} {difficulty} free course"
    
    request = YOUTUBE.search().list(
        q=query,
        part="snippet",
        type="video",
        videoDuration="long",  # only long videos (20+ mins)
        maxResults=max_results
    )
    response = request.execute()
    
    results = []
    for item in response.get("items", []):
        video_id = item["id"]["videoId"]
        snippet = item["snippet"]
        
        results.append({
            "title": snippet["title"],
            "provider": "YouTube",
            "url": f"https://www.youtube.com/watch?v={video_id}",
            "is_free": True,
            "difficulty": difficulty,
            "tags": tags,
            "duration_minutes": None,  # can be fetched via Videos API if needed
            "author": snippet["channelTitle"],
            "publish_date": snippet["publishedAt"],
        })
    
    return results
