import { MENU_ITEMS } from '../constants';

interface Props {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export default function BottomNav({ activeMenu, setActiveMenu }: Props) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around bg-[#2F2FA2] border-t border-white/10 p-[10px] z-10">
      {MENU_ITEMS.map((item) => (
        <div
          key={item.name}
          onClick={() => setActiveMenu(item.name)}
          className={`flex flex-col items-center gap-[5px] p-[5px] text-[10px] font-semibold ${
            activeMenu === item.name ? 'text-[#FF6B6B]' : 'text-[#F7FFF7]/70'
          }`}
        >
          <span className="flex items-center justify-center h-[24px] text-[20px]">{item.icon}</span>
          {item.name}
        </div>
      ))}
    </div>
  );
}
