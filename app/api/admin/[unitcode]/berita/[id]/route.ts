/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Berita from '@/models/berita'; // Pastikan huruf 'b' kecil
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

interface RouteParams {
  params: {
    unitcode: string;
    id: string;
  };
}

// ==========================================
// GET: Mengambil detail berita lama untuk form Edit
// ==========================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  await dbConnect();
  try {
    // WAJIB di-await untuk Next.js terbaru
    const resolvedParams = await params;
    const { unitcode, id } = resolvedParams;

    const berita = await Berita.findOne({ _id: id, unitCode: unitcode });
    if (!berita) {
      return NextResponse.json({ status: 0, message: "Berita tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ status: 1, data: { berita } }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}

// ==========================================
// PUT: Menyimpan perubahan (Update Data)
// ==========================================
export async function PUT(request: NextRequest, { params }: RouteParams) {
  await dbConnect();
  try {
    // WAJIB di-await untuk Next.js terbaru
    const resolvedParams = await params;
    const { unitcode, id } = resolvedParams;

    // Tangkap data dari FormData frontend
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const imageFile = formData.get('image') as File | null;

    // Cari data lama di database
    const existingBerita = await Berita.findOne({ _id: id, unitCode: unitcode });
    if (!existingBerita) {
      return NextResponse.json({ status: 0, message: "Berita tidak ditemukan" }, { status: 404 });
    }

    // Default: gunakan link gambar yang sudah ada
    let imagePath = existingBerita.image; 

    // JIKA admin mengunggah gambar baru, proses gambarnya
    if (imageFile && typeof imageFile === 'object' && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${Date.now()}-${imageFile.name.replaceAll(' ', '_')}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      
      // Buat folder public/uploads kalau belum ada
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        // Abaikan jika folder sudah ada
      }

      await writeFile(path.join(uploadDir, filename), buffer);
      
      // Timpa imagePath lama dengan yang baru
      imagePath = `/uploads/${filename}`; 
    }

    // Update data di MongoDB
    existingBerita.title = title;
    existingBerita.content = content;
    existingBerita.image = imagePath;
    await existingBerita.save();

    return NextResponse.json({ 
      status: 1, 
      message: "Berita berhasil diperbarui", 
      data: existingBerita 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error PUT Berita:", error);
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}

// ==========================================
// DELETE: Menghapus data berita
// ==========================================
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  await dbConnect();
  try {
    const resolvedParams = await params;
    const { unitcode, id } = resolvedParams;

    // Cari dan hapus berita berdasarkan ID dan unitCode
    const deletedBerita = await Berita.findOneAndDelete({ _id: id, unitCode: unitcode });
    
    if (!deletedBerita) {
      return NextResponse.json({ status: 0, message: "Berita tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ status: 1, message: "Berita berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}