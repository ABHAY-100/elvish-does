"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
    const [currentValue, setCurrentValue] = useState<number | null>(null); // State to hold the current value
    const [loading, setLoading] = useState<boolean>(true); // State to handle loading status

    const fetchCurrentValue = async () => {
        try {
            const response = await fetch('/api/get-aura');
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched current value:', data.currentValue); // Log the fetched value
                setCurrentValue(data.currentValue); // Update the state with the fetched value
                setLoading(false); // Set loading to false after fetching the value
            } else {
                console.error('Failed to fetch current value');
                setLoading(false); // Set loading to false even if there's an error
            }
        } catch (error) {
            console.error('Error fetching current value:', error);
            setLoading(false); // Set loading to false on error
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
                <h1 
                    data-aos="fade-up" 
                    data-aos-duration="1000" 
                    className='text-5xl font-bold tracking-wide mt-[10px]'
                >
                    {loading ? 'Loading...' : currentValue} <span className='text-4xl'>aura</span>
                </h1>
                <a 
                    data-aos="fade-up" 
                    data-aos-duration="1000" 
                    data-aos-delay="100" 
                    href='https://www.instagram.com/elvin_j_alapatt' 
                    target='_blank' 
                    className='text-[18px] opacity-90 tracking-wide mt-[7px]'
                >
                    @elvish_bai
                </a>
            </div>

            <div className="flex flex-col items-center justify-center">
                <Link 
                    href="/secret-key" 
                    className="bg-white text-black flex items-center justify-center w-full h-[42px] font-bold"
                >
                    Update Aura
                </Link>
            </div>
        </>
    );
}

