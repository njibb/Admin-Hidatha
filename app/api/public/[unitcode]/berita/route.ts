/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Berita from '@/models/berita';

interface RouteParams {
  params: Promise<{ unitcode: string }>;
}

export async function GET(request: NextRequest, context: RouteParams) {
  await dbConnect();
  try {
    const resolvedParams = await context.params;
    const unit = resolvedParams.unitcode;

    const beritaList = await Berita.find({
      unitCode: { $regex: new RegExp(`^${unit}$`, "i") }
    }).sort({ createdAt: -1 });

    // Format URL Gambar agar mengarah ke Port 3000 Admin
    // Format URL Gambar agar mengenali Base64 dan mengarah ke domain Vercel
    const formattedList = beritaList.map((item) => {
      const obj = item.toObject();
      return {
        ...obj,
        image: obj.image ? (obj.image.startsWith('http') || obj.image.startsWith('data:') ? obj.image : `https://admin-hidatha.vercel.app${obj.image}`) : null
      };
    });

    return NextResponse.json({ status: 1, data: formattedList }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      }
    });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}