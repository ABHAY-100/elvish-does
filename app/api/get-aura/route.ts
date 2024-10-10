import clientPromise from '../../../lib/mongodb';

export async function GET() {
    const client = await clientPromise;
    const db = client.db('auraDatabase'); 

    const auraDoc = await db.collection('auraValues').findOne({});
    
    return new Response(JSON.stringify({ currentValue: auraDoc?.currentValue }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
