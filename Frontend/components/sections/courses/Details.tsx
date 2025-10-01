import Image, { StaticImageData } from 'next/image'
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import Icon from '@/public/dashboard/greenVector.png'
import Resume from '@/public/dashboard/courses/sideArrow.png'
import Star from '@/public/dashboard/courses/Star.png'
import Link from 'next/link'
import { useUserProfileStore } from '@/state/user'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type DetailsProps = {
    title: string
    content: string
    overview: string
    progress: number
    difficulty: string
    duration: string
    rating: number
    index: number
    levelsCompleted: number
    levelTotal: number
    instructor: string
    instructorRole: string
    instructorCourses: string
    instructorStudents: string
    instructorRatings: number
    link: string
    courseId: number
}

const Details = ({ props, children }: { props: DetailsProps, children: ReactNode }) => {
    const router = useRouter()
    const profile = useUserProfileStore((s) => s.profile)

    // Use provided backend course id directly
    const courseId = props.courseId

    const [isEnrolled, setIsEnrolled] = useState(false)
    const [adding, setAdding] = useState(false)

    // Helpers mirroring CourseCard to safely parse enrollment responses
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
                if (!userId || !courseId) return
                const token = localStorage.getItem('token') || undefined
                const res = await fetch('https://nuroki-backend.onrender.com/enrollments/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    cache: 'no-store',
                })
                if (!res.ok) return
                const raw: unknown = await res.json()
                const arr = pickArray(raw)
                const found = arr.some((enr) => {
                    const uidVal = getUserFromEnrollment(enr)
                    const cid = resolveCourseId(getCourseFromEnrollment(enr))
                    return uidVal !== null && String(uidVal) === String(userId) && cid === courseId
                })
                if (found) {
                    setIsEnrolled(true)
                }
            } catch {
                // best-effort
            }
        }
        checkEnrollment()
    }, [profile?.user_id, courseId])

    const enrollIfNeeded = useCallback(async () => {
        if (isEnrolled || adding) return true
        if (!courseId) return false
        try {
            setAdding(true)
            const userId = profile?.user_id
            if (!userId) throw new Error('User not found. Please sign in again.')
            const token = localStorage.getItem('token') || undefined
            const res = await fetch('https://nuroki-backend.onrender.com/enrollments/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ user: userId, course_id: courseId }),
            })
            if (!res.ok) return false
            setIsEnrolled(true)
            return true
        } catch {
            return false
        } finally {
            setAdding(false)
        }
    }, [isEnrolled, adding, courseId, profile?.user_id])

    const handleStartResume = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        const ok = await enrollIfNeeded()
        if (ok) {
            toast.success('Added to Skill Tree')
        }
        if (props.link) {
            router.push(props.link)
        }
    }

    const ctaLabel = (isEnrolled || props.progress > 0) ? 'Resume ' : 'Start '

    return (
        <div className='text-[#4A4A4A]'>
            <section className='flex  gap-2  py-5'>
                    <Image src={Icon} width={20} height={20} alt='' className='min-w-[32px] h-fit'/>
                <div className=''>
                    <div className='font-semibold text-[20px] md:text-[24px] text-[#212121]'>{props.title}</div>
                    <div className='text-[16px] md:text-[18px]'>{props.content}</div>
                </div>
            </section>

            <section className='pb-4'>
                <p className='font-semibold text-[18px] md:text-[20px] pb-2 text-[#212121]'>Course Overview</p>
                <p className=' text-[16px] pb-4 md:text-[18px]'>{props.overview}</p>
                <div className='flex space-x-2  py-2 text-[14px] capitalize md:text-[16px]'>
                    <p>{props.difficulty} </p> <p>&middot; </p> 
                    <p>{props.levelTotal} Levels </p> <p>&middot; </p>  
                    <p>{props.duration}</p> <p>&middot; </p> 
                    <div className='flex gap-1 items-center px-1'>
                        <Image src={Star} width={40} height={40} alt='' className='w-4 '/>
                        <p>{props.rating}/5</p>
                    </div>
                </div>
                <div className='flex justify-between '>
                    <p className='font-semibold text-[#212121] md:text-[20px]'>Your Progress</p>
                    <p>{props.progress}%</p>
                </div>
                <div className={`my-2 h-[6px] md:h-[10px] w-full bg-[#EBFFFC] rounded-lg overflow-hidden`} >
                    <div
                        className={`h-full bg-[#00bfa5] rounded-lg`}
                        style={{ width: `${props.progress}%` }}
                    ></div>
                </div>
                <div className='flex justify-between  md:text-[18px]'>
                    <p><span className='font-semibold'>{props.levelsCompleted}</span> of <span className='font-semibold'>{props.levelTotal}</span> levels completed</p>
                    <Link href={props.link || '#'} onClick={handleStartResume} className='flex items-center text-center gap-1'>
                        <p className='text-[#00bfa5] font-semibold'>{ ctaLabel } Learning</p>
                        <Image src={Resume} alt='' />
                    </Link>
                </div>
            </section>

            <section >
                <p className='py-3 font-bold  md:text-[20px] text-[#212121]'>Course Curriculum</p>
                {children}
            </section>

            <section className='text-[#212121] '>
                <p className='py-4 text-[18px] font-bold  md:text-[20px]'>Course Instructor</p>

                <section className='md:flex justify-between'>
                <div className='flex md:flex-1 gap-3 items-center'>
                    <div className='h-10 w-10 md:h-20 md:w-20 bg-[#EBFFFC] rounded-full'></div>
                    <div className=''>
                        <p className='font-semibold text-[20px]'>{props.instructor}</p>
                        <p className=''>{props.instructorRole}</p>
                    </div>
                </div>

                <div className="flex md:flex-1 w-full justify-between items-center divide- divide-[#CCCCCC]  space-x-2 rounded-2xl p-[16px] text-[24px] font-semibold">
                    <div className="text-center">
                        <p className=" text-[#00BFA5] md:text-[40px] ">
                            {props.instructorCourses}
                        </p>
                        <p className="text-[13px] md:text-[18px] ">Courses</p>
                    </div>
                    <div className=" text-center">
                        <p className="text-[#00BFA5] text-[24px] md:text-[40px] ">
                            {props.instructorStudents}
                        </p>
                        <p className="text-[13px] md:text-[18px] ">
                            Students
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-[#00BFA5] text-[24px] md:text-[40px] ">
                            {props.instructorRatings}
                        </p>
                        <p className="text-[13px] md:text-[18px] ">
                            Ratings
                        </p>
                    </div>
                </div>
                </section>
            </section>
        </div>
    )
}

export default Details
