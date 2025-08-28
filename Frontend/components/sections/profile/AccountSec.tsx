'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import DropDown from '@/public/dashboard/downArrow.png'
import AuthButton from '@/components/common/button/Button'

const AccountSec = () => {
  const [isRouting, setIsRouting] = useState<boolean>(false);
  return (
    <main className='select-none'>
      <div className='pb-5'>
        <p className='text-[18px] font-bold md:text-[40px]'>Account Security</p>
        <p className='text-[15px] text-[#4A4A4A] md:text-[24px]'>Manage your password and keep your account safe</p>
      </div>
      <form className='space-y-5 md:pt-5'>
        <div className='flex flex-col md:flex-row md:justify-between md:items-center md:font-semibold gap-2'>
          <label className='md:flex-2 md:text-[20px] md:font-semibold'>Current Password</label>
          <input type='password' name='CurrentPassword' className='md:flex-7 md:py-6 p-2 rounded-xl border border-[#CCCCCC]' />
        </div>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
          <label className='md:flex-2 md:text-[20px] md:font-semibold'>New Password</label>
          <input type='password' name='NewPassword' className='md:flex-7 md:py-6 p-2 rounded-xl border border-[#CCCCCC]' />
        </div>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between '>
          <label className='md:flex-2 md:text-[20px] md:font-semibold'>Confirm Password</label>
          <input type='password' name='ConfirmPassword' className='md:flex-7 md:py-6 p-2 rounded-xl border border-[#CCCCCC]' />
        </div>

        <div className='flex md:justify-end px-[20%]  md:px-[0] gap-3 pt-3'>
          <button className='bg-[#00B5A5] rounded-lg text-center md:text-[20px] md:px-5 py-3 text-white font-bold'>Update Password</button>
        </div>

        <hr className='border border-[#CCCCCC]/50 w-full mt-8' />
      </form>
    </main>
  )
}

export default AccountSec