import React from 'react'
import Image from 'next/image'
import DropDown from '@/public/dashboard/downArrow.png'
import Photo from './Photo'

const PersonalInfo = () => {
  return (
    <main className='md:border rounded-2xl md:p-7 md:mt-8 select-none'>
        <div className='pb-5'>
            <p className='text-[18px] md:text-[40px] font-bold'>Personal Information</p>
            <p className='text-[15px] md:text-[24px] text-[#4A4A4A]'>Update your profile details and personal information</p>
        </div>

        <section className='md:flex gap-10 md:pt-5'>
            <div className='md:inline-block hidden w-[30%]'>
            <Photo />
            </div>

            {/* {The personal info form} */}

             <form className='space-y-5 w-full'>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
                <label className='md:flex-2 md:text-[20px] md:font-semibold'>First Name</label>
                <input type='text' name='FirstName' className='md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]' />
            </div>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
                <label className='md:flex-2 md:text-[20px] md:font-semibold'>Last Name</label>
                <input type='text' name='LastName' className='md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]' />
            </div>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
                <label className='md:flex-2 md:text-[20px] md:font-semibold'>Email Address</label>
                <input type='text' name='EmailAddress' className='md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]' />
            </div>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
                <label className='md:flex-2 md:text-[20px] md:font-semibold'>Gender</label>
                <div className='md:flex-7 md:py-4 flex justify-between items-center px-3 py-2  rounded-lg border border-[#CCCCCC]'>
                    <p>Female</p>
                    <div>
                        <Image src={DropDown} alt=''/>
                    </div>
                </div>
            </div>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
                <label className='font-medium md:flex-2 md:text-[20px] md:font-semibold'>Date of Birth</label>
                <section className='md:flex-7 flex justify-between gap-3 '>
                <div className='flex-1 md:py-4 flex justify-between items-center px-3 py-2  rounded-lg border border-[#CCCCCC]'>
                    <p>31</p>
                    <div>
                        <Image src={DropDown} alt=''/>
                    </div>
                </div>
                <div className='flex-1 md:py-4 flex justify-between items-center px-3 py-2  rounded-lg border border-[#CCCCCC]'>
                    <p>January</p>
                    <div>
                        <Image src={DropDown} alt=''/>
                    </div>
                </div>
                <div className='flex-1 md:py-4 flex justify-between items-center px-3 py-2  rounded-lg border border-[#CCCCCC]'>
                    <p>2005</p>
                    <div>
                        <Image src={DropDown} alt=''/>
                    </div>
                </div>
                </section>
            </div>

            <div className=' flex md:justify-end gap-3 pt-3'>
                <button className='bg-[#FF6665] rounded-lg text-center md:px-5 py-3 text-white font-bold'>Log Out</button>
                <button className='bg-[#00B5A5] rounded-lg text-center md:px-5 py-3 text-white font-bold'>Save Changes</button>
            </div>

            <hr className='border border-[#CCCCCC] w-full mt-8 md:hidden'/>
        </form>
        </section>
       
    </main>
  )
}

export default PersonalInfo