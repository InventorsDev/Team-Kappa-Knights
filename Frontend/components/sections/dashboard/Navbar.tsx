import React from 'react'
import Image from 'next/image'
import Profile from '@/public/dashboard/profile.png'
import SidebarIcon from '@/public/dashboard/Frame.png'

const Navbar = () => {
  return (
    <nav className='flex justify-between items-center select-none'>
        <section className='flex gap-2 items-center'>
            <div>
                <Image src={Profile} alt='Profile picture'/>
            </div>
            <div>
                <p className='text-[20px] font-bold'>Hello, Gbemisola!</p>
                <p className='text-[14px] text-[#4A4A4A]'>Here's to steady growth</p>
            </div>
        </section>
        <div>
            <Image src={SidebarIcon} width={24} height={24} alt='menu'/>
        </div>
    </nav>
  )
}

export default Navbar