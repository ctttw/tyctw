import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Camera } from 'lucide-react';
import jsQR from 'jsqr';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
}

export default function QRCodeModal({ isOpen, onClose, onScan }: Props) {
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [cameraError, setCameraError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen || mode !== 'camera') return;

    // We only mount the scanner if in camera mode
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        onScan(decodedText);
      },
      (error) => {
        // Just ignore continuous scan errors
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [isOpen, mode, onScan]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            onScan(code.data);
          } else {
            alert('無法從圖片中讀取 QR Code！');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-slate-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-emerald-50">
              <h2 className="text-xl font-black text-slate-900">掃描邀請碼</h2>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors border-2 border-transparent hover:border-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
               <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => setMode('camera')}
                    className={`flex-1 py-2 font-bold text-sm rounded-xl border-2 transition-all flex items-center justify-center gap-1 ${mode === 'camera' ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                  >
                    <Camera className="w-4 h-4" /> 鏡頭掃描
                  </button>
                  <button 
                    onClick={() => setMode('upload')}
                    className={`flex-1 py-2 font-bold text-sm rounded-xl border-2 transition-all flex items-center justify-center gap-1 ${mode === 'upload' ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                  >
                    <Upload className="w-4 h-4" /> 圖片上傳
                  </button>
               </div>

               {mode === 'camera' ? (
                 <div id="reader" className="w-full rounded-xl overflow-hidden min-h-[300px] border-2 border-slate-900 bg-slate-100 flex items-center justify-center">
                    {/* Html5QrcodeScanner will inject here */}
                 </div>
               ) : (
                 <div className="w-full min-h-[300px] rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                    <Upload className="w-12 h-12 text-slate-300 mb-4" />
                    <p className="font-bold text-slate-600 mb-4">請上傳包含 QR Code 的圖片</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-indigo-500 text-white font-bold rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all"
                    >
                      選擇圖片
                    </button>
                 </div>
               )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
