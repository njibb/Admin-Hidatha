/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agenda from '@/models/agenda';

interface RouteParams {
  params: Promise<{
    unitcode: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteParams) {
  await dbConnect();
  try {
    const resolvedParams = await context.params;
    const unit = resolvedParams.unitcode; // Bisa "TK" atau "tk"

    // Cari dengan regex case-insensitive (mengabaikan huruf besar/kecil)
    // Sekaligus mencakup pencocokan parsial jika diperlukan
    const agendaList = await Agenda.find({ 
      unitCode: { $regex: new RegExp(`^${unit}$`, "i") } 
    }).sort({ startDate: 1 });
    
    return NextResponse.json({ status: 1, data: agendaList }, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}