import React from 'react';
import { Button, SearchBar } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCreateTodo, useGetTodos } from '@/hooks/api/supabase';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';


function AsidePage() {
  const router = useRouter();
  const createPage = useCreateTodo();

  const { todos, setTodos, getTodos } = useGetTodos();
  const {toast} = useToast();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = async(event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === "Enter"){
      try{
        const { data, status, error} = await supabase.from("todos").select('*').ilike('title', `%${searchTerm}%`);
        
        if(data && status === 200){
          setTodos(data);
          toast({
            title: '검색.',
            description: '해당 검색어가 포함된 TODO를 호출했습니다.',
          });
        }

        if(error){
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
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <aside className="page__aside">
      <SearchBar placeholder="검색어를 입력하세요" onChange={(event)=> setSearchTerm(event.target.value)} onKeyDown={handleSearch}/>
      <Button
        className="text-[#E79057] bg-white border border-[#E79057] hover:bg-[#ffb235]"
        onClick={createPage}
      >
        Add New Page
      </Button>
      {/**TODO List */}
      <div className="flex flex-col mt-4 gap-2 mx-0">
        <small className="text-sm font-medium leading-none text-[#A6A6A6] mx-0">
          민아의 TODO-BOARD
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
            <li className="py-2 px-[10px]">Enter Title</li>
          )}
        </ul>
      </div>
    </aside>
  );
}

export default AsidePage;
