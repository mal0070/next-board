'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  Button,
  SearchBar,
  Progress,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
} from '@/components/ui';
import styles from './page.module.scss';

function BoardPage() {
  const router = useRouter();

  const [date, setDate] = React.useState<Date>();

  return (
    <div className="page">
      <aside className="page__aside">
        <SearchBar placeholder="검색어를 입력하세요"></SearchBar>
        <Button
          className="text-[#E79057] bg-white border border-[#E79057] hover:bg-[#ffb235]"
          onClick={() => router.push('/board/1')}
        >
          Add New Page
        </Button>
        {/**TODO List */}
        <div className="flex flex-col mt-4 gap-2 mx-0">
          <small className="text-sm font-medium leading-none text-[#A6A6A6] mx-0">
            민아의 TODO-BOARD
          </small>
          <ul className="flex flex-col mt-2 bg-[#f5f5f5] rounded-sm text-sm">
            <li className="flex items-center gap-2 py-2 px-[10px] ml-0">
              <div className="h-[10px] w-[10px] bg-[#00f38d]"></div>
              <p>Enter Title</p>
            </li>
            <li className="py-2 px-[10px]">Enter Title</li>
          </ul>
        </div>
      </aside>
      <main className="page__main">
        <div className={styles.header}>
          <div className={styles.header__top}>
            <input
              type="text"
              placeholder="Enter title here!"
              className={styles.header__top__input}
            ></input>
            <div className="flex items-center justify-start gap-4">
              <small className="text-sm font-medium leading-none text-[#A6A6A6] mx-0">
                0/0 Completed
              </small>
              <Progress className="w-60 h-[10px]" value={33}></Progress>
            </div>
          </div>
          <div className={styles.header__bottom}>
            <div className="flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[280px] justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button className='bg-[#ea8628] border border-[#E79057] hover:bg-[#ffb235]'>Add New Board</Button>
          </div>
        </div>
        <div className={styles.body}></div>
      </main>
    </div>
  );
}

export default BoardPage;
