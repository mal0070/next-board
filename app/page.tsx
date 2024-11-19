import { Button, SearchBar } from '@/components/ui';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="page">
      <aside className="page__aside">
        <SearchBar placeholder="검색어를 입력하세요"></SearchBar>
        <Button className="text-[#E79057] bg-white border border-[#E79057] hover:bg-[#ffb235]">
          Add New Page
        </Button>
        {/**TODO List */}
        <div className="flex flex-col mt-4 gap-2 mx-0">
          <small className="text-sm font-medium leading-none text-[#A6A6A6] mx-0">
            민아의 TODO-BOARD
          </small>
          <ul className="flex flex-col mt-2 bg-[#f5f5f5] rounded-sm">
            <li className="flex items-center gap-2 py-2 px-[10px] ml-0">
              <div className="h-[10px] w-[10px] bg-[#00f38d]"></div>
              <p>Enter Title</p>
            </li>
            <li className="py-2 px-[10px]">Enter Title</li>
          </ul>
        </div>
      </aside>
      <main className="page__main"></main>
    </div>
  );
}
