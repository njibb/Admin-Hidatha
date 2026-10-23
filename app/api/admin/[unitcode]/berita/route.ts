/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Berita from '@/models/berita';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

interface RouteParams {
  params: Promise<{
    unitcode: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteParams) {
  await dbConnect();
  try {
    const resolvedParams = await context.params;
    const unit = resolvedParams.unitcode; 

    const beritaList = await Berita.find({ unitCode: unit }).sort({ createdAt: -1 });
    return NextResponse.json({ status: 1, data: beritaList }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: RouteParams) {
  await dbConnect();
  
  try {
    const resolvedParams = await context.params;
    const unit = resolvedParams.unitcode;

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const imageFile = formData.get('image') as File | null;

    let imagePath = null;

    if (imageFile && typeof imageFile === 'object' && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${Date.now()}-${imageFile.name.replaceAll(' ', '_')}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        // Abaikan jika folder sudah ada
      }

      await writeFile(path.join(uploadDir, filename), buffer);
      imagePath = `/uploads/${filename}`;
    }

    const newBerita = await Berita.create({
      title,
      content,
      image: imagePath,
      unitCode: unit,
      asalData: 'MANUAL'
    });

    return NextResponse.json(
      { status: 1, message: "Berita berhasil ditambahkan", data: newBerita }, 
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error POST Berita:", error);
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}