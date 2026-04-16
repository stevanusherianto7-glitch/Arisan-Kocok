import { Member } from '../types';

interface Props {
  members: Member[];
  setMembers: (members: Member[]) => void;
  arisanAmount: number;
}

export default function StatusIuran({ members, setMembers, arisanAmount }: Props) {
  const updateStatus = (id: number, status: 'LUNAS' | 'PENDING') => {
    setMembers(members.map(m => m.id === id ? { ...m, status } : m));
  };

  const syncMembers = () => {
    alert('Data berhasil disimpan!');
  };

  return (
    <div className="md:col-span-2 rounded-[16px] bg-white p-[16px] text-[#2F2FA2] border-b-[6px] border-[#d1d5db] shadow-md">
      <div className="mb-[12px] flex items-center justify-between">
        <h3 className="text-[14px] font-bold">Status Iuran Anggota</h3>
        <button onClick={syncMembers} className="text-[10px] bg-[#2F2FA2] text-white p-[4px_8px] rounded-[6px] font-bold border-b-[3px] border-[#1e1e7a] active:border-b-0 active:translate-y-[3px] transition-all">Simpan</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[8px]">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-[10px] rounded-[12px] bg-white p-[8px] border-2 border-[#F1F5F9] border-b-[4px]">
            <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full font-bold text-white" style={{ backgroundColor: member.color }}>
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="text-[12px] font-bold">{member.name}</div>
              <div className="flex gap-[4px] mt-[4px]">
                <button onClick={() => updateStatus(member.id, 'LUNAS')} className="text-[9px] bg-[#D1FAE5] text-[#065F46] p-[2px_4px] rounded-[4px] font-bold border-b-[2px] border-[#a7f3d0] active:border-b-0 active:translate-y-[2px] transition-all">Lunas</button>
                <button onClick={() => updateStatus(member.id, 'PENDING')} className="text-[9px] bg-[#FEF3C7] text-[#92400E] p-[2px_4px] rounded-[4px] font-bold border-b-[2px] border-[#fde68a] active:border-b-0 active:translate-y-[2px] transition-all">Pending</button>
              </div>
            </div>
            <div className="flex flex-col items-end gap-[2px]">
              <div className={`rounded-[4px] p-[2px_6px] text-[10px] font-bold ${member.status === 'LUNAS' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEF3C7] text-[#92400E]'}`}>
                {member.status}
              </div>
              <div className="text-[10px] font-bold text-[#2F2FA2]">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(arisanAmount).replace('Rp', 'Rp\u00A0')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
