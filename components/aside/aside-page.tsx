'use client';

import React from 'react';
import { Button, SearchBar } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCreateTodo, useGetTodos } from '@/hooks/api/supabase';
import { supabase } from '@/lib/supabase';
import { toast} from '@/hooks/use-toast';
import { NavUser } from './nav-user';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/stores/atom';

function AsidePage() {
  const user = useAtomValue(userAtom); //read

  const router = useRouter();
  const createPage = useCreateTodo();

  const { todos,setTodos, getTodos } = useGetTodos();

  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      try {
        const { data, status, error } = await supabase
          .from('todos')
          .select('*')
          .eq('user_id', user?.id)
          .ilike('title', `%${searchTerm}%`);
          
        console.log(data);

        if (data && data.length>0 && status === 200) {
          setTodos(data);
          toast({
            title: '검색.',
            description: '해당 검색어가 포함된 TODO를 호출했습니다.',
          });
        } else {
          setTodos([]);
          toast({
            title: '데이터 없음',
            description: '해당 검색어가 포함된 TODO가 없습니다.',
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
    }
  };

  useEffect(() => {
    getTodos();
  }, [getTodos]); 
  /* getTodo넣으면 검색X
  setTodo, Todo 넣으면 검색O 새로고침하면 Todo 안나타남*/

  return (
    <aside className="page__aside">
      <SearchBar
        placeholder="검색어를 입력하세요"
        onChange={(event) => setSearchTerm(event.target.value)}
        onKeyDown={handleSearch}
      />
      <Button
        className="text-[#E79057] bg-white border border-[#E79057] hover:bg-[#ffb235]"
        onClick={createPage}
      >
        Add New Page
      </Button>
      {/**TODO List */}
      <div className="flex flex-col mt-4 gap-2 mx-0">
        <small className="text-sm font-medium leading-none text-[#A6A6A6] mx-0">
          {`${user?.name}의 TODO-BOARD`}
        </small>
        <ul className="flex flex-col mt-2 bg-[#f5f5f5] rounded-sm text-sm">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-2 py-2 px-[10px] ml-0"
                onClick={() => router.push(`/board/${todo.id}`)}
              >
                <div className="h-[10px] w-[10px] bg-[#00f38d]"></div>
                <p>{todo.title ? todo.title : '제목을 입력해주세요.'}</p>
              </li>
            ))
          ) : (
            <li className="py-2 px-[10px] flex items-center gap-2">
              <div className="h-[10px] w-[10px] bg-[#979897]"></div>
              <p className='text-[#979897]'>등록한 TODO가 없습니다.</p>
            </li>
          )}
        </ul>
      </div>
      <NavUser user={user} />
    </aside>
  );
}

export { AsidePage };
