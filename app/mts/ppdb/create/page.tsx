/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import { Plus, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

function CreatePpdbContent() {
  const unitCode = "mts"; // Ubah ini saat ditaruh di folder MI, MTs, atau SMK
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [statusBuka, setStatusBuka] = useState(true);
  const [jalurList, setJalurList] = useState([
    { namaJalur: '', biayaFormulir: 0, biayaSpp: 0, uangGedung: 0 }
  ]);

  const addJalur = () => setJalurList([...jalurList, { namaJalur: '', biayaFormulir: 0, biayaSpp: 0, uangGedung: 0 }]);
  const removeJalur = (index: number) => setJalurList(jalurList.filter((_, i) => i !== index));

  const handleJalurChange = (index: number, field: string, value: string | number) => {
    const updated = [...jalurList];
    updated[index] = { ...updated[index], [field]: value };
    setJalurList(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('bearer_token');
      const response = await fetch(`/api/admin/${unitCode}/ppdb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ statusBuka, jalurPendaftaran: jalurList })
      });
      const result = await response.json();
      if (response.ok && result.status === 1) {
        router.push(`/${unitCode}/ppdb?success=create`);
      } else {
        Swal.fire('Oops...', result.message || 'Gagal menambahkan PPDB.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi kesalahan pada server.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#faf6f3] font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className={`flex-1 transition-all duration-300 p-10 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="mb-8 flex items-center gap-4">
          <Link href={`/${unitCode}/ppdb`} className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-amber-800 hover:bg-amber-50 shadow-sm"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Tambah Data PPDB</h1>
            <p className="text-sm text-gray-500 mt-0.5">Atur status pendaftaran dan rincian jalur biaya baru.</p>
          </div>
        </div>

        <div className="bg-white rounded-[1.25rem] shadow-sm border border-amber-100/60 p-8 max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <label className="text-sm font-bold text-amber-900 cursor-pointer flex items-center gap-2">
                <input type="checkbox" checked={statusBuka} onChange={(e) => setStatusBuka(e.target.checked)} className="w-5 h-5 text-amber-700 rounded focus:ring-amber-500" />
                Status Pendaftaran Saat Ini DIBUKA
              </label>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Daftar Jalur & Biaya</h3>
                <button type="button" onClick={addJalur} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-lg flex items-center gap-2"><Plus className="w-4 h-4"/> Tambah Jalur</button>
              </div>

              {jalurList.map((jalur, index) => (
                <div key={index} className="p-5 border border-gray-200 rounded-xl bg-gray-50/50 relative">
                  {jalurList.length > 1 && (
                    <button type="button" onClick={() => removeJalur(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><Trash2 className="w-5 h-5"/></button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Nama Jalur (Cth: Umum / Alumni) <span className="text-red-500">*</span></label>
                      <input type="text" value={jalur.namaJalur} onChange={(e) => handleJalurChange(index, 'namaJalur', e.target.value)} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Biaya Formulir (Rp) <span className="text-red-500">*</span></label>
                      <input type="number" value={jalur.biayaFormulir || ''} onChange={(e) => handleJalurChange(index, 'biayaFormulir', Number(e.target.value))} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Biaya SPP (Rp) <span className="text-red-500">*</span></label>
                      <input type="number" value={jalur.biayaSpp || ''} onChange={(e) => handleJalurChange(index, 'biayaSpp', Number(e.target.value))} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Uang Gedung (Rp) <span className="text-red-500">*</span></label>
                      <input type="number" value={jalur.uangGedung || ''} onChange={(e) => handleJalurChange(index, 'uangGedung', Number(e.target.value))} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Link href={`/${unitCode}/ppdb`} className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm">Batal</Link>
              <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-sm shadow-md disabled:bg-amber-800/50">
                {isLoading ? 'Menyimpan...' : 'Simpan PPDB'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function CreatePpdbPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}><CreatePpdbContent /></Suspense>;
}