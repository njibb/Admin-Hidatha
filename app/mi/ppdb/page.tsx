/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function AdminPPDBPage() {
  const unitCode = "mi"; // Ubah ini saat ditaruh di folder MI, MTs, atau SMK
  const [ppdbList, setPpdbList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const fetchPpdb = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/admin/${unitCode}/ppdb`, {
        cache: "no-store",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      if (response.ok && result.status === 1) {
        setPpdbList(result.data || []);
      }
    } catch (error) {
      console.error("Gagal mengambil data PPDB:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPpdb();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data biaya PPDB ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#853502",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("bearer_token");
        const response = await fetch(`/api/admin/${unitCode}/ppdb/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await response.json();
        
        if (response.ok && result.status === 1) {
          Swal.fire("Terhapus!", "Data PPDB berhasil dihapus.", "success");
          fetchPpdb();
        } else {
          Swal.fire("Gagal!", result.message || "Gagal menghapus data.", "error");
        }
      } catch (error) {
        Swal.fire("Error!", "Terjadi kesalahan pada sistem.", "error");
      }
    }
  };

  const formatRp = (angka: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(angka);

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 p-8 w-full ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight uppercase">Kelola PPDB {unitCode}</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola data biaya formulir, SPP, dan uang gedung pendaftaran siswa baru.</p>
          </div>
          <Link
            href={`/${unitCode}/ppdb/create`}
            className="bg-[#853502] hover:bg-[#6c2b02] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" /> Tambah Data PPDB
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="pb-4 w-12 text-center">NO</th>
                  <th className="pb-4">STATUS PENDAFTARAN</th>
                  <th className="pb-4">RINCIAN JALUR & BIAYA</th>
                  <th className="pb-4 text-center w-24">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {isLoading ? (
                  <tr><td colSpan={4} className="py-8 text-center text-gray-400">Memuat data PPDB...</td></tr>
                ) : ppdbList.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-gray-400">Belum ada data PPDB.</td></tr>
                ) : (
                  ppdbList.map((item, idx) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 font-semibold text-gray-500 text-center align-top">{idx + 1}</td>
                      <td className="py-4 align-top">
                        {item.statusBuka ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle className="w-3.5 h-3.5"/> DIBUKA</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-200"><XCircle className="w-3.5 h-3.5"/> DITUTUP</span>
                        )}
                      </td>
                      <td className="py-4">
                        <div className="space-y-3">
                          {item.jalurPendaftaran.map((jalur: any, i: number) => (
                            <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                              <p className="font-bold text-gray-800 mb-1">{jalur.namaJalur}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600">
                                <p>Formulir: <span className="font-semibold text-amber-700">{formatRp(jalur.biayaFormulir)}</span></p>
                                <p>SPP: <span className="font-semibold text-amber-700">{formatRp(jalur.biayaSpp)}</span></p>
                                <p>Gedung: <span className="font-semibold text-amber-700">{formatRp(jalur.uangGedung)}</span></p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 text-center align-top">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/${unitCode}/ppdb/edit/${item._id}`} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg transition-colors" title="Edit"><Pencil className="w-4 h-4" /></Link>   
                          <button onClick={() => handleDelete(item._id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}