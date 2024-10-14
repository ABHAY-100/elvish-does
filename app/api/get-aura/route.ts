import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('auraDatabase');

        const auraDoc = await db.collection('auraValues').findOne({});
        
        return NextResponse.json({ currentValue: auraDoc?.currentValue }, { status: 200 });
    } catch (error) {
        console.error('Error fetching aura value:', error);
        return NextResponse.json({ error: 'Failed to fetch aura value' }, { status: 500 });
    }
}
