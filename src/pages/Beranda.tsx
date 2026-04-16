import { Member, WinnerHistoryItem } from '../types';

interface Props {
  isSpinning: boolean;
  timer: number;
  members: Member[];
  arisanAmount: number;
  winner: string | null;
  winnerHistory: WinnerHistoryItem[];
  setShowSisaModal: (show: boolean) => void;
  getSisaMembers: () => Member[];
  getDaysLeft: () => string;
}

export default function Beranda({
  isSpinning, timer, members, arisanAmount, winner, winnerHistory,
  setShowSisaModal, getSisaMembers, getDaysLeft
}: Props) {
  return (
    <>
      {/* Spinner Panel */}
      <div className="flex flex-col items-center justify-center rounded-[16px] bg-[#FF6B6B] p-[16px] text-center text-white border-b-[6px] border-[#e05a5a] shadow-lg">
        <h3 className="text-[16px] font-extrabold">LUCKY SPINNER</h3>
        <p className={`mt-[2px] text-[10px] opacity-80 ${isSpinning ? 'animate-pulse' : ''}`}>
          {isSpinning ? `${timer}s` : 'Timer Mundur'}
        </p>
        <div className="relative my-[16px] flex h-[140px] w-[140px] md:h-[180px] md:w-[180px] items-center justify-center rounded-full bg-[#2F2FA2] shadow-xl">
          {/* Lights */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-full flex justify-center"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div
                className={`mt-[6px] md:mt-[8px] w-[8px] h-[8px] md:w-[12px] md:h-[12px] rounded-full ${
                  isSpinning 
                    ? (i % 2 === 0 ? 'bg-[#FFE66D] shadow-[0_0_8px_#FFE66D] animate-[pulse_0.3s_ease-in-out_infinite]' : 'bg-[#FF6B6B] shadow-[0_0_8px_#FF6B6B] animate-[pulse_0.3s_ease-in-out_infinite_0.15s]') 
                    : 'bg-[#FFE66D]/50'
                }`}
              />
            </div>
          ))}
          {/* Inner Spinner */}
          <div className="relative flex h-[110px] w-[110px] md:h-[140px] md:w-[140px] items-center justify-center rounded-full border-[4px] border-white/20 overflow-hidden">
            <div className={`h-full w-full rounded-full bg-[conic-gradient(#4ECDC4_0deg_60deg,#FFE66D_60deg_120deg,#ffffff_120deg_180deg,#4ECDC4_180deg_240deg,#FFE66D_240deg_300deg,#ffffff_300deg_360deg)] ${isSpinning ? 'animate-[spin_2s_linear_infinite]' : ''}`}></div>
          </div>
          {/* Pointer */}
          <div className="absolute -top-[10px] z-10 h-[24px] w-[24px] bg-[#FFE66D] [clip-path:polygon(50%_0%,0%_100%,100%_100%)] transition-transform duration-[500ms] ease-in-out drop-shadow-md" style={{ transform: isSpinning ? 'rotate(220deg)' : 'rotate(180deg)', animation: isSpinning ? 'swing 1s ease-in-out infinite' : 'none' }}></div>
          {/* Center Dot */}
          <div className="absolute h-[30px] w-[30px] rounded-full bg-white shadow-md z-10"></div>
        </div>
        <div className="rounded-[8px] bg-black/20 p-[6px_12px] text-[12px] font-bold">
          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(members.length * arisanAmount).replace('Rp', 'Rp\u00A0')}
        </div>
      </div>

      {/* Notification Banner */}
      <div className="md:col-span-2 flex items-center gap-[8px] rounded-[12px] bg-[#4ECDC4] p-[8px_16px] text-[11px] font-semibold text-white">
        <span>🔔</span>
        <span className="whitespace-pre-line text-center w-full">{winner ? `Selamat!\nPemenang Arisan Putaran Ini Adalah:\n${winner.toUpperCase()}` : 'Belum Ada Pemenang Putaran Ini.'}</span>
      </div>

      {/* Stats Footer */}
      <div className="md:col-span-2 grid grid-cols-3 gap-[10px]">
        <div 
          onClick={() => setShowSisaModal(true)}
          className="rounded-[12px] border-2 border-white/20 bg-white/10 p-[12px] cursor-pointer hover:bg-white/20 border-b-[4px] active:border-b-[2px] active:translate-y-[2px] transition-all shadow-[0_4px_0_rgba(0,0,0,0.1)]"
        >
          <span className="text-[10px] uppercase tracking-[1px] opacity-60">Sisa</span>
          <span className="mt-[2px] block text-[16px] font-extrabold">{getSisaMembers().length}</span>
        </div>
        <div className="rounded-[12px] border-2 border-white/20 bg-white/10 p-[12px] border-b-[4px] shadow-[0_4px_0_rgba(0,0,0,0.1)]">
          <span className="text-[10px] uppercase tracking-[1px] opacity-60">Pemenang</span>
          <span className="mt-[2px] block text-[16px] font-extrabold text-[#FFE66D] truncate">
            {winnerHistory.length > 0 ? winnerHistory[0].name : '-'}
          </span>
        </div>
        <div className="rounded-[12px] border-2 border-white/20 bg-white/10 p-[12px] border-b-[4px] shadow-[0_4px_0_rgba(0,0,0,0.1)]">
          <span className="text-[10px] uppercase tracking-[1px] opacity-60">Tempo</span>
          <span className="mt-[2px] block text-[16px] font-extrabold">{getDaysLeft()}</span>
        </div>
      </div>
      
      {/* Winner History */}
      <div className="md:col-span-2 rounded-[12px] border-2 border-white/10 bg-white/5 p-[12px] mt-[10px] border-b-[4px] shadow-[0_4px_0_rgba(0,0,0,0.1)]">
        <h4 className="text-[10px] uppercase tracking-[1px] opacity-60 mb-[8px]">Riwayat Pemenang</h4>
        <style>{`
          .custom-scroll::-webkit-scrollbar {
            width: 1px;
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
          }
        `}</style>
        {winnerHistory.length > 0 ? (
          <div className="flex flex-col gap-[6px] max-h-[120px] overflow-y-auto custom-scroll pr-[2px]">
            {winnerHistory.map((w, index) => (
              <div key={index} className="flex justify-between items-center rounded-full bg-[#FFE66D] px-[8px] py-[4px] text-[10px] font-bold text-[#2F2FA2] shrink-0">
                <span>{w.name}</span>
                <span className="opacity-70">
                  {new Date(w.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[12px] text-center opacity-50 py-[10px]">
            Belum ada riwayat pemenang.
          </div>
        )}
      </div>
    </>
  );
}
