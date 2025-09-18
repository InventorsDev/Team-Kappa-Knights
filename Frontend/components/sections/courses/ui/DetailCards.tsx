import Image, { StaticImageData } from 'next/image'
import React from 'react'

type DetailCardsProps = {
    id: number
    levelTitle: string
    levelContent: string
    levelTime: number
    levelStatusIcon: StaticImageData | string
    levelStatus: string
}

const DetailCards = ({props}: {props: DetailCardsProps}) => {
  return (
    
            <div className='p-4 rounded-2xl border border-[#CCCCCC] md:text-[18px]'>
            <p className=''><span className='font-bold text-[#212121]'>Level {props.id}:</span> {props.levelTitle}</p>
            <div className='text-[16px] md:text-[18px] flex justify-between '>
                <p className='text-[#4A4A4A] w-[60%] py-3'>{props.levelContent}</p>
                <button className='bg-[#00B5A5] rounded-lg text-center  md:text-[18px] px-4 py-2 h-fit  text-white font-bold'>
                    {props.levelTime} mins
                </button>
            </div>
            <div className='flex gap-2 items-center'>
                <Image src={props.levelStatusIcon} width={16} height={16} alt={`${props.levelStatus}`} className='w-4 h-4'/>
                <p className='text-[#00BFA5]'>{props.levelStatus}</p>
            </div>
        </div>
  )
}

export default DetailCards