/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Berita from '@/models/berita'; 
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ unitcode: string; id: string }> }
) {
  await dbConnect();
  try {
    const { unitcode, id } = await params;
    const berita = await Berita.findOne({ _id: id, unitCode: unitcode });
    
    if (!berita) return NextResponse.json({ status: 0, message: "Berita tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ status: 1, data: { berita } }, { status: 200 });
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
    const { unitcode, id } = await params;
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const imageFile = formData.get('image') as File | null;

    const existingBerita = await Berita.findOne({ _id: id, unitCode: unitcode });
    if (!existingBerita) return NextResponse.json({ status: 0, message: "Berita tidak ditemukan" }, { status: 404 });

    let imagePath = existingBerita.image; 

    if (imageFile && typeof imageFile === 'object' && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${imageFile.name.replaceAll(' ', '_')}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      
      try { await mkdir(uploadDir, { recursive: true }); } catch (err) {}
      await writeFile(path.join(uploadDir, filename), buffer);
      imagePath = `/uploads/${filename}`; 
    }

    existingBerita.title = title;
    existingBerita.content = content;
    existingBerita.image = imagePath;
    await existingBerita.save();

    return NextResponse.json({ status: 1, message: "Berita berhasil diperbarui", data: existingBerita }, { status: 200 });
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
    const { unitcode, id } = await params;
    const deletedBerita = await Berita.findOneAndDelete({ _id: id, unitCode: unitcode });
    
    if (!deletedBerita) return NextResponse.json({ status: 0, message: "Berita tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ status: 1, message: "Berita berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}