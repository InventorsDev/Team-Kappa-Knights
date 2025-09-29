'use client'
import { CourseDataType, useUserCourses, useUserStore } from '@/state/store'
import notFound from '@/app/not-found'
import Details from '@/components/sections/courses/Details'
import DetailCards from '@/components/sections/courses/ui/DetailCards'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Back from '@/public/dashboard/backArrow.png'
import { use, useEffect, useState } from 'react'
import Locked from '@/public/dashboard/courses/locked.png'
import Completed from '@/public/dashboard/courses/completed.png'
import Ongoing from '@/public/dashboard/courses/unlocked.png'
import { useParams } from 'next/navigation'
import Loader from '@/components/common/loader/Loader'

type Props = {
  params: Promise<{ course: string }>
}

export default function DetailsPage() {
  // const { course } = use(params)
  const { courses, courseItems, setCourseItems } = useUserCourses()
  const [courseContent, setCourseContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const course = params.course
  const router = useRouter()
  const idx = Number(course)
  const courseItem = courses[idx] // top-level course info (title, desc, etc)

  useEffect(() => {
    const fetchCourseItems = async () => {
      try {
        const res = await fetch(
          // ${courseItem.id}
          `https://nuroki-backend.onrender.com/roadmaps/${idx}/contents/`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        // if (!res.ok) throw new Error('Failed to fetch course contents')
        const data = await res.json()

        // map backend format → your levelsArray shape
        const formatted = data.map((item: any) => {
          let statusIcon = Locked
          if (item.status === 'completed') statusIcon = Completed
          else if (item.status === 'ongoing') statusIcon = Ongoing
          else if (item.status === 'not-started') statusIcon = Locked

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
  }, [idx, setCourseContent])

  if (isLoading) return <div className='w-full h-full flex items-center justify-center'><Loader /> </div>
  if(!courseContent) return <div>no course found</div>

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
        }}
      >
        <div className="flex flex-col gap-5">
          {courseItems.map((lvl, i) => (
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
          ))}
        </div>
      </Details>
    </div>
  )
}



