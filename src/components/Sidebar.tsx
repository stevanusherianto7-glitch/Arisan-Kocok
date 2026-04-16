import { MENU_ITEMS } from '../constants';

interface Props {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export default function Sidebar({ activeMenu, setActiveMenu }: Props) {
  return (
    <div className="hidden md:flex w-[200px] flex-col border-r border-white/10 bg-white/5 p-[20px]">
      <div className="mb-[30px] flex items-center gap-[8px] text-[20px] font-extrabold text-[#FF6B6B]">
        <span>Arisan IndoVWT</span>
      </div>
      {MENU_ITEMS.map((item) => (
        <div
          key={item.name}
          onClick={() => setActiveMenu(item.name)}
          className={`mb-[8px] flex cursor-pointer items-center gap-[10px] rounded-[8px] p-[8px_12px] text-[14px] font-semibold transition-colors ${
            activeMenu === item.name ? 'bg-[#FF6B6B] text-white' : 'hover:bg-white/5'
          }`}
        >
          <span className="flex items-center justify-center w-[24px] h-[24px] text-[20px]">{item.icon}</span>
          {item.name}
        </div>
      ))}
    </div>
  );
}
