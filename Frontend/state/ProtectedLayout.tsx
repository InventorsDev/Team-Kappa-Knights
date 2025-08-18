'use client'
import React, { ReactNode } from 'react'
import { useAuthStore } from './authStore'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ProtectedLayout = ({children}: {children: ReactNode}) => {
    const {isAuthenticated, hydrated} = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if(hydrated && !isAuthenticated) {
            router.push("/")
        }
    }, [hydrated, isAuthenticated, router])
    if (!hydrated) return null;
  return (
   <> {isAuthenticated ? children : null} </>
  )
}

export default ProtectedLayout