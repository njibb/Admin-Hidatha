/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ppdb from '@/models/ppdb';

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
    const ppdbList = await Ppdb.find({ unitCode: unitcode }).sort({ createdAt: -1 });
    return NextResponse.json({ status: 1, data: ppdbList }, { 
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
    const { jalurPendaftaran, statusBuka } = body;

    const newPpdb = await Ppdb.create({
      unitCode: unitcode,
      jalurPendaftaran,
      statusBuka: statusBuka !== undefined ? statusBuka : true,
    });

    // TRIGGER SYNC KE CHATBOT (CREATE)
    await triggerChatbotSync('CREATE_UPDATE', 'ppdb', {
      _id: newPpdb._id,
      title: `Informasi PPDB ${unitcode.toUpperCase()} - Jalur ${newPpdb.jalurPendaftaran}`,
      content: `Unit Sekolah: ${unitcode}, Jalur Pendaftaran: ${newPpdb.jalurPendaftaran}, Status Pendaftaran: ${newPpdb.statusBuka ? 'Dibuka' : 'Ditutup'}`
    });

    return NextResponse.json({ status: 1, message: "Data PPDB berhasil ditambahkan", data: newPpdb }, { 
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  } catch (error: any) {
    console.error("Error POST PPDB:", error);
    return NextResponse.json({ status: 0, message: error.message }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}