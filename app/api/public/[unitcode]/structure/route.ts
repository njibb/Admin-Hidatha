/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Struktur from '@/models/structure';

interface RouteParams {
  params: Promise<{
    unitcode: string;
  }>;
}

// GET: Publik (Tanpa Token) dengan pencarian unit case-insensitive
export async function GET(request: NextRequest, context: RouteParams) {
  await dbConnect();
  try {
    const resolvedParams = await context.params;
    const unit = resolvedParams.unitcode; 

    const strukturList = await Struktur.find({ 
      unitCode: { $regex: new RegExp(`^${unit}$`, "i") } 
    });
    
    return NextResponse.json({ status: 1, data: strukturList }, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}