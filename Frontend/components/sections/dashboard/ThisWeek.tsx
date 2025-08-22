'use client'
import React from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'


const moods = [
    {
        day: "Mon",
        logo: "motivated.png",
        altText: "motivated"
    },
    {
        day: "Tue",
        logo: "stressed.png",
        altText: "stressed"
    },
    {
        day: "Wed",
        logo: "excited.png",
        altText: "excited"
    },
    {
        day: "Thur",
        logo: "okay.png",
        altText: "okay"
    },
    {
        day: "Fri",
        logo: "frustrated.png",
        altText: "frustrated"
    },
    {
        day: "Sat",
        logo: "tired.png",
        altText: "tired"
    },
    {
        day: "Sun",
        logo: "tired.png",
        altText: "tired"
    },
];

const ThisWeek = () => {
    return (
        <main className='pt-5 space-y-3'>
            <p className='text-[18px] md:text-[32px] font-bold'>This Week&apos;s Journey</p>
            <section>
                <Swiper
                    spaceBetween={16}
                    slidesPerView={4}
                    className="mySwiper"
                        breakpoints={{
                            300: { slidesPerView: 3 },
                            414: { slidesPerView: 3 },
                            640: { slidesPerView: 4 },
                            768: { slidesPerView: 6 },
                            1024: { slidesPerView: 6 },
                            1280: { slidesPerView: 6 },
                            1600: { slidesPerView: 8 },
                        }}
                >
                    {moods.map((item) => {
                        // const isGreen = index % 2 !== 0
                        return (
                            <SwiperSlide key={item.day}>
                                <div
                                    className={`flex flex-col gap-2 items-center justify-center text-center text-[16px] bg-[#F5F5F5] font-semibold space-x-2 rounded-2xl p-[16px]`}
                                >
                                    <p className='text-[24px] font-medium'>{item.day}</p>
                                    <Image src={`/emotions/${item.logo}`} width={50} height={50} alt={`${item.altText}`} />
                                </div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>

            </section>
        </main>
    )
}

export default ThisWeek