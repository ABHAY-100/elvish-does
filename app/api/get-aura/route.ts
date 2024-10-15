import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('auraDatabase');

        const auraDoc = await db.collection('auraValues').findOne({});
        
        const responseData = {
            currentValue: auraDoc?.currentValue,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            databaseName: db.databaseName
        };

        console.log('API Response:', JSON.stringify(responseData));

        return NextResponse.json(responseData, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
            },
        });
    } catch (error) {
        console.error('Error fetching aura value:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            currentValue: null,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            databaseName: 'auraDatabase',
            error: 'Failed to fetch aura value',
            details: errorMessage
        }, { status: 500 });
    }
}
