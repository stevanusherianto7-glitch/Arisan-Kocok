import { Member } from '../types';

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  sisaMembers: Member[];
}

export default function SisaModal({ showModal, setShowModal, sisaMembers }: Props) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[20px]">
      <div className="w-full max-w-sm rounded-[16px] bg-white p-[20px] text-[#2F2FA2] border-b-[8px] border-[#d1d5db] shadow-2xl">
        <div className="mb-[16px] flex items-center justify-between">
          <h3 className="text-[16px] font-bold">Belum Dapat Arisan</h3>
          <button 
            onClick={() => setShowModal(false)}
            className="text-[20px] font-bold leading-none text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {sisaMembers.length > 0 ? (
            <div className="flex flex-col gap-[8px]">
              {sisaMembers.map((member, index) => (
                <div key={member.id} className="flex items-center gap-[10px] rounded-[8px] border border-gray-100 p-[8px]">
                  <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#4ECDC4] text-[10px] font-bold text-white">
                    {index + 1}
                  </div>
                  <span className="text-[12px] font-bold">{member.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-[12px] opacity-60">Semua peserta sudah dapat arisan.</div>
          )}
        </div>
        <button 
          onClick={() => setShowModal(false)}
          className="mt-[16px] w-full rounded-[8px] bg-[#2F2FA2] p-[10px] text-[12px] font-bold text-white border-b-[4px] border-[#1e1e7a] active:border-b-0 active:translate-y-[4px] transition-all"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
