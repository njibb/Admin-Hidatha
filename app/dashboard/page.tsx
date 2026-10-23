"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '../../components/sidebar';

interface UnitSummary {
  unitName: string;
  unitCode: string;
  totalBerita: number;
  totalAgenda: number;
  kepalaSekolah: string;
  badgeColor: string;
}

const INITIAL_UNITS: UnitSummary[] = [
  { unitName: "Taman Kanak-Kanak (TK)", unitCode: "tk", totalBerita: 0, totalAgenda: 0, kepalaSekolah: "Hj. Siti Aminah, S.Pd.AUD.", badgeColor: "bg-amber-50 text-amber-800 border-amber-200" },
  { unitName: "Madrasah Ibtidaiyah (MI)", unitCode: "mi", totalBerita: 0, totalAgenda: 0, kepalaSekolah: "Drs. H. M. Nur, M.Pd.I", badgeColor: "bg-orange-50 text-orange-800 border-orange-200" },
  { unitName: "Madrasah Tsanawiyah (MTs)", unitCode: "mts", totalBerita: 0, totalAgenda: 0, kepalaSekolah: "Dra. Tasmiyah", badgeColor: "bg-amber-100 text-amber-900 border-amber-300" },
  { unitName: "Sekolah Menengah Kejuruan (SMK)", unitCode: "smk", totalBerita: 0, totalAgenda: 0, kepalaSekolah: "Drs. H. Ahmad Fauzi, M.Pd.", badgeColor: "bg-stone-100 text-stone-800 border-stone-300" },
];

export default function MasterDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [units, setUnits] = useState<UnitSummary[]>(INITIAL_UNITS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDatabaseStats() {
      try {
        const updatedUnits = await Promise.all(
          INITIAL_UNITS.map(async (unit) => {
            const resBerita = await fetch(`/api/admin/${unit.unitCode}/berita`).catch(() => null);
            const dataBerita = resBerita ? await resBerita.json() : null;

            const resAgenda = await fetch(`/api/admin/${unit.unitCode}/agendas`).catch(() => null);
            const dataAgenda = resAgenda ? await resAgenda.json() : null;

            return {
              ...unit,
              totalBerita: dataBerita?.data?.length || dataBerita?.berita?.length || 0,
              totalAgenda: dataAgenda?.agendas?.length || 0,
            };
          })
        );

        if (isMounted) {
          setUnits(updatedUnits);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Gagal memuat statistik database:", error);
        if (isMounted) setIsLoading(false);
      }
    }

    fetchDatabaseStats();

    return () => {
      isMounted = false;
    };
  }, []); // Array kosong di sini memastikan useEffect HANYA berjalan sekali saat halaman pertama kali dibuka!

  return (
    <div className="flex min-h-screen bg-[#faf6f3] font-sans">
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 p-10 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Dashboard <span className="text-amber-800">Yayasan Hidayatut Thalibin</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Pusat kontrol terpadu pengelola konten seluruh unit pendidikan di bawah naungan yayasan.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-amber-100 shadow-sm text-xs font-semibold text-gray-600">
            Status Database: <span className="text-green-600 font-bold">● Terhubung MongoDB Atlas</span>
          </div>
        </div>

        <div className="space-y-8">
          {units.map((unit) => (
            <div key={unit.unitCode} className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-amber-100/60 hover:shadow-md transition-all">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${unit.badgeColor} uppercase tracking-wider`}>
                    {unit.unitCode}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{unit.unitName}</h2>
                </div>
                <div>
                  <Link 
                    href={`/admin/${unit.unitCode}/berita`}
                    className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm shadow-amber-800/10 inline-block"
                  >
                    Kelola Data Unit Ini &rarr;
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div className="bg-[#faf6f3] p-5 rounded-2xl border border-amber-50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Berita</p>
                    <p className="text-2xl font-extrabold text-gray-800 mt-1">
                      {isLoading ? '...' : unit.totalBerita} <span className="text-xs font-normal text-gray-500">artikel</span>
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-amber-100/70 text-amber-800 rounded-xl flex items-center justify-center font-bold">📰</div>
                </div>

                <div className="bg-[#faf6f3] p-5 rounded-2xl border border-amber-50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Agenda Terjadwal</p>
                    <p className="text-2xl font-extrabold text-gray-800 mt-1">
                      {isLoading ? '...' : unit.totalAgenda} <span className="text-xs font-normal text-gray-500">kegiatan</span>
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100/70 text-orange-700 rounded-xl flex items-center justify-center font-bold">📅</div>
                </div>

                <div className="bg-[#faf6f3] p-5 rounded-2xl border border-amber-50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pimpinan / Kepala</p>
                    <p className="text-sm font-bold text-gray-800 mt-1 truncate max-w-[200px]" title={unit.kepalaSekolah}>{unit.kepalaSekolah}</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-100/70 text-emerald-700 rounded-xl flex items-center justify-center font-bold">👤</div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}