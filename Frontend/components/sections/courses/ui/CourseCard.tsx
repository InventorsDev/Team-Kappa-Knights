import React from 'react'
import Image from 'next/image'
import Icon from '@/public/dashboard/greenVector.png'
import Link from 'next/link'

type CardProps = {
  title: string
  content: string
  tutor: string
  duration: string
  progress: number
  link: string
}

const CourseCard = ({
  props,
  className = "",
}: {
  props: CardProps
  className?: string
}) => {
  return (
    <div
      className={`p-4 rounded-2xl border border-[#CCCCCC] md:text-[18px] flex flex-col h-full ${className}`}
    >
      {/* Header */}
      <section className="flex gap-2 pb-4 items-center">
        <Image src={Icon} width={20} height={20} alt=""  className='w-4 h-4 md:w-7 md:h-7'/>
        <div className="font-semibold text-[18px]">{props.title}</div>
      </section>

      {/* Content */}
      <div className="text-[16px] md:text-[18px] text-[#4A4A4A] line-clamp-2">
        {props.content}
      </div>
      <div className="py-3 text-sm text-gray-600">
        {props.tutor} &middot; {props.duration}
      </div>

      {/* Progress + Button */}
      <section className="mt-auto">
        <div className="flex justify-between">
          <p>Progress</p>
          <p className="font-semibold">{props.progress}%</p>
        </div>

        <div className="my-4 h-[6px] w-full bg-[#EBFFFC] rounded-lg overflow-hidden">
          <div
            className="h-full bg-[#00bfa5] rounded-lg"
            style={{ width: `${props.progress}%` }}
          ></div>
        </div>

        <Link href={`${props.link}`}>
          <button className="bg-[#00B5A5] rounded-lg text-center w-full md:text-[18px] md:px-5 py-3 text-white font-bold hover:cursor-pointer">
            View Details
          </button>
        </Link>
      </section>
    </div>
  )
}

export default CourseCard

















// import React, { ReactNode } from 'react'
// import Image from 'next/image'
// import Icon from '@/public/dashboard/greenVector.png'
// import Link from 'next/link'

// type CardProps = {
//     title: string
//     content: string
//     tutor: string
//     duration: string
//     progress: number
//     index: number
// }

// const CourseCard = ({ props, className = "", }: { props: CardProps, className: string }) => {
//     return (
//         <div className='p-4 rounded-2xl border border-[#CCCCCC] md:text-[18px]'>
//             <section className='flex gap-2 pb-4'>
//                 <Image src={Icon} width={20} height={20} alt='' />
//                 <div className='font-semibold text-[18px]'>{props.title}</div>
//             </section>
//             <div className='text-[16px] md:text-[18px] text-[#4A4A4A]'>{props.content}</div>
//             <div className='py-3'>{props.tutor} &middot; {props.duration} </div>
//             <section>
//                 <div className='flex justify-between '>
//                     <p className=''>Progress</p>
//                     <p className='font-semibold'>{props.progress}%</p>
//                 </div>

//                 <div className={`my-4 h-[6px] w-full bg-[#EBFFFC] rounded-lg overflow-hidden`} >
//                     <div
//                         className={`h-full bg-[#00bfa5] rounded-lg`}
//                         style={{ width: `${props.progress}%` }}
//                     ></div>
//                 </div>
//                 <div>
//                     <Link href={`/courses/${props.index}`}>
//                         <button className='bg-[#00B5A5] rounded-lg text-center w-full md:text-[18px] md:px-5 py-3 text-white font-bold hover:cursor-pointer'>View Details</button>
//                     </Link>
//                 </div>
//             </section>
//         </div>
//     )
// }

// export default CourseCard