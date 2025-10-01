'use client'
import React, { useEffect } from 'react'
import CourseCard from './ui/CourseCard'
import { useUserStore, CourseDataType, useUserCourses  } from '@/state/store'
import Loading from '@/app/loading'
import { useOnboardingStore } from '@/state/useOnboardingData'
import { stringify } from 'querystring'
// import { useCourseStore, CourseDataType } from '@/state/store'

const CoursesSet = () => {
  const {selectedTags } = useUserStore()
  const { courses, setCourses} = useUserCourses()
  const {interests, skillLevel} = useOnboardingStore()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // helpers to parse arrays wrapped as {results: []} or {courses: []}
        const pickArray = (v: unknown): unknown[] => {
          if (Array.isArray(v)) return v
          if (typeof v === 'object' && v !== null) {
            const obj = v as Record<string, unknown>
            if (Array.isArray(obj.results)) return obj.results
            if (Array.isArray(obj.courses)) return obj.courses
          }
          return []
        }

        // Fetch DB courses and recommendations concurrently
        const [dbRes, recRes] = await Promise.all([
          fetch('https://nuroki-backend.onrender.com/courses/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
          }),
          fetch('https://nuroki-backend.onrender.com/outrecommendall/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              interest: interests,
              ...(skillLevel ? { skill_level: skillLevel } : {}),
            }),
          }),
        ])

        const dbList: CourseDataType[] = dbRes.ok ? (pickArray(await dbRes.json()) as CourseDataType[]) : []
        const recPayload = recRes.ok ? await recRes.json() : null
        const recList: CourseDataType[] = recPayload ? (pickArray(recPayload) as CourseDataType[] | null) || (recPayload.courses as CourseDataType[] | undefined) || [] : []

        // Merge DB-first, then append recommendations not already present by course_id
        const byId = new Map<number, CourseDataType>()
        for (const c of dbList) if (c && typeof c.course_id === 'number') byId.set(c.course_id, c)
        for (const c of recList) if (c && typeof c.course_id === 'number' && !byId.has(c.course_id)) byId.set(c.course_id, c)

        const merged = Array.from(byId.values())
        setCourses(merged)
      } catch (err) {
        console.error(err)
      }
    }
    fetchCourses()
  }, [interests, skillLevel, setCourses])

 
  const displayCourses = courses.length > 0 ? courses : []
      if (courses.length === 0) return <Loading /> 
      // console.log(displayCourses)

  return (
    <div className="pt-3 flex flex-col md:grid grid-cols-3 gap-4">
      {courses.length === 0 ? (
      <p className="col-span-3 text-center text-gray-500 font-semibold">
        No courses found
      </p>
    ) : (
      displayCourses.map((item) => (
        <div key={item.course_id} className="flex">
          <CourseCard
            props={{
              title: item.title,
              content: item.description,
              tutor: item.tutor || 'Code Academy',
              duration: item.duration,
              progress: item.progress,
              link: item.course_url,
              courseId: item.course_id,
            }}
            className="flex-1"
          />
        </div>
      ))
    )}
    </div>
  )
}

export default CoursesSet






