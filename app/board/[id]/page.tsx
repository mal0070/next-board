'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Progress, DatePicker } from '@/components/ui';
import styles from './page.module.scss';
import BoardItem from '../../../features/board/board-item';
import { ArrowLeftSquareIcon, PlusCircleIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AsidePage from '@/features/aside/aside-page';
import { useToast } from '@/hooks/use-toast';
import { Board } from '@/types';

function BoardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const params = useParams();
  const tid = params.id;

  const [boards, setBoards] = React.useState<Board[]>([]);
  const [todoTitle, setTodoTitle] = React.useState<string>('');
  const [todoStartDate, setTodoStartDate] = React.useState<Date>();
  const [todoEndDate, setTodoEndDate] = React.useState<Date>();
  const [progress, setProgress] = React.useState<number>(0);

  React.useEffect(() => {
    getBoards();
    getTodoTitleAndDate();
  }, [tid]);

  async function deleteTodo() {
    if (confirm('이 TODO 페이지를 삭제하시겠습니까?') === true) {
      try {
        const { data } = await supabase
          .from('boards')
          .delete()
          .eq('todo_id', tid);
        const { error } = await supabase
          .from('todos')
          .delete()
          .eq('id', tid)
          .select();

        router.push('/');
        toast({
          variant: 'default',
          title: '해당 TODO 삭제를 완료했습니다.',
          description: '새로운 TODO가 생기면 언제든 추가해주세요!',
        });

        if (error) {
          toast({
            variant: 'destructive',
            title: '에러가 발생했습니다.',
            description: `Supabase 오류: ${error.message || '알 수 없는 오류'}`,
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: '네트워크 오류',
          description: '서버와 연결할 수 없습니다. 다시 시도해주세요.',
        });
      }
    }
  }

  async function getBoards() {
    const { data } = await supabase.from('boards').select().eq('todo_id', tid);
    setBoards(data || []);

    let count = 0;
    data?.forEach((i) => (i.is_checked ? count++ : 0));
    setProgress(count);
  }



  

  const createBoard = async () => {
    try {
      const { data, error } = await supabase
        .from('boards')
        .insert({
          title: '제목을 입력해주세요.',
          is_checked: false,
          todo_id: tid,
        })
        .select();

      if (data) {
        setBoards(prevBoards => [...prevBoards, ...data]);
        toast({
          title: '새로운 TODO-BOARD를 생성했습니다.',
          description: '생성한 BOARD를 예쁘게 꾸며주세요!',
        });
      }
      if (error) {
        toast({
          variant: 'destructive',
          title: '에러가 발생했습니다.',
          description: `Supabase 오류: ${error.message || '알 수 없는 오류'}`,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '네트워크 오류',
        description: '서버와 연결할 수 없습니다. 다시 시도해주세요.',
      });
    }
  };

  const handleBoardChange = React.useCallback((changedBoardData: Board) => {
    setBoards((prevItems) =>
      prevItems.map((item) =>
        item.id === changedBoardData.id ? changedBoardData : item
      )
    );
  }, []);

  const updateBoardChange = async () => {
    try {
      const board = boards.find((item) => item.todo_id === Number(tid));
      if (!board) return;

      const { data, error } = await supabase
        .from('boards')
        .update(board)
        .eq('id', board.id);

      if (data) {
        setBoards(data);
        toast({
          title: '보드가 업데이트되었습니다.',
          description: '변경사항이 성공적으로 저장되었습니다.',
        });
      }

      if (error) {
        toast({
          variant: 'destructive',
          title: '에러가 발생했습니다.',
          description: `Supabase 오류: ${error.message || '알 수 없는 오류'}`,
        });
      }

    } catch (error) {
      toast({
        variant: 'destructive',
        title: '네트워크 오류',
        description: '서버와 연결할 수 없습니다. 다시 시도해주세요.',
      });
    }
  };

  const handleDelete = (id: number) => {
    //UI업데이트
    setBoards((prevItem) => prevItem.filter((item) => item.id !== id));
    toast({
      title: '선택하신 TODO-BOARD가 삭제되었습니다.',
      description:
        "새로운 TODO-BOARD를 생성하려면 'Add New Board' 버튼을 눌러주세요!",
    });
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
        .update({
          title: todoTitle,
          from_date: todoStartDate,
          to_date: todoEndDate,
        })
        .eq('id', tid);

      if (error) throw error;

      toast({
        title: 'TODO-LIST 수정을 완료하였습니다.',
        description: '수정한 TODO-LIST의 마감일을 꼭 지켜주세요!',
      });

      //re-rendering
      setTodoTitle(todoTitle);
      setTodoStartDate(todoStartDate);
      setTodoEndDate(todoEndDate);
    } catch (error) {
      console.error('Error updating todo title:', error);
    }
  };

  const saveChange = async () => {
    if (!todoTitle || !todoStartDate || !todoEndDate) {
      toast({
        variant: 'destructive',
        title: '기입되지 않은 데이터(값)가 있습니다.',
        description: '수정한 TODO-LIST의 마감일을 꼭 지켜주세요!',
      });
      return;
    }
    await updateTodoTitleAndDate();
    await updateBoardChange();
  };

  const backHome = () => {
    router.push('/');
  };

  return (
    <div className="page">
      <AsidePage />
      <main className="page__main">
        <div className={styles.header}>
          <div className={styles.header__top}>
            <div className="flex justify-between">
                <ArrowLeftSquareIcon className="w-10 h-10" onClick={backHome}/>
              <div className="flex gap-2">
                <Button className="w-14 h-10 " onClick={saveChange}>
                  저장
                </Button>
                <Button className="w-14 h-10 bg-red-400 text-red-800" onClick={deleteTodo}>
                  삭제
                </Button>
              </div>
            </div>
            <input
              type="text"
              placeholder="Enter title here!"
              className={styles.header__top__input}
              value={todoTitle}
              onChange={handleTodoTitleChange}
            ></input>
            <div className="flex boards-center justify-start gap-4">
              <small className="text-sm font-medium leading-none text-[#A6A6A6] mx-0">
                {progress}/{boards.length} Completed
              </small>
              <Progress
                className="w-60 h-[10px]"
                value={progress}
                max={boards.length}
              ></Progress>
            </div>
          </div>
          <div className={styles.header__bottom}>
            <div className="flex boards-center gap-3">
              <DatePicker
                label="From"
                isReadOnly={false}
                value={todoStartDate}
                onSetDate={(date) => setTodoStartDate(date)}
              />
              <DatePicker
                label="To"
                isReadOnly={false}
                value={todoEndDate}
                onSetDate={(date) => setTodoEndDate(date)}
              />
              <Button className="bg-gray-200 text-gray-500">
                View Timeline
              </Button>
            </div>
            <Button
              className="bg-[#ea8628] border border-[#E79057] hover:bg-[#ffb235]"
              onClick={createBoard}
            >
              Add New Board
            </Button>
          </div>
        </div>
        <div className={styles.area}>
          {boards.length > 0 ? (
            boards.map((item) => (
              <BoardItem
                key={item.id}
                data={item}
                onDelete={handleDelete}
                onChange={handleBoardChange}
              />
            ))
          ) : (
            <div className="flex flex-col boards-center gap-4">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                There is no board yet.
              </h3>
              <PlusCircleIcon
                className="w-14 h-14"
                onClick={createBoard}
              ></PlusCircleIcon>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default BoardPage;
