/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Berita from '@/models/berita';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ unitcode: string }> }
) {
  await dbConnect();
  try {
    const { unitcode } = await params; 
    const beritaList = await Berita.find({ unitCode: unitcode }).sort({ createdAt: -1 });
    return NextResponse.json({ status: 1, data: beritaList }, { status: 200 });
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

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const imageFile = formData.get('image') as File | null;

    let imagePath = null;

    // Ubah file gambar ke Base64 agar aman di Vercel (Read-Only File System)
    if (imageFile && typeof imageFile === 'object' && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = imageFile.type || 'image/png';
      imagePath = `data:${mimeType};base64,${buffer.toString('base64')}`;
    }

    const newBerita = await Berita.create({
      title, 
      content, 
      image: imagePath, 
      unitCode: unitcode, 
      asalData: 'MANUAL'
    });

    return NextResponse.json({ status: 1, message: "Berita berhasil ditambahkan", data: newBerita }, { status: 201 });
  } catch (error: any) {
    console.error("Error POST Berita:", error);
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}