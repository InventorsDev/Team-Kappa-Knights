import Image, { StaticImageData } from 'next/image'
import React from 'react'

type KeyDetailType = {
    title: string
    icon: string | StaticImageData
    details: string
    moreDetails: string | null
    colour: string
}

const KeyCard = ({props}: {props: KeyDetailType}) => {
  return (
    <div className={` rounded-2xl  space-y-3 bg-[${props.colour}]`}>
        <div className='flex gap-3 items-center ml-2 border-y border-r border-[#CCCCCC]/50 rounded-2xl rounded-l-2xl p-5 bg-white'>
            <Image src={props.icon} width={40} height={40}  alt=''/>
            <div>
            <p className='font-semibold text-[18px] md:text-[20px] pb-2'>{props.title}</p>
            <p className='text-[14px] text-[#4A4A4A] md:text-[18px]'>{props.details}</p>
            <p className='text-[14px] text-[#4A4A4A] md:text-[18px]'>{props.moreDetails}</p>
            </div>
        </div>
    </div>
  )
}

export default KeyCard