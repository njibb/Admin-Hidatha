/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Struktur from '@/models/structure';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ unitcode: string; id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const data = await Struktur.findById(id);
    if (!data) return NextResponse.json({ status: 0, message: "Data tidak ditemukan" }, { status: 404 });
    
    return NextResponse.json({ status: 1, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ unitcode: string; id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updatedData = await Struktur.findByIdAndUpdate(id, body, { new: true });
    if (!updatedData) return NextResponse.json({ status: 0, message: "Gagal mengupdate data" }, { status: 404 });
    
    return NextResponse.json({ status: 1, message: "Berhasil diupdate", data: updatedData }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ unitcode: string; id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const deletedData = await Struktur.findByIdAndDelete(id);
    if (!deletedData) return NextResponse.json({ status: 0, message: "Gagal menghapus data" }, { status: 404 });
    
    return NextResponse.json({ status: 1, message: "Berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}