'use client'; // This is needed for client components in the app directory

import { useState } from 'react';

export default function NumberForm() {
    const [operation, setOperation] = useState<'add' | 'subtract'>('add');
    const [value, setValue] = useState<number>(0);

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
        const data = await response.json();
        alert(`New Aura Value: ${data.newValue}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <select onChange={(e) => setOperation(e.target.value as 'add' | 'subtract')}>
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
            </select>
            <input 
                type="number" 
                onChange={(e) => setValue(Number(e.target.value))} 
                required 
            />
            <button type="submit">Submit</button>
        </form>
    );
}