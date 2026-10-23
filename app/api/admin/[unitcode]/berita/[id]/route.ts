/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Berita from '@/models/berita'; 

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

    // Ubah file gambar baru ke Base64 jika diunggah
    if (imageFile && typeof imageFile === 'object' && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = imageFile.type || 'image/png';
      imagePath = `data:${mimeType};base64,${buffer.toString('base64')}`;
    }

    existingBerita.title = title;
    existingBerita.content = content;
    existingBerita.image = imagePath;
    await existingBerita.save();

    return NextResponse.json({ status: 1, message: "Berita berhasil diperbarui", data: existingBerita }, { status: 200 });
  } catch (error: any) {
    console.error("Error PUT Berita:", error);
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
    
    if (!deletedBerita) return NextResponse.json({ status: 0, message: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ status: 1, message: "Berita berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}