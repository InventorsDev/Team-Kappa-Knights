'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import DropDown from '@/public/dashboard/downArrow.png'
import AuthButton from '@/components/common/button/Button'
import ToggleDemo from './ui/Toggle'
import { Select } from '@/components/ui/select'

const Preference = () => {
  const [isRouting, setIsRouting] = useState<boolean>(false);
  return (
    <main className='md:border rounded-2xl md:p-7 md:mt-8 select-none'>
      <section className='flex justify-between pb-5'>
        <div>
          <p className='font-semibold md:text-[24px]'>Add Preference</p>
          <p className='text-sm text-[#4A4A4A] md:text-[20px]'>Customize your Nuroki experience with preferred settings</p>
        </div>
        <div></div>
      </section>
      <section className='pt-5'>
        <section className='space-y-2'>
          <div className='flex justify-between md:text-[18px]'>
              <div className='md:flex-5 font-semibold text-[15px] flex items-center md:text-[18px]'>Language</div>
            <div className='md:flex-2 flex justify-between gap-3 items-center px-3 py-2 md:py-4 md:rounded-xl   rounded-lg border border-[#cccccc]'>
              <p>English</p>
              <div>
                <Image src={DropDown} alt='' />
              </div>
            </div>
          </div>
          <div className='flex justify-between items-center md:text-[18px]'>
            <div className=''>
              <div className='font-semibold text-[15px] md:text-[18px]'>Notification</div>
            </div>
            <div className=' p-3 px-5'>
             <ToggleDemo />
            </div>
          </div>
          <div className='flex justify-between md:text-[18px]'>
              <div className='font-semibold text-[15px] md:text-[18px] flex items-center md:flex-5'>Theme</div>
            <div className='flex justify-between items-center min-w-[105px] px-3 py-2 md:py-4 md:rounded-xl  rounded-lg border border-[#cccccc] md:flex-2'>
              <p>Light</p>
              <div>
                <Image src={DropDown} alt='' />
              </div>
            </div>
          </div>
        </section>

        <div className='flex justify-center md:justify-end gap-3 pt-7'>
          <div className='w-[45%] md:w-[21%]'>
                <button className='bg-[#00B5A5] rounded-lg text-center w-full md:text-[18px] md:px-5 py-3 text-white font-bold'>Save Preferences</button>
                </div>
        </div>
        <hr className='border border-[#CCCCCC] w-full mt-8 md:hidden' />
        

      </section>
    </main>
  )
}

export default Preference