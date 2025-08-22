'use client'
import React, { useState } from 'react'
import Mood from './Mood'
import LearningJourney from './LearningJourney'
import Progress from './Progress'
import Suggested from './Suggested'
import ThisWeek from './ThisWeek'
import Recent from './Recent'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <main className='pt-10 px-5 md:px-8 space-y-8 text-[#212121] pb-20' style={{ "fontFamily": "var(--font-nunito), sans-serif" }}>
      <div className='block md:hidden'>
        <Navbar />
        <Sidebar  />
      </div>
          <Mood />
          <section className="md:grid grid-cols-2 grid-rows-2 gap-5 md:gap-x-8">
            <div className="pb-5 md:col-start-1 md:row-start-1">
              <LearningJourney />
            </div>
            <div className="pb-5 md:col-start-1 md:row-start-2">
              <Progress />
            </div>
            <div className="md:col-start-2 md:row-start-1 md:row-span-2 md:border md:border-gray-300 md:rounded-2xl md:px-8 md:pt-5 md:pb-0">
              <Suggested />
            </div>
          </section>
          <ThisWeek />
          <Recent />
    </main>
  )
}

export default Dashboard