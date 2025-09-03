import React from 'react'
import PerformanceCard from './ui/PerformanceCard'

const Details = [
    {
        title: 'Skills Completed',
        icon: '/dashboard/insights/skillsCompleted.png',
        num: 24,
        numText: '',
        text: 'Total Unique Skills mastered'
    },
    {
        title: 'Active Days',
        icon: '/dashboard/insights/daysActive.png',
        num: 24,
        numText: 'Days',
        text: 'Your current longest learning streak'
    },
    {
        title: 'Hours Studied',
        icon: '/dashboard/insights/hoursStudied.png',
        num: 24,
        numText: 'Hours',
        text: 'Total time spent learning on Nuroki'
    },
    {
        title: 'Current Motivation',
        icon: '/dashboard/insights/motivation.png',
        num: null,
        numText: 'High',
        text: 'Your recent self- reported motivation level'
    },
]

const Performance = () => {
    return (
        <section className='select-none'>
            <p className='pb-3 font-bold text-[20px] md:text-[24px]'>Overall Performance</p>
            <div className='grid grid-cols-2 gap-3 lg:flex md:w-full items-stretch'>
                {Details.map((item, idx) => (
                    <div key={idx} className='h-full'>
                    <PerformanceCard props={{
                        title: item.title,
                        icon: item.icon,
                        num: item.num,
                        numText: item.numText,
                        details: item.text
                    }} />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Performance