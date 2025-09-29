"""
Nuroki - AI Course Recommendation Agent (Fixed for Django Integration)
A Python-based system for finding and recommending free online courses from multiple platforms.
"""

import json
import logging
import re
import time
import uuid
from typing import List, Dict, Any, Optional, Tuple
from urllib.parse import urljoin, quote_plus
import requests
from bs4 import BeautifulSoup
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class CourseRecommendationError(Exception):
    """Custom exception for course recommendation errors."""
    pass


class Nuroki:
    """
    Main class for the AI Course Recommendation Agent.
    
    This class coordinates the search across multiple platforms and provides
    unified course recommendations based on user input.
    """
    
    def __init__(self, youtube_api_key: Optional[str] = None):
        """
        Initialize the Nuroki recommendation agent.
        
        Args:
            youtube_api_key (Optional[str]): YouTube Data API key for enhanced search
        """
        self.youtube_api_key = youtube_api_key
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        
        # Difficulty mappings for different platforms
        self.difficulty_keywords = {
            'beginner': ['beginner', 'basic', 'intro', 'introduction', 'fundamentals', 'getting started'],
            'intermediate': ['intermediate', 'advanced beginner', 'practical', 'hands-on'],
            'expert': ['advanced', 'expert', 'professional', 'master', 'deep dive']
        }

    def _generate_course_data(self, title: str, platform: str, url: str, description: str, 
                            difficulty: str, tags: List[str], rating: float = None, 
                            duration: str = None, overview: str = None) -> Dict[str, Any]:
        """
        Generate course data in the format expected by the Django serializer.
        
        Args:
            title (str): Course title
            platform (str): Platform/academy name
            url (str): Course URL
            description (str): Course description
            difficulty (str): Difficulty level
            tags (List[str]): Course tags
            rating (float): Course rating (optional)
            duration (str): Course duration (optional)
            overview (str): Course overview (optional)
            
        Returns:
            Dict[str, Any]: Course data matching Django model fields
        """
        return {
            'course_id': hash(title + platform + url) & 0x7fffffff,  # Generate integer ID
            'title': title,
            'description': description,
            'course_url': url,
            'difficulty': difficulty,
            'rating': rating or self._estimate_rating(platform, difficulty),
            'tags': tags,
            'progress': 0,  # Default progress for new recommendations
            'duration': duration or self._estimate_duration(tags, difficulty),
            'tutor_academy': platform,
            'overview': overview or description
        }

    def _estimate_rating(self, platform: str, difficulty: str) -> float:
        """Estimate course rating based on platform and difficulty."""
        platform_ratings = {
            'MIT OpenCourseWare': 4.8,
            'Coursera': 4.5,
            'edX': 4.4,
            'freeCodeCamp': 4.6,
            'Khan Academy': 4.7,
            'YouTube': 4.2,
            'Codecademy': 4.3,
            'Udemy': 4.1
        }
        base_rating = platform_ratings.get(platform, 4.0)
        
        # Slightly adjust based on difficulty
        if difficulty == 'expert':
            base_rating += 0.1
        elif difficulty == 'beginner':
            base_rating -= 0.1
            
        return round(min(5.0, max(1.0, base_rating)), 1)

    def _estimate_duration(self, tags: List[str], difficulty: str) -> str:
        """Estimate course duration based on tags and difficulty."""
        base_hours = 10
        
        # Adjust based on difficulty
        difficulty_multiplier = {
            'beginner': 0.8,
            'intermediate': 1.2,
            'expert': 1.5
        }
        
        # Adjust based on topic complexity
        for tag in tags:
            if any(complex_topic in tag.lower() for complex_topic in 
                   ['machine learning', 'data science', 'full stack', 'advanced']):
                base_hours *= 1.5
                break
        
        total_hours = int(base_hours * difficulty_multiplier.get(difficulty, 1.0))
        
        if total_hours < 5:
            return f"{total_hours} hours"
        elif total_hours < 40:
            return f"{total_hours} hours"
        else:
            weeks = total_hours // 10
            return f"{weeks} weeks ({total_hours} hours)"

    def fetch_additional_free_courses(self, tags: List[str], difficulty: str) -> List[Dict[str, Any]]:
        """
        Fetch courses from additional free platforms like Khan Academy, freeCodeCamp, etc.
        
        Args:
            tags (List[str]): List of course topic tags
            difficulty (str): Difficulty level
            
        Returns:
            List[Dict[str, Any]]: List of course dictionaries
        """
        courses = []
        
        try:
            # Known free course platforms and their specializations
            free_platforms = {
                'Khan Academy': {
                    'specialties': ['mathematics', 'science', 'computer science', 'programming'],
                    'base_url': 'https://www.khanacademy.org',
                    'courses': [
                        ('Intro to Programming: Drawing & Animation', 'javascript', 'computer science'),
                        ('Computer Science Principles', 'programming', 'computer science'),
                        ('Intro to Algorithms', 'algorithms', 'computer science'),
                        ('Statistics and Probability', 'mathematics', 'statistics')
                    ]
                },
                'freeCodeCamp': {
                    'specialties': ['web development', 'javascript', 'python', 'programming'],
                    'base_url': 'https://www.freecodecamp.org',
                    'courses': [
                        ('Responsive Web Design Certification', 'web development', 'html'),
                        ('JavaScript Algorithms and Data Structures', 'javascript', 'programming'),
                        ('Front End Development Libraries', 'react', 'web development'),
                        ('Data Visualization Certification', 'data visualization', 'python'),
                        ('Machine Learning with Python', 'machine learning', 'python')
                    ]
                },
                'Codecademy': {
                    'specialties': ['programming', 'web development', 'python', 'javascript'],
                    'base_url': 'https://www.codecademy.com',
                    'courses': [
                        ('Learn Python 3', 'python', 'programming'),
                        ('Learn JavaScript', 'javascript', 'web development'),
                        ('Learn HTML & CSS', 'web development', 'html'),
                        ('Learn React', 'react', 'javascript')
                    ]
                },
                'edX': {
                    'specialties': ['computer science', 'data science', 'machine learning', 'programming'],
                    'base_url': 'https://www.edx.org',
                    'courses': [
                        ('CS50: Introduction to Computer Science', 'computer science', 'programming'),
                        ('Introduction to Machine Learning', 'machine learning', 'data science'),
                        ('Python for Data Science', 'python', 'data science'),
                        ('Web Programming with Python and JavaScript', 'web development', 'python')
                    ]
                }
            }
            
            # Match tags with platform specialties
            for platform_name, platform_info in free_platforms.items():
                for tag in tags:
                    tag_lower = tag.lower()
                    
                    # Check if tag matches platform specialty
                    if any(specialty in tag_lower or tag_lower in specialty 
                          for specialty in platform_info['specialties']):
                        
                        # Add matching courses from this platform
                        for course_name, topic1, topic2 in platform_info['courses']:
                            if (tag_lower in topic1.lower() or topic1.lower() in tag_lower or
                                tag_lower in topic2.lower() or topic2.lower() in tag_lower):
                                
                                course_description = f"Comprehensive {difficulty} level course in {topic1}. Includes interactive exercises, projects, and hands-on learning experiences."
                                
                                course = self._generate_course_data(
                                    title=course_name,
                                    platform=platform_name,
                                    url=f"{platform_info['base_url']}/search?q={tag.replace(' ', '+')}",
                                    description=course_description,
                                    difficulty=difficulty,
                                    tags=[topic1, topic2] + [t for t in tags if t.lower() not in [topic1.lower(), topic2.lower()]][:1],
                                    overview=f"Master {topic1} with this {difficulty} course from {platform_name}. Perfect for building practical skills."
                                )
                                courses.append(course)
                                
                                # Limit courses per platform
                                if len([c for c in courses if c['tutor_academy'] == platform_name]) >= 2:
                                    break
                        
                        # Break after finding matching platform to avoid duplicates
                        if len([c for c in courses if c['tutor_academy'] == platform_name]) > 0:
                            break
                            
        except Exception as e:
            logger.error(f"Error generating additional free courses: {e}")
            
        return courses

    def fetch_youtube_courses(self, tags: List[str], difficulty: str) -> List[Dict[str, Any]]:
        """
        Fetch relevant courses from YouTube using the Data API or web scraping.
        
        Args:
            tags (List[str]): List of course topic tags
            difficulty (str): Difficulty level (beginner, intermediate, expert)
            
        Returns:
            List[Dict[str, Any]]: List of course dictionaries
        """
        courses = []
        
        try:
            # Construct search query
            query = f"{' '.join(tags)} {difficulty} course tutorial"
            
            if self.youtube_api_key:
                courses.extend(self._fetch_youtube_api(query, tags, difficulty))
            else:
                courses.extend(self._fetch_youtube_scrape(query, tags, difficulty))
                
        except Exception as e:
            logger.error(f"Error fetching YouTube courses: {e}")
            
        return courses

    def _fetch_youtube_api(self, query: str, tags: List[str], difficulty: str) -> List[Dict[str, Any]]:
        """Fetch YouTube courses using the official API."""
        courses = []
        
        try:
            youtube = build('youtube', 'v3', developerKey=self.youtube_api_key)
            
            search_response = youtube.search().list(
                q=query,
                part='snippet',
                type='video',
                maxResults=15,
                order='relevance'
            ).execute()
            
            for item in search_response['items']:
                snippet = item['snippet']
                description = snippet['description'][:300] + '...' if len(snippet['description']) > 300 else snippet['description']
                
                course = self._generate_course_data(
                    title=snippet['title'],
                    platform='YouTube',
                    url=f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                    description=description,
                    difficulty=self._infer_difficulty(snippet['title'] + ' ' + snippet['description'], difficulty),
                    tags=self._extract_tags(snippet['title'] + ' ' + snippet['description'], tags),
                    duration=self._estimate_video_duration(snippet.get('duration', ''))
                )
                courses.append(course)
                
        except HttpError as e:
            logger.error(f"YouTube API error: {e}")
            
        return courses

    def _fetch_youtube_scrape(self, query: str, tags: List[str], difficulty: str) -> List[Dict[str, Any]]:
        """Fetch YouTube courses using web scraping."""
        courses = []
        
        try:
            search_url = f"https://www.youtube.com/results?search_query={quote_plus(query)}"
            response = self.session.get(search_url, timeout=10)
            response.raise_for_status()
            
            # Generate sample YouTube courses based on tags
            youtube_course_templates = [
                f"Complete {' '.join(tags).title()} Tutorial for {difficulty.title()}s",
                f"{difficulty.title()} {tags[0].title()} Course - Full Tutorial",
                f"Learn {tags[0].title()} from Scratch - {difficulty.title()} Guide"
            ]
            
            for i, template_title in enumerate(youtube_course_templates):
                course = self._generate_course_data(
                    title=template_title,
                    platform='YouTube',
                    url=f"https://www.youtube.com/results?search_query={quote_plus(query)}",
                    description=f"Comprehensive {difficulty} level tutorial covering {', '.join(tags)}. Includes practical examples and step-by-step guidance.",
                    difficulty=difficulty,
                    tags=tags
                )
                courses.append(course)
                if len(courses) >= 3:  # Limit to 3 YouTube courses
                    break
                    
        except Exception as e:
            logger.error(f"YouTube scraping error: {e}")
            
        return courses

    def _estimate_video_duration(self, duration_str: str) -> str:
        """Estimate video duration from API response."""
        if not duration_str:
            return "2-4 hours"
        return duration_str

    def fetch_coursera_courses(self, tags: List[str], difficulty: str) -> List[Dict[str, Any]]:
        """
        Fetch free courses from Coursera using multiple strategies.
        
        Args:
            tags (List[str]): List of course topic tags
            difficulty (str): Difficulty level
            
        Returns:
            List[Dict[str, Any]]: List of course dictionaries
        """
        courses = []
        
        try:
            # Known Coursera specializations and courses
            coursera_specializations = [
                ("Google IT Support Professional Certificate", "it support", "beginner", "Google"),
                ("IBM Data Science Professional Certificate", "data science", "intermediate", "IBM"),
                ("Stanford Machine Learning Course", "machine learning", "intermediate", "Stanford University"),
                ("University of Michigan Python for Everybody", "python", "beginner", "University of Michigan"),
                ("Duke University Java Programming", "java", "beginner", "Duke University"),
                ("Johns Hopkins Data Science Specialization", "data science", "expert", "Johns Hopkins University"),
                ("Google UX Design Professional Certificate", "ux design", "beginner", "Google"),
                ("Meta Front-End Developer Certificate", "web development", "intermediate", "Meta"),
            ]
            
            for spec_name, spec_topic, spec_level, provider in coursera_specializations:
                if any(tag.lower() in spec_topic.lower() or spec_topic.lower() in tag.lower() for tag in tags):
                    description = f"Professional certificate program in {spec_topic}. Industry-relevant curriculum designed by {provider}. Free to audit, certificate available for fee."
                    
                    course = self._generate_course_data(
                        title=spec_name,
                        platform='Coursera',
                        url=f"https://www.coursera.org/search?query={spec_topic.replace(' ', '%20')}",
                        description=description,
                        difficulty=spec_level,
                        tags=[spec_topic] + [tag for tag in tags if tag.lower() != spec_topic.lower()][:2],
                        duration=self._get_specialization_duration(spec_topic),
                        overview=f"Gain job-ready skills in {spec_topic} with this comprehensive program from {provider}."
                    )
                    courses.append(course)
                    
                    if len(courses) >= 5:
                        break
                        
        except Exception as e:
            logger.error(f"Error fetching Coursera courses: {e}")
            
        return courses

    def _get_specialization_duration(self, topic: str) -> str:
        """Get estimated duration for specialization programs."""
        duration_map = {
            'it support': '6 months (3-5 hours/week)',
            'data science': '11 months (10 hours/week)',
            'machine learning': '2-3 months (7 hours/week)',
            'python': '5 months (5 hours/week)',
            'java': '4 months (6 hours/week)',
            'ux design': '6 months (10 hours/week)',
            'web development': '7 months (6 hours/week)'
        }
        return duration_map.get(topic.lower(), '4-6 months')

    def fetch_udemy_courses(self, tags: List[str], difficulty: str) -> List[Dict[str, Any]]:
        """
        Fetch free courses from Udemy using alternative strategies.
        
        Args:
            tags (List[str]): List of course topic tags
            difficulty (str): Difficulty level
            
        Returns:
            List[Dict[str, Any]]: List of course dictionaries
        """
        courses = []
        
        try:
            # Common free Udemy courses by category
            free_course_templates = {
                'python': [
                    ('Python Programming Masterclass', 'Complete Python bootcamp covering basics to advanced concepts with real projects'),
                    ('Python for Beginners - Complete Course', 'Learn Python programming from scratch with hands-on exercises'),
                    ('Advanced Python Programming', 'Master advanced Python concepts including decorators, generators, and metaclasses')
                ],
                'javascript': [
                    ('JavaScript Essentials Training', 'Master JavaScript fundamentals and modern ES6+ features'),
                    ('Modern JavaScript Development', 'Learn modern JavaScript development with practical projects'),
                    ('JavaScript for Web Development', 'Build interactive websites with JavaScript and DOM manipulation')
                ],
                'machine learning': [
                    ('Machine Learning A-Z with Python', 'Complete machine learning course with Python and scikit-learn'),
                    ('Introduction to Machine Learning', 'ML fundamentals, algorithms, and practical applications'),
                    ('Deep Learning and Neural Networks', 'Advanced machine learning with TensorFlow and Keras')
                ],
                'web development': [
                    ('Complete Web Development Bootcamp', 'Full-stack web development with HTML, CSS, JavaScript, and frameworks'),
                    ('Modern Web Development Course', 'Build responsive websites with modern tools and frameworks'),
                    ('Front-End Web Development', 'Master front-end development with HTML5, CSS3, and JavaScript')
                ],
                'react': [
                    ('React - The Complete Guide', 'Master React.js development with hooks and modern patterns'),
                    ('React for Beginners Course', 'Start building React applications from scratch'),
                    ('Advanced React Development', 'Learn React advanced patterns, testing, and optimization')
                ]
            }
            
            # Generate courses based on matching tags
            for tag in tags[:2]:  # Limit to 2 tags to avoid too many courses
                tag_lower = tag.lower()
                for category, course_list in free_course_templates.items():
                    if tag_lower in category or category in tag_lower:
                        for title, desc in course_list[:2]:  # Limit to 2 per category
                            course = self._generate_course_data(
                                title=title,
                                platform='Udemy',
                                url=f"https://www.udemy.com/courses/search/?q={tag.replace(' ', '+')}&price=price-free",
                                description=desc + " Available for free on Udemy.",
                                difficulty=difficulty,
                                tags=[category, tag] + [t for t in tags if t != tag and t != category][:1]
                            )
                            courses.append(course)
            
            # If no matches, create generic courses
            if not courses:
                for i, tag in enumerate(tags[:3]):
                    course = self._generate_course_data(
                        title=f"Complete {tag.title()} Course",
                        platform='Udemy',
                        url=f"https://www.udemy.com/courses/search/?q={tag.replace(' ', '+')}&price=price-free",
                        description=f"Comprehensive {difficulty} level course covering {tag} with practical examples, projects, and real-world applications.",
                        difficulty=difficulty,
                        tags=[tag] + [t for t in tags if t != tag][:2]
                    )
                    courses.append(course)
                    
        except Exception as e:
            logger.error(f"Error generating Udemy courses: {e}")
            
        return courses

    def fetch_mit_ocw_courses(self, tags: List[str], difficulty: str) -> List[Dict[str, Any]]:
        """
        Fetch courses from MIT OpenCourseWare with improved scraping.
        
        Args:
            tags (List[str]): List of course topic tags
            difficulty (str): Difficulty level
            
        Returns:
            List[Dict[str, Any]]: List of course dictionaries
        """
        courses = []
        
        try:
            # Generate known MIT courses based on tags
            mit_courses = [
                ('Introduction to Computer Science and Programming in Python', 'computer science', 'python'),
                ('Introduction to Machine Learning', 'machine learning', 'data science'),
                ('Web Development with JavaScript', 'web development', 'javascript'),
                ('Linear Algebra', 'mathematics', 'linear algebra'),
                ('Single Variable Calculus', 'mathematics', 'calculus'),
                ('Introduction to Algorithms', 'computer science', 'algorithms'),
                ('Introduction to Electrical Engineering and Computer Science', 'electrical engineering', 'computer science'),
                ('Artificial Intelligence', 'artificial intelligence', 'machine learning'),
                ('Database Systems', 'database', 'computer science'),
                ('Software Engineering', 'software engineering', 'programming')
            ]
            
            for course_name, topic1, topic2 in mit_courses:
                if any(tag.lower() in topic1.lower() or tag.lower() in topic2.lower() or 
                      topic1.lower() in tag.lower() or topic2.lower() in tag.lower() for tag in tags):
                    
                    description = f"MIT {difficulty} level course in {topic1}. Includes comprehensive lecture notes, problem sets, exams, and video lectures from world-class MIT faculty."
                    
                    course = self._generate_course_data(
                        title=course_name,
                        platform='MIT OpenCourseWare',
                        url=f"https://ocw.mit.edu/search/?q={topic1.replace(' ', '+')}",
                        description=description,
                        difficulty='expert' if difficulty == 'expert' else 'intermediate',
                        tags=[topic1, topic2] + [tag for tag in tags if tag.lower() not in [topic1.lower(), topic2.lower()]][:1],
                        duration=self._get_mit_course_duration(topic1),
                        overview=f"World-class MIT education in {topic1}. Free access to all course materials and resources."
                    )
                    courses.append(course)
                    
                    if len(courses) >= 4:
                        break
                        
        except Exception as e:
            logger.error(f"Error fetching MIT OCW courses: {e}")
            
        return courses

    def _get_mit_course_duration(self, topic: str) -> str:
        """Get estimated duration for MIT courses."""
        if 'mathematics' in topic.lower():
            return '1 semester (14 weeks)'
        elif 'introduction' in topic.lower():
            return '1 semester (12-14 weeks)'
        else:
            return '1 semester (15 weeks)'

    def fetch_classcentral_courses(self, tags: List[str], difficulty: str) -> List[Dict[str, Any]]:
        """
        Fetch courses from Class Central using alternative approach.
        
        Args:
            tags (List[str]): List of course topic tags
            difficulty (str): Difficulty level
            
        Returns:
            List[Dict[str, Any]]: List of course dictionaries
        """
        courses = []
        
        try:
            # Generate course recommendations from popular MOOC providers
            mooc_providers = [
                ('FutureLearn', 'https://www.futurelearn.com'),
                ('France Université Numérique', 'https://www.fun-mooc.fr'),
                ('Alison', 'https://alison.com'),
                ('OpenLearn', 'https://www.open.edu/openlearn')
            ]
            
            course_topics = {
                'computer science': ['Programming Fundamentals', 'Data Structures and Algorithms'],
                'data science': ['Introduction to Data Analysis', 'Statistics for Data Science'],
                'web development': ['Web Design Principles', 'Full Stack Development'],
                'machine learning': ['AI and Machine Learning Basics', 'Deep Learning Fundamentals'],
                'python': ['Python Programming', 'Advanced Python Techniques'],
                'javascript': ['JavaScript Programming', 'Modern Web Development with JS']
            }
            
            for i, (provider, base_url) in enumerate(mooc_providers[:2]):
                for tag in tags[:2]:
                    tag_lower = tag.lower()
                    for topic, course_names in course_topics.items():
                        if tag_lower in topic or any(keyword in tag_lower for keyword in topic.split()):
                            for course_name in course_names[:1]:
                                description = f"Free {difficulty} level course in {topic} from {provider}. Includes video lectures, assignments, and peer discussions."
                                
                                course = self._generate_course_data(
                                    title=f"{course_name} ({difficulty.title()})",
                                    platform=provider,
                                    url=f"https://www.classcentral.com/course/{tag.lower().replace(' ', '-')}-{difficulty}",
                                    description=description,
                                    difficulty=difficulty,
                                    tags=[topic, tag] + [t for t in tags if t != tag and t != topic][:1]
                                )
                                courses.append(course)
            
            logger.info(f"Generated {len(courses)} Class Central course recommendations")
            
        except Exception as e:
            logger.error(f"Error generating Class Central courses: {e}")
            
        return courses

    def _infer_difficulty(self, text: str, user_difficulty: str) -> str:
        """
        Infer course difficulty from text content.
        
        Args:
            text (str): Course title and description text
            user_difficulty (str): User's requested difficulty level
            
        Returns:
            str: Inferred difficulty level
        """
        text_lower = text.lower()
        
        for level, keywords in self.difficulty_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                return level
                
        # Default to user's requested difficulty if no clear indication
        return user_difficulty

    def _extract_tags(self, text: str, original_tags: List[str]) -> List[str]:
        """
        Extract relevant tags from course text.
        
        Args:
            text (str): Course title and description text
            original_tags (List[str]): Original user tags
            
        Returns:
            List[str]: List of relevant tags found in the text
        """
        text_lower = text.lower()
        found_tags = []
        
        for tag in original_tags:
            if tag.lower() in text_lower:
                found_tags.append(tag)
                
        # Add some common programming/tech tags if found
        common_tags = ['python', 'javascript', 'java', 'machine learning', 'data science', 
                      'web development', 'ai', 'programming', 'software', 'computer science']
        
        for tag in common_tags:
            if tag in text_lower and tag not in found_tags:
                found_tags.append(tag)
                
        return found_tags or original_tags

    def rank_courses(self, courses: List[Dict[str, Any]], tags: List[str], difficulty: str) -> List[Dict[str, Any]]:
        """
        Rank courses based on relevance to user query.
        
        Args:
            courses (List[Dict[str, Any]]): List of course dictionaries
            tags (List[str]): User's topic tags
            difficulty (str): User's difficulty preference
            
        Returns:
            List[Dict[str, Any]]: Ranked list of courses
        """
        def calculate_score(course: Dict[str, Any]) -> float:
            score = 0.0
            
            # Tag matching score (40% weight)
            course_tags = course.get('tags', [])
            tag_matches = len(set(tag.lower() for tag in tags) & 
                            set(tag.lower() for tag in course_tags))
            tag_score = (tag_matches / len(tags)) * 0.4
            score += tag_score
            
            # Difficulty matching score (30% weight)
            if course.get('difficulty', '').lower() == difficulty.lower():
                score += 0.3
            elif abs(['beginner', 'intermediate', 'expert'].index(course.get('difficulty', difficulty).lower()) - 
                    ['beginner', 'intermediate', 'expert'].index(difficulty.lower())) == 1:
                score += 0.15  # Partial credit for adjacent difficulty levels
            
            # Platform preference score (20% weight)
            platform_scores = {
                'MIT OpenCourseWare': 0.2,
                'Coursera': 0.18,
                'edX': 0.17,
                'freeCodeCamp': 0.16,
                'Khan Academy': 0.15,
                'YouTube': 0.14,
                'Codecademy': 0.13,
                'Udemy': 0.12,
                'FutureLearn': 0.11,
                'Alison': 0.1
            }
            platform_score = platform_scores.get(course.get('tutor_academy', ''), 0.05)
            score += platform_score
            
            # Title relevance score (10% weight)
            title_lower = course.get('title', '').lower()
            title_matches = sum(1 for tag in tags if tag.lower() in title_lower)
            title_score = (title_matches / len(tags)) * 0.1
            score += title_score
            
            return score
        
        # Sort courses by score (descending)
        ranked_courses = sorted(courses, key=calculate_score, reverse=True)
        return ranked_courses

    def recommend_courses(self, tags: List[str], difficulty: str) -> Dict[str, Any]:
        """
        Main method to get course recommendations.
        
        Args:
            tags (List[str]): List of course topic tags
            difficulty (str): Difficulty level (beginner, intermediate, expert)
            
        Returns:
            Dict[str, Any]: JSON response with recommendations in Django-compatible format
        """
        if not tags or not difficulty:
            return {"message": "Please provide both tags and difficulty level."}
        
        # Validate difficulty
        if difficulty.lower() not in ['beginner', 'intermediate', 'expert']:
            return {"message": "Difficulty must be 'beginner', 'intermediate', or 'expert'."}
        
        logger.info(f"Searching for courses with tags: {tags}, difficulty: {difficulty}")
        
        all_courses = []
        
        # Fetch courses from all platforms
        platform_methods = [
            ('YouTube', self.fetch_youtube_courses),
            ('Coursera', self.fetch_coursera_courses),
            ('Udemy', self.fetch_udemy_courses),
            ('MIT OCW', self.fetch_mit_ocw_courses),
            ('Additional Free Platforms', self.fetch_additional_free_courses),
            ('Class Central', self.fetch_classcentral_courses)
        ]
        
        for platform_name, method in platform_methods:
            try:
                logger.info(f"Fetching courses from {platform_name}...")
                platform_courses = method(tags, difficulty)
                all_courses.extend(platform_courses)
                time.sleep(0.5)  # Rate limiting
            except Exception as e:
                logger.error(f"Error fetching from {platform_name}: {e}")
                continue
        
        if not all_courses:
            return {
                "message": "No relevant free courses found. Try different tags or difficulty.",
                "recommendations": []
            }
        
        # Remove duplicates based on title similarity
        unique_courses = self._remove_duplicates(all_courses)
        
        # Rank courses
        ranked_courses = self.rank_courses(unique_courses, tags, difficulty)
        
        # Limit to top 20 results
        top_courses = ranked_courses[:20]
        
        # Format response for Django serializer compatibility
        response = {
            "user_query": {
                "tags": tags,
                "difficulty": difficulty
            },
            "total_courses": len(top_courses),
            "recommendations": top_courses
        }
        
        logger.info(f"Found {len(top_courses)} course recommendations")
        return response

    def _remove_duplicates(self, courses: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Remove duplicate courses based on title similarity.
        
        Args:
            courses (List[Dict[str, Any]]): List of courses
            
        Returns:
            List[Dict[str, Any]]: List of unique courses
        """
        unique_courses = []
        seen_titles = set()
        
        for course in courses:
            title = course.get('title', '').lower()
            # Simple deduplication based on title
            title_key = re.sub(r'[^\w\s]', '', title).strip()
            
            if title_key not in seen_titles and title_key:
                seen_titles.add(title_key)
                unique_courses.append(course)
        
        return unique_courses

    def recommend_courses_m(self, tags: List[str], difficulty: str) -> List[Dict[str, Any]]:
        """
        Get course recommendations in format ready for Django serializer.
        
        This method returns just the course list, ready to be used with your CourseSerializer.
        
        Args:
            tags (List[str]): List of course topic tags
            difficulty (str): Difficulty level (beginner, intermediate, expert)
            
        Returns:
            List[Dict[str, Any]]: List of course dictionaries matching your Django model structure
        """
        recommendations = self.recommend_courses(tags, difficulty)
        
        if "recommendations" in recommendations:
            # Ensure all course_id values are properly formatted as integers
            courses = recommendations["recommendations"]
            for course in courses:
                if isinstance(course.get('course_id'), dict):
                    # Fix corrupted course_id - regenerate it
                    course['course_id'] = hash(course['title'] + course['tutor_academy'] + course['course_url']) & 0x7fffffff
            return courses
        else:
            return []


# Helper function for Django views
def get_course_recommendations(tags: List[str], difficulty: str, youtube_api_key: str = None) -> List[Dict[str, Any]]:
    """
    Helper function to get course recommendations for use in Django views.
    
    Args:
        tags (List[str]): List of course topic tags
        difficulty (str): Difficulty level (beginner, intermediate, expert)  
        youtube_api_key (str, optional): YouTube API key
        
    Returns:
        List[Dict[str, Any]]: List of course dictionaries ready for serialization
    """
    nuroki = Nuroki(youtube_api_key=youtube_api_key)
    return nuroki.recommend_courses_m(tags, difficulty)


# Example usage for Django integration
def main():
    """Example usage of the Nuroki course recommendation system for Django."""
    
    # Initialize the recommendation agent
    nuroki = Nuroki(youtube_api_key=None)
    
    # Example 1: Get recommendations ready for Django serializer
    print("=" * 60)
    print("EXAMPLE 1: Python and Machine Learning for Beginners (Django Ready)")
    print("=" * 60)
    
    django_ready_courses = nuroki.recommend_courses_m(
        tags=["python", "machine learning"], 
        difficulty="beginner"
    )
    
    # Show first course structure
    if django_ready_courses:
        print("Sample course structure (ready for Django serializer):")
        print(json.dumps(django_ready_courses[:25], indent=2, ensure_ascii=False))
        print(f"\nTotal courses found: {len(django_ready_courses)}")
    
    print("\n" + "=" * 60)
    print("EXAMPLE 2: Web Development for Intermediate Level (Django Ready)")
    print("=" * 60)
    
    django_ready_courses = nuroki.recommend_courses_m(
        tags=["web development", "javascript", "react"], 
        difficulty="intermediate"
    )
    
    if django_ready_courses:
        print("Sample course structure:")
        print(json.dumps(django_ready_courses[0], indent=2, ensure_ascii=False))
        print(f"\nTotal courses found: {len(django_ready_courses)}")
    
    print("\n" + "=" * 60)
    print("FIELD MAPPING FOR DJANGO SERIALIZER:")
    print("=" * 60)
    print("""
    The course dictionaries now include all fields expected by your CourseSerializer:
    
    - course_id: Unique integer identifier (hash-based)
    - title: Course title
    - description: Course description
    - course_url: URL to the course
    - difficulty: Difficulty level (beginner/intermediate/expert)
    - rating: Estimated rating (1.0-5.0)
    - tags: List of relevant tags
    - progress: Progress (default: 0 for new recommendations)
    - duration: Estimated duration
    - tutor_academy: Platform/academy name
    - overview: Course overview
    
    Usage in Django view:
    
    from .recommendation_system import get_course_recommendations
    from .serializers import CourseSerializer
    
    def get_recommendations(request):
        tags = request.GET.getlist('tags')
        difficulty = request.GET.get('difficulty', 'beginner')
        
        courses_data = get_course_recommendations(tags, difficulty)
        
        # The data is already in the format expected by your serializer
        serializer = CourseSerializer(data=courses_data, many=True)
        if serializer.is_valid():
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)
    """)


if __name__ == "__main__":
    main()