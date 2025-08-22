'use client'
import { useUsername } from '@/state/usernameStore'
import React from 'react'



const UserName = () => {
    const user = useUsername((state) => (state.name))

    const getName = (name: string) => {
        if(!name) return "Guest"
      return   name
    }
  return (
    <span>{getName(user)}</span>
  )
}

export default UserName