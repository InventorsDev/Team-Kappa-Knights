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
  badge?: string
  external?: boolean
}

const CourseCard = ({
  props,
  className = "",
}: {
  props: CardProps
  className?: string
}) => {
  const Title = (
    <section className="flex gap-3 pb-4 ">
      <Image src={Icon} width={100} height={100} alt="" className='w-4 h-4 md:w-7 md:h-7' />
      <div className="font-semibold text-[18px] flex flex-col items-start gap-2">
        <span className="">{props.title}</span>
        {props.badge && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border border-gray-300">{props.badge}</span>
        )}
      </div>
    </section>
  )

  return (
    <div
      className={`p-4 rounded-2xl border border-[#CCCCCC] md:text-[18px] flex flex-col h-full ${className}`}
    >
      {/* Header */}
      {Title}

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

        {props.external ? (
          <a href={props.link} target="_blank" rel="noopener noreferrer">
            <button className="bg-[#00B5A5] rounded-lg text-center w-full md:text-[18px] md:px-5 py-3 text-white font-bold hover:cursor-pointer">
              View Details
            </button>
          </a>
        ) : (
          <Link href={`${props.link}`}>
            <button className="bg-[#00B5A5] rounded-lg text-center w-full md:text-[18px] md:px-5 py-3 text-white font-bold hover:cursor-pointer">
              View Details
            </button>
          </Link>
        )}
      </section>
    </div>
  )
}

export default CourseCard
