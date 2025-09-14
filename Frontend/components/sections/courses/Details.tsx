import Image, { StaticImageData } from 'next/image'
import React, { ReactNode } from 'react'
import Icon from '@/public/dashboard/greenVector.png'
import Resume from '@/public/dashboard/courses/sideArrow.png'
import Star from '@/public/dashboard/courses/Star.png'
import Link from 'next/link'

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
}

const Details = ({ props, children }: { props: DetailsProps, children: ReactNode }) => {
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
                <div className='flex  py-2 text-[14px] md:text-[16px]'>
                    {props.difficulty}  &middot;  
                    {props.levelTotal} Levels  &middot;  
                    {props.duration} weeks  &middot;  
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
                    <div className='flex items-center text-center gap-1'>
                        <p className='text-[#00bfa5] font-semibold'>Resume Learning</p>
                        <Image src={Resume} alt='' />
                    </div>
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