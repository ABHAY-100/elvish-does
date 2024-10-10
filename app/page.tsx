"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
    const [currentValue, setCurrentValue] = useState<number | null>(null); // State to hold the current value

    const fetchCurrentValue = async () => {
        const response = await fetch('/api/get-aura');
        if (response.ok) {
            const data = await response.json();
            setCurrentValue(data.currentValue); // Update the state with the fetched value
        } else {
            console.error('Failed to fetch current value');
        }
    };

    useEffect(() => {
        fetchCurrentValue(); // Fetch the current value when the component mounts

        const intervalId = setInterval(() => {
            fetchCurrentValue(); // Fetch every 1 second
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup the interval on unmount
    }, []);

    return (
        <>
            <div className='flex flex-col max-w-[300px] mx-auto items-center justify-center h-screen'>
                <h1 data-aos="fade-up" data-aos-duration="1000" className='text-5xl opacity-90 font-bold tracking-wide mt-[10px]'>
                    {currentValue} <span className='text-4xl'>aura</span>
                </h1>
                <a 
                    data-aos="fade-up" 
                    data-aos-duration="1000" 
                    data-aos-delay="100" 
                    href='https://www.instagram.com/elvin_j_alapatt' 
                    target='_blank' 
                    className='text-[21px] opacity-90 tracking-wide mt-[6px]'
                >
                    @elvish_bai
                </a>
            </div>

            <div className="flex flex-col items-center justify-center py-[20px]">
                <Link 
                    href="/secret-key" 
                    className="bg-transparent text-white underline underline-offset-4 px-4 py-2 rounded-full border-2 border-black"
                >
                    Is there any change?
                </Link>
            </div>
        </>
    );
}
