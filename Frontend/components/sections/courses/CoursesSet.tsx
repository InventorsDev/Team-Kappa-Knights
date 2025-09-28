'use client'
import React, { useEffect } from 'react'
import CourseCard from './ui/CourseCard'
import { useUserStore, CourseDataType  } from '@/state/store'
import Loading from '@/app/loading'
import { useOnboardingStore } from '@/state/useOnboardingData'
import { stringify } from 'querystring'
// import { useCourseStore, CourseDataType } from '@/state/store'

const CoursesSet = () => {
  const { courses, setCourses, selectedSkillLevel, selectedTags } = useUserStore()
  const {interests, skillLevel} = useOnboardingStore()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const fetchCourses = async () => {
      try {
        // const res = await fetch('https://nuroki-backend.onrender.com/courses/', {
        //   method: 'GET',
        //   headers: {
        //     // Authorization: `Bearer ${token}`,
        //     'Content-Type': 'application/json',
        //   },
        // })

        console.log(selectedTags)

        const res = await fetch('https://nuroki-backend.onrender.com/outrecommendall/', {
          method: 'POST',
          headers: {
            // Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // skill_level: skillLevel,
            interest: interests,
          })
        })

        console.log(res)
         console.log('selected tags are:' + selectedTags)
        if (!res.ok) throw new Error('Failed to fetch courses')
          const returnedData = await res.json()
        const data: CourseDataType[] = returnedData.courses
      console.log(data)
        setCourses(data)


//         const res = await fetch('https://nuroki-backend.onrender.com/recommend/', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     // Authorization: `Bearer ${token}`, // if required
//   },
//   body: JSON.stringify({
//     skill_level: selectedSkillLevel,
//     interests: selectedTags
//   })
// })

// if (!res.ok) throw new Error(`Failed: ${res.status}`)

// const payload = await res.json()
// setCourses(payload.recommendations || [])

      } catch (err) {
        console.error(err)
      }
    }
    fetchCourses()
  }, [setCourses])

  // If no API courses yet, you could show placeholders
  const displayCourses = courses.length > 0 ? courses : []
      if (courses.length === 0) return <Loading /> 
      console.log(displayCourses)

  return (
    <div className="pt-3 flex flex-col md:grid grid-cols-3 gap-4">
      {displayCourses.map((item, idx) => (
        <div key={idx} className="flex">
          <CourseCard
            props={{
              title: item.title,
              content: item.description,
              tutor: item.tutor || 'Code Academy',
              duration: item.duration,
              progress: item.progress,
              link: item.course_url,
            }}
            className="flex-1"
          />
        </div>
      ))}
      {/* {} */}
    </div>
  )
}

export default CoursesSet






