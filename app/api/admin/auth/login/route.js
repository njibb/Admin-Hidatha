import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    // 1. Cari user berdasarkan email di database
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ status: 0, message: "Email atau password salah!" }, { status: 401 });
    }

    // 2. Cek password (untuk tahap skripsi/dev, perbandingan string langsung)
    if (user.password !== password) {
      return NextResponse.json({ status: 0, message: "Email atau password salah!" }, { status: 401 });
    }

    // 3. Generate Mock Token unik yang membawa identitas unit
    // Format token: mock_token_[unitCode]_[randomString]
    const token = `mock_token_${user.unitCode}_${Date.now()}`;

    return NextResponse.json({
      status: 1,
      message: "Success login",
      data: {
        token: token,
        name: user.name,
        email: user.email,
        role: user.role,
        unitCode: user.unitCode
      }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}