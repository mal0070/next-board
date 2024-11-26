'use client';

import { Board } from '@/types';
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

import MarkdownEditor from '@uiw/react-markdown-editor';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  children: React.ReactNode;
  board: Board;
  onChange: (changedBoardData:Board) => void;
}

function MarkdownEditorDialog({ children, board, onChange }: Props) {
  const [itemData, setItemData] = useState<Board>(board);
  const { toast } = useToast();

  useEffect(() => {
    setItemData(board);
  }, []);

  /*const getBoardData = async () => {
    const { data } = await supabase
      .from('boards')
      .select()
      .eq('id', board.id)
      .single();
    
    if (data) setItemData(data);
  };*/

/* const handleDataChange = (field: keyof BoardData, value:any) => {
    setItemData((prevData)=> ({...prevData, [field]:value}));
  } //각 필드 별로 set할 수 있도록 설정*/

  
  const handleDataChange = (field: keyof Board, value: any) => {
    setItemData((prevData) => {
      const newData = {...prevData, [field]: value};
      console.log('Updated itemData:', newData);
      return newData;
    });
  }

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
            value={itemData.from_date || undefined}
            onSetDate={(date: Date) => handleDataChange('from_date', date)}
            isReadOnly={false}
          />
          <DatePicker
            label={'To'}
            value={itemData.to_date || undefined}
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
              onClick={() => {
                onChange(itemData);
                toast({
                  title: 'TODO-BOARD 콘텐츠가 올바르게 등록되었습니다.',
                  description: '등록한 TODO-BOARD의 마감일을 지켜 하루를 채워가세요!',
                });
              }}
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
