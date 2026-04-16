import { useState, useEffect, useRef } from 'react';
import { Member, WinnerHistoryItem } from '../types';
import confetti from 'canvas-confetti';
import { supabase, hasSupabase } from '../lib/supabase';

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
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembersState] = useState<Member[]>(INITIAL_MEMBERS);
  const [winner, setWinnerState] = useState<string | null>(null);
  const [winnerHistory, setWinnerHistoryState] = useState<WinnerHistoryItem[]>([]);
  const [arisanAmount, setArisanAmountState] = useState<number>(100000);
  const [audioUrl, setAudioUrlState] = useState('');
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [timer, setTimer] = useState(10);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isHydrated = useRef(false);

  // --- HYDRATION & MIGRATION ON MOUNT ---
  useEffect(() => {
    let isMounted = true;
    const initData = async () => {
      if (!hasSupabase) {
        console.log('No Supabase credentials. Falling back to LocalStorage.');
        const savedMembers = localStorage.getItem('arisan_members');
        if (savedMembers) setMembersState(JSON.parse(savedMembers));

        const savedWinner = localStorage.getItem('arisan_winner');
        if (savedWinner) setWinnerState(savedWinner);

        const savedHistory = localStorage.getItem('arisan_history');
        if (savedHistory) setWinnerHistoryState(JSON.parse(savedHistory).map((item: any) => ({ ...item, date: new Date(item.date) })));

        const savedAmt = localStorage.getItem('arisan_amount');
        if (savedAmt) setArisanAmountState(Number(savedAmt));

        const savedAudio = localStorage.getItem('arisan_audio');
        if (savedAudio) setAudioUrlState(savedAudio);

        if (isMounted) {
          isHydrated.current = true;
          setIsLoading(false);
        }
        return;
      }

      try {
        console.log('Connecting to Supabase...');
        const { data: migFlag } = await supabase.from('settings').select('value').eq('key', 'is_migrated').single();
        
        if (!migFlag || migFlag.value !== 'true') {
          console.log('Migrating local data to Supabase...');
          
          const lsMembers = localStorage.getItem('arisan_members');
          const arrMembers: Member[] = lsMembers ? JSON.parse(lsMembers) : INITIAL_MEMBERS;
          const memberPayload = arrMembers.map(m => ({ id: m.id, name: m.name, status: m.status, color: m.color, wa_number: m.waNumber }));
          if (memberPayload.length) await supabase.from('members').upsert(memberPayload);

          const lsHistory = localStorage.getItem('arisan_history');
          const arrHistory: WinnerHistoryItem[] = lsHistory ? JSON.parse(lsHistory) : [];
          const historyPayload = arrHistory.map(h => ({ member_id: h.id, name: h.name, win_date: new Date(h.date).toISOString() }));
          if (historyPayload.length) await supabase.from('winner_history').insert(historyPayload);

          const saves = [
            { key: 'arisan_winner', value: localStorage.getItem('arisan_winner') || '' },
            { key: 'arisan_amount', value: localStorage.getItem('arisan_amount') || '100000' },
            { key: 'arisan_audio', value: localStorage.getItem('arisan_audio') || '' },
            { key: 'is_migrated', value: 'true' }
          ];
          await supabase.from('settings').upsert(saves);
        }

        console.log('Fetching Latest Data from Supabase...');
        const [memRes, histRes, setRes] = await Promise.all([
          supabase.from('members').select('*').order('id', { ascending: true }),
          supabase.from('winner_history').select('*').order('win_date', { ascending: false }),
          supabase.from('settings').select('*')
        ]);

        if (memRes.data && memRes.data.length > 0 && isMounted) {
          setMembersState(memRes.data.map((d: any) => ({ 
            id: Number(d.id), name: d.name, status: d.status, color: d.color, waNumber: d.wa_number || '' 
          })));
        }
        if (histRes.data && isMounted) {
          setWinnerHistoryState(histRes.data.map((d: any) => ({ 
            id: Number(d.member_id), name: d.name, date: new Date(d.win_date) 
          })));
        }
        if (setRes.data && isMounted) {
          const sMap: any = {};
          setRes.data.forEach((r: any) => { sMap[r.key] = r.value; });
          if (sMap.arisan_winner) setWinnerState(sMap.arisan_winner);
          if (sMap.arisan_amount) setArisanAmountState(Number(sMap.arisan_amount));
          if (sMap.arisan_audio) setAudioUrlState(sMap.arisan_audio);
        }

      } catch (e) {
        console.error('Supabase Init Error:', e);
      } finally {
        if (isMounted) {
          isHydrated.current = true;
          setIsLoading(false);
        }
      }
    };
    initData();
    return () => { isMounted = false; };
  }, []);

  // --- CUSTOM STATE WRAPPERS (Syncs locally or to DB) ---
  const setMembers = async (val: Member[] | ((prev: Member[]) => Member[])) => {
    const next = typeof val === 'function' ? val(members) : val;
    setMembersState(next);
    
    if (!hasSupabase) {
      localStorage.setItem('arisan_members', JSON.stringify(next));
      return;
    }

    try {
      const upsertData = next.map(m => ({ id: m.id, name: m.name, status: m.status, color: m.color, wa_number: m.waNumber }));
      if (upsertData.length > 0) await supabase.from('members').upsert(upsertData);
      
      const ids = next.map(m => m.id);
      if (ids.length > 0) {
         await supabase.from('members').delete().not('id', 'in', `(${ids.join(',')})`);
      } else {
         await supabase.from('members').delete().gt('id', 0);
      }
    } catch(e) { console.error(e) }
  };

  const setWinner = async (val: string | null | ((prev: string | null) => string | null)) => {
    const next = typeof val === 'function' ? val(winner) : val;
    setWinnerState(next);
    if (!hasSupabase) localStorage.setItem('arisan_winner', next || '');
    else supabase.from('settings').upsert({ key: 'arisan_winner', value: next || '' }).then();
  };

  const setArisanAmount = async (val: number | ((prev: number) => number)) => {
    const next = typeof val === 'function' ? val(arisanAmount) : val;
    setArisanAmountState(next);
    if (!hasSupabase) localStorage.setItem('arisan_amount', next.toString());
    else supabase.from('settings').upsert({ key: 'arisan_amount', value: next.toString() }).then();
  };

  const setAudioUrl = async (val: string | ((prev: string) => string)) => {
    const next = typeof val === 'function' ? val(audioUrl) : val;
    setAudioUrlState(next);
    if (!hasSupabase) localStorage.setItem('arisan_audio', next);
    else supabase.from('settings').upsert({ key: 'arisan_audio', value: next }).then();
  };

  const setWinnerHistory = async (val: WinnerHistoryItem[] | ((prev: WinnerHistoryItem[]) => WinnerHistoryItem[])) => {
    const next = typeof val === 'function' ? val(winnerHistory) : val;
    setWinnerHistoryState(next);
    
    if (!hasSupabase) {
       localStorage.setItem('arisan_history', JSON.stringify(next));
       return;
    }

    try {
      if (next.length === 0) {
         await supabase.from('winner_history').delete().gt('id', 0);
      } else {
         await supabase.from('winner_history').delete().gt('id', 0);
         const inserts = next.map(h => ({ member_id: h.id, name: h.name, win_date: h.date.toISOString() }));
         await supabase.from('winner_history').insert(inserts);
      }
    } catch (e) {
      console.error('History sync err', e);
    }
  };

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
    isLoading,
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
