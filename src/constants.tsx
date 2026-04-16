import { User, Home, FileCheck, Settings } from 'lucide-react';

export const MENU_ITEMS = [
  { name: 'Beranda', icon: <Home className="w-5 h-5" /> },
  { name: 'Peserta', icon: <User className="w-5 h-5" /> },
  { name: 'Status Iuran', icon: <FileCheck className="w-5 h-5" /> },
  { name: 'Pengaturan', icon: <Settings className="w-5 h-5" /> },
];
