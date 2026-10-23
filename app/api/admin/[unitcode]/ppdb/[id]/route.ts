/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ppdb from '@/models/ppdb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ unitcode: string; id: string }> }
) {
  await dbConnect();
  try {
    const { unitcode, id } = await params;
    const ppdbData = await Ppdb.findOne({ _id: id, unitCode: unitcode });
    if (!ppdbData) return NextResponse.json({ status: 0, message: "Data PPDB tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ status: 1, data: { ppdb: ppdbData } }, { status: 200 });
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
    const { jalurPendaftaran, statusBuka } = body;

    const updatedPpdb = await Ppdb.findOneAndUpdate(
      { _id: id, unitCode: unitcode },
      { jalurPendaftaran, statusBuka },
      { new: true, runValidators: true }
    );

    if (!updatedPpdb) return NextResponse.json({ status: 0, message: "Data PPDB tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ status: 1, message: "Data PPDB berhasil diperbarui", data: updatedPpdb }, { status: 200 });
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
    const deletedPpdb = await Ppdb.findOneAndDelete({ _id: id, unitCode: unitcode });
    if (!deletedPpdb) return NextResponse.json({ status: 0, message: "Data PPDB tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ status: 1, message: "Data PPDB berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}