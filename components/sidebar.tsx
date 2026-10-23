/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [role, setRole] = useState<string | null>(null);
  const [unitCode, setUnitCode] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRole(localStorage.getItem('user_role'));
      setUnitCode(localStorage.getItem('unit_code'));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const isTkActive = pathname?.startsWith('/tk');
  const isMiActive = pathname?.startsWith('/mi');
  const isMtsActive = pathname?.startsWith('/mts');
  const isSmkActive = pathname?.startsWith('/smk');

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-6 left-6 z-50 p-2.5 bg-amber-800 text-white rounded-xl shadow-lg hover:bg-amber-900 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-amber-100 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="p-6 flex items-center justify-between border-b border-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-800 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-sm">H</div>
            <div>
              <span className="font-extrabold text-base tracking-wider text-gray-900 block leading-none">HIDATHA</span>
              <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-widest mt-1 block">CMS Yayasan</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-amber-50 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          
          {role === 'superadmin' && (
            <div>
              <p className="text-[11px] font-bold text-gray-400 mb-3 px-3 uppercase tracking-wider">Menu Utama</p>
              <ul className="space-y-1">
                <li>
                  <Link href="/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 bg-amber-50 text-amber-900 rounded-xl font-semibold text-sm transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    Master Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          )}

          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-3 px-3 uppercase tracking-wider">Manajemen Unit</p>
            <ul className="space-y-1">
              
              {/* MENU TK */}
              {(role === 'superadmin' || unitCode === 'tk') && (
                <li className="mb-2">
                  <Link href="/tk" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors ${isTkActive ? 'bg-amber-100 text-amber-900 font-bold' : 'text-gray-600 hover:bg-amber-50 hover:text-amber-900'}`}>
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    Dashboard TK
                  </Link>
                  
                  {isTkActive && (
                    <div className="ml-7 mt-2 pl-4 border-l-2 border-amber-100 space-y-1.5">
                      <Link href="/tk/berita" className={`block text-xs py-1.5 px-2 rounded-lg transition-colors ${pathname?.includes('/tk/berita') ? 'text-amber-800 font-bold bg-amber-50' : 'text-gray-500 hover:text-amber-700'}`}>Berita TK</Link>
                      <Link href="/tk/agenda" className={`block text-xs py-1.5 px-2 rounded-lg transition-colors ${pathname?.includes('/tk/agenda') ? 'text-amber-800 font-bold bg-amber-50' : 'text-gray-500 hover:text-amber-700'}`}>Agenda TK</Link>
                      <Link href="/tk/structure" className={`block text-xs py-1.5 px-2 rounded-lg transition-colors ${pathname?.includes('/tk/structure') ? 'text-amber-800 font-bold bg-amber-50' : 'text-gray-500 hover:text-amber-700'}`}>Struktur TK</Link>
                      <Link href="/tk/ppdb" className={`block text-xs py-1.5 px-2 rounded-lg transition-colors ${pathname?.includes('/tk/ppdb') ? 'text-amber-800 font-bold bg-amber-50' : 'text-gray-500 hover:text-amber-700'}`}>PPDB TK</Link>
                    </div>
                  )}
                </li>
              )}

              {/* MENU MI */}
              {(role === 'superadmin' || unitCode === 'mi') && (
                <li className="mb-2">
                  <Link href="/mi" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors ${isMiActive ? 'bg-amber-100 text-amber-900 font-bold' : 'text-gray-600 hover:bg-amber-50 hover:text-amber-900'}`}>
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    Dashboard MI
                  </Link>
                  
                  {isMiActive && (
                    <div className="ml-7 mt-2 pl-4 border-l-2 border-amber-100 space-y-1.5">
                      <Link href="/mi/berita" className={`block text-xs py-1.5 px-2 rounded-lg transition-colors ${pathname?.includes('/mi/berita') ? 'text-amber-800 font-bold bg-amber-50' : 'text-gray-500 hover:text-amber-700'}`}>Berita MI</Link>
                      <Link href="/mi/agenda" className={`block text-xs py-1.5 px-2 rounded-lg transition-colors ${pathname?.includes('/mi/agenda') ? 'text-amber-800 font-bold bg-amber-50' : 'text-gray-500 hover:text-amber-700'}`}>Agenda MI</Link>
                      <Link href="/mi/structure" className={`block text-xs py-1.5 px-2 rounded-lg transition-colors ${pathname?.includes('/mi/structure') ? 'text-amber-800 font-bold bg-amber-50' : 'text-gray-500 hover:text-amber-700'}`}>Struktur MI</Link>
                      <Link href="/mi/ppdb" className={`block text-xs py-1.5 px-2 rounded-lg transition-colors ${pathname?.includes('/mi/ppdb') ? 'text-amber-800 font-bold bg-amber-50' : 'text-gray-500 hover:text-amber-700'}`}>PPDB MI</Link>
                    </div>
                  )}
                </li> 
              )}

              {/* MENU MTs */}
              {(role === 'superadmin' || unitCode === 'mts') && (
                <li className="mb-2">
                  <Link href="/mts" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors ${isMtsActive ? 'bg-amber-100 text-amber-900 font-bold' : 'text-gray-600 hover:bg-amber-50 hover:text-amber-900'}`}>
                    <span className="w-2 h-2 rounded-full bg-amber-800"></span>
                    Dashboard MTs
                  </Link>

                  {isMtsActive && (
                    <div className="ml-7 mt-2 pl-4 border-l-2 border-amber-100 space-y-1.5">
                      <Link href="/mts/berita" className={`block text-xs py-1.5 px-2 rounded-lg transition-colors ${pathname?.includes('/mts/berita') ? 'text-amber-800 font-bold bg-amber-50' : 'text-gray-500 hover:text-amber-700'}`}>Berita MTs</Link>
                      <Link href="/mts/agenda" className={`block text-xs py-1.5 px-2 rounded-lg transition-colors ${pathname?.includes('/mts/agenda') ? 'text-amber-800 font-bold bg-amber-50' : 'text-gray-500 hover:text-amber-700'}`}>Agenda MTs</Link>
                      <Link href="/mts/structure" className={`block text-xs py-1.5 px-2 rounded-lg transition-colors ${pathname?.includes('/mts/structure') ? 'text-amber-800 font-bold bg-amber-50' : 'text-gray-500 hover:text-amber-700'}`}>Struktur MTs</Link>
                      <Link href="/mts/ppdb" className={`block text-xs py-1.5 px-2 rounded-lg transition-colors ${pathname?.includes('/mts/ppdb') ? 'text-amber-800 font-bold bg-amber-50' : 'text-gray-500 hover:text-amber-700'}`}>PPDB MTs</Link>
                    </div>
                  )}
                </li>
              )}

              {/* MENU SMK */}
              {(role === 'superadmin' || unitCode === 'smk') && (
                <li className="mb-2">
                  <Link href="/smk" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors ${isSmkActive ? 'bg-amber-100 text-amber-900 font-bold' : 'text-gray-600 hover:bg-amber-50 hover:text-amber-900'}`}>
                    <span className="w-2 h-2 rounded-full bg-stone-700"></span>
                    Dashboard SMK
                  </Link>

                  {isSmkActive && (
                    <div className="ml-7 mt-2 pl-4 border-l-2 border-amber-100 space-y-1.5">
                      <Link href="/smk/berita" className={`block text-xs py-1.5 px-2 rounded-lg transition-colors ${pathname?.includes('/smk/berita') ? 'text-amber-800 font-bold bg-amber-50' : 'text-gray-500 hover:text-amber-700'}`}>Berita SMK</Link>
                      <Link href="/smk/agenda" className={`block text-xs py-1.5 px-2 rounded-lg transition-colors ${pathname?.includes('/smk/agenda') ? 'text-amber-800 font-bold bg-amber-50' : 'text-gray-500 hover:text-amber-700'}`}>Agenda SMK</Link>
                      <Link href="/smk/structure" className={`block text-xs py-1.5 px-2 rounded-lg transition-colors ${pathname?.includes('/smk/structure') ? 'text-amber-800 font-bold bg-amber-50' : 'text-gray-500 hover:text-amber-700'}`}>Struktur SMK</Link>
                      <Link href="/smk/ppdb" className={`block text-xs py-1.5 px-2 rounded-lg transition-colors ${pathname?.includes('/smk/ppdb') ? 'text-amber-800 font-bold bg-amber-50' : 'text-gray-500 hover:text-amber-700'}`}>PPDB SMK</Link>
                    </div>
                  )}
                </li>
              )}

            </ul>
          </div>
        </div>

        <div className="p-4 border-t border-amber-50">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold text-xs transition-colors">
            Keluar Sesi (Logout)
          </button>
        </div>
      </aside>
    </>
  );
}