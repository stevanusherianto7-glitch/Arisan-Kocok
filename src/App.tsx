import { useState } from 'react';
import { useArisan } from './hooks/useArisan';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import SisaModal from './components/SisaModal';
import Beranda from './pages/Beranda';
import Peserta from './pages/Peserta';
import StatusIuran from './pages/StatusIuran';
import Pengaturan from './pages/Pengaturan';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('Beranda');
  const [showSisaModal, setShowSisaModal] = useState(false);
  
  const session = useArisan();

  const renderContent = () => {
    switch (activeMenu) {
      case 'Beranda':
        return (
          <Beranda 
            isSpinning={session.isSpinning}
            timer={session.timer}
            members={session.members}
            arisanAmount={session.arisanAmount}
            winner={session.winner}
            winnerHistory={session.winnerHistory}
            setShowSisaModal={setShowSisaModal}
            getSisaMembers={session.getSisaMembers}
            getDaysLeft={session.getDaysLeft}
          />
        );
      case 'Peserta':
        return <Peserta members={session.members} setMembers={session.setMembers} />;
      case 'Status Iuran':
        return <StatusIuran members={session.members} setMembers={session.setMembers} arisanAmount={session.arisanAmount} />;
      case 'Pengaturan':
        return <Pengaturan arisanAmount={session.arisanAmount} setArisanAmount={session.setArisanAmount} audioUrl={session.audioUrl} setAudioUrl={session.setAudioUrl} />;
      default:
        return (
          <div className="md:col-span-2 flex h-full items-center justify-center rounded-[24px] bg-white/5 text-[24px] font-bold">
            Halaman {activeMenu} belum tersedia.
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#2F2FA2] font-sans text-[#F7FFF7]">
      {session.audioUrl && <audio ref={session.audioRef} src={session.audioUrl} />}
      
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <div className="flex flex-1 flex-col overflow-y-auto relative">
        <div className="flex flex-col gap-[16px] p-[16px] pb-[80px] md:pb-[16px]">
          <Header 
            winnerHistoryLength={session.winnerHistory.length} 
            handleReset={session.handleReset}
            handleKocok={session.handleKocok}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            {renderContent()}
          </div>
        </div>
      </div>

      <BottomNav activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <SisaModal 
        showModal={showSisaModal} 
        setShowModal={setShowSisaModal} 
        sisaMembers={session.getSisaMembers()} 
      />
    </div>
  );
}
