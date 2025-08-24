'use client'
import { useUsername } from '@/state/usernameStore'
import React from 'react'



const FirstName = () => {
    const user = useUsername((state) => (state.name))

    const getFirstName = (firstName: string) => {
        if(!firstName) return "Guest"
      return   firstName.trim().split(" ")[0]
    }

  return (
    <span>{getFirstName(user)}</span>
  )
}

export default FirstName