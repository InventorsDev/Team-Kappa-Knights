import React from 'react'
import Image from 'next/image'
import Pic from '@/public/dashboard/profile.png'

const Photo = () => {
  return (
    <main className='flex flex-col items-center justify-center pt-5'>
        <div className='pb-2'>
            <Image src={Pic} width={120} height={120} alt='Profile Pic' className='md:w-[160px] md:h-[160px]'/>
        </div>
        <p className='hover:cursor-pointer text-[#00BFA5] text-[18px] font-semibold md:text-[18px]'>Change Photo</p>
    </main>
  )
}

export default Photo