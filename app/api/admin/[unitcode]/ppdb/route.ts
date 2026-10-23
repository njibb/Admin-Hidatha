/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ppdb from '@/models/ppdb';

interface RouteParams {
  params: Promise<{
    unitcode: string;
  }>;
}

// Handler untuk Preflight CORS Request (OPTIONS)
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET: Mengambil seluruh daftar PPDB berdasarkan unit
export async function GET(request: NextRequest, context: RouteParams) {
  await dbConnect();
  try {
    const resolvedParams = await context.params;
    const unit = resolvedParams.unitcode; 

    const ppdbList = await Ppdb.find({ unitCode: unit }).sort({ createdAt: -1 });
    
    return NextResponse.json({ status: 1, data: ppdbList }, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}

// POST: Menambahkan data PPDB baru
export async function POST(request: NextRequest, context: RouteParams) {
  await dbConnect();
  try {
    const resolvedParams = await context.params;
    const unit = resolvedParams.unitcode;

    const body = await request.json();
    const { jalurPendaftaran, statusBuka } = body;

    const newPpdb = await Ppdb.create({
      unitCode: unit,
      jalurPendaftaran,
      statusBuka: statusBuka !== undefined ? statusBuka : true,
    });

    return NextResponse.json(
      { status: 1, message: "Data PPDB berhasil ditambahkan", data: newPpdb }, 
      { 
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  } catch (error: any) {
    console.error("Error POST PPDB:", error);
    return NextResponse.json({ status: 0, message: error.message }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}