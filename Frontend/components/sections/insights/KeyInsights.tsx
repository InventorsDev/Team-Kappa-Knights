import React from 'react'
import PerformanceCard from './ui/PerformanceCard'
import KeyCard from './ui/KeyCards'

const Details = [
    {
        title: 'Great Progress!',
        icon: '/dashboard/insights/progress.png',
        colour: '#00BFA5',
        text: 'You’ve stayed positive for 8 days. ',
        subText: 'Consistency builds awareness.'
    },
    {
        title: 'Learning Patterns',
        icon: '/dashboard/insights/patterns.png',
        colour: '#FF8185',
        text: 'You learn best on Tuesdays & Thursdays. ',
        subText: 'Save tough topics for these days.'
    },
    {
        title: 'Recommended',
        icon: '/dashboard/insights/recommended.png',
        colour: '#886CFF',
        text: 'Your mood is lower on Mondays; try lighter learning to lift energy',
        subText: null
    },
    {
        title: 'Balanced Growth',
        icon: '/dashboard/insights/growth.png',
        colour: '#4CD964',
        text: 'You’re exploring both Tech and Wellness courses. Great for balanced growth',
        subText: null
    },
]

const KeyInsights = () => {
    return (
        <section className='select-none '>
            <p className='pb-3 font-bold text-[20px] md:text-[24px]'>Key Insights</p>
            <div className=' space-y-4'>
                {Details.map((item, idx) => (
                    <div key={idx}>
                    <KeyCard props={{
                        title: item.title,
                        icon: item.icon,
                        colour: item.colour,
                        details: item.text,
                        moreDetails: item.subText
                    }} />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default KeyInsights