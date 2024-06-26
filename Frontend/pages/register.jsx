import { register_user } from '@/services';
import Link from 'next/link';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({ 
        firstName: "", 
        lastName: "", 
        email: "", 
        password: "", 
        dateOfBirth: "", 
        organisation_name: "" 
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await register_user(formData);
        if (res.success) {
            toast.success(res.message);
            setTimeout(() => {
            router.push(`/OtpVerification?email=${formData.email}`);
            },1000);
        } else {
            toast.error(res.message);
        }
    };

    return (
        <>
            <section className="bg-indigo-700 text-center">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-indigo-800 dark:border-indigo-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-indigo-700 md:text-2xl dark:text-white">
                                Create an Account
                            </h1>
                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                                <div className='text-left'>
                                    <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-indigo-700 dark:text-white">First Name</label>
                                    <input onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} type="text" name="firstName" id="firstName" className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Pratik" required />
                                </div>
                                <div className='text-left'>
                                    <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-indigo-700 dark:text-white">Last Name</label>
                                    <input onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} type="text" name="lastName" id="lastName" className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Khulge" required />
                                </div>
                                <div className='text-left'>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-indigo-700 dark:text-white">Email</label>
                                    <input onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" name="email" id="email" className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                                </div>
                                <div className='text-left'>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-indigo-700 dark:text-white">Password</label>
                                    <input onChange={(e) => setFormData({ ...formData, password: e.target.value })} type="password" name="password" id="password" placeholder="••••••••" className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                </div>
                                <div className='text-left'>
                                    <label htmlFor="dateOfBirth" className="block mb-2 text-sm font-medium text-indigo-700 dark:text-white">Date of Birth</label>
                                    <input onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} type="date" name="dateOfBirth" id="dateOfBirth" className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                </div>
                                <div className='text-left'>
                                    <label htmlFor="organisation_name" className="block mb-2 text-sm font-medium text-indigo-700 dark:text-white">Organisation Name</label>
                                    <input onChange={(e) => setFormData({ ...formData, organisation_name: e.target.value })} type="text" name="organisation_name" id="organisation_name" className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='org001' required />
                                </div>
                                <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign Up</button>
                                <p className="text-sm font-light text-indigo-500 dark:text-indigo-400">
                                    Already have an account  <Link href="/" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign In</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer />
            
        </>
    )
}
