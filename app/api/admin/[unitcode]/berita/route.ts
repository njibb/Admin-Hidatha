/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Berita from '@/models/berita';

// Helper fungsi untuk menembak webhook/sync ke chatbot utama
async function triggerChatbotSync(action: 'CREATE_UPDATE' | 'DELETE', collectionName: string, data: any) {
  try {
    const chatbotUrl = process.env.NEXT_PUBLIC_CHATBOT_URL || 'https://www.hidayatuttholibin.blog/';
   const secretKey = process.env.ADMIN_SYNC_SECRET;

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

    // TRIGGER SYNC KE CHATBOT (CREATE)
    await triggerChatbotSync('CREATE_UPDATE', 'berita', {
      _id: newBerita._id,
      title: newBerita.title,
      content: `Unit: ${unitcode}. Berita: ${newBerita.title}. Isi: ${newBerita.content}`
    });

    return NextResponse.json({ status: 1, message: "Berita berhasil ditambahkan", data: newBerita }, { status: 201 });
  } catch (error: any) {
    console.error("Error POST Berita:", error);
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}