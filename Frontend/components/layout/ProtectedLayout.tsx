'use client'
import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Props = { children: ReactNode }

export default function ProtectedLayout({ children }: Props) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/')
      localStorage.setItem('token', '')   // yeet them back home
    }
  }, [router])

  return <>{children}</>
}
