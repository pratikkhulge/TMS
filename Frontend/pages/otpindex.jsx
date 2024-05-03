import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import Router from 'next/router';
import Link from 'next/link';

export default function Home() {
    const [formData, setFormData] = useState({ email: "", otp: "", organisation_name: "" });
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");

    const handleSendOTP = async () => {
        const res = await fetch('http://localhost:5000/user/loginUserOTP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: formData.email })
        });

        const data = await res.json();
        if (data.success) {
            toast.success(data.message);
            setOtpSent(true);
        } else {
            toast.error(data.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, organisation_name } = formData;
        if (otpSent) {
            const res = await fetch('http://localhost:5000/user/userLoginWithOtp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, otp, organisation_name })
            });

            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                Cookies.set("token", data.token);
                setTimeout(() => {
                    Router.push("/home");
                }, 1000);
            } else {
                toast.error(data.message);
            }
        }
    };

    return (
        <>
            <div className="bg-indigo-700 text-center text-indigo-600">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-indigo-800 dark:border-indigo-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-indigo-600 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                                <div className='text-left'>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Your email</label>
                                    <input onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" name="email" id="email" className="bg-indigo-50 border border-indigo-300 text-indigo-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                                </div>
                                {!otpSent && (
                                    <button onClick={handleSendOTP} className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Send OTP</button>
                                )}
                                {otpSent && (
                                    <div className='text-left'>
                                        <label htmlFor="otp" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">OTP</label>
                                        <input onChange={(e) => setOtp(e.target.value)} type="text" name="otp" id="otp" className="bg-indigo-50 border border-indigo-300 text-indigo-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter OTP" required="" />
                                    </div>
                                )}
                                <div className='text-left'>
                                    <label htmlFor="organisation_name" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Organisation Name</label>
                                    <input onChange={(e) => setFormData({ ...formData, organisation_name: e.target.value })} type="text" name="organisation_name" id="organisation_name" className="bg-indigo-50 border border-indigo-300 text-indigo-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your organisation name" required="" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-indigo-300 rounded bg-indigo-50 focus:ring-3 focus:ring-primary-300 dark:bg-indigo-700 dark:border-indigo-600 dark:focus:ring-primary-600 dark:ring-offset-indigo-800" required="" />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="remember" className="text-indigo-500 dark:text-indigo-300">Remember me</label>
                                        </div>
                                    </div>
                                    <a href="/" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Login With Password?</a>
                                </div>
                                <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                                <p className="text-sm font-light text-indigo-500 dark:text-indigo-400">
                                    Don’t have an account yet? <Link href="/register" className="font-medium text-indigo-600 hover:underline dark:text-primary-500">Sign up</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}
