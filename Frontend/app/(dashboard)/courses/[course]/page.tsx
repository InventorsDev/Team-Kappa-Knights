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
  levelTime: number
  levelStatus: string
  // string relative to public/ (DetailCards prefixes with "/")
  levelStatusIcon: string
}

export default function DetailsPage() {
  const { courses } = useUserCourses()
  const [courseContent, setCourseContent] = useState<RoadmapContentType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const course = params.course
  const router = useRouter()
  const idx = Number(course)
  const courseItem = courses[idx] // top-level course info (title, desc, etc)

  useEffect(() => {
    const fetchCourseItems = async () => {
      try {
        // Prefer a real course/roadmap id when available, fallback to index
        const contentId = (courseItem as any)?.id ?? idx
        const res = await fetch(
          `https://nuroki-backend.onrender.com/roadmaps/${contentId}/contents/`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        // if (!res.ok) throw new Error('Failed to fetch course contents')
        const data = await res.json()

        // map backend format → page level shape
        type BackendItem = {
          sequence: number
          title: string
          content_url: string
          status: 'completed' | 'ongoing' | 'not-started' | string
        }
        console.log(data)
        const formatted: RoadmapContentType[] = (data as BackendItem[]).map((item) => {
          let statusIcon: string = 'dashboard/courses/locked.png'
          if (item.status === 'completed') statusIcon = 'dashboard/courses/completed.png'
          else if (item.status === 'ongoing') statusIcon = 'dashboard/courses/unlocked.png'
          else if (item.status === 'not-started') statusIcon = 'dashboard/courses/locked.png'

          return {
            id: item.sequence,
            levelTitle: item.title,
            levelContent: item.content_url,
            levelTime: 0,
            levelStatus: item.status,
            levelStatusIcon: statusIcon,
          }
        })

        setCourseContent(formatted)
      } catch (err) {
        console.error(err)
      } finally{
        setIsLoading(false)
      }
    }
    fetchCourseItems()
  }, [idx])

  if (isLoading) return <div className='w-full h-full flex items-center justify-center'><Loader /> </div>
  if (!courseItem) return <div className='p-4'>No course details found.</div>

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
          title: courseItem.title,
          content: courseItem.description,
          overview: courseItem.overview,
          progress: courseItem.progress,
          difficulty: courseItem.difficulty,
          duration: courseItem.duration || '5',
          rating: courseItem.rating,
          index: idx,
          levelsCompleted: courseItem.levelsCompleted || 0,
          levelTotal: courseItem.levelTotal || 5,
          instructor: courseItem.instructor,
          instructorRole: courseItem.instructorRole,
          instructorCourses: courseItem.instructorCourses,
          instructorStudents: courseItem.instructorStudents,
          instructorRatings: courseItem.instructorRatings,
          link: ''
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
                }}
              />
            ))
          )}
        </div>
      </Details>
    </div>
  )
}



