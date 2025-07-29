'use client'
import React from 'react'
import Image from 'next/image'
import Logo from '@/public/images/image 3.png'
import Link from 'next/link'
import Google from '@/public/images/Google.png'
import Picture from '@/public/images/ea1b6262a739e5fb38bc0cd69c97b27da0a6e89f.jpg'
import { useState } from 'react'
import { auth, db, provider } from '@/app/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { addDoc, collection } from 'firebase/firestore'
import { signInWithPopup } from 'firebase/auth'

const CreateAcct = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [signingIn, setSigningIn] = useState(false)
    const router = useRouter();

    const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password.length < 8) {
            const el = document.getElementById("wrong")!
            if (el) el.classList.remove("hidden");
            return
        }
        const el = document.getElementById("wrong");
        if (el) el.classList.add("hidden");

        try {
            await createUserWithEmailAndPassword(auth, email, password).then(() => {
                addDoc(collection(db, 'users'), {
                    email: email,
                    name: name
                })
            }
            );
            alert('User signed up successfully')
            router.push('/components/Login');

        } catch (error) {
            alert('Incorrect email or password')
            console.error("Error creating account:", error);
        }
    };

    const handleGoogleSignup = async () => {
        if (signingIn) return;
        setSigningIn(true);
        try {
            const result = await signInWithPopup(auth, provider)
            const user = result.user
            router.push('/components/Login')
            console.log(user)
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'code' in error) {
                const err = error as { code: string };
                if (err.code === "auth/popup-closed-by-user") {
                    console.log("User closed the popup before completing sign-in");
                } else {
                    console.error('Google Sign-In Error:', err)
                }
            }
        } finally {
            setSigningIn(false)
        }
    }
    return (
        <main
            className="xl:flex w-screen h-screen overflow-hidden"
            style={{ fontFamily: 'var(--font-nunito), sans-serif' }}
        >

            <section className="hidden xl:block w-[40%] h-screen fixed left-0 top-0 z-10">
                <Image
                    src={Picture}
                    width={638}
                    alt=""
                    className="w-full h-full object-cover scale-110"
                />
            </section>
            <section className="flex justify-center xl:ml-[45%] w-full overflow-y-auto h-screen px-[20px] xl:px-[50px] ">
                <section className="w-full max-w-[440px] xl:min-w-[600px] xl:max-w-[700px] mt-[64px]">
                    <div className='w-full flex items-center justify-center'>
                        <Image src={Logo} alt="Neuroloom Logo" className='' />
                    </div>
                    <div className='w-full mt-[29px] text-center'>
                        <div>
                            <p style={{ fontWeight: 700 }} className='w-full text-[24px]'>Create an account</p>
                            <p style={{ fontWeight: 400 }} className='text-[16px] text-[#6F6F6F]'>Fill in the field below to create an account</p>
                        </div>
                        <form className='w-full mt-[30px]' onSubmit={(e) => (handleCreateAccount(e))}>
                            <div className='w-full'>
                                <label htmlFor='name' className='text-left block' style={{ fontWeight: 500 }}>Full Name</label>
                                <input type="text"
                                    name='name'
                                    placeholder='John Doe'
                                    className='border border-[#D9D9D9] focus:border-[#00BFA5]
                                           rounded-xl p-[12px] w-[100%] mb-[30px]'
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className='w-full'>
                                <label htmlFor='email' className='text-left block' style={{ fontWeight: 500 }}>Email Address</label>
                                <input type="email"
                                    name='email'
                                    placeholder='name@example.com '
                                    className='border border-[#D9D9D9] focus:border-[#00BFA5]
             not-placeholder-shown:border-[#00BFA5] rounded-xl p-[12px] w-[100%] mb-[30px]'                  onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className=''>
                                <label htmlFor='password' className='text-left block' style={{ fontWeight: 500 }}>Password</label>
                                <input type="password"
                                    name='password'
                                    placeholder='min. of 8 characters'
                                    className='border border-[#D9D9D9]
                                     focus:border-[#00BFA5]
                                     not-placeholder-shown:border-[#00BFA5] 
                               rounded-xl p-[12px] w-full '
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div id='wrong' className='hidden text-red-600 '>Password cannot be less than 8 characters</div>
                            <button className='bg-[#00BFA5] text-white rounded-xl py-[12px] w-full hover:cursor-pointer mt-[50px]' type='submit'>Sign up</button>
                            <div className='mt-[12px] mb-[15px]'>
                                <p className='text-center '>Already have an account? <Link href="/components/Login" className='text-[#00BFA5] hover:cursor-pointer'>Log in</Link></p>
                            </div>
                            <section className='flex items-center gap-4 mb-[12px]'>
                                <hr className='flex-grow border-t border-[#CCCCCC]' />
                                <span className=''>or</span>
                                <hr className='flex-grow border-t border-[#CCCCCC]' />
                            </section>
                        </form>

                        <button className=' border border-[#CCCCCC] rounded-xl py-[12px] w-full hover:cursor-pointer' onClick={() => handleGoogleSignup()} disabled={signingIn}>
                            <div className='flex items-center justify-center gap-[4px]'>
                                <Image src={Google} alt='Google logo' />
                                <p>Sign in with Google</p>
                            </div>
                        </button>
                    </div>
                </section>
            </section>
        </main>
    )
}

export default CreateAcct