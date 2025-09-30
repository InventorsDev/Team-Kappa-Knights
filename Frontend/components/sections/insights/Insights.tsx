import React from 'react'
import Visuals from './Visuals'
import KeyInsights from './KeyInsights'
import PushingForward from './PushingForward'
import Performance from './Performance'

const Insights = () => {
  return (
    <div className='py-7 space-y-7' style={{ 'fontFamily': 'var(--font-nunito)'}}>
        <Performance />
        <Visuals />
        <KeyInsights />
        <PushingForward />
    </div>
  )
}

export default Insights