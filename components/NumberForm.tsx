'use client'; // This is needed for client components in the app directory

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function NumberForm({ onLogout }) {
    const [operation, setOperation] = useState<'add' | 'subtract'>('add');
    const [value, setValue] = useState<number>(0);
    const router = useRouter(); // Initialize useRouter

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await fetch('/api/update-aura', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ operation, value }),
        });

        // Check if the response is OK
        if (!response.ok) {
            const errorText = await response.text(); // Get the raw text of the response
            console.error('Error:', errorText); // Log the error for debugging
            alert('Failed to update aura value.'); // Show a user-friendly message
            return; // Exit early
        }

        // Parse the JSON response
        // const data = await response.json();
        // alert(`New Aura Value: ${data.newValue}`);

        // Reset authentication state after submission
        onLogout(); 

        // Redirect to the main page after logout
        router.push('/'); // Redirect to main page
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
            <select onChange={(e) => setOperation(e.target.value as 'add' | 'subtract')} className='border-b-2 text-center pb-[2px] border-white w-full bg-transparent text-white outline-none'>
                <option value="add" className='text-black'>Add</option>
                <option value="subtract" className='text-black'>Subtract</option>
            </select>
            <input 
                type="number" 
                className='border-b-2 text-center pb-[2px] border-white w-full bg-transparent text-white outline-none'
                onChange={(e) => setValue(Number(e.target.value))} 
                placeholder='Enter a number'
                required 
            />
            <button type="submit">Submit</button>
        </form>
    );
}