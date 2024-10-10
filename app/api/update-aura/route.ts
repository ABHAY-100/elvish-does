import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Document, PushOperator } from 'mongodb';

// Define the schema for the aura document
interface AuraDocument extends Document {
    _id: string;
    currentValue: number;
    lastUpdated: Date;
    history: Array<{
        change: number;
        operation: string;
        timestamp: Date;
    }>;
}

export async function POST(req: Request) {
    try {
        const { operation, value }: { operation: string; value: number } = await req.json();

        const client = await clientPromise;
        const db = client.db('auraDatabase');

        // Ensure TypeScript knows the expected schema for the document
        const auraDoc = await db.collection<AuraDocument>('auraValues').findOne({});
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

        // Prepare the update operation
        const updateQuery = {
            $set: { currentValue: newValue, lastUpdated: new Date() },
            $push: {
                history: {
                    change: newValue - auraDoc.currentValue,
                    operation,
                    timestamp: new Date(),
                }
            } as unknown as PushOperator<AuraDocument> // Explicitly cast to unknown first, then to PushOperator
        };

        // Log the data before updating
        console.log("Updating aura document:", {
            currentValue: newValue,
            operation,
            value,
            timestamp: new Date(),
        });

        // Perform the update operation
        await db.collection('auraValues').updateOne({}, updateQuery);

        return NextResponse.json({ success: true, newValue });
    } catch (error) {
        console.error('Error updating aura:', error);
        return NextResponse.json({ success: false, message: 'Error updating aura' }, { status: 500 });
    }
}
