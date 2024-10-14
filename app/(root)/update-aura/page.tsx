// app/update/aura/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import NumberForm from '@/components/NumberForm';

const AuraUpdatePage = () => {
    const router = useRouter();
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, router]);

    const handleLogout = () => {
        setIsAuthenticated(false);
        router.push('/');
    };

    if (loading) {
        return null;
    }

    return (
        <div className='flex flex-col max-w-[300px] mx-auto items-center justify-center h-screen gap-8'>
            <h1 data-aos="fade-up" data-aos-duration="1000" className='text-2xl text-center'>Hola, amigo mío!</h1>
            <NumberForm onLogout={handleLogout} />
        </div>
    );
};

export default AuraUpdatePage;
