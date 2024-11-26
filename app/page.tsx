'use client';

import { Button } from '@/components/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { createClient } from '@/lib/client';
import { userAtom } from '@/stores/atom';
import { useAtom } from 'jotai';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useAtom(userAtom);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const signIn = async () => {
    try {
      const { data:{user}, error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput,
      });

      if (user) {
        console.log(user);
        setUser({
          name: user.id || 'mina',
          email: user.email || '',
          avatar: '../public/assets/profile.jpg', //경로 오류남
        });
        toast({
          title: '로그인을 성공하였습니다.',
          description: '자유롭게 TASK 관리를 해주세요!',
        });
        router.push('/board'); // 로그인 페이지로 이동
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
        description: '서버와 연결할 수 없습니다. 다시 시도해주세요!',
      });
    }
  };

  //supabase 로그인
  return (
    <div className="page">
      <div className="page__container">
        <div className="flex flex-col items-center mt-10">
          <h4 className="text-lg font-semibold">안녕하세요 😀</h4>
          <div className="flex flex-col items-center justify-center mt-2 mb-4">
            <div className="text-sm text-muted-foreground">
              <small className="text-sm text-[#e79057] font-medium leading-none">
                Task 관리 앱
              </small>
              에 방문해주셔서 감사합니다.
            </div>
            <p className="text-sm text-muted-foreground">
              서비스를 이용하려면 로그인을 진행해주세요.
            </p>
          </div>
        </div>
        <Card className="w-[400px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">로그인</CardTitle>
            <CardDescription>
              로그인을 위한 정보를 입력해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요."
                value={emailInput}
                onChange={(event) => setEmailInput(event.target.value)}
                required
              />
            </div>
            <div className="relative grid gap-2">
              <div className="flex items-center">
                <label htmlFor="password">비밀번호</label>
                <Link
                  href={'#'}
                  className="ml-auto inline-block text-sm underline"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요."
                value={passwordInput}
                onChange={(event) => setPasswordInput(event.target.value)}
                required
              />
              <Button
                size={'icon'}
                className="absolute top-[38px] right-2 -translate-y-1/4 bg-transparent hover:bg-transparent"
              >
                <Eye className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </CardContent>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <CardFooter className="flex flex-col mt-6">
            <Button
              className="text-[#E79057] bg-transparent border border-[#E79057] hover:bg-[#ffb235] w-full"
              onClick={signIn}
            >
              로그인
            </Button>
            <div className="mt-4 text-center text-sm">
              계정이 없으신가요?
              <Link href={'/signup'} className="underline text-sm ml-1">
                회원가입
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
