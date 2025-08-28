'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import DropDown from '@/public/dashboard/downArrow.png'
import AuthButton from '@/components/common/button/Button'

const Preference = () => {
  const [isRouting, setIsRouting] = useState<boolean>(false);
  return (
    <main className='md:border rounded-2xl md:p-7 md:mt-8'>
      <section className='flex justify-between pb-5'>
        <div>
          <p className='font-semibold md:text-[40px]'>Add Preference</p>
          <p className='text-sm text-[#4A4A4A] md:text-[20px]'>Customize your Nuroki experience with preferred settings</p>
        </div>
        <div></div>
      </section>
      <section className='pt-5'>
        <section className='space-y-5'>
          <div className='flex justify-between md:text-[20px]'>
              <div className='md:flex-5 font-semibold text-[15px] flex items-center md:text-[20px]'>Language</div>
            <div className='md:flex-1 flex justify-between gap-3 items-center px-3 py-2  rounded-lg border border-[#cccccc]'>
              <p>English</p>
              <div>
                <Image src={DropDown} alt='' />
              </div>
            </div>
          </div>
          <div className='flex justify-between md:text-[20px]'>
            <div className=''>
              <div className='font-semibold text-[15px] md:text-[20px]'>Notification</div>
            </div>
            <div className=' p-3 px-5'>
             
            </div>
          </div>
          <div className='flex justify-between md:text-[20px]'>
              <div className='font-semibold text-[15px] md:text-[20px] flex items-center md:flex-5'>Theme</div>
            <div className='flex justify-between items-center min-w-[105px] px-3 py-2  rounded-lg border border-[#cccccc] md:flex-1'>
              <p>Light</p>
              <div>
                <Image src={DropDown} alt='' />
              </div>
            </div>
          </div>
        </section>

        <div className='flex justify-center md:justify-end gap-3 pt-7'>
                <button className='bg-[#00B5A5] rounded-lg text-center md:text-[20px] md:px-5 py-3 text-white font-bold'>Save Preferences</button>
        </div>
        <hr className='border border-[#CCCCCC] w-full mt-8 md:hidden' />
        

      </section>
    </main>
  )
}

export default Preference