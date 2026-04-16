interface Props {
  arisanAmount: number;
  setArisanAmount: (amount: number) => void;
  audioUrl: string;
  setAudioUrl: (url: string) => void;
}

export default function Pengaturan({ arisanAmount, setArisanAmount, audioUrl, setAudioUrl }: Props) {
  return (
    <div className="md:col-span-2 rounded-[16px] bg-white p-[16px] text-[#2F2FA2] border-b-[6px] border-[#d1d5db] shadow-md">
      <h3 className="text-[14px] font-bold mb-[12px]">Pengaturan Arisan</h3>
      <div className="flex flex-col gap-[8px]">
        <label className="text-[12px] font-semibold">Nominal Iuran per Anggota</label>
        <div className="relative">
          <span className="absolute left-[8px] top-[8px] text-[12px] text-gray-500">Rp</span>
          <input
            type="text"
            value={arisanAmount === 0 ? '' : new Intl.NumberFormat('id-ID').format(arisanAmount)}
            onChange={(e) => {
              const val = e.target.value.replace(/\./g, '');
              if (!isNaN(Number(val))) {
                setArisanAmount(Number(val));
              }
            }}
            className="w-full p-[8px_8px_8px_28px] text-[12px] rounded-[8px] border border-gray-300"
          />
        </div>
        <button 
          onClick={() => alert(`Nominal iuran diperbarui menjadi: Rp ${new Intl.NumberFormat('id-ID').format(arisanAmount)}`)}
          className="w-full bg-[#FF6B6B] text-white p-[8px] text-[12px] font-bold rounded-[8px] border-b-[4px] border-[#e05a5a] active:border-b-0 active:translate-y-[4px] transition-all"
        >
          OK
        </button>
        <label className="text-[12px] font-semibold mt-[8px]">Unggah File Audio Spinner (MP3)</label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 3 * 1024 * 1024) {
                alert('Ukuran file terlalu besar. Maksimal 3MB untuk disimpan di browser.');
                return;
              }
              const reader = new FileReader();
              reader.onload = (event) => {
                if (event.target?.result) {
                  setAudioUrl(event.target.result as string);
                }
              };
              reader.readAsDataURL(file);
            }
          }}
          className="w-full p-[8px] text-[12px] rounded-[8px] border border-gray-300 bg-white mb-[8px]"
        />
        <button 
          onClick={() => {
            localStorage.setItem('arisan_audio', audioUrl);
            alert('Pengaturan audio berhasil disimpan!');
          }}
          className="w-full bg-[#FF6B6B] text-white p-[8px] text-[12px] font-bold rounded-[8px] border-b-[4px] border-[#e05a5a] active:border-b-0 active:translate-y-[4px] transition-all"
        >
          Simpan Audio
        </button>
      </div>
    </div>
  );
}
