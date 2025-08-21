import React from 'react'
import Mood from './Mood'
import LearningJourney from './LearningJourney'
import Progress from './Progress'
import Suggested from './Suggested'
import ThisWeek from './ThisWeek'
import Recent from './Recent'
import Navbar from './Navbar'

const Dashboard = () => {
  return (
    <main className='pt-10 px-5 space-y-8 text-[#212121] pb-20' style={{ "fontFamily": "var(--font-nunito), sans-serif"}}>
      <Navbar />
      <Mood />
      <LearningJourney />
      <Progress />
      <Suggested />
      <ThisWeek />
      <Recent />
    </main>
  )
}

export default Dashboard