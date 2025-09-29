'use client'
import React, { useEffect } from 'react'
import CourseCard from './ui/CourseCard'
import { useUserStore, CourseDataType, useUserCourses  } from '@/state/store'
import Loading from '@/app/loading'
import { useOnboardingStore } from '@/state/useOnboardingData'

const CoursesSet = () => {
  const { selectedTags } = useUserStore()
  const { courses, setCourses } = useUserCourses()
  const { interests, skillLevel } = useOnboardingStore()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('https://nuroki-backend.onrender.com/outrecommendall/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            interest: interests,
            ...(skillLevel ? { skill_level: skillLevel } : {}),
          })
        })

        if (!res.ok) throw new Error('Failed to fetch courses')
        const returnedData = await res.json()
        const data: CourseDataType[] = returnedData.courses || returnedData.results || []
        setCourses(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setCourses([])
      }
    }
    fetchCourses()
  }, [setCourses, interests, skillLevel])

  const displayCourses = courses.length > 0 ? courses : []

  return (
    <div className="pt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.length === 0 ? (
        <div className="col-span-1 md:col-span-3">
          <Loading />
        </div>
      ) : displayCourses.length === 0 ? (
        <p className="col-span-1 md:col-span-3 text-center text-gray-500 font-semibold">No courses found</p>
      ) : (
        displayCourses.map((item, idx) => {
          const external = !!item.course_url && /^https?:\/\//i.test(item.course_url)
          const href = external ? item.course_url : `/courses/${idx}`
          const badge = external ? 'Outsourced' : 'In-house'
          return (
            <div key={idx}>
              <CourseCard
                props={{
                  title: item.title,
                  content: item.description,
                  tutor: item.tutor || 'Code Academy',
                  duration: item.duration,
                  progress: item.progress,
                  link: href,
                  badge,
                  external,
                }}
              />
            </div>
          )
        })
      )}
    </div>
  )
}

export default CoursesSet






