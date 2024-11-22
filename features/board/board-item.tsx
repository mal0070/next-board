import { DatePicker, Button } from '@/components/ui';
import React, { useState } from 'react';
import { MarkdownEditorDialog } from './ME-dialog';
import { BoardData } from '@/app/board/[id]/page';
import { supabase } from '@/lib/supabase';

interface Props {
  data: BoardData;
  onDelete: (id: number) => void; //부모 컴포넌트에서 상태 업데이트
  onChange: (id: number, checkedValue: boolean ) => void;
}

function BoardItem({ data, onDelete, onChange }: Props) {
  const deleteBoard = async (id: number) => {
    try {
      const { error } = await supabase.from('boards').delete().eq('id', id); //DB에서 제거
      if (error) throw error;
      onDelete(id); //부모 컴포넌트에 삭제 알림
    } catch (error) {
      console.error('board delete 오류: ' + error);
    }
  };

  const detectCheckValueChange = () => {
    onChange(data.id, !data.is_checked);
  }

  const [itemStartDate, setItemStartDate] = useState<Date>(new Date());
  const [itemEndDate, setItemEndDate] = useState<Date>(new Date());

  return (
    <div className="flex flex-col gap-3 h-[180px] bg-[#ffffff] rounded-sm p-5">
      <div className="flex flex-col gap-3">
        {/** board-item-header */}
        <div className="items-center">
          <input
            type="checkbox"
            id="todo"
            name="todo"
            className="w-[20px] h-[20px]"
            checked={data.is_checked}
            onChange={detectCheckValueChange}
          /> 
          <label
            htmlFor="todo"
            className="scroll-m-20 text-2xl font-semibold tracking-tight m-3"
          >
          {data.title}
          </label>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-6">
            <DatePicker label="From" isReadOnly={true} onSetDate={setItemStartDate}/>
            <DatePicker label="To" isReadOnly={true} onSetDate={setItemEndDate}/>
          </div>
          <div className="flex gap-3">
            <Button className="bg-transparent text-gray-500">Duplicate</Button>
            <Button
              className="bg-transparent text-gray-500"
              onClick={() => deleteBoard(data.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-5">
        <hr className="w-full solid"></hr>
        <MarkdownEditorDialog boardData={data}>
          <Button variant={'ghost'} className="text-gray-500 bg-transparent">
            Add Contents
          </Button>
        </MarkdownEditorDialog>
      </div>
    </div>
  );
}

export default BoardItem;
