'use client';

import { BoardData } from '@/app/board/[id]/page';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DatePicker,
  DialogClose,
} from '@/components/ui';
import { supabase } from '@/lib/supabase';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { useState, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
  boardData: BoardData;
}

function MarkdownEditorDialog({ children, boardData }: Props) {
 // const [itemData, setItemData] = useState<BoardData>();
  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [content, setContent] = useState<string>('**Hello, World!!**');

  useEffect(()=> {
    getBoardData();
  },[]);

  const getBoardData = async()=> {
    const { data } = await supabase.from('boards').select().eq('id', boardData.id).single();
    setTitle(data?.title);
    setStartDate(data?.from_date);
    setEndDate(data?.to_date);
    setContent(data?.contents);
  }

  const updateBoardData = (e: React.ChangeEvent<HTMLInputElement>) => {
    /** 생성한 페이지의 전체 데이터를 조회: 특정 TODO-LIST의 id 값을 기준으로 조회 */

  };

  //부모 컴포넌트(item)에서 리렌더링(UI반영)
  //1. 제목, 날짜
  //2.Add Content 버튼 없애고, content표시 + 하단에 edit버튼 추가

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col">
          <DialogTitle>
            <div className="flex items-center justify-start gap-2">
              <input
                type="text"
                placeholder="게시물의 제목을 입력해주세요."
                className="w-full text-xl outline-none bg-transparent"
                name="title"
                value={title}
                onChange={(event)=>{setTitle(()=>event.target.value)}}
              />
            </div>
          </DialogTitle>
          <DialogDescription>
            마크다운 에디터를 사용하여 TODO-BOARD를 예쁘게 꾸며보세요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-5">
          <DatePicker
            label={'From'}
            value={startDate}
            onSetDate={() => setStartDate(startDate)}
            isReadOnly={false}
          />
          <DatePicker
            label={'To'}
            value={endDate}
            onSetDate={() => setEndDate(endDate)}
            isReadOnly={false}
          />
        </div>

        {/* 마크다운 에디터 영역 */}
        <MarkdownEditor className="h-[320px]" />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" variant={'outline'}>
              취소
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="text-white bg-[#E79057] hover:bg-[#E26F24] hover:ring-1 hover:ring-[#E26F24] hover:ring-offset-1 active:bg-[#D5753D] hover:shadow-lg"
            onClick={()=> updateBoardData}
          >
            등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { MarkdownEditorDialog };
