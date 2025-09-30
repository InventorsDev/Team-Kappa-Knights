import React from 'react'
import Image from 'next/image'
import Icon from '@/public/dashboard/insights/pushingForward.png'

const PushingForward = () => {
  return (
    <section className='p-5 bg-[#EBFFFC] space-y-3 rounded-2xl'>
        <div className='flex gap-3 items-center'>
            <Image src={Icon} width={20} height={20} alt=''/>
            <p className=' font-bold text-[20px] md:text-[24px]'>Keep Pushing Forward!</p>
        </div>
        <p className='text-[#4A4A4A] md:text-[18px]'>Your dedication is inspiring. Remember, every step, no matter how small, brings you closer to your goals. Nuroki is here to support your journey. Explore new courses or revisit your skill tree to see how far you&apos;ve come.</p>
    </section>
  )
}

export default PushingForward