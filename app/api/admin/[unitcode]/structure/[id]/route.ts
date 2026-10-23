/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Struktur from '@/models/structure';

interface RouteParams {
  params: Promise<{
    unitcode: string;
    id: string;
  }>;
}

// GET: Mengambil satu data spesifik untuk dimunculkan di form Edit
export async function GET(request: NextRequest, context: RouteParams) {
  await dbConnect();
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;

    const data = await Struktur.findById(id);
    if (!data) return NextResponse.json({ status: 0, message: "Data tidak ditemukan" }, { status: 404 });
    
    return NextResponse.json({ status: 1, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}

// PUT: Mengupdate data struktur
export async function PUT(request: NextRequest, context: RouteParams) {
  await dbConnect();
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;
    const body = await request.json();
    
    const updatedData = await Struktur.findByIdAndUpdate(id, body, { new: true });
    if (!updatedData) return NextResponse.json({ status: 0, message: "Gagal mengupdate data" }, { status: 404 });
    
    return NextResponse.json({ status: 1, message: "Berhasil diupdate", data: updatedData }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}

// DELETE: Menghapus data struktur
export async function DELETE(request: NextRequest, context: RouteParams) {
  await dbConnect();
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;

    const deletedData = await Struktur.findByIdAndDelete(id);
    if (!deletedData) return NextResponse.json({ status: 0, message: "Gagal menghapus data" }, { status: 404 });
    
    return NextResponse.json({ status: 1, message: "Berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}