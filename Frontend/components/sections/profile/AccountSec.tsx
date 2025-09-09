"use client"

import React, { useState } from "react"
import { toast } from "sonner"

const AccountSec = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [allPasswords, setAllPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAllPasswords(prev => ({ ...prev, [name]: value }))
  }

  const toggleEdit = () => {
    setIsEditing(prev => !prev)
    if (isEditing) {
      setAllPasswords({ current: "", new: "", confirm: "" })
    }
  }

  const handleSave = async () => {
    if (!allPasswords.new || allPasswords.new !== allPasswords.confirm) {
      toast.error("New and confirm passwords must match")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Not signed in")
      return
    }

    try {
      const res = await fetch("http://34.228.198.154/api/user/p", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: allPasswords.current,
          new_password: allPasswords.new,
        }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      toast.success("Password updated")
      setAllPasswords({ current: "", new: "", confirm: "" })
      setIsEditing(false)
      setShowPassword(false)
    } catch (err: any) {
      console.error("Password update failed:", err)
      toast.error(err.message || "Update failed")
    }
  }

  const mask = (val: string) => (showPassword ? val : "•".repeat(val.length))

  return (
    <main className="select-none">
      <div className="pb-5">
        <p className="text-[18px] font-bold md:text-[24px]">Account Security</p>
        <p className="text-[15px] text-[#4A4A4A] md:text-[20px]">
          Manage your password and keep your account safe
        </p>
      </div>

      <form className="space-y-5 md:pt-5">
        {/* Current Password */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <label className="md:flex-2 md:text-[18px] md:font-semibold">Current Password</label>
          <div className="md:flex-7 md:py-6 md:px-4 p-2 rounded-xl border border-[#CCCCCC] flex items-center justify-between">
            {isEditing ? (
              <input
                type={showPassword ? "text" : "password"}
                name="current"
                value={allPasswords.current}
                onChange={handleChange}
                className="flex-1 outline-none"
              />
            ) : (
              <span className="flex-1">{mask(allPasswords.current)}</span>
            )}
            <button
              type="button"
              className="ml-2 text-[#00B5A5]"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {/* {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />} */}
            </button>
          </div>
        </div>

        {/* New & Confirm Password */}
        {isEditing && (
          <>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <label className="md:flex-2 md:text-[18px] md:font-semibold">New Password</label>
              <input
                type="password"
                name="new"
                value={allPasswords.new}
                onChange={handleChange}
                className="md:flex-7 md:py-6 md:px-4 p-2 rounded-xl border border-[#CCCCCC]"
              />
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <label className="md:flex-2 md:text-[18px] md:font-semibold">Confirm Password</label>
              <input
                type="password"
                name="confirm"
                value={allPasswords.confirm}
                onChange={handleChange}
                className="md:flex-7 md:py-6 md:px-4 p-2 rounded-xl border border-[#CCCCCC]"
              />
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="flex md:justify-end px-[20%] md:px-0 gap-3 pt-3">
          <button
            type="button"
            className="bg-[#00B5A5] rounded-lg text-center md:text-[18px] w-full md:w-[22%] py-3 text-white font-bold"
            onClick={isEditing ? handleSave : toggleEdit}
          >
            {isEditing ? "Update Password" : "Edit Password"}
          </button>
        </div>

        <hr className="border border-[#CCCCCC]/50 w-full mt-8" />
      </form>
    </main>
  )
}

export default AccountSec











// 'use client'
// import React, { useState } from 'react'
// import { EyeIcon, EyeOffIcon } from 'lucide-react'
// import { toast } from 'sonner'
// import { useUserStore } from '@/state/store'

// const AccountSec = () => {
//   const [isEditing, setIsEditing] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const {password, setPassword} = useUserStore()

//   const [allPasswords, setAllPasswords] = useState({
//     current: password, 
//     new: '',
//     confirm: ''
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setAllPasswords(prev => ({ ...prev, [name]: value }))
//   }

//   const toggleEdit = () => {
//     setIsEditing(prev => !prev)
//     if (isEditing) {
//       setAllPasswords(prev => ({ ...prev, new: '', confirm: '' }))
//     }
//   }

//   const handleSave = () => {
//     if (allPasswords.new && allPasswords.new === allPasswords.confirm) {
//       setAllPasswords(prev => ({
//         ...prev,
//         current: allPasswords.new,
//         new: '',
//         confirm: ''
//       }))
//       setIsEditing(false)
//       setShowPassword(false)
//       console.log('Password updated:', allPasswords.new)
//     } else {
//       toast('New and Confirm allPasswords must match.')
//     }
//   }

//   const mask = (val: string) => showPassword ? val : '•'.repeat(val.length)

//   return (
//     <main className='select-none'>
//       <div className='pb-5'>
//         <p className='text-[18px] font-bold md:text-[24px]'>Account Security</p>
//         <p className='text-[15px] text-[#4A4A4A] md:text-[20px]'>
//           Manage your password and keep your account safe
//         </p>
//       </div>

//       <form className='space-y-5 md:pt-5'>
//         {/* Current Password */}
//         <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
//           <label className='md:flex-2 md:text-[18px] md:font-semibold'>Current Password</label>
//           <div className='md:flex-7 md:py-6 md:px-4 p-2 rounded-xl border border-[#CCCCCC] flex items-center justify-between'>
//             <span className='flex-1'>{mask(allPasswords.current)}</span>
//             <button
//               type='button'
//               className='ml-2 text-[#00B5A5]'
//               onClick={() => setShowPassword(prev => !prev)}
//             >
//               {showPassword ? <EyeOffIcon className='size-4' /> : <EyeIcon className='size-4' />}
//             </button>
//           </div>
//         </div>

//         {/* New & Confirm Password */}
//         {isEditing && (
//           <>
//             <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
//               <label className='md:flex-2 md:text-[18px] md:font-semibold'>New Password</label>
//               <input
//                 type='password'
//                 name='new'
//                 value={allPasswords.new}
//                 onChange={handleChange}
//                 className='md:flex-7 md:py-6 md:px-4 p-2 rounded-xl border border-[#CCCCCC]'
//               />
//             </div>

//             <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
//               <label className='md:flex-2 md:text-[18px] md:font-semibold'>Confirm Password</label>
//               <input
//                 type='password'
//                 name='confirm'
//                 value={allPasswords.confirm}
//                 onChange={handleChange}
//                 className='md:flex-7 md:py-6 md:px-4 p-2 rounded-xl border border-[#CCCCCC]'
//               />
//             </div>
//           </>
//         )}

//         {/* Buttons */}
//         <div className='flex md:justify-end px-[20%] md:px-0 gap-3 pt-3'>
//           <button
//             type='button'
//             className='bg-[#00B5A5] rounded-lg text-center md:text-[18px] w-full md:w-[22%] py-3 text-white font-bold'
//             onClick={isEditing ? handleSave : toggleEdit}
//           >
//             {isEditing ? 'Update Password' : 'Edit Password'}
//           </button>
//         </div>

//         <hr className='border border-[#CCCCCC]/50 w-full mt-8' />
//       </form>
//     </main>
//   )
// }

// export default AccountSec







// 'use client'
// import React, { useState } from 'react'
// import Image from 'next/image'
// import DropDown from '@/public/dashboard/downArrow.png'
// import AuthButton from '@/components/common/button/Button'

// const AccountSec = () => {
//   const [isRouting, setIsRouting] = useState<boolean>(false);
//   return (
//     <main className='select-none'>
//       <div className='pb-5'>
//         <p className='text-[18px] font-bold md:text-[24px]'>Account Security</p>
//         <p className='text-[15px] text-[#4A4A4A] md:text-[20px]'>Manage your password and keep your account safe</p>
//       </div>
//       <form className='space-y-5 md:pt-5'>
//         <div className='flex flex-col md:flex-row md:justify-between md:items-center md:font-semibold gap-2'>
//           <label className='md:flex-2 md:text-[18px] md:font-semibold'>Current Password</label>
//           <input type='password' name='CurrentPassword' className='md:flex-7 md:py-6 p-2 rounded-xl border border-[#CCCCCC]' />
//         </div>
//         <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
//           <label className='md:flex-2 md:text-[18px] md:font-semibold'>New Password</label>
//           <input type='password' name='NewPassword' className='md:flex-7 md:py-6 p-2 rounded-xl border border-[#CCCCCC]' />
//         </div>
//         <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between '>
//           <label className='md:flex-2 md:text-[18px] md:font-semibold'>Confirm Password</label>
//           <input type='password' name='ConfirmPassword' className='md:flex-7 md:py-6 p-2 rounded-xl border border-[#CCCCCC]' />
//         </div>

//         <div className='flex md:justify-end px-[20%]  md:px-[0] gap-3 pt-3'>
//           <div className='md:w-[22%] w-full'>
//           <button className='bg-[#00B5A5] rounded-lg text-center md:text-[18px] w-full md:px-5 py-3 text-white font-bold'>Update Password</button>
//           </div>
//         </div>

//         <hr className='border border-[#CCCCCC]/50 w-full mt-8' />
//       </form>
//     </main>
//   )
// }

// export default AccountSec