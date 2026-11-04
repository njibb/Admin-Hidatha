/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agenda from '@/models/agenda';

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
  { params }: { params: Promise<{ unitcode: string; id: string }> }
) {
  await dbConnect();
  try {
    const { unitcode, id } = await params;
    const agenda = await Agenda.findOne({ _id: id, unitCode: unitcode });
    if (!agenda) return NextResponse.json({ status: 0, message: "Agenda tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ status: 1, data: { agenda } }, { status: 200 });
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
    const body = await request.json();
    const { title, startDate, endDate, kategori, description } = body;

    const updatedAgenda = await Agenda.findOneAndUpdate(
      { _id: id, unitCode: unitcode },
      { title, startDate, endDate, kategori, description },
      { new: true, runValidators: true }
    );

    if (!updatedAgenda) return NextResponse.json({ status: 0, message: "Agenda tidak ditemukan" }, { status: 404 });

    // TRIGGER SYNC KE CHATBOT (UPDATE)
    await triggerChatbotSync('CREATE_UPDATE', 'agendas', {
      _id: updatedAgenda._id,
      title: `Agenda ${unitcode.toUpperCase()}: ${updatedAgenda.title}`,
      content: `Unit: ${unitcode}, Agenda: ${updatedAgenda.title}, Kategori: ${updatedAgenda.kategori}, Tanggal Mulai: ${updatedAgenda.startDate}, Tanggal Selesai: ${updatedAgenda.endDate}, Deskripsi: ${updatedAgenda.description || '-'}`
    });

    return NextResponse.json({ status: 1, message: "Agenda berhasil diperbarui", data: updatedAgenda }, { status: 200 });
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
    const deletedAgenda = await Agenda.findOneAndDelete({ _id: id, unitCode: unitcode });
    if (!deletedAgenda) return NextResponse.json({ status: 0, message: "Agenda tidak ditemukan" }, { status: 404 });

    // TRIGGER SYNC KE CHATBOT (DELETE)
    await triggerChatbotSync('DELETE', 'agendas', {
      _id: deletedAgenda._id
    });

    return NextResponse.json({ status: 1, message: "Agenda berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}