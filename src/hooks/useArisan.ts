import { useState, useEffect, useRef } from 'react';
import { Member, WinnerHistoryItem } from '../types';
import confetti from 'canvas-confetti';

const INITIAL_MEMBERS: Member[] = [
  { id: 1, name: 'ALBY', status: 'PENDING', color: '#FF6B6B', waNumber: '' },
  { id: 2, name: 'AMES', status: 'PENDING', color: '#4ECDC4', waNumber: '' },
  { id: 3, name: 'AMIN', status: 'PENDING', color: '#45B7D1', waNumber: '' },
  { id: 4, name: 'AZAM', status: 'PENDING', color: '#96CEB4', waNumber: '' },
  { id: 5, name: 'BERGAWA', status: 'PENDING', color: '#FFEEAD', waNumber: '' },
  { id: 6, name: 'DEDE', status: 'PENDING', color: '#D4A5A5', waNumber: '' },
  { id: 7, name: 'DHINDA', status: 'PENDING', color: '#9B59B6', waNumber: '' },
  { id: 8, name: 'EAYAD BACHTIAR', status: 'PENDING', color: '#3498DB', waNumber: '' },
  { id: 9, name: 'ESAL', status: 'PENDING', color: '#E67E22', waNumber: '' },
  { id: 10, name: 'EZHAL', status: 'PENDING', color: '#2ECC71', waNumber: '' },
  { id: 11, name: 'EZHAL NAOMI', status: 'PENDING', color: '#F1C40F', waNumber: '' },
  { id: 12, name: 'FARMOZA', status: 'PENDING', color: '#E74C3C', waNumber: '' },
  { id: 13, name: 'FERIL', status: 'PENDING', color: '#1ABC9C', waNumber: '' },
  { id: 14, name: 'FORMOZA', status: 'PENDING', color: '#8E44AD', waNumber: '' },
  { id: 15, name: 'FORMOZA', status: 'PENDING', color: '#2980B9', waNumber: '' },
  { id: 16, name: 'FORMOZA', status: 'PENDING', color: '#D35400', waNumber: '' },
  { id: 17, name: 'FORMOZA', status: 'PENDING', color: '#27AE60', waNumber: '' },
  { id: 18, name: 'MARIYAH', status: 'PENDING', color: '#F39C12', waNumber: '' },
  { id: 19, name: 'MAY', status: 'PENDING', color: '#C0392B', waNumber: '' },
  { id: 20, name: 'MESYA', status: 'PENDING', color: '#16A085', waNumber: '' },
  { id: 21, name: 'MHEY MHEY', status: 'PENDING', color: '#8E44AD', waNumber: '' },
  { id: 22, name: 'MIKHA', status: 'PENDING', color: '#2980B9', waNumber: '' },
  { id: 23, name: 'NAOMI', status: 'PENDING', color: '#D35400', waNumber: '' },
  { id: 24, name: 'NAOMI2', status: 'PENDING', color: '#27AE60', waNumber: '' },
  { id: 25, name: 'NARA', status: 'PENDING', color: '#F39C12', waNumber: '' },
  { id: 26, name: 'NAYA', status: 'PENDING', color: '#C0392B', waNumber: '' },
  { id: 27, name: 'QUEEN', status: 'PENDING', color: '#16A085', waNumber: '' },
  { id: 28, name: 'REZA', status: 'PENDING', color: '#8E44AD', waNumber: '' },
  { id: 29, name: 'ZHIZI', status: 'PENDING', color: '#2980B9', waNumber: '' },
];

export const useArisan = () => {
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('arisan_members');
    if (saved) return JSON.parse(saved);
    return INITIAL_MEMBERS;
  });

  const [winner, setWinner] = useState<string | null>(() => {
    return localStorage.getItem('arisan_winner');
  });

  const [winnerHistory, setWinnerHistory] = useState<WinnerHistoryItem[]>(() => {
    const saved = localStorage.getItem('arisan_history');
    if (saved) {
      return JSON.parse(saved).map((item: any) => ({ ...item, date: new Date(item.date) }));
    }
    return [];
  });

  const [arisanAmount, setArisanAmount] = useState<number>(() => {
    const saved = localStorage.getItem('arisan_amount');
    return saved ? Number(saved) : 100000;
  });

  const [isSpinning, setIsSpinning] = useState(false);
  const [timer, setTimer] = useState(10);
  const [audioUrl, setAudioUrl] = useState(() => {
    return localStorage.getItem('arisan_audio') || '';
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    localStorage.setItem('arisan_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    if (winner) localStorage.setItem('arisan_winner', winner);
  }, [winner]);

  useEffect(() => {
    localStorage.setItem('arisan_history', JSON.stringify(winnerHistory));
  }, [winnerHistory]);

  useEffect(() => {
    localStorage.setItem('arisan_amount', arisanAmount.toString());
  }, [arisanAmount]);

  const getDaysLeft = () => {
    if (winnerHistory.length === 0) return 'Siap';
    const lastDate = new Date(winnerHistory[0].date);
    const nextDate = new Date(lastDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Hari Ini';
    return `H-${diffDays}`;
  };

  const getSisaMembers = () => {
    return members.filter(m => !winnerHistory.some(w => w.id === m.id || (!w.id && w.name === m.name)));
  };

  const handleReset = () => {
    if (window.confirm("Apakah Anda yakin ingin mereset riwayat pemenang? Data pemenang dan putaran akan dikembalikan ke awal agar aplikasi siap digunakan untuk periode arisan berikutnya. Data seluruh peserta akan tetap dipertahankan.")) {
      setWinnerHistory([]);
      setWinner(null);
    }
  };

  const handleKocok = () => {
    const sisaMembers = getSisaMembers();
    const eligibleMembers = sisaMembers.filter(m => m.status === 'LUNAS');
    
    if (eligibleMembers.length === 0) {
      alert('Tidak ada sisa anggota yang belum menang dan memenuhi syarat (LUNAS) untuk dikocok.');
      return;
    }

    let spinDuration = 10;
    if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration) && audioRef.current.duration !== Infinity) {
      spinDuration = Math.ceil(audioRef.current.duration);
    }

    setIsSpinning(true);
    setTimer(spinDuration);
    
    if (audioRef.current && audioUrl) {
      audioRef.current.play().catch(e => {
        console.error("Audio play failed:", e);
      });
    }
    
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    
    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      const randomIndex = Math.floor(Math.random() * eligibleMembers.length);
      const winningMember = eligibleMembers[randomIndex];
      const newWinnerName = winningMember.name;
      setWinner(newWinnerName);
      setWinnerHistory(prev => [{ id: winningMember.id, name: newWinnerName, date: new Date() }, ...prev]);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      alert(`Selamat! Pemenang arisan putaran ini adalah: ${newWinnerName}`);
    }, spinDuration * 1000);
  };

  return {
    members, setMembers,
    winner, setWinner,
    winnerHistory, setWinnerHistory,
    arisanAmount, setArisanAmount,
    isSpinning, timer,
    audioUrl, setAudioUrl, audioRef,
    getDaysLeft, getSisaMembers,
    handleReset, handleKocok
  };
};
