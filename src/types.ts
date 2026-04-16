export interface Member {
  id: number;
  name: string;
  status: 'LUNAS' | 'PENDING';
  color: string;
  waNumber: string;
}

export interface WinnerHistoryItem {
  id?: number;
  name: string;
  date: Date;
}
