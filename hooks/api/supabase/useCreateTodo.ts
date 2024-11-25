"use client";

import { useToast } from "@/hooks/use-toast";
import { supabase} from "@/lib/supabase";
import { todosAtom } from "@/stores/atom";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

export function useCreateTodo() {
  const router = useRouter();
  const [todos, setTodos] = useAtom(todosAtom);
  const {toast} = useToast();

  const createPage = async () => {
    try {
      const { data, status, error } = await supabase
        .from('todos')
        .insert({
          title: null,
          from_date: null,
          to_date: null,
        })
        .select();

      if (data && status===201 ) {
        setTodos((prevTodos)=> [...prevTodos, data[0]]); //상태 업데이트

        router.push(`/board/${data[0].id}`);
        console.log(data);
      }

      if (error) {
        toast({
          variant: "destructive",
          title: '에러가 발생했습니다.',
          description: `Supabase 오류: ${error.message || "알 수 없는 오류"}`
        });
      }
    } catch (error) {
      /**네트워크나 예기치 않은 오류 */
      toast({
        variant: "destructive",
        title: '네트워크 오류',
        description: '서버와 연결할 수 없습니다. 다시 시도해주세요.'
      });
    }
  };

  return createPage;
}