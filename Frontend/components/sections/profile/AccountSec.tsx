'use client'
import React, { useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { toast } from 'sonner'

const AccountSec = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [passwords, setPasswords] = useState({
    current: 'MySecret123', 
    new: '',
    confirm: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswords(prev => ({ ...prev, [name]: value }))
  }

  const toggleEdit = () => {
    setIsEditing(prev => !prev)
    if (isEditing) {
      setPasswords(prev => ({ ...prev, new: '', confirm: '' }))
    }
  }

  const handleSave = () => {
    if (passwords.new && passwords.new === passwords.confirm) {
      setPasswords(prev => ({
        ...prev,
        current: passwords.new,
        new: '',
        confirm: ''
      }))
      setIsEditing(false)
      setShowPassword(false)
      console.log('Password updated:', passwords.new)
    } else {
      toast('New and Confirm passwords must match.')
    }
  }

  const mask = (val: string) => showPassword ? val : '•'.repeat(val.length)

  return (
    <main className='select-none'>
      <div className='pb-5'>
        <p className='text-[18px] font-bold md:text-[24px]'>Account Security</p>
        <p className='text-[15px] text-[#4A4A4A] md:text-[20px]'>
          Manage your password and keep your account safe
        </p>
      </div>

      <form className='space-y-5 md:pt-5'>
        {/* Current Password */}
        <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
          <label className='md:flex-2 md:text-[18px] md:font-semibold'>Current Password</label>
          <div className='md:flex-7 md:py-6 md:px-4 p-2 rounded-xl border border-[#CCCCCC] flex items-center justify-between'>
            <span className='flex-1'>{mask(passwords.current)}</span>
            <button
              type='button'
              className='ml-2 text-[#00B5A5]'
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <EyeOffIcon className='size-4' /> : <EyeIcon className='size-4' />}
            </button>
          </div>
        </div>

        {/* New & Confirm Password */}
        {isEditing && (
          <>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
              <label className='md:flex-2 md:text-[18px] md:font-semibold'>New Password</label>
              <input
                type='password'
                name='new'
                value={passwords.new}
                onChange={handleChange}
                className='md:flex-7 md:py-6 md:px-4 p-2 rounded-xl border border-[#CCCCCC]'
              />
            </div>

            <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
              <label className='md:flex-2 md:text-[18px] md:font-semibold'>Confirm Password</label>
              <input
                type='password'
                name='confirm'
                value={passwords.confirm}
                onChange={handleChange}
                className='md:flex-7 md:py-6 md:px-4 p-2 rounded-xl border border-[#CCCCCC]'
              />
            </div>
          </>
        )}

        {/* Buttons */}
        <div className='flex md:justify-end px-[20%] md:px-0 gap-3 pt-3'>
          <button
            type='button'
            className='bg-[#00B5A5] rounded-lg text-center md:text-[18px] w-full md:w-[22%] py-3 text-white font-bold'
            onClick={isEditing ? handleSave : toggleEdit}
          >
            {isEditing ? 'Update Password' : 'Edit Password'}
          </button>
        </div>

        <hr className='border border-[#CCCCCC]/50 w-full mt-8' />
      </form>
    </main>
  )
}

export default AccountSec







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