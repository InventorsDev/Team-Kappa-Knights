'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import DropDown from '@/public/dashboard/downArrow.png'
import AuthButton from '@/components/common/button/Button'

const Security = () => {
  const [isRouting, setIsRouting] = useState<boolean>(false);
  return (
    <main className='mb-10 md:border rounded-2xl md:p-7 md:mt-8'>
      <section className='flex justify-between pb-3'>
        <div>
          <p className='font-semibold text-[18px] md:text-[40px]'>Security & Sessions</p>
          <p className='text-sm text-[#4A4A4A] md:text-[20px]'>Manage your active sessions and data privacy settings
          </p>
        </div>
        <div></div>
      </section>
      <section className='pt-5'>
        <section className='space-y-5'>
          <div className='flex justify-between md:text-[20px]'>
              <div className='text-[15px] flex flex-col md:text-[20px]'>
                <p className='font-semibold '>Current session (Window, Chrome)</p>
                <p className='text-sm text-[#4A4A4A] md:text-[18px]'>Lagos, Nigeria &middot; Active Now</p>
              </div>
            <div className='border border-[#cccccc] rounded-xl p-3 px-5'>
              Revoke
            </div>
          </div>
          <div className='flex justify-between md:text-[20px]'>
              <div className=' text-[15px] flex flex-col md:text-[20px]'>
                <p className='font-semibold '>Previous session (Window, Chrome)</p>
                <p className='text-sm text-[#4A4A4A] md:text-[18px]'>Lagos, Nigeria &middot; 2 days ago</p>
              </div>
            <div className='border border-[#cccccc] rounded-xl p-3 px-5'>
              Revoke
            </div>
          </div>
        </section>
        <hr className='border border-[#CCCCCC]/50 w-full mt-8' />

        <section className=' md:flex justify-between md:pb-6'>
        <div className='pt-5'>
          <p className='font-semibold md:text-[28px]'>Data Management</p>
          <p className='text-sm text-[#4A4A4A] md:text-[18px]'>You&apos;re in charge of your information and account status.
          </p>
        </div>

        <div className='flex justify-center md:justify-end gap-3 pt-7'>
                <button className='bg-[#FF6665] rounded-lg text-center md:text-[20px] md:px-5 py-3 text-white font-bold'>Delete Account</button>
        </div>
        
        </section>

      </section>
    </main>
  )
}

export default Security