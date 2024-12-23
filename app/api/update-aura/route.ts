import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Document, PushOperator } from "mongodb";

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
    const { operation, value }: { operation: string; value: number } =
      await req.json();

    if (!operation || typeof value !== 'number') {
      return NextResponse.json(
        { success: false, message: "Invalid request parameters" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("auraDatabase");

    const auraDoc = await db.collection<AuraDocument>("auraValues").findOne({});
    if (!auraDoc) {
      return NextResponse.json(
        { success: false, message: "Aura document not found" },
        { status: 404 }
      );
    }

    let newValue = auraDoc.currentValue;

    if (operation === "add") {
      newValue += value;
    } else if (operation === "subtract") {
      newValue -= value;
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid operation" },
        { status: 400 }
      );
    }

    const updateQuery = {
      $set: { currentValue: newValue, lastUpdated: new Date() },
      $push: {
        history: {
          change: newValue - auraDoc.currentValue,
          operation,
          timestamp: new Date(),
        },
      } as unknown as PushOperator<AuraDocument>,
    };

    await db.collection("auraValues").updateOne({}, updateQuery);

    return NextResponse.json({ 
      success: true, 
      newValue,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Internal server error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
