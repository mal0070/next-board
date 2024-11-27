import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAtom, useAtomValue } from 'jotai';
import { userAtom } from '@/stores/atom';
import { supabase } from '@/lib/supabase';
import { RESET } from 'jotai/utils';
import { User } from '@/types';

interface Props {
  onClose: () => void;
}

export function ProfileCard({ onClose }: Props) {
 const [user, setUser] = useAtom(userAtom);
  const [userName, setuserName] = React.useState(user?.name);

  const changeUserName = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ user_name: userName })
        .eq('id', user?.id);

         // 전역 상태 업데이트
        setUser((prevUser): User | null  => {
            if (prevUser === null) return user;
            return {...prevUser, name: userName || ''}
        });

        onClose();
    
        if (error) throw error;
    
    } catch (error) {
        console.error('네트워크 오류');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>프로필 수정</CardTitle>
        <CardDescription>내 프로필 정보를 수정하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="name">이름</label>
            <input
              id="name"
              placeholder="Name"
              value={userName}
              onChange={(e) => setuserName(e.target.value)}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button type="submit" onClick={changeUserName}>
          등록
        </Button>
      </CardFooter>
    </Card>
  );
}
