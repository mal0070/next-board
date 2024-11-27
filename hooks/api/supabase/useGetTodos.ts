import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { todosAtom, userAtom } from '@/stores/atom';
import { useAtom, useAtomValue } from 'jotai';

export function useGetTodos() {
  const { toast } = useToast();
  const [todos, setTodos] = useAtom(todosAtom);
  const user = useAtomValue(userAtom);

  const getTodos = async () => {
    try {
      const { data, status, error } = await supabase.from('todos').select().eq('user_id',user?.id);

      if (data && status === 200) setTodos(data);

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
  };

  return {todos,setTodos, getTodos};
}
