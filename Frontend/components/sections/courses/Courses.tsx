'use client'
import React from 'react'
import Top from './Top'
import CoursesSet from './CoursesSet'
import Image from 'next/image'
import Back from '@/public/dashboard/backArrow.png'
import { useRouter } from 'next/navigation'

const Courses = () => {
  const router = useRouter()
  return (
    <div className='text-[#212121] pb-8' style={{ 'fontFamily': 'var(--font-nunito)'}}>
            <section className=' hidden md:block'>
              <div className='flex items-center py-3 '>
              <div onClick={() => router.back()} className='hover:cursor-pointer'>
                <Image src={Back} alt=''/>
              </div>
              <div className='w-full flex justify-center'>
              <p className='font-semibold text-[18px]'> Course Recommendation</p>
              </div>
              </div>
              <hr className='border border-[#CCCCCC]/30 w-full'/>
            </section>
      <Top />
      <div className='md:pt-4'>
      <CoursesSet />
      </div>
    </div>
  )
}

export default Courses