'use client'
import React from 'react'
import Image from 'next/image'
import Logo from '@/public/images/image 3.png'
import Link from 'next/link'
import Picture from '@/public/images/ea1b6262a739e5fb38bc0cd69c97b27da0a6e89f.jpg'
import { useState } from 'react'
import { auth  } from '@/app/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'

const Login = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const router = useRouter();

        const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            try {
                await signInWithEmailAndPassword(auth, email, password)
                alert('User signed in successfully')
                router.push('')
            } catch(error) {
                alert('Incorrect email or password')
                console.log(error)
            }
        }
    return (
        <main className='md:flex md:grid-cols-[2fr 3fr] w-screen relative  select-none h-screen' style={{ fontFamily: 'var(--font-nunito), sans-serif' }}>
            <section className='hidden  md:block basis-4/9 h-full overflow-hidden'>
                <Image src={Picture} width={638} alt='' className='w-full h-full object-cover scale-120' />
            </section>
            <section className='flex justify-center mx-[20px] md:mx-[50px] basis-full md:basis-5/9 '>
                <section className='w-full max-w-[440px] md:min-w-[600px] md:max-w-[700px] mt-[64px] '>
                    <div className='w-full flex items-center justify-center'>
                        <Image src={Logo} alt="Neuroloom Logo" className='' />
                    </div>
                    <div className='w-full mt-[29px] text-center'>
                        <div>
                            <p style={{ fontWeight: 700 }} className='w-full text-[24px]'>Log in to your account</p>
                            <p style={{ fontWeight: 400 }} className='text-[16px] text-[#6F6F6F]'>Fill in the field below to log in</p>
                        </div>
                        <form className='w-full mt-[30px]' onSubmit={(e) => (handleSignin(e))}>
                            <div className='w-full'>
                                <label htmlFor='email' className='text-left block md:mb-[12px]' style={{ fontWeight: 500 }}>Email Address</label>
                                <input type="email" 
                                name='email' 
                                placeholder='name@example.com ' 
                                className='border border-[#D9D9D9] focus:border-[#00BFA5]
             not-placeholder-shown:border-[#00BFA5] rounded-xl md:rounded-2xl p-[12px] md:p-[20px] w-[100%] mb-[30px]' 
                                onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div>
                                <label htmlFor='password' className='text-left block md:mb-[12px]' style={{ fontWeight: 500 }}>Password</label>
                                <input type="password"
                                 name='password' 
                                 placeholder='min. of 8 characters' 
                                 className='border border-[#D9D9D9]
                                     focus:border-[#00BFA5]
                                     not-placeholder-shown:border-[#00BFA5] 
                               rounded-xl md:rounded-2xl p-[12px] w-full mb-[12px] md:p-[20px]'
                                    onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className='flex justify-between mb-[30px]'>
                                <div className='flex'>
                                    <label htmlFor='remember' className='text-left flex items-center cursor-pointer'>
                                        <input type="checkbox" name='remember' className='mr-[8px] accent-[#00BFA5] hover:cursor-pointer' />
                                        <span>Remember me</span></label>
                                </div>
                                <div className='hover:cursor-pointer'>
                                    Forgot password?
                                </div>
                            </div>
                        <button className='bg-[#00BFA5] text-white rounded-xl md:rounded-2xl py-[12px] w-full md:py-[20px] text-xl hover:cursor-pointer' type='submit'>Log In</button>
                            <div className='mt-[12px]'>
                                <p className='text-center '>Don&apos;t have an account? <Link href="/components/CreateAcct" className='text-[#00BFA5] hover:cursor-pointer'>Sign up</Link></p>
                            </div>
                        </form>
                    </div>
                </section>
            </section>
        </main>
    )
}

export default Login