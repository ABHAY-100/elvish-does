import clientPromise from '@/lib/mongodb';
import { ChangeStream, Document } from 'mongodb';

interface AuraDocument {
    currentValue: number;
    timestamp?: string;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
    const url = new URL(req.url);
    const isSSE = url.searchParams.get('sse') === 'true';

    try {
        const client = await clientPromise;
        const db = client.db('auraDatabase');
        const collection = db.collection<AuraDocument>('auraValues');

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

            const changeStream: ChangeStream<Document> = collection.watch([], { 
                fullDocument: 'updateLookup'
            });
            
            const initialDoc = await collection.findOne({});
            const initialData = {
                currentValue: initialDoc?.currentValue ?? 0,
                timestamp: new Date().toISOString()
            };
            await writer.write(encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`));

            changeStream.on('change', async (change: Document) => {
                if ('fullDocument' in change && change.fullDocument) {
                    const data = {
                        currentValue: (change.fullDocument as AuraDocument).currentValue ?? 0,
                        timestamp: new Date().toISOString()
                    };
                    await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
                }
            });

            return response;
        }

        const auraDoc = await collection.findOne({});
        const responseData = {
            currentValue: auraDoc?.currentValue ?? 0,
            timestamp: new Date().toISOString()
        };

        return new Response(JSON.stringify(responseData), { 
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
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Internal server error',
            currentValue: null,
            timestamp: new Date().toISOString()
        }), { 
            status: 500,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate'
            }
        });
    }
}
