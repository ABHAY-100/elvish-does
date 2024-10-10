import NumberForm from '@/components/NumberForm';
import clientPromise from '../lib/mongodb';

export default async function Home() {
    const client = await clientPromise;
    const db = client.db('auraDatabase'); // Use your database name
    const auraDoc = await db.collection('auraValues').findOne({});

    return (
        <div>
            <h1>Current Aura Value: {auraDoc?.currentValue}</h1>
            <NumberForm />
        </div>
    );
}