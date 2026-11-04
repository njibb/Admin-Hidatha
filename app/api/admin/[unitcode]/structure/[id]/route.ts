/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Struktur from '@/models/structure';

// Helper fungsi untuk menembak webhook/sync ke chatbot utama
async function triggerChatbotSync(action: 'CREATE_UPDATE' | 'DELETE', collectionName: string, data: any) {
  try {
    const chatbotUrl = process.env.NEXT_PUBLIC_CHATBOT_URL || 'https://hidayatuttholibin.blog';
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
    
    // TRIGGER SYNC KE CHATBOT (UPDATE)
    await triggerChatbotSync('CREATE_UPDATE', 'structure', {
      _id: updatedData._id,
      title: `${updatedData.jabatan} - ${updatedData.nama}`,
      content: `Unit: ${updatedData.unitCode}, Nama: ${updatedData.nama}, Jabatan: ${updatedData.jabatan}, Kategori: ${updatedData.kategori}`
    });

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
    
    // TRIGGER SYNC KE CHATBOT (DELETE)
    await triggerChatbotSync('DELETE', 'structure', {
      _id: deletedData._id
    });

    return NextResponse.json({ status: 1, message: "Berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}