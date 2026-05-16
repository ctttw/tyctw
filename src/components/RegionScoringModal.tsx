import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calculator, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { ALL_REGIONS } from './RegionModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedRegion: string;
}

const REGION_SCORING_DATA: Record<string, {
  total: string;
  items: { label: string; score: string; desc: string }[];
  examDetail?: { level: string; score: string }[];
  note?: string;
}> = {
  taipei: {
    total: '108',
    items: [
      { label: '志願序', score: '36', desc: '第1-5志願36分，第6-10志願35分，依序遞減至32分' },
      { label: '多元學習表現', score: '36', desc: '均衡學習(健體/藝文/綜合, 每領域及格7分, 上限21分)；服務學習(每學期滿6小時5分, 上限15分)' },
      { label: '國中教育會考', score: '36', desc: '五科每科最高7分(上限35分)；寫作測驗最高1分' },
    ],
    examDetail: [
      { level: 'A++', score: '7分' },
      { level: 'A+', score: '6分' },
      { level: 'A', score: '5分' },
      { level: 'B++', score: '4分' },
      { level: 'B+', score: '3分' },
      { level: 'B', score: '2分' },
      { level: 'C', score: '1分' },
    ],
    note: '寫作測驗：六級分(1分)、五級分(0.8分)、四級分(0.6分)、三級分(0.4分)、二級分(0.2分)、一級分(0.1分)'
  },
  taoyuan: {
    total: '100',
    items: [
      { label: '適性輔導', score: '32', desc: '含志願序(15分)、畢業資格(6分)、生涯規劃(6分)、就近入學(5分)' },
      { label: '多元學習表現', score: '35', desc: '含品德(10分)、服務(10分)、均衡學習(9分)、體適能(6分)、才藝(5分)、本土語(2分)' },
      { label: '國中教育會考', score: '33', desc: '五科每科最高6分，寫作測驗最高3分' }
    ],
    examDetail: [
      { level: 'A++', score: '7點' },
      { level: 'A+', score: '6點' },
      { level: 'A', score: '5點' },
      { level: 'B++', score: '4點' },
      { level: 'B+', score: '3點' },
      { level: 'B', score: '2點' },
      { level: 'C', score: '1點' },
    ],
    note: '同分比序順序：1.低收入戶優先 2.適性輔導 3.多元學習表現 4.國中會考 5.志願序 6.會考點數和 7.單科標示(國>數>英>社>自)'
  },
  central: {
    total: '100',
    items: [
      { label: '志願序', score: '30', desc: '依志願序給分，群組計分' },
      { label: '多元學習表現', score: '30', desc: '含均衡學習、服務學習、體適能等' },
      { label: '國中教育會考', score: '30', desc: '精熟(6分)、基礎(4分)、待加強(2分)' },
      { label: '扶助弱勢', score: '10', desc: '符合資格者給分' }
    ]
  },
  changhua: {
    total: '135',
    items: [
      { label: '志願序', score: '45', desc: '志願序積分' },
      { label: '多元學習表現', score: '45', desc: '含服務學習、體適能、競賽等' },
      { label: '國中教育會考', score: '45', desc: '教育會考總積分' }
    ]
  },
  tainan: {
    total: '100',
    items: [
      { label: '志願序', score: '10', desc: '志願序積分' },
      { label: '多元學習表現', score: '50', desc: '多元學習總積分' },
      { label: '國中教育會考', score: '30', desc: '會考成績' },
      { label: '生涯發展', score: '10', desc: '生涯發展紀錄' }
    ]
  },
  kaohsiung: {
    total: '100',
    items: [
      { label: '志願序', score: '30', desc: '志願序積分' },
      { label: '多元學習表現', score: '40', desc: '多元學習表現' },
      { label: '國中教育會考', score: '30', desc: '會考總積分' }
    ]
  },
  hsinchu: {
    total: '100',
    items: [
      { label: '志願序', score: '30', desc: '志願序積分' },
      { label: '多元學習表現', score: '40', desc: '多元學習表現積分' },
      { label: '國中教育會考', score: '30', desc: '會考總積分' }
    ]
  }
};

export default function RegionScoringModal({ isOpen, onClose, selectedRegion }: Props) {
  const regionName = ALL_REGIONS.find(r => r.id === selectedRegion)?.name || '未知區域';
  const scoringData = REGION_SCORING_DATA[selectedRegion];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-slate-50 rounded-[2rem] border-4 border-slate-900 overflow-hidden shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 sm:p-8 bg-sky-300 border-b-4 border-slate-900 relative overflow-hidden shrink-0">
              <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
                <Calculator className="w-48 h-48 text-slate-900" />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="px-3 py-1 bg-slate-900 text-white font-black text-sm rounded-lg flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {regionName}
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2">
                    <Calculator className="w-8 h-8" /> 超額比序計分方式
                  </h2>
                </div>
                <button 
                  onClick={onClose} 
                  className="w-12 h-12 bg-white rounded-2xl border-4 border-slate-900 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:bg-slate-100 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-y-0 active:shadow-none shrink-0"
                >
                  <X className="w-6 h-6 text-slate-900" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
              {!scoringData ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-slate-200 border-4 border-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-4 rotate-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                    <Calculator className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">尚無此區計分資料</h3>
                  <p className="text-slate-500 font-bold mt-2">系統即將更新各區最新計分規則</p>
                </div>
              ) : (
                <div className="space-y-8">
                  
                  {/* Total Score Header */}
                  <div className="flex items-center gap-4 bg-white border-4 border-slate-900 p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                    <div className="w-16 h-16 bg-fuchsia-300 border-4 border-slate-900 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-3 shrink-0">
                      <Award className="w-8 h-8 text-slate-900" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">總積分上限</div>
                      <div className="text-4xl font-black text-slate-900 flex items-baseline gap-1">
                        {scoringData.total} <span className="text-xl font-bold text-slate-500">分</span>
                      </div>
                    </div>
                  </div>

                  {/* Score Items */}
                  <div className="space-y-4">
                    <h3 className="font-black text-xl text-slate-900 border-b-4 border-slate-900 pb-2 inline-block">三大類別配分</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {scoringData.items.map((item, index) => (
                        <div key={index} className="bg-white border-4 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-transform">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-black text-lg text-slate-900">{item.label}</h4>
                            <div className="bg-amber-300 border-2 border-slate-900 px-3 py-1 rounded-full text-slate-900 font-black flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                              {item.score} <span className="text-xs">分</span>
                            </div>
                          </div>
                          <p className="text-slate-600 font-bold text-sm leading-relaxed flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exam Detail if any */}
                  {scoringData.examDetail && (
                    <div className="space-y-4">
                      <h3 className="font-black text-xl text-slate-900 border-b-4 border-slate-900 pb-2 inline-block">會考單科等級計分換算</h3>
                      <div className="bg-white border-4 border-slate-900 rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                        <table className="w-full text-center border-collapse">
                          <thead>
                            <tr className="bg-slate-900 text-white">
                              <th className="py-3 px-4 font-black border-b-4 border-slate-900">等級標示</th>
                              <th className="py-3 px-4 font-black border-b-4 border-slate-900">換算積分</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scoringData.examDetail.map((detail, index) => (
                              <tr key={index} className="border-b-2 border-slate-200 last:border-0 hover:bg-slate-50">
                                <td className="py-3 px-4 font-black text-indigo-600 font-mono text-lg">{detail.level}</td>
                                <td className="py-3 px-4 font-bold text-slate-700">{detail.score}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {scoringData.note && (
                        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 mt-4">
                          <p className="text-indigo-800 font-bold text-sm">{scoringData.note}</p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
