/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agenda from '@/models/agenda';

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

// GET: Mengambil seluruh daftar agenda berdasarkan unit
export async function GET(request: NextRequest, context: RouteParams) {
  await dbConnect();
  try {
    const resolvedParams = await context.params;
    const unit = resolvedParams.unitcode; 

    const agendaList = await Agenda.find({ unitCode: unit }).sort({ startDate: 1 });
    
    return NextResponse.json({ status: 1, data: agendaList }, { 
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

// POST: Menambahkan agenda baru
export async function POST(request: NextRequest, context: RouteParams) {
  await dbConnect();
  try {
    const resolvedParams = await context.params;
    const unit = resolvedParams.unitcode;

    const body = await request.json();
    const { title, startDate, endDate, kategori, description } = body;

    const newAgenda = await Agenda.create({
      title,
      startDate,
      endDate: endDate || startDate, 
      kategori: kategori || 'lainnya',
      description,
      unitCode: unit,
    });

    return NextResponse.json(
      { status: 1, message: "Agenda berhasil ditambahkan", data: newAgenda }, 
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
    console.error("Error POST Agenda:", error);
    return NextResponse.json({ status: 0, message: error.message }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}