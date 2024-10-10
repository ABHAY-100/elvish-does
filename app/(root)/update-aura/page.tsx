// app/update/aura/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Ensure this path is correct
import NumberForm from '../../../components/NumberForm'; // Adjust path as necessary

const AuraUpdatePage = () => {
    const router = useRouter();
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true); // State to manage loading

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/'); // Redirect to secret key page if not authenticated
        } else {
            setLoading(false); // Set loading to false if authenticated
        }
    }, [isAuthenticated, router]);

    const handleLogout = () => {
        setIsAuthenticated(false); // Reset authentication state
        router.push('/'); // Redirect back to main page
    };

    // Show nothing or a loading indicator while checking authentication
    if (loading) {
        return null; // Alternatively, you can return a loading spinner or message here
    }

    return (
        <div className='flex flex-col max-w-[300px] mx-auto items-center justify-center h-screen gap-4'>
            <h1 className='text-2xl'>melcow!</h1>
            <NumberForm onLogout={handleLogout} />
        </div>
    );
};

export default AuraUpdatePage;