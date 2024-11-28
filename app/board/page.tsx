'use client';

import { Button } from '@/components/ui';
import { useCreateTodo } from "@/hooks/api/supabase";


function Home() {
  
  const createPage = useCreateTodo();

  return (
    <div className="page">
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
