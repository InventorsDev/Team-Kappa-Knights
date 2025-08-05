# tests/rocmend_course.py

from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from base.models import Courses, Tag

class RecommendCoursesTest(APITestCase):

    def setUp(self):
        # Create tags
        self.tag_ai = Tag.objects.create(name='AI')
        self.tag_web = Tag.objects.create(name='Web Development')

        # Create courses
        self.course1 = Courses.objects.create(
            title='Intro to AI',
            description='Learn AI basics',
            difficulty='beginner',
            rating=4.5
        )
        self.course1.tags.add(self.tag_ai)

        self.course2 = Courses.objects.create(
            title='Web Dev Bootcamp',
            description='Frontend and backend',
            difficulty='beginner',
            rating=4.7
        )
        self.course2.tags.add(self.tag_web)

        self.course3 = Courses.objects.create(
            title='Advanced AI',
            description='Deep learning and ML',
            difficulty='advanced',
            rating=4.9
        )
        self.course3.tags.add(self.tag_ai)

        self.url = reverse('recommend_courses')

    def test_recommend_courses_based_on_skill_and_interests(self):
        payload = {
            "skill_level": "beginner",
            "interests": ["AI", "Web Development"]
        }

        response = self.client.post(self.url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        returned_titles = [course['title'] for course in response.data]
        self.assertIn('Intro to AI', returned_titles)
        self.assertIn('Web Dev Bootcamp', returned_titles)
        self.assertNotIn('Advanced AI', returned_titles)

    def test_invalid_payload(self):
        payload = {
            "interests": ["AI"]
            # missing skill_level
        }

        response = self.client.post(self.url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('skill_level', response.data)
