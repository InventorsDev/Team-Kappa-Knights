import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

const sidebarItems = [
    {
        text: "Home",
        logo: "/dashboard/house.png",
        altText: "Home"
    },
    {
        text: "Journals",
        logo: "/dashboard/journal.png",
        altText: "Journals"
    },
    {
        text: "Skills",
        logo: "/dashboard/skills.png",
        altText: "Skills"
    },
    {
        text: "Insights",
        logo: "/dashboard/insights.png",
        altText: "Insights"
    },
    {
        text: "Profile",
        logo: "/dashboard/profileLogo.png",
        altText: "Profile"
    }
];

const Sidebar = () => {
    return (
        <main>
            <section className='w-[12%] h-screen fixed hidden md:block bg-gray-100 border-l border-gray-500 pt-30 pb-5 '>
                <section className='flex flex-col justify-between h-full'>
                    <div className='flex flex-col gap-5 justify-between'>
                        {sidebarItems.map((item, idx) => (
                            <div key={idx} className='flex flex-col gap-3 items-center justify-center '>
                                <Image src={`${item.logo}`} width={32} height={32} alt={item.altText} />
                                <p className='text-[24px] '>{item.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className='flex flex-col gap-3 items-center justify-center'>
                        <Image src={`/dashboard/logout.png`} width={32} height={32} alt={'Log Out'} />
                        <p className='text-[24px] text-[#EA4335]'>Log Out</p>
                    </div>
                </section>
            </section>
              <nav className='flex flex-col md:hidden gap-[10%] p-6 w-full h-screen bg-[#005C4D]'>
                    <div>
                        <Link href={'/dashboard'}>X</Link></div>
                    <section className='flex flex-col gap-10 items-cent h-full'>
                        {sidebarItems.map((item, idx) => (
                            <div key={idx} className='flex  gap-3 items-center justify-cente '>
                                <Image src={`${item.logo}`} width={32} height={32} alt={item.altText} />
                                <p className='text-[24px] '>{item.text}</p>
                            </div>
                        ))}
                        
                    <div className='flex f gap-3 items-cente justify-cente'>
                        <Image src={`/dashboard/logout.png`} width={32} height={32} alt={'Log Out'} />
                        <p className='text-[24px] text-[#EA4335]'>Log Out</p>
                    </div>
                    </section>
                </nav>
        </main>
    )
}

export default Sidebar