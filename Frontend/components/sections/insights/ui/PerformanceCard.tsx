import Image, { StaticImageData } from 'next/image'
import React from 'react'

type PerformanceDetailType = {
    title: string
    icon: string | StaticImageData
    num: number | null
    numText: string
    details: string
}

const PerformanceCard = ({props}: {props: PerformanceDetailType}) => {
  return (
    <div className='border border-[#CCCCCC]/50 rounded-2xl p-5 space-y-3 h-full flex flex-col'>
        <div className='flex justify-between items-center'>
            <p className='font-semibold md:text-[20px]'>{props.title}</p>
            <Image src={props.icon} width={20} height={20}  alt=''/>
        </div>
        <p className='text-[#00BFA5] text-xl font-semibold'>{props.num} {props.numText}</p>
        <p className='text-[#4A4A4A] text-sm md:text-[18px]'>{props.details}</p>
    </div>
  )
}

export default PerformanceCard