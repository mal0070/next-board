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
//import { supabase } from '@/lib/supabase';
import { createClient } from '@/lib/client';
import { userAtom } from '@/stores/atom';
import { useAtom } from 'jotai';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const saveUserEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
  };

  const saveUserPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(e.target.value);
  };

  //DB저장
  const handleSignup = async () => {
    try {
      if (passwordInput.length < 6) {
        alert('비밀번호는 6자리 이상이여야합니다.');
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email: emailInput,
        password: passwordInput,
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: '에러가 발생했습니다.',
          description: `Supabase 오류: ${error.message || '알 수 없는 오류'}`,
        });
      }

      if (user) {
        //user가 생성되면
        //profile db에 추가
        const { data, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user?.id,
            user_name: nameInput,
            avatar_url: '/assets/profile.jpg',
            email: emailInput,
          })
          .select();
        
        if (profileError) throw profileError;

        toast({
          title: '회원가입 성공',
          description: '프로필이 생성되었습니다.',
        });

        router.push('/');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '에러가 발생했습니다.',
        description: '네트워크 오류',
      });
    }
  };

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
              회원가입을 진행해주세요.
            </p>
          </div>
        </div>
        <Card className="w-[400px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">회원가입</CardTitle>
            <CardDescription>
              계정을 생성하기 위해 아래 정보를 입력해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6" id="login-form">
            <div className="grid gap-2">
              <label htmlFor="email">이름</label>
              <input
                id="name"
                type="id"
                placeholder="이름을 입력하세요."
                onChange={(e) => setNameInput(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요."
                onChange={(e) => saveUserEmail(e)}
                required
              />
            </div>
            <div className="relative grid gap-2">
              <label htmlFor="password">비밀번호</label>
              <input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요."
                onChange={(e) => saveUserPassword(e)}
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
                간편 회원가입을 원하시면 이전 버튼을 누르세요.
              </span>
            </div>
          </div>
          <CardFooter className="flex flex-col mt-6">
            <div className="w-full flex items-center gap-4">
              <Button
                variant={'outline'}
                className="w-full"
                onClick={() => router.push('/')}
              >
                이전
              </Button>
              <Button
                className="w-full text-white bg-[#E79057] hover:bg-[#E26F24] hover:ring-1 hover:ring-[#E26F24] hover:ring-offset-1 active:bg-[#D5753D] hover:shadow-lg"
                type="submit"
                onClick={handleSignup}
              >
                회원가입
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              이미 계정이 있으신가요?{' '}
              <Link href={'/'} className="underline text-sm ml-1">
                로그인
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default SignupPage;
