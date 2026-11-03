/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/sidebar';
import LiquidText from "../components/ui/liquid-text";

export default function MasterDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('Admin');
  const router = useRouter();

  useEffect(() => {
    
    const token = localStorage.getItem('bearer_token');
    const name = localStorage.getItem('user_name');
    

    if (!token) {
      router.push('/');
    } else {
   
      setUserName(name || 'Admin');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-[#faf6f3] font-sans overflow-hidden">
      
      {/* Sidebar tetap dipertahankan untuk navigasi */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Area Utama (menyesuaikan lebar jika sidebar dibuka/ditutup) */}
      <main className={`flex-1 transition-all duration-300 relative ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        
        {/* Efek blur background agar senada dengan halaman login */}
        <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-amber-200/30 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 pointer-events-none z-0"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[45rem] h-[45rem] bg-orange-200/30 rounded-full mix-blend-multiply filter blur-[150px] opacity-70 pointer-events-none z-0"></div>

        {/* Pembungkus Liquid Text di tengah layar */}
        <div className="relative z-10 w-full h-screen flex items-center justify-center px-10">
          <LiquidText
            text={`Selamat Datang ${userName}!`}
            tone="light"
            fontSize={90} // Ukuran disesuaikan agar tidak menabrak sidebar
            color="#92400e" // Warna amber-800
            viscosity={0.55}
            className="w-full max-w-5xl"
          />
        </div>

      </main>
    </div>
  );
}