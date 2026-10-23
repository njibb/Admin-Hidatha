/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Berita from '@/models/berita';

interface RouteParams {
  params: Promise<{ unitcode: string; id: string }>;
}

export async function GET(request: NextRequest, context: RouteParams) {
  await dbConnect();
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;

    const berita = await Berita.findById(id);
    if (!berita) {
      return NextResponse.json({ status: 0, message: "Berita tidak ditemukan" }, { status: 404 });
    }

    const obj = berita.toObject();
    const formattedBerita = {
      ...obj,
      image: obj.image ? (obj.image.startsWith('http') ? obj.image : `http://localhost:3000${obj.image}`) : null
    };

    return NextResponse.json({ status: 1, data: formattedBerita }, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}