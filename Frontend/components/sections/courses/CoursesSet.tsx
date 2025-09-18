'use client'
import React, { useEffect } from 'react'
import CourseCard from './ui/CourseCard'
import { useUserStore, CourseDataType  } from '@/state/store'
import Loading from '@/app/loading'
import { stringify } from 'querystring'
// import { useCourseStore, CourseDataType } from '@/state/store'

const CoursesSet = () => {
  const { courses, setCourses, selectedSkillLevel, selectedTags } = useUserStore()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const fetchCourses = async () => {
      try {
        const res = await fetch('https://nuroki-backend.onrender.com/courses/', {
          method: 'GET',
          headers: {
            // Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        // console.log(selectedTags)

        // const res = await fetch('https://nuroki-backend.onrender.com/recommend/', {
        //   method: 'POST',
        //   headers: {
        //     // Authorization: `Bearer ${token}`,
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     skill_level: selectedSkillLevel,
        //     interests: selectedTags
        //   })
        // })


        if (!res.ok) throw new Error('Failed to fetch courses')
        const data: CourseDataType[] = await res.json()
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
              index: idx,
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
















// import React, { useEffect } from 'react'
// import CourseCard from './ui/CourseCard'
// import Link from 'next/link'
// import { StaticImageData } from 'next/image'

// type CourseDataType = {
//     title: string
//     content: string
//     tutor: string
//     duration: string
//     progress: number
//     overview: string
//     index: number
//     levelsCompleted: number
//     levelTotal: number
//     levelsArray: {
//         id: number
//         levelTitle: string
//         levelContent: string
//         levelTime: number
//         levelStatusIcon: StaticImageData | string
//         levelStatus: string
//     }[]
//     instructor: string
//     instructorRole: string
//     instructorCourses: string
//     instructorStudents: string
//     instructorRatings: number
// }

// export const courseData: CourseDataType[] = [
//     {
//         index: 0,
//         title: "Web Development",
//         content: "Learn to build responsive, modern websites from scratch, bring your ideas to life online.",
//         tutor: "Code Academy",
//         duration: "6",
//         progress: 40,
//         overview: 'Web Development is the backbone of the digital world. In this course, you’ll learn to create websites from scratch using HTML, CSS, and JavaScript, and explore modern frameworks. By the end, you’ll be able to design, build, and publish a functional website, whether for a career in tech, freelancing, or personal projects.',
//         levelsCompleted: 3,
//         levelTotal: 5,
//         levelsArray: [{
//             id: 1,
//             levelTitle: 'HTML Basics',
//             levelContent: 'Understand the core elements of web pages and build a solid foundation with HTML.',
//             levelTime: 45,
//             levelStatusIcon: '/dashboard/courses/completed.png',
//             levelStatus: 'Completed',
//         },
//         {
//             id: 2,
//             levelTitle: 'HTML Basics',
//             levelContent: 'Understand the core elements of web pages and build a solid foundation with HTML.',
//             levelTime: 45,
//             levelStatusIcon: '/dashboard/courses/completed.png',
//             levelStatus: 'Completed',
//         }],
//         instructor: 'David Angola',
//         instructorRole: 'Frontend WebDev',
//         instructorCourses: "5",
//         instructorStudents: "22k",
//         instructorRatings: 4.9
//     },
//     {
//         index: 1,
//         title: "Web Development",
//         content: "Learn to build responsive, modern websites from scratch, bring your ideas to life online.",
//         tutor: "Code Academy",
//         duration: "6",
//         progress: 40,
//         overview: 'Web Development is the backbone of the digital world. In this course, you’ll learn to create websites from scratch using HTML, CSS, and JavaScript, and explore modern frameworks. By the end, you’ll be able to design, build, and publish a functional website, whether for a career in tech, freelancing, or personal projects.',
//         levelsCompleted: 3,
//         levelTotal: 5,
//         levelsArray: [{
//             id: 1,
//             levelTitle: 'HTML Basics',
//             levelContent: 'Understand the core elements of web pages and build a solid foundation with HTML.',
//             levelTime: 45,
//             levelStatusIcon: '/dashboard/courses/completed.png',
//             levelStatus: 'Completed',
//         },
//         {
//             id: 2,
//             levelTitle: 'HTML Basics',
//             levelContent: 'Understand the core elements of web pages and build a solid foundation with HTML.',
//             levelTime: 45,
//             levelStatusIcon: '/dashboard/courses/completed.png',
//             levelStatus: 'Completed',
//         }],
//         instructor: 'David Angola',
//         instructorRole: 'Frontend WebDev',
//         instructorCourses: "5",
//         instructorStudents: "22k",
//         instructorRatings: 4.9
//     },
//     {
//         index: 0,
//         title: "Web Development",
//         content: "Learn to build responsive, modern websites from scratch, bring your ideas to life online.",
//         tutor: "Code Academy",
//         duration: "6",
//         progress: 40,
//         overview: 'Web Development is the backbone of the digital world. In this course, you’ll learn to create websites from scratch using HTML, CSS, and JavaScript, and explore modern frameworks. By the end, you’ll be able to design, build, and publish a functional website, whether for a career in tech, freelancing, or personal projects.',
//         levelsCompleted: 3,
//         levelTotal: 5,
//         levelsArray: [{
//             id: 1,
//             levelTitle: 'HTML Basics',
//             levelContent: 'Understand the core elements of web pages and build a solid foundation with HTML.',
//             levelTime: 45,
//             levelStatusIcon: '/dashboard/courses/completed.png',
//             levelStatus: 'Completed',
//         },
//         {
//             id: 2,
//             levelTitle: 'HTML Basics',
//             levelContent: 'Understand the core elements of web pages and build a solid foundation with HTML.',
//             levelTime: 45,
//             levelStatusIcon: '/dashboard/courses/completed.png',
//             levelStatus: 'Completed',
//         }],
//         instructor: 'David Angola',
//         instructorRole: 'Frontend WebDev',
//         instructorCourses: "5",
//         instructorStudents: "22k",
//         instructorRatings: 4.9
//     }
// ]

// const CoursesSet = () => {
//     // useEffect(() => {
//     //     const token = localStorage.getItem('token')
//     //     const fetchCourses = async () => {
//     //         try {
//     //             await fetch('nuroki-backend.onrender.com/recommend/', {
//     //                 method: 'POST',
//     //                 headers: {
//     //                     Authorization: `Bearer ${token}`,
//     //                     'Content-Type': 'applications/json'
//     //                 },
//     //                 body: JSON.stringify({
//     //                     skill_level: '',
//     //                     interests: ''
//     //                 }),
//     //             })
//     //         } catch (err) {
//     //             console.log(err)
//     //         }
//     //     }
//     //     fetchCourses()
//     // }, [])

//      useEffect(() => {
//         const token = localStorage.getItem('token')
//         const fetchCourses = async () => {
//             try {
//                const res = await fetch('nuroki-backend.onrender.com/courses/', {
//                     method: 'GET',
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'applications/json'
//                     }
//                 })
//                 const data = await res.json()
//             } catch (err) {
//                 console.log(err)
//             }
//         }
//         fetchCourses()
//     }, [])

//     return (
//         <div className='pt-3 flex flex-col md:grid grid-cols-3 gap-4'>
//             {courseData.map((item, idx) => {
//                 return (
//                     <div key={idx} className=''>
//                         <CourseCard props={{
//                             title: item.title,
//                             content: item.content,
//                             tutor: item.tutor,
//                             duration: item.duration,
//                             progress: item.progress,
//                             index: idx
//                         }} />
//                     </div>
//                 )
//             })
//             }
//         </div >
//     )
// }

// export default CoursesSet