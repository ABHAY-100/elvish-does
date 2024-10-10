import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        const { operation, value }: { operation: string; value: number } = await req.json();

        const client = await clientPromise;
        const db = client.db('auraDatabase');

        const auraDoc = await db.collection('auraValues').findOne({});
        if (!auraDoc) {
            return NextResponse.json({ success: false, message: 'Aura document not found' }, { status: 404 });
        }

        let newValue = auraDoc.currentValue;

        if (operation === 'add') {
            newValue += value;
        } else if (operation === 'subtract') {
            newValue -= value;
        } else {
            return NextResponse.json({ success: false, message: 'Invalid operation' }, { status: 400 });
        }

        await db.collection('auraValues').updateOne(
            {},
            {
                $set: { currentValue: newValue, lastUpdated: new Date() },
                $push: { history: { change: operation === 'add' ? value : -value, operation, timestamp: new Date() } }
            }
        );

        return NextResponse.json({ success: true, newValue });
    } catch (error) {
        console.error('Error updating aura:', error);
        return NextResponse.json({ success: false, message: 'Error updating aura' }, { status: 500 });
    }
}