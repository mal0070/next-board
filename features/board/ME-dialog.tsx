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
  onChange: (changedBoardData:BoardData) => void;
}

function MarkdownEditorDialog({ children, boardData, onChange }: Props) {
  const [itemData, setItemData] = useState<BoardData>(boardData);

  useEffect(() => {
    getBoardData();
  }, []);

  const getBoardData = async () => {
    const { data } = await supabase
      .from('boards')
      .select()
      .eq('id', boardData.id)
      .single();
    
    if (data) setItemData(data);
  };

/* const handleDataChange = (field: keyof BoardData, value:any) => {
    setItemData((prevData)=> ({...prevData, [field]:value}));
  } //각 필드 별로 set할 수 있도록 설정*/

  
  const handleDataChange = (field: keyof BoardData, value: any) => {
    setItemData((prevData) => {
      const newData = {...prevData, [field]: value};
      console.log('Updated itemData:', newData);
      return newData;
    });
  }


  //부모 컴포넌트(item)에서

  //save -> db update
  //리렌더링(UI반영)
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
                value={itemData.title}
                onChange={(event)=>handleDataChange('title', event.target.value )}
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
            value={itemData.from_date}
            onSetDate={(date: Date) => handleDataChange('from_date', date)}
            isReadOnly={false}
          />
          <DatePicker
            label={'To'}
            value={itemData.to_date}
            onSetDate={(date: Date) => handleDataChange('to_date', date)}
            isReadOnly={false}
          />
        </div>

        {/* 마크다운 에디터 영역 */}
        <MarkdownEditor className="h-[320px]" value={itemData.contents}
          onChange={(value)=>handleDataChange('contents', value)} />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" variant={'outline'}>
              취소
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="submit"
              className="text-white bg-[#E79057] hover:bg-[#E26F24] hover:ring-1 hover:ring-[#E26F24] hover:ring-offset-1 active:bg-[#D5753D] hover:shadow-lg"
              onClick={() => onChange(itemData)}
            >
              등록
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { MarkdownEditorDialog };
