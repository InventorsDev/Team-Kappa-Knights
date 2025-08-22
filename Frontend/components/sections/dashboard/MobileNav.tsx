import React from 'react'
import Image from 'next/image';
import X from '@/public/dashboard/xButton.png'

const mobileNavItems = [
    {
        text: "Home",
        logo: "/dashboard/homeWhite.png",
        altText: "Home"
    },
    {
        text: "Journals",
        logo: "/dashboard/journalWhite.png",
        altText: "Journals"
    },
    {
        text: "Skills",
        logo: "/dashboard/skillWhite.png",
        altText: "Skills"
    },
    {
        text: "Insights",
        logo: "/dashboard/insightswhite.png",
        altText: "Insights"
    },
    {
        text: "Profile",
        logo: "/dashboard/profileWhite.png",
        altText: "Profile"
    },
    {
        text: "Log Out",
        logo: "/dashboard/logoutWhite.png",
        altText: "Log Out"
    }
];

const MobileNav = () => {
  return (
     <nav className='flex flex-col md:hidden gap-[10%] p-6 pt-10 w-full h-screen bg-[#005C4D]'>
                    <div className='pl-2'>
                        <Image src={X} alt='Navbar' />
                    </div>
                    <section className='flex flex-col gap-10 items-cent h-full text-white'>
                        {mobileNavItems.map((item, idx) => (
                            <div key={idx} className='flex  gap-3 items-center justify-cente '>
                                <Image src={`${item.logo}`} width={32} height={32} alt={item.altText} />
                                <p className='text-[24px] '>{item.text}</p>
                            </div>
                        ))}
                    </section>
                </nav>
  )
}

export default MobileNav