import { useState } from 'react';
import { Member } from '../types';

interface Props {
  members: Member[];
  setMembers: (members: Member[]) => void;
}

export default function Peserta({ members, setMembers }: Props) {
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberWa, setNewMemberWa] = useState('');

  const addMember = () => {
    if (newMemberName.trim()) {
      setMembers([...members, { id: Date.now(), name: newMemberName, status: 'PENDING', color: '#FFE66D', waNumber: newMemberWa }]);
      setNewMemberName('');
      setNewMemberWa('');
    }
  };

  const deleteMember = (id: number) => {
    setMembers(members.filter(m => m.id !== id));
  };

  return (
    <div className="md:col-span-2 rounded-[16px] bg-white p-[16px] text-[#2F2FA2] border-b-[6px] border-[#d1d5db] shadow-md">
      <h3 className="text-[14px] font-bold mb-[12px]">Manajemen Anggota</h3>
      <div className="flex flex-col gap-[8px] mb-[16px]">
        <input
          type="text"
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          placeholder="Nama baru"
          className="w-full p-[8px] text-[12px] rounded-[8px] border border-gray-300"
        />
        <input
          type="text"
          value={newMemberWa}
          onChange={(e) => setNewMemberWa(e.target.value)}
          placeholder="No WA"
          className="w-full p-[8px] text-[12px] rounded-[8px] border border-gray-300"
        />
        <button onClick={addMember} className="w-full bg-[#4ECDC4] text-[#2F2FA2] p-[8px_16px] text-[12px] rounded-[8px] font-bold border-b-[4px] border-[#3eb5ad] active:border-b-0 active:translate-y-[4px] transition-all">Tambah</button>
      </div>
      <div className="space-y-[8px]">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-[10px] bg-white rounded-[12px] border-2 border-[#F1F5F9] border-b-[4px]">
            <div>
              <div className="text-[12px] font-bold">{member.name}</div>
              <div className="text-[10px] opacity-70">{member.waNumber || '-'}</div>
            </div>
            <div className="flex gap-[8px]">
              <button className="text-[10px] text-[#4ECDC4] bg-[#4ECDC4]/10 p-[4px_8px] rounded-[6px] border-b-[2px] border-[#4ECDC4]/30 active:border-b-0 active:translate-y-[2px] transition-all">Edit</button>
              <button onClick={() => deleteMember(member.id)} className="text-[10px] text-[#FF6B6B] bg-[#FF6B6B]/10 p-[4px_8px] rounded-[6px] border-b-[2px] border-[#FF6B6B]/30 active:border-b-0 active:translate-y-[2px] transition-all">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
