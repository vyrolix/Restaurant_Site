import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QrCode, Users, ExternalLink, Download } from 'lucide-react';

export default function TableManager() {
  const { tables } = useApp();
  const [selectedTable, setSelectedTable] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Occupied':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Ordering':
      case 'Preparing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://10.20.45.53:5173';

  const getQrCodeUrl = (tableId) => {
    const tableUrl = `${currentOrigin}/?table=${tableId}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(tableUrl)}&color=06382B`;
  };

  const handleLaunchTableSession = (tableNum) => {
    window.location.href = `${currentOrigin}/?table=${tableNum}`;
  };

  return (
    <div className="p-4 space-y-4 font-sans">
      <div className="flex justify-between items-center">
        <h3 className="font-serif font-bold text-[#06382B] text-base">Restaurant Dining Tables (10)</h3>
        <span className="text-[11px] text-[#06382B]/80 font-semibold">Tap table for Scannable QR</span>
      </div>

      {/* Grid of Tables */}
      <div className="grid grid-cols-2 gap-3">
        {tables.map((table) => (
          <div 
            key={table.id}
            onClick={() => setSelectedTable(table)}
            className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md ${
              selectedTable?.id === table.id 
                ? 'bg-[#06382B] text-white border-[#D4AF37]' 
                : 'bg-white text-[#06382B] border-neutral-200/80 hover:border-[#06382B]'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="font-serif font-bold text-base">Table {table.id}</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadge(table.status)}`}>
                {table.status}
              </span>
            </div>

            <div className="mt-2 text-xs opacity-80 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> {table.capacity} Seats
              </span>
              <QrCode className="w-4 h-4 text-[#D4AF37]" />
            </div>

            {table.activeGuest && (
              <div className="mt-1.5 pt-1.5 border-t border-neutral-200/40 text-[10px] truncate text-[#D4AF37] font-semibold">
                Guest: {table.activeGuest}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Table Real Scannable QR Code Modal */}
      {selectedTable && (
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 space-y-4 shadow-xl animate-fade-up">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
            <div>
              <h4 className="font-serif font-bold text-[#06382B] text-base">
                Real-Time Scannable QR Code
              </h4>
              <span className="text-[10px] text-neutral-500 font-semibold uppercase">
                Table {selectedTable.id} • {selectedTable.capacity} Seats
              </span>
            </div>
            <button 
              onClick={() => setSelectedTable(null)}
              className="bg-neutral-100 hover:bg-neutral-200 text-[#06382B] font-bold text-xs px-2.5 py-1 rounded-full cursor-pointer"
            >
              &times; Close
            </button>
          </div>

          {/* REAL SCANNABLE QR CODE IMAGE */}
          <div className="flex flex-col items-center space-y-3 py-2">
            <div className="bg-white p-3 rounded-2xl border-2 border-[#D4AF37] shadow-md flex flex-col items-center">
              <img 
                src={getQrCodeUrl(selectedTable.id)} 
                alt={`Table ${selectedTable.id} QR Code`}
                className="w-44 h-44 object-contain rounded-lg"
              />
              <span className="text-xs font-serif font-bold text-[#06382B] mt-2 tracking-widest uppercase">
                K/N RESTAURANT • TABLE {selectedTable.id}
              </span>
            </div>

            <div className="text-center space-y-1">
              <p className="text-[11px] text-neutral-600 font-medium max-w-[280px]">
                Scan with any Phone Camera on Local Wi-Fi network:
              </p>
              <code className="text-[11px] bg-[#06382B]/10 text-[#06382B] font-mono px-2 py-0.5 rounded font-bold block truncate max-w-[300px]">
                {currentOrigin}/?table={selectedTable.id}
              </code>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => handleLaunchTableSession(selectedTable.id)}
              className="flex-1 bg-[#06382B] hover:bg-[#04291F] text-[#D4AF37] py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-transform active:scale-95 border border-[#D4AF37]/40"
            >
              <ExternalLink className="w-4 h-4" />
              Open Customer Session
            </button>
            <a 
              href={getQrCodeUrl(selectedTable.id)} 
              target="_blank"
              rel="noreferrer"
              className="bg-neutral-100 hover:bg-neutral-200 text-[#06382B] p-3 rounded-xl flex items-center justify-center cursor-pointer border border-neutral-300"
              title="Download / Print QR Code"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
