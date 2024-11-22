import { NextResponse, Request } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
    const url = new URL(req.url);
    const isSSE = url.searchParams.get('sse') === 'true';

    if (isSSE) {
        const stream = new TransformStream();
        const writer = stream.writable.getWriter();
        const encoder = new TextEncoder();

        // Send initial headers for SSE
        const response = new Response(stream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

        // Watch for changes
        const client = await clientPromise;
        const db = client.db('auraDatabase');
        const collection = db.collection('auraValues');
        
        const changeStream = collection.watch([], { fullDocument: 'updateLookup' });
        
        // Send initial value
        const initialDoc = await collection.findOne({});
        const initialData = {
            currentValue: initialDoc?.currentValue ?? 0,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            databaseName: db.databaseName
        };
        writer.write(encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`));

        // Listen for changes
        changeStream.on('change', async (change) => {
            const data = {
                currentValue: change.fullDocument?.currentValue ?? 0,
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV,
                databaseName: db.databaseName
            };
            writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        });

        return response;
    }

    // Regular REST API endpoint for non-SSE requests
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
        return new NextResponse(JSON.stringify({
            error: errorMessage,
            currentValue: null,
            timestamp: new Date().toISOString(),
        }), { 
            status: 500,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            }
        });
    }
}
