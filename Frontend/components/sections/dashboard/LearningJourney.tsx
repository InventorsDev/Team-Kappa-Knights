'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Purple from '@/public/dashboard/purpleVector.png'
import Green from '@/public/dashboard/greenVector.png'

type JourneyType = {
    journey: string
    percent: number
}


const journeyContent: JourneyType[] = [
    {
        journey: 'Web3',
        percent: 50
    },
    {
        journey: 'Business',
        percent: 35
    },
]

const LearningJourney = () => {
    const [journey, setJourney] = useState<JourneyType[]>([]);

    useEffect(() => {
        setJourney(journeyContent);
    }, [])
    return (
        <main className='border border-[#CCCCCCCC] w-full p-4 md:px-8 rounded-[16px] select-none'>
            <p className='text-[18px] md:text-[32px] font-bold pb-5'>Your Learning Journey</p>
            <div className='space-y-4'>
                {journey.map((item, index) => {
                    const isGreen = index % 2 !== 0
                    return (
                        <div key={index} className={`flex gap-2 items-center text-[16px] font-semibold space-x-2 rounded-2xl p-[16px] ${isGreen ? 'bg-[#EBFFFC]' : 'bg-[#F1EFFF]'} `}>
                            <div>
                                {isGreen && (
                                    <Image src={Green} alt='' className={``} />
                                )}
                                {!isGreen && (
                                    <Image src={Purple} alt='' className={``} />
                                )}
                            </div>
                            <section className='w-full space-y-2'>
                                <div className='flex justify-between '>
                                    <p className='font-semibold text-[16px] md:text-[24px]'>{item.journey}</p>
                                    <p className='font-medium md:text-[24px]'>{item.percent}%</p>
                                </div>
                                <hr className={`border-2 ${isGreen ? 'text-[#AAF4E9] ' : 'text-[#886CFF]'}`} />
                            </section>
                        </div>
                    )
                })}
            </div>
        </main>
    )
}

export default LearningJourney