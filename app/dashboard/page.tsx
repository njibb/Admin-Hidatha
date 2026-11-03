/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/sidebar';
import LiquidText from "../components/ui/liquid-text";

export default function MasterDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Menandai bahwa komponen sudah di-render di sisi klien
    // Ini mencegah error hidrasi dan mereset kanvas WebGL
    setIsMounted(true);

    const token = localStorage.getItem('bearer_token');
    const role = localStorage.getItem('user_role'); // 'superadmin' atau 'admin'
    const unit = localStorage.getItem('unit_code'); // 'all', 'tk', 'mi', 'mts', 'smk'

    // Tendang jika belum login
    if (!token) {
      router.push('/');
      return; // Hentikan eksekusi kode di bawahnya
    }

    // --- LOGIKA PENYESUAIAN 5 AKUN ---
    if (role === 'superadmin' || unit === 'all') {
      setGreeting('Selamat Datang Super Admin Yayasan!');
    } else if (unit) {
      // Format teks unit, khusus MTs huruf kapitalnya menyesuaikan (MTs)
      const unitFormatted = unit === 'mts' ? 'MTs' : unit.toUpperCase();
      setGreeting(`Selamat Datang Admin ${unitFormatted}!`);
    } else {
      setGreeting('Selamat Datang Admin!');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-[#faf6f3] font-sans overflow-hidden">
      
      {/* Sidebar Navigasi */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 relative ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        
        {/* Background Blur */}
        <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-amber-200/30 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 pointer-events-none z-0"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[45rem] h-[45rem] bg-orange-200/30 rounded-full mix-blend-multiply filter blur-[150px] opacity-70 pointer-events-none z-0"></div>

        {/* Kontainer Liquid Text */}
        <div className="relative z-10 w-full h-screen flex items-center justify-center px-10">
          
          {/* Trik Jitu: Render LiquidText HANYA JIKA komponen sudah siap di-mount (isMounted)
              serta berikan 'key' agar WebGL canvas ter-reset saat kembali dari halaman lain */}
          {isMounted && greeting && (
            <LiquidText
              key={greeting} 
              text={greeting}
              tone="light"
              fontSize={80} // Diatur 80 agar kalimat panjang (contoh: Super Admin Yayasan) muat dan tidak nabrak
              color="#92400e"
              viscosity={0.55}
              className="w-full max-w-5xl"
            />
          )}
          
        </div>
      </main>
    </div>
  );
}