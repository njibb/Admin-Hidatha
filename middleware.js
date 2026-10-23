import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.pathname;

  if (url.startsWith('/api/admin') && !url.includes('/auth/login')) {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { status: 0, message: 'Akses Ditolak: Token tidak ditemukan. Silakan login!' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Validasi fleksibel: asal token diawali dengan format 'mock_token_' buatan API login kita
    if (!token.startsWith('mock_token_')) {
      return NextResponse.json(
        { status: 0, message: 'Akses Ditolak: Token tidak valid atau kadaluarsa.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*'],
};