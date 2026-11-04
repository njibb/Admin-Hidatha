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

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ unitcode: string }> }
) {
  await dbConnect();
  try {
    const { unitcode } = await params;
    const agendaList = await Agenda.find({ unitCode: unitcode }).sort({ startDate: 1 });
    return NextResponse.json({ status: 1, data: agendaList }, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ unitcode: string }> }
) {
  await dbConnect();
  try {
    const { unitcode } = await params;
    const body = await request.json();
    const { title, startDate, endDate, kategori, description } = body;

    const newAgenda = await Agenda.create({
      title, startDate, endDate: endDate || startDate, kategori: kategori || 'lainnya', description, unitCode: unitcode,
    });

    // TRIGGER SYNC KE CHATBOT (CREATE)
    await triggerChatbotSync('CREATE_UPDATE', 'agendas', {
      _id: newAgenda._id,
      title: `Agenda ${unitcode.toUpperCase()}: ${newAgenda.title}`,
      content: `Unit: ${unitcode}, Agenda: ${newAgenda.title}, Kategori: ${newAgenda.kategori}, Tanggal Mulai: ${newAgenda.startDate}, Tanggal Selesai: ${newAgenda.endDate}, Deskripsi: ${newAgenda.description || '-'}`
    });

    return NextResponse.json({ status: 1, message: "Agenda berhasil ditambahkan", data: newAgenda }, { 
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  } catch (error: any) {
    console.error("Error POST Agenda:", error);
    return NextResponse.json({ status: 0, message: error.message }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}