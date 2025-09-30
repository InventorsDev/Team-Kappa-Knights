import React, { useState } from 'react'
import Image from 'next/image'
import Icon from '@/public/dashboard/greenVector.png'
import Link from 'next/link'
import { useUserProfileStore } from '@/state/user'
import { toast } from 'sonner'

type CardProps = {
  title: string
  content: string
  tutor: string
  duration: string
  progress: number
  link: string
  courseId: number
}

const CourseCard = ({
  props,
  className = "",
}: {
  props: CardProps
  className?: string
}) => {
  const profile = useUserProfileStore((s) => s.profile)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // /enrollments/ 

  const handleAddCourse = async () => {
    if (adding || added) return
    setAdding(true)
    setError(null)
    try {
      const userId = profile?.user_id
      if (!userId) {
        throw new Error('User not found. Please sign in again.')
      }
      if(!props.courseId){
        toast.error("no id")
        return;
      }
      const token = localStorage.getItem('token') || undefined
      const res = await fetch('https://nuroki-backend.onrender.com/enrollments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ user: userId, course_id: props.courseId }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Failed to enroll (HTTP ${res.status})`)
      }
      setAdded(true)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to enroll'
      setError(msg)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div
      className={`p-4 rounded-2xl border border-[#CCCCCC] md:text-[18px] flex flex-col h-full ${className}`}
    >
      {/* Header */}
      <section className="flex gap-2 pb-4 items-center">
        <Image src={Icon} width={20} height={20} alt="" className='w-4 h-4 md:w-7 md:h-7' />
        <div className="font-semibold text-[18px]">{props.title}</div>
      </section>

      {/* Content */}
      <div className="text-[16px] md:text-[18px] text-[#4A4A4A] line-clamp-2">
        {props.content}
      </div>
      <div className="py-3 text-sm text-gray-600">
        {props.tutor} &middot; {props.duration}
      </div>

      {/* Progress + Button */}
      <section className="mt-auto">
        <div className="flex justify-between">
          <p>Progress</p>
          <p className="font-semibold">{props.progress}%</p>
        </div>

        <div className="my-4 h-[6px] w-full bg-[#EBFFFC] rounded-lg overflow-hidden">
          <div
            className="h-full bg-[#00bfa5] rounded-lg"
            style={{ width: `${props.progress}%` }}
          ></div>
        </div>

        <div className='flex gap-2'>
          <Link href={`${props.link}`} className='flex-1'>
            <button className="bg-[#00B5A5] rounded-lg text-center w-full md:text-[18px] md:px-5 py-3 text-white font-bold hover:cursor-pointer">
              View Details
            </button>
          </Link>
          <button
            onClick={handleAddCourse}
            disabled={adding || added}
            className={`flex-1 rounded-lg text-center w-full md:text-[18px] md:px-5 py-3 text-white font-bold hover:cursor-pointer ${added ? 'bg-gray-400' : 'bg-[#00B5A5]'}`}
          >
            {added ? 'Added' : adding ? 'Adding…' : 'Add Course'}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">Failed to add course</p>}
      </section>
    </div>
  )
}

export default CourseCard









