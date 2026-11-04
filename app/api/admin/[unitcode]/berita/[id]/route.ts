/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Berita from '@/models/berita'; 

// Helper fungsi untuk menembak webhook/sync ke chatbot utama
async function triggerChatbotSync(action: 'CREATE_UPDATE' | 'DELETE', collectionName: string, data: any) {
  try {
    const chatbotUrl = process.env.NEXT_PUBLIC_CHATBOT_URL || 'https://www.hidayatuttholibin.blog/';
    const secretKey = process.env.NEXT_PUBLIC_ADMIN_SYNC_SECRET;

    await fetch(`${chatbotUrl}/api/sync-single`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`
      },
      body: JSON.stringify({ action, collectionName, data })
    });
  } catch (error) {
    console.error('Gagal sync ke chatbot:', error);
  }
}

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
      const mimeType = imageFile.type || 'image/png';
      imagePath = `data:${mimeType};base64,${buffer.toString('base64')}`;
    }

    existingBerita.title = title;
    existingBerita.content = content;
    existingBerita.image = imagePath;
    await existingBerita.save();

    // TRIGGER SYNC KE CHATBOT (UPDATE)
    await triggerChatbotSync('CREATE_UPDATE', 'berita', {
      _id: existingBerita._id,
      title: existingBerita.title,
      content: `Unit: ${unitcode}. Berita: ${existingBerita.title}. Isi: ${existingBerita.content}`
    });

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

    // TRIGGER SYNC KE CHATBOT (DELETE)
    await triggerChatbotSync('DELETE', 'berita', {
      _id: deletedBerita._id
    });

    return NextResponse.json({ status: 1, message: "Berita berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}