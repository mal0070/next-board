'use client';

import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { boardAtom } from '@/stores/atom';
import { useAtom } from 'jotai';

export function useCreateBoard(tid:number) {
  const { toast } = useToast();
  const [board, setBoard] = useAtom(boardAtom);

  const createBoard = async () => {
    try {
      const { data, status, error } = await supabase
        .from('boards')
        .insert({
          title: '제목없음',
          from_date: new Date(),
          to_date: new Date(),
          contents: '',
          is_checked: false,
          todo_id: tid,
        })
        .select(); //200

      if (data && status === 200) {
        toast({
          title: '새로운 TODO-BOARD를 생성했습니다.',
          description: '생성한 BOARD를 예쁘게 꾸며주세요!',
        });
        console.log(data);
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

  return createBoard;
}
