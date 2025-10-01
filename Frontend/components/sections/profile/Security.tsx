'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Delete from '@/public/dashboard/deleteIcon.png'
import Back from '@/public/dashboard/xButtonBlack.png'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { deleteUser } from 'firebase/auth'
import { deleteDoc, doc } from 'firebase/firestore'

const Security = () => {
  const [isRouting, setIsRouting] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const router = useRouter()

  const handleDisable = async() => {
    const token = localStorage.getItem('token')
    try {
      await fetch('http://34.228.198.154/api/user/disable-me', {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",}})
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async() => {
    setIsRouting(true)
    const token = localStorage.getItem('token')
    try {
      // 1) Delete from your backend
      await fetch('http://34.228.198.154/api/user/me', {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",}})

      // 2) Delete Firestore user doc (if exists)
      const current = auth.currentUser
      if (current) {
        try {
          await deleteDoc(doc(db, 'users', current.uid))
        } catch (e) {
          console.warn('Could not delete Firestore user doc:', e)
        }

        // 3) Delete Firebase Auth user
        try {
          await deleteUser(current)
        } catch (e: unknown) {
          const err = e as { code?: string };
          if (err?.code === 'auth/requires-recent-login') {
            console.warn('Firebase requires recent login to delete account.')
          } else {
            console.error('Failed to delete Firebase Auth user:', e)
          }
        }
      }

      // 4) Cleanup and redirect
      localStorage.removeItem('token')
      setIsClicked(false)
      router.replace('/')
    } catch (err) {
      console.log(err)
    } finally {
      setIsRouting(false)
    }
  }

  return (
    <main className='mb-10 md:border rounded-2xl md:p-7 md:mt-8 select-none '>
      {isClicked && (
        <section className="fixed inset-0 z-50 flex justify-center items-center bg-black/60">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
            <div className="flex w-full justify-end">
              <button onClick={() => setIsClicked(false)} className="p-1">
                <Image src={Back} alt="Exit" width={10} height={10} />
              </button>
            </div>
            <section className="flex flex-col justify-center items-center text-center pt-6">
              <Image src={Delete} alt="Delete" width={60} height={60} />
              <p className="text-[24px] font-bold">Delete Account</p>
              <p className="text-[#4A4A4A] pb-8">
                Are you sure you want to delete your account?
              </p>
              <section className="flex flex-col gap-2 w-full">
                <button onClick={handleDisable} className="bg-[#00B5A5] rounded-xl py-3 text-white font-semibold">
                  Disable Account
                </button>
                <button onClick={handleDelete}  className="bg-[#EBFFFC] rounded-xl py-3  font-semibold">
                  Delete Account
                </button>
              </section>
            </section>
          </div>
        </section>
      )}
      {/* <section className='flex justify-between pb-3'>
        <div>
          <p className='font-semibold text-[18px] md:text-[24px]'>Security & Sessions</p>
          <p className='text-sm text-[#4A4A4A] md:text-[20px]'>Manage your active sessions and data privacy settings
          </p>
        </div>
        <div></div>
      </section> */}
      <section className=''>
        {/* <section className='space-y-5'>
          <div className='flex justify-between md:text-[20px]'>
            <div className='text-[15px] flex flex-col md:text-[18px]'>
              <p className='font-semibold '>Current session (Window, Chrome)</p>
              <p className='text-sm text-[#4A4A4A] md:text-[16px]'>Lagos, Nigeria &middot; Active Now</p>
            </div>
            <div className='border border-[#cccccc] rounded-xl p-3 px-5'>
              Revoke
            </div>
          </div>
          <div className='flex justify-between md:text-[20px]'>
            <div className=' text-[15px] flex flex-col md:text-[18px]'>
              <p className='font-semibold '>Previous session (Window, Chrome)</p>
              <p className='text-sm text-[#4A4A4A] md:text-[16px]'>Lagos, Nigeria &middot; 2 days ago</p>
            </div>
            <div className='border border-[#cccccc] rounded-xl p-3 px-5'>
              Revoke
            </div>
          </div>
        </section>
        <hr className='border border-[#CCCCCC]/50 w-full mt-8' /> */}


        <section className="select-none">
      <div className="pb-5">
        <p className="text-[18px] font-bold md:text-[24px]">Data Management</p>
        <p className="text-[15px] text-[#4A4A4A] md:text-[20px]">
          You&apos;re in charge of your information and account status.
        </p>
      </div>

        <div className="flex md:justify-end px-[20%] md:px-0 gap-3 pt-3">
          <button
            type="button"
            className="bg-[#FF6665] rounded-lg text-center md:text-[18px] w-full md:w-[22%] py-3 text-white font-bold"
            onClick={() => setIsClicked(true)}
          >
            Delete Account
          </button>
        </div>
    </section>

        {/* <section className=' md:flex justify-between items-center'>
          <div className=''>
            <p className='font-semibold md:text-[24px]'>Data Management</p>
            <p className='text-sm text-[#4A4A4A] md:text-[18px]'>You&apos;re in charge of your information and account status.
            </p>
          </div>

          
        <div className="flex md:justify-end px-[20%] md:px-0 gap-3 pt-3">
          <button
            type="button"
            className="bg-[#FF6665] rounded-lg text-center md:text-[18px] w-full md:w-[22%] py-3 text-white font-bold"
            onClick={() => setIsClicked(true)}
          >
            Delete Account
          </button>
        </div>


        </section> */}

      </section>
    </main>
  )
}

export default Security