'use client';

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

interface Props {
  children: React.ReactNode;
}

function MarkdownEditorDialog({ children }: Props) {
  const handleBoardData = (e: React.ChangeEvent<HTMLInputElement>) => {

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
                name='title'
                onChange={handleBoardData}
              />
            </div>
          </DialogTitle>
          <DialogDescription>
            마크다운 에디터를 사용하여 TODO-BOARD를 예쁘게 꾸며보세요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-5">
          <DatePicker label={'From'} />
          <DatePicker label={'To'} />
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
            className="text-white bg-[#E79057] hover:bg-[#E26F24] hover:ring-1 hover:ring-[#E26F24] hover:ring-offset-1 active:bg-[#D5753D] hover:shadow-lg">
            등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { MarkdownEditorDialog };
