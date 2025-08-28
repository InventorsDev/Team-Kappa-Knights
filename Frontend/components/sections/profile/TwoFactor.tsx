import React from 'react'
import Image from 'next/image'
import Call from '@/public/dashboard/call.png'
import Gmail from '@/public/dashboard/gmail.png'

const TwoFactor = () => {
  return (
    <main className='select-none md:mt-5'>
      <section className='flex justify-between pb-5'>
        <div>
          <p className='font-semibold md:text-[28px]'>Two-Factor Authentication</p>
          <p className='text-sm text-[#4A4A4A] md:text-[20px]'>Add an extra layer of security to your account</p>
        </div>
        <div></div>
      </section>
      <hr className=''/>
      <section className='pt-5'>
        <p className='font-semibold md:text-[28px] md:pb-5'>Connected Account</p>
        <section className='space-y-5'>
          <div className='flex justify-between'>
            <div className='flex gap-2 items-center'>
              <div>
                <Image src={Gmail} width={16} height={16} alt='connect your gmail' className='md:w-[24px]'/>
              </div>
              <div className='font-semibold text-[15px] md:text-[20px]'>Gmail</div>
            </div>
            <div className='border border-[#cccccc] min-w-[130px] md:min-w-[155px] text-center rounded-xl p-3 px-5 md:text-[20px]'>
              Disconnect
            </div>
          </div>
          <div className='flex justify-between'>
            <div className='flex gap-2 items-center'>
              <div>
                <Image src={Call} width={16} height={16} alt='connect your phone number' className='md:w-[24px]'/>
              </div>
              <div className='font-semibold text-[15px] md:text-[20px]'>Phone Number</div>
            </div>
            <div className='border border-[#cccccc] rounded-xl p-3 px-5 md:text-[20px]'>
              Add Number
            </div>
          </div>
        </section>
        <hr className='border border-[#CCCCCC] w-full mt-8 md:hidden' />
      </section>
    </main>
  )
}

export default TwoFactor