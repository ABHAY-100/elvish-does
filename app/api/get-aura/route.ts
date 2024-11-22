import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('auraDatabase');

        const auraDoc = await db.collection('auraValues').findOne({}, {
            maxTimeMS: 1000 // 1 second timeout
        });
        
        const responseData = {
            currentValue: auraDoc?.currentValue ?? 0,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            databaseName: db.databaseName
        };

        return new NextResponse(JSON.stringify(responseData), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Surrogate-Control': 'no-store'
            },
        });
    } catch (error) {
        console.error('Error fetching aura value:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: errorMessage,
            currentValue: null,
            timestamp: new Date().toISOString(),
        }, { 
            status: 500,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            }
        });
    }
}
