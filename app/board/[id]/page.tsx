'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, SearchBar, Progress, DatePicker } from '@/components/ui';
import styles from './page.module.scss';
import BoardItem from '../../../features/board/board-item';
import { ArrowLeftSquareIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface BoardData {
  id: number; //board만의 id
  title: string;
  from_date: Date;
  to_date: Date;
  contents: string;
  is_checked: boolean;
  todo_id: number;
}

function BoardPage() {
  const router = useRouter();

  const params = useParams();
  const tid = params.id;

  const [items, setItems] = React.useState<BoardData[]>([]);
  const [todoTitle, setTodoTitle] = React.useState<string>('');

  React.useEffect(() => {
    getBoards();
    getTodoTitle();
  }, [tid]);

  async function getBoards() {
    const { data } = await supabase.from('boards').select().eq('todo_id', tid);
    setItems(data || []);
  }

  async function getTodoTitle() {
    const { data } = await supabase.from('todos').select().eq('id', tid).single();
    setTodoTitle(data?.title || '');
  }

  const handleTodoTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
  };

  const saveTodoTitle = async () => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ title: todoTitle })
        .eq('id', tid);

      if (error) throw error;

      console.log('Todo title updated successfully');
    } catch (error) {
      console.error('Error updating todo title:', error);
    }
  };

  const addBoard = async () => {
    try {
      const { data, error } = await supabase
        .from('boards')
        .insert({
          title: '보드',
          from_date: new Date(),
          to_date: new Date(),
          contents: 'dd',
          is_checked: false,
          todo_id: tid
        }).select();

        if(data) {
          console.log(data);
          getBoards();
        }

    } catch (error) {
      console.error('board insert 오류: ' + error);
    }
  
  };

  const backHome = () => {
    router.push('/');
  }

  return (
    <div className="page">
      <aside className="page__aside">
        <SearchBar placeholder="검색어를 입력하세요"></SearchBar>
        <Button
          className="text-[#E79057] bg-white border border-[#E79057] hover:bg-[#ffb235]"
          onClick={() => router.push('/board/..')}
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
            <div className="flex gap-2">
              <Button className="w-5 h-10 bg-slate-300" onClick={backHome}>
                <ArrowLeftSquareIcon />
              </Button>
              <Button className="w-12 h-10 " onClick={saveTodoTitle}>저장</Button>
            </div>
            <input
              type="text"
              placeholder="Enter title here!"
              className={styles.header__top__input}
              value={todoTitle}
              onChange={handleTodoTitleChange}
            ></input>
            <div className="flex items-center justify-start gap-4">
              <small className="text-sm font-medium leading-none text-[#A6A6A6] mx-0">
                0/0 Completed
              </small>
              <Progress className="w-60 h-[10px]" value={33}></Progress>
            </div>
          </div>
          <div className={styles.header__bottom}>
            <div className="flex items-center gap-3">
              <DatePicker label="From" />
              <DatePicker label="To" />
              <Button className="bg-gray-200 text-gray-500">
                View Timeline
              </Button>
            </div>
            <Button
              className="bg-[#ea8628] border border-[#E79057] hover:bg-[#ffb235]"
              onClick={addBoard}
            >
              Add New Board
            </Button>
          </div>
        </div>
        <div className={styles.area}>
          {items.length > 0 ? (
            items.map((item) => <BoardItem key={item.id} data={item} />)
          ) : (
            <p>There is no board yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default BoardPage;
