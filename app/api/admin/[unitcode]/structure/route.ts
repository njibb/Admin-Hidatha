/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Struktur from '@/models/structure';

interface RouteParams {
  params: Promise<{
    unitcode: string;
  }>;
}

// Handler untuk Preflight CORS Request
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

// GET: Mengambil data struktur untuk tabel CMS Admin
export async function GET(request: NextRequest, context: RouteParams) {
  await dbConnect();
  try {
    const resolvedParams = await context.params;
    const unit = resolvedParams.unitcode; 

    const strukturList = await Struktur.find({ unitCode: unit }).sort({ createdAt: 1 });
    
    return NextResponse.json({ status: 1, data: strukturList }, { 
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}

// POST: Menambahkan pengurus baru dari CMS Admin
export async function POST(request: NextRequest, context: RouteParams) {
  await dbConnect();
  try {
    const resolvedParams = await context.params;
    const unit = resolvedParams.unitcode;

    const body = await request.json();
    const { nama, jabatan, kategori } = body;

    const newStruktur = await Struktur.create({
      nama,
      jabatan,
      kategori,
      unitCode: unit,
    });

    return NextResponse.json(
      { status: 1, message: "Pengurus berhasil ditambahkan", data: newStruktur }, 
      { 
        status: 201,
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    );
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}