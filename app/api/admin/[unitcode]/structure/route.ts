/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Struktur from '@/models/structure';

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ unitcode: string }> }
) {
  await dbConnect();
  try {
    const { unitcode } = await params;
    const strukturList = await Struktur.find({ unitCode: unitcode }).sort({ createdAt: 1 });
    return NextResponse.json({ status: 1, data: strukturList }, { 
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ unitcode: string }> }
) {
  await dbConnect();
  try {
    const { unitcode } = await params;
    const body = await request.json();
    const { nama, jabatan, kategori } = body;

    const newStruktur = await Struktur.create({
      nama, jabatan, kategori, unitCode: unitcode,
    });

    return NextResponse.json({ status: 1, message: "Pengurus berhasil ditambahkan", data: newStruktur }, { 
        status: 201,
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    );
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}