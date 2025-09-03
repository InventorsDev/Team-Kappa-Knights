'use client'
import React, { use } from 'react'
import { courseData } from '@/components/sections/courses/CoursesSet'
import notFound from '@/app/not-found'
import Details from '@/components/sections/courses/Details'
import DetailCards from '@/components/sections/courses/ui/DetailCards'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Back from '@/public/dashboard/backArrow.png'

type Props = {
    params: Promise<{ course: string}>
}

const DetailsPage = ({ params }: Props) => {
    const { course } = use(params)
    const router = useRouter()

    const courseItem = courseData[Number(course)]

    if (!courseItem) return notFound()
    return (
        <div style={{ 'fontFamily': 'var(--font-nunito)' }}>
            <section className=' hidden md:block'>
                <div className='flex items-center py-3 '>
                    <div onClick={() => router.back()} className='hover:cursor-pointer'>
                        <Image src={Back} alt='' />
                    </div>
                    <div className='w-full flex justify-center'>
                        <p className='font-semibold text-[18px]'> Course Recommendation</p>
                    </div>
                </div>
                <hr className='border border-[#CCCCCC]/30 w-full' />
            </section>
            <Details props={{
                title: courseItem.title,
                content: courseItem.content,
                overview: courseItem.overview,
                progress: courseItem.progress,
                index: courseItem.index,
                levelsCompleted: courseItem.levelsCompleted,
                levelTotal: courseItem.levelTotal,
                instructor: courseItem.instructor,
                instructorRole: courseItem.instructorRole,
                instructorCourses: courseItem.instructorCourses,
                instructorStudents: courseItem.instructorStudents,
                instructorRatings: courseItem.instructorRatings
            }}>
                <div className='flex flex-col gap-5'>
                    {courseData.map((item, idx) => (
                        <div key={idx}>
                            <DetailCards props={{
                                id: courseItem.levelsArray[courseItem.index].id,
                                levelTitle: courseItem.levelsArray[courseItem.index].levelTitle,
                                levelContent: courseItem.levelsArray[courseItem.index].levelContent,
                                levelTime: courseItem.levelsArray[courseItem.index].levelTime,
                                levelStatusIcon: courseItem.levelsArray[courseItem.index].levelStatusIcon,
                                levelStatus: courseItem.levelsArray[courseItem.index].levelStatus
                            }} />
                        </div>
                    ))}
                </div>
            </Details>
        </div >
    )
}

export default DetailsPage