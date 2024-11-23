import clientPromise from '@/lib/mongodb';
import { ChangeStream, Db, MongoClient, Collection } from 'mongodb';

interface AuraDocument {
    currentValue: number;
    timestamp?: string;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Connection pooling with proper types
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const client = await clientPromise;
    const db = client.db('auraDatabase');
    
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const isSSE = url.searchParams.get('sse') === 'true';

    try {
        const { db } = await connectToDatabase();
        const collection: Collection<AuraDocument> = db.collection('auraValues');

        if (isSSE) {
            const stream = new TransformStream();
            const writer = stream.writable.getWriter();
            const encoder = new TextEncoder();

            const response = new Response(stream.readable, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                },
            });

            // Set up change stream with timeout
            const changeStream: ChangeStream = collection.watch([], { 
                fullDocument: 'updateLookup',
                maxAwaitTimeMS: 30000 // 30 seconds timeout
            });

            // Fetch initial data with timeout
            const initialDoc = await collection.findOne({}, { 
                maxTimeMS: 5000 // 5 seconds timeout
            });

            if (!initialDoc) {
                throw new Error('No aura document found');
            }

            const initialData = {
                currentValue: initialDoc.currentValue,
                timestamp: new Date().toISOString()
            };

            await writer.write(encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`));

            changeStream.on('change', async (change) => {
                if ('fullDocument' in change && change.fullDocument) {
                    const data = {
                        currentValue: (change.fullDocument as AuraDocument).currentValue,
                        timestamp: new Date().toISOString()
                    };
                    await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
                }
            });

            // Handle change stream errors
            changeStream.on('error', async () => {
                await writer.write(encoder.encode(`data: ${JSON.stringify({ error: 'Connection error' })}\n\n`));
                changeStream.close();
            });

            return response;
        }

        // Regular REST API endpoint
        const auraDoc = await collection.findOne({}, { 
            maxTimeMS: 5000 // 5 seconds timeout
        });

        if (!auraDoc) {
            throw new Error('No aura document found');
        }

        const responseData = {
            currentValue: auraDoc.currentValue,
            timestamp: new Date().toISOString()
        };

        return new Response(JSON.stringify(responseData), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        const errorResponse = {
            error: errorMessage,
            currentValue: null,
            timestamp: new Date().toISOString()
        };

        return new Response(JSON.stringify(errorResponse), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate'
            }
        });
    }
}
