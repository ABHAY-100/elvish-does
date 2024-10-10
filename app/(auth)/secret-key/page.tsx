"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Ensure this path is correct

const SecretKeyEntry = () => {
    const [key, setKey] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { setIsAuthenticated } = useAuth();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const correctKey = process.env.NEXT_PUBLIC_SECRET_KEY;

        if (key === correctKey) {
            setIsAuthenticated(true); // Set authentication state
            router.push('/update-aura');
        } else {
            setError('Incorrect key. Try again.');
        }
    };

    return (
        <div className='flex flex-col max-w-[300px] mx-auto items-center justify-center h-screen gap-4'>
            <h1 data-aos="fade-up" data-aos-duration="1000" className='text-2xl'>u can find the key beyond the doors!</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
                <input 
                    data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100"
                    type="text" 
                    value={key} 
                    onChange={(e) => setKey(e.target.value)} 
                    placeholder="try guessing the key!" 
                    className='border-b-2 text-center pb-[2px] border-white w-full bg-transparent text-white outline-none'
                    required
                />
                <button data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200" type="submit">Submit</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default SecretKeyEntry;