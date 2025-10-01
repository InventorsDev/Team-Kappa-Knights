import React, { useEffect, useState } from 'react'
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
  const [isEnrolled, setIsEnrolled] = useState(false)

  // Resolve course id from enrollment payloads (could be number, string, or object)
  const resolveCourseId = (v: unknown): number | null => {
    if (v == null) return null
    if (typeof v === 'number') return v
    if (typeof v === 'string') {
      const n = Number(v)
      return Number.isFinite(n) ? n : null
    }
    if (typeof v === 'object') {
      const obj = v as Record<string, unknown>
      const cand = (obj.course_id ?? obj.id ?? obj.courseId) as unknown
      const n = Number(cand)
      return Number.isFinite(n) ? n : null
    }
    return null
  }

  // Helpers to safely parse enrollment responses without using any
  const pickArray = (v: unknown): unknown[] => {
    if (Array.isArray(v)) return v
    if (typeof v === 'object' && v !== null) {
      const obj = v as Record<string, unknown>
      if (Array.isArray(obj.results)) return obj.results
      if (Array.isArray(obj.courses)) return obj.courses
    }
    return []
  }

  const getUserFromEnrollment = (e: unknown): string | number | null => {
    if (typeof e === 'object' && e !== null) {
      const obj = e as Record<string, unknown>
      const u = obj.user
      if (typeof u === 'string' || typeof u === 'number') return u
    }
    return null
  }

  const getCourseFromEnrollment = (e: unknown): unknown => {
    if (typeof e === 'object' && e !== null) {
      const obj = e as Record<string, unknown>
      return obj.course
    }
    return null
  }

  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const userId = profile?.user_id
        if (!userId || !props.courseId) return
        const res = await fetch('https://nuroki-backend.onrender.com/enrollments/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        })
        if (!res.ok) return
        const raw: unknown = await res.json()
        const arr = pickArray(raw)
        const found = arr.some((enr) => {
          const uidVal = getUserFromEnrollment(enr)
          const cid = resolveCourseId(getCourseFromEnrollment(enr))
          return uidVal !== null && String(uidVal) === String(userId) && cid === props.courseId
        })
        if (found) {
          setIsEnrolled(true)
          setAdded(true)
        }
      } catch {
        // silently ignore; enrollment check is best-effort
      }
    }
    checkEnrollment()
  }, [profile?.user_id, props.courseId])

  const handleAddCourse = async () => {
    if (adding || added || isEnrolled) return
    setAdding(true)
    try {
      const userId = profile?.user_id
      if (!userId) {
        throw new Error('User not found. Please sign in again.')
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
      setIsEnrolled(true)
      toast.success('Course added')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to enroll'
      toast.error(msg || 'Failed to add course')
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
          {/* <Link href={`${props.link}`} className='flex-1'> */}
          <Link href={`/courses/${props.courseId}`} className='flex-1'>
            <button className="bg-[#00B5A5] rounded-lg text-center w-full md:text-[18px] md:px-5 py-3 text-white font-bold hover:cursor-pointer">
              View Details
            </button>
          </Link>
          <button
            onClick={handleAddCourse}
            disabled={adding || added || isEnrolled}
            className={`flex-1 rounded-lg text-center w-full md:text-[18px] md:px-5 py-3 text-white font-bold hover:cursor-pointer ${(added || isEnrolled) ? 'bg-gray-400' : 'bg-[#00B5A5]'}`}
          >
            {(added || isEnrolled) ? 'Added' : adding ? 'Adding…' : 'Add Course'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default CourseCard









