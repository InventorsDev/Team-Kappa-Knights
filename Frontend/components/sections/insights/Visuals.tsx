import React from 'react'
import PerformanceCard from './ui/PerformanceCard'
import VisualCards from './ui/VisualCards'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const Details = [
    {
        title: 'Motivational Level Trend',
        subtitle: 'Your emotional well-being overtime',
    },
    {
        title: 'Skill Completion Overview',
        subtitle: 'Breakdown of complete skills across learning paths',
    },
    {
        title: 'Daily Engagement',
        subtitle: 'Time spent on learning activities per day',
    },
]

const Visuals = () => {
    return (
        <section className='select-none '>
            <p className='pb-3 font-bold text-[20px] md:text-[24px]'>Learning Visuals</p>
            <div className=' space-y-3 md:grid grid-cols-2 gap-x-10 gap-y-8'>
                <div className='relative'>
                    <div className='absolute top-5 right-5'>
                        <Select>
                            <SelectTrigger className="flex-1 md:py-6 p-2 rounded-lg border border-[#CCCCCC]">
                                <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                                {[
                                    "January",
                                    "February",
                                    "March",
                                    "April",
                                    "May",
                                    "June",
                                    "July",
                                    "August",
                                    "September",
                                    "October",
                                    "November",
                                    "December",
                                ].map((m) => (
                                    <SelectItem key={m} value={m}>
                                        {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <VisualCards props={{
                        title: 'Motivational Level Trend',
                        subtitle: 'Your emotional well-being overtime',
                    }}>
                        <div className='max-w-[300px] h-[150px] rounded-2xl bg-[#CCCCCC]'></div>
                    </VisualCards>
                </div>
                <div >
                    <VisualCards props={{
                        title: 'Skill Completion Overview',
                        subtitle: 'Breakdown of complete skills across learning paths',
                    }}>
                        <div className='max-w-[300px] h-[150px] rounded-2xl bg-[#CCCCCC]'></div>
                    </VisualCards>
                </div>
                <div className='col-span-2'>
                    <VisualCards props={{
                        title: 'Daily Engagement',
                        subtitle: 'Time spent on learning activities per day',
                    }}>
                        <div className='max-w-[300px] h-[150px] rounded-2xl bg-[#CCCCCC]'></div>
                    </VisualCards>
                </div>
            </div>
        </section>
    )
}

export default Visuals