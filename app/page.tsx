'use client';

import AsidePage from "@/features/aside/aside-page";


import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { BoardData } from './board/[id]/page';
import { nanoid } from "nanoid"; // ESM
//import { useToast } from '@/hooks/use-toast';

interface Todo {
  id: number;
  title: string;
  from_date: Date;
  to_date: Date;
  boards_id: number;
}

function Home() {
  
  const router = useRouter();
  // const {toast}  = useToast();

  const createPage = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert({
          title: null,
          from_date: null,
          to_date: null,
        })
        .select();

      if (data) {
        router.push(`/board/${data[0].id}`);
        console.log(data);
      }
    } catch (error) {
      console.error('todo insert 오류: ' + error);
    }
  };

  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    getTodos();
  }, []);

  async function getTodos() {
    const { data } = await supabase.from('todos').select();
    setTodos(data || []); // 데이터가 null일 경우 빈 배열로 설정
  }

  return (
    <div className="page">
      <AsidePage/>
      <main className="page__main">
        <div className="w-full h-full flex flex-col items-center justify-center gap-5 mb-5">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            How to Start:
          </h3>
          <p>1. Create a page</p>
          <p>2. Add boards to page</p>
          <Button
            className="text-[#E79057] bg-transparent border border-[#E79057] hover:bg-[#ffb235]"
            onClick={createPage}
          >
            Add New Page
          </Button>
        </div>
      </main>
    </div>
  );
}

export default Home;
