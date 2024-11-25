import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { boardAtom } from '@/stores/atom';
import { useAtom } from 'jotai';

export function useGetBoards(tid: number) {
  const { toast } = useToast();
  const [boards, setBoards] = useAtom(boardAtom);

  const getBoards = async () => {
    try {
      const { data, status, error } = await supabase
        .from('boards')
        .select()
        .eq('todo_id', tid);

      if (data && status=== 204) setBoards(data);

      if (error) {
        toast({
          variant: 'destructive',
          title: '에러가 발생했습니다.',
          description: `Supabase 오류: ${error.message || '알 수 없는 오류'}`,
        });
      }
    } catch (error) {
      /**네트워크나 예기치 않은 오류 */
      toast({
        variant: 'destructive',
        title: '네트워크 오류',
        description: '서버와 연결할 수 없습니다. 다시 시도해주세요.',
      });
    }
  };

  return { boards, getBoards };
}
