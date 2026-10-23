/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agenda from '@/models/agenda';

interface RouteParams {
  params: {
    unitcode: string;
    id: string;
  };
}

// GET: Ambil detail 1 agenda untuk form edit
export async function GET(request: NextRequest, { params }: RouteParams) {
  await dbConnect();
  try {
    const resolvedParams = await params;
    const { unitcode, id } = resolvedParams;

    const agenda = await Agenda.findOne({ _id: id, unitCode: unitcode });
    if (!agenda) {
      return NextResponse.json({ status: 0, message: "Agenda tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ status: 1, data: { agenda } }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}

// PUT: Update agenda
export async function PUT(request: NextRequest, { params }: RouteParams) {
  await dbConnect();
  try {
    const resolvedParams = await params;
    const { unitcode, id } = resolvedParams;

    const body = await request.json();
    const { title, startDate, endDate, kategori, description } = body;

    const updatedAgenda = await Agenda.findOneAndUpdate(
      { _id: id, unitCode: unitcode },
      { title, startDate, endDate, kategori, description },
      { new: true, runValidators: true }
    );

    if (!updatedAgenda) {
      return NextResponse.json({ status: 0, message: "Agenda tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ status: 1, message: "Agenda berhasil diperbarui", data: updatedAgenda }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}

// DELETE: Hapus agenda
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  await dbConnect();
  try {
    const resolvedParams = await params;
    const { unitcode, id } = resolvedParams;

    const deletedAgenda = await Agenda.findOneAndDelete({ _id: id, unitCode: unitcode });
    if (!deletedAgenda) {
      return NextResponse.json({ status: 0, message: "Agenda tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ status: 1, message: "Agenda berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}