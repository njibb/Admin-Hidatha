import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';

// Rute darurat untuk mendaftarkan akun-akun admin secara otomatis ke database
export async function GET() {
  await dbConnect();

  try {
    const defaultUsers = [
      { name: "Super Admin Yayasan", email: "superadmin@yayasan.sch.id", password: "yayasan2026!", role: "superadmin", unitCode: "all" },
      { name: "Admin TK", email: "admin.tk@yayasan.sch.id", password: "admintk2026", role: "admin", unitCode: "tk" },
      { name: "Admin MI", email: "admin.mi@yayasan.sch.id", password: "adminmi2026", role: "admin", unitCode: "mi" },
      { name: "Admin MTs", email: "admin.mts@yayasan.sch.id", password: "adminmts2026", role: "admin", unitCode: "mts" },
      { name: "Admin SMK", email: "admin.smk@yayasan.sch.id", password: "adminsmk2026", role: "admin", unitCode: "smk" },
    ];

    // Masukkan data jika belum ada
    for (const u of defaultUsers) {
      const existing = await User.findOne({ email: u.email });
      if (!existing) {
        await User.create(u);
      }
    }

    return NextResponse.json({
      status: 1,
      message: "Berhasil! Semua akun admin default sudah dimasukkan ke MongoDB."
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ status: 0, message: error.message }, { status: 500 });
  }
}