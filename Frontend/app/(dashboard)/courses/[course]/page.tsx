'use client'
import { useUserCourses } from '@/state/store'
import Details from '@/components/sections/courses/Details'
import DetailCards from '@/components/sections/courses/ui/DetailCards'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Back from '@/public/dashboard/backArrow.png'
import { useEffect, useState } from 'react'
import Locked from '@/public/dashboard/courses/locked.png'
import Completed from '@/public/dashboard/courses/completed.png'
import Ongoing from '@/public/dashboard/courses/unlocked.png'
import Loader from '@/components/common/loader/Loader'

// Types for course content levels used on this page
export type RoadmapContentType = {
  id: number
  levelTitle: string
  levelContent: string
  levelTime: string
  levelStatus: string
  // string relative to public/ (DetailCards prefixes with "/")
  levelStatusIcon: string
  levelLink: string
}

export default function DetailsPage() {
  const { courses } = useUserCourses()
  const [courseContent, setCourseContent] = useState<RoadmapContentType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const router = useRouter()

  // Parse backend id from route and find by id, not by array index
  const courseId = Number(params.course)
  const selectedCourse = courses.find(
    (c) => String(c.course_id) === String(courseId) || String(c.id) === String(courseId)
  ) // top-level course info (title, desc, etc)

  useEffect(() => {
    const fetchCourseItems = async () => {
      try {
        // Prefer a real course/roadmap id when available, fallback to courseId from route
        const contentId = (selectedCourse)?.id ?? (selectedCourse)?.course_id ?? courseId
        const res = await fetch(
          `https://nuroki-backend.onrender.com/roadmaps/${contentId}/contents/`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        // if (!res.ok) throw new Error('Failed to fetch course contents')
        const data = await res.json()
        
        // console.log(data)
        
        type BackendItem = {
          sequence: number
          title: string
          content_url: string
          status: 'completed' | 'ongoing' | 'not-started' | string
          description: string
          duration: string
        }
        const formatted: RoadmapContentType[] = (data as BackendItem[]).map((item) => {
          let statusIcon: string = 'dashboard/courses/locked.png'
          if (item.status === 'completed') statusIcon = 'dashboard/courses/completed.png'
          else if (item.status === 'ongoing') statusIcon = 'dashboard/courses/unlocked.png'
          else if (item.status === 'not-started') statusIcon = 'dashboard/courses/locked.png'

          return {
            id: item.sequence,
            levelTitle: item.title,
            levelContent: item.description,
            levelTime: item.duration,
            levelStatus: item.status,
            levelStatusIcon: statusIcon,
            levelLink: item.content_url
          }
        })

        setCourseContent(formatted)
        console.log(data)
      } catch (err) {
        console.error(err)
      } finally{
        setIsLoading(false)
      }
    }
    fetchCourseItems()
  }, [courseId, selectedCourse?.id, selectedCourse?.course_id])

  useEffect(() =>{
    console.log(courseContent)
  }, [courseContent])


  if (isLoading) return <div className='w-full h-full flex items-center justify-center'><Loader /> </div>
  if (!selectedCourse) return <div className='p-4'>Course not found.</div>
  if (!courseContent) return <div className='p-4'>No course details found.</div>

  return (
    <div style={{ fontFamily: 'var(--font-nunito)' }}>
      <section className="hidden md:block">
        <div className="flex items-center py-3">
          <div onClick={() => router.back()} className="hover:cursor-pointer">
            <Image src={Back} alt="back" />
          </div>
          <div className="w-full flex justify-center">
            <p className="font-semibold text-[18px]">Course Recommendation</p>
          </div>
        </div>
        <hr className="border border-[#CCCCCC]/30 w-full" />
      </section>

      <Details
        props={{
          title: selectedCourse.title,
          content: selectedCourse.description,
          overview: selectedCourse.overview,
          progress: selectedCourse.progress,
          difficulty: selectedCourse.difficulty,
          duration: selectedCourse.duration || '5',
          rating: selectedCourse.rating,
          index: 0, // no longer used for lookups
          levelsCompleted: selectedCourse.levelsCompleted || 0,
          levelTotal: selectedCourse.levelTotal || 5,
          instructor: selectedCourse.instructor,
          instructorRole: selectedCourse.instructorRole,
          instructorCourses: selectedCourse.instructorCourses,
          instructorStudents: selectedCourse.instructorStudents,
          instructorRatings: selectedCourse.instructorRatings,
          link: selectedCourse.course_url,
          courseId: courseId,
        }}
      >
        <div className="flex flex-col gap-5">
          {courseContent.length === 0 ? (
            <div className='text-sm text-gray-500'>No course content found.</div>
          ) : (
            courseContent.map((lvl) => (
              <DetailCards
                key={lvl.id}
                props={{
                  id: lvl.id,
                  levelTitle: lvl.levelTitle,
                  levelContent: lvl.levelContent,
                  levelTime: lvl.levelTime,
                  levelStatusIcon: lvl.levelStatusIcon,
                  levelStatus: lvl.levelStatus,
                  levelLink: lvl.levelLink
                }}
              />
            ))
          )}
        </div>
      </Details>
    </div>
  )
}



