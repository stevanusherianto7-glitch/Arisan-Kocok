interface Props {
  winnerHistoryLength: number;
  handleReset: () => void;
  handleKocok: () => void;
}

export default function Header({ winnerHistoryLength, handleReset, handleKocok }: Props) {
  return (
    <div className="flex items-center justify-between gap-[10px]">
      <div className="header-info flex flex-col leading-tight">
        <h1 className="text-[18px] font-bold">Arisan IndoVWT</h1>
        <span className="text-[10px] opacity-70">Phinisi Nusantara Family</span>
        <span className="text-[10px] font-semibold text-[#FFE66D] mt-[2px]">
          Putaran Minggu ke-{winnerHistoryLength + 1}
        </span>
      </div>
      <div className="flex items-center gap-[8px]">
        <button onClick={handleReset} className="rounded-[20px] bg-[#FF6B6B] p-[8px_16px] text-[12px] font-bold uppercase tracking-[0.5px] text-white border-b-[4px] border-[#e05a5a] active:border-b-0 active:translate-y-[4px] transition-all">
          Reset
        </button>
        <button onClick={handleKocok} className="rounded-[20px] bg-[#4ECDC4] p-[8px_16px] text-[12px] font-bold uppercase tracking-[0.5px] text-[#2F2FA2] border-b-[4px] border-[#3eb5ad] active:border-b-0 active:translate-y-[4px] transition-all">
          Kocok
        </button>
      </div>
    </div>
  );
}
