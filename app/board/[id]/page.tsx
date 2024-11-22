'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, SearchBar, Progress, DatePicker } from '@/components/ui';
import styles from './page.module.scss';
import BoardItem from '../../../features/board/board-item';
import { ArrowLeftSquareIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AsidePage from '@/features/aside/aside-page';

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
  const [todoStartDate, setTodoStartDate] = React.useState<Date>(new Date());
  const [todoEndDate, setTodoEndDate] = React.useState<Date>(new Date());

  React.useEffect(() => {
    getBoards();
    getTodoTitleAndDate();
  }, [tid]);

  async function getBoards() {
    const { data } = await supabase.from('boards').select().eq('todo_id', tid);
    setItems(data || []);
  }

  const addBoard = async () => {
    try {
      const { data, error } = await supabase
        .from('boards')
        .insert({
          title: '제목없음',
          from_date: new Date(),
          to_date: new Date(),
          contents: '',
          is_checked: false,
          todo_id: tid,
        })
        .select();

      if (data) {
        console.log(data);
        getBoards();
      }
    } catch (error) {
      console.error('board insert 오류: ' + error);
    }
  };

  /*const handleBoardChange = (id: number, updatedBoard: Partial<BoardData>) => {
    setItems(prevItems => prevItems.map(item => item.id === id ? {...item, ...updatedBoard} : item));
  }*/

  const handleBoardChange = (changeId: number, changeCheckedValue: boolean) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === changeId
          ? { ...item, is_checked: changeCheckedValue }
          : item
      )
    );
  };

  const updateBoardChange = async () => {
    try {
      const board = items.find((item) => item.todo_id === Number(tid));
      if(!board) return;

      const { error } = await supabase.from('boards').update(board).eq('id', board.id);
      if (error) throw error;
      console.log('update board!');
    } catch (error) {
      console.error('updating board error: ' + error);
    }
  };

  const handleDelete = (id: number) => {
    //UI업데이트
    setItems((prevItem) => prevItem.filter((item) => item.id !== id));
  };

  async function getTodoTitleAndDate() {
    const { data } = await supabase
      .from('todos')
      .select()
      .eq('id', tid)
      .single();

    setTodoTitle(data?.title || '');
    setTodoStartDate(data?.from_date || null);
    setTodoEndDate(data?.to_date || null);
  }

  const handleTodoTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
  };

  const updateTodoTitleAndDate = async () => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ title: todoTitle, from_date: todoStartDate, to_date: todoEndDate})
        .eq('id', tid);

      if (error) throw error;

      console.log('Todo title updated successfully');

      //re-rendering
      setTodoTitle(todoTitle);
      setTodoStartDate(todoStartDate);
      setTodoEndDate(todoEndDate);
    } catch (error) {
      console.error('Error updating todo title:', error);
    }
  };

  const saveChange = async () => {
    await updateTodoTitleAndDate();
    await updateBoardChange();
  };

  const backHome = () => {
    router.push('/');
  };

  return (
    <div className="page">
      <AsidePage/>
      <main className="page__main">
        <div className={styles.header}>
          <div className={styles.header__top}>
            <div className="flex gap-2">
              <Button className="w-5 h-10 bg-slate-300" onClick={backHome}>
                <ArrowLeftSquareIcon />
              </Button>
              <Button className="w-12 h-10 " onClick={saveChange}>
                저장
              </Button>
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
              <DatePicker label="From" isReadOnly={false} value={todoStartDate} onSetDate={() => setTodoStartDate(todoStartDate)}/>
              <DatePicker label="To" isReadOnly={false} value={todoEndDate} onSetDate={() => setTodoEndDate(todoEndDate)} />
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
            items.map((item) => (
              <BoardItem
                key={item.id}
                data={item}
                onDelete={handleDelete}
                onChange={handleBoardChange}
              />
            ))
          ) : (
            <p>There is no board yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default BoardPage;
