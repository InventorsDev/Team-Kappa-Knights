'use client'
import AuthButton from '@/components/common/button/Button'
import React, { useEffect, useState } from 'react'

type suggestedType = {
    title: string
    details: string
    category: string
    feature: string
}


const suggestedContent: suggestedType[] = [
    {
        title: 'Morning Meditation',
        details: 'Start your day with a 10 minutes guided meditation',
        category: 'Wellness',
        feature: '10 mins'
    },
    {
        title: 'Java Scripts Fundamental',
        details: 'Continue your web development suggested today',
        category: 'Programming',
        feature: 'Beginner'
    },
]

const Suggested = () => {

    const [suggested, setSuggested] = useState<suggestedType[]>([]);
    const [isRouting, setIsRouting] = useState<boolean>(false);

    useEffect(() => {
        setSuggested(suggestedContent);
    }, [])

    return (
        <main className='select-none'>
            <p className='text-[18px] md:text-[32px] font-bold pb-3'>Suggested for you</p>
            <section className='space-y-8 pb-10'>
                {suggested.map((item, index) => {
                    const isGreen = index % 2 !== 0
                    return (
                        <section key={index} className='border border-[#CCCCCCCC] w-full p-4 rounded-[16px] select-none'>
                            <p className='text-[16px] md:text-[24px] font-semibold '>{item.title}</p>
                            <p className='text-[#4A4A4A] text-[14px] md:text-[18px]'> {item.details} </p>
                            <div className='flex gap-3 pt-2 '>
                                <div className={`px-3 py-1 rounded-lg border md:text-[18px] ${isGreen ? ' border-[#AAF4E9] border-2' : 'border-[#886CFF]'}`}>{item.category}</div>
                                <div className={`px-3 py-1 rounded-lg border md:text-[18px] ${isGreen ? ' border-[#AAF4E9] border-2' : 'border-[#886CFF]'}`}>{item.feature}</div>
                            </div>
                        </section>
                    )
                })}
            </section>
            <AuthButton 
            text="Next"
            action={isRouting}
            textWhileActionIsTakingPlace="..."
            isAuth={false}
            />
        </main>
    )
}

export default Suggested