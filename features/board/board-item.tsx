import { DatePicker, Button } from '@/components/ui';
import React, { useEffect, useState } from 'react';
import { MarkdownEditorDialog } from './ME-dialog';
import { Board } from '@/types';
import { supabase } from '@/lib/supabase';

interface Props {
  data: Board;
  onDelete: (id: number) => void; //부모 컴포넌트에서 상태 업데이트
  onChange: (changedBoardData: Board) => void;
}

function BoardItem({ data, onDelete, onChange }: Props) {
  const [item, setItem] = useState<Board>(data);

  useEffect(() => {
    setItem(data);
  }, [data]);

  const deleteBoard = async (id: number) => {
    try {
      const { error } = await supabase.from('boards').delete().eq('id', id); //DB에서 제거
      if (error) throw error;
      onDelete(id); //부모 컴포넌트에 삭제 알림
    } catch (error) {
      console.error('board delete 오류: ' + error);
    }
  };

  const handleBoardChange = (changedBoardData: Board) => {
    setItem(changedBoardData); //UI
    onChange(changedBoardData); //부모 컴포넌트에 변경 알림

  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //데이터가 없으면, check 못하게 함
    const updatedData = { ...item, is_checked: e.target.checked };
    handleBoardChange(updatedData);
  };

  const handleDateChange = (field: 'from_date' | 'to_date') => (date: Date) => {
    const updatedData = { ...item, [field]: date };
    handleBoardChange(updatedData);
  };

  return (
    <div className="flex flex-col gap-3 h-[180px] bg-[#ffffff] rounded-sm p-5">
      <div className="flex flex-col gap-3">
        {/** board-item-header */}
        <div className="items-center">
          <input
            type="checkbox"
            id={`todo-${item.id}`}
            name="todo"
            className="w-[20px] h-[20px]"
            checked={item.is_checked}
            onChange={handleCheckboxChange}
          />
          <label
            htmlFor={`todo-${item.id}`}
            className="scroll-m-20 text-2xl font-semibold tracking-tight m-3"
          >
            {item.title}
          </label>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-6">
            <DatePicker
              label="From"
              isReadOnly={true}
              value={item.from_date}
              onSetDate={handleDateChange('from_date')}
            />
            <DatePicker
              label="To"
              isReadOnly={true}
              value={item.to_date}
              onSetDate={handleDateChange('to_date')}
            />
          </div>
          <div className="flex gap-3">
            <Button className="bg-transparent text-gray-500">Duplicate</Button>
            <Button
              className="bg-transparent text-gray-500"
              onClick={() => deleteBoard(item.id)}
            >
              Delete
            </Button>
          </div>
        </div>
        <hr className="w-full solid"></hr>
      </div>
      {item.contents ? (
        <div className="flex flex-col">
          <div>{item.contents}</div>
          <MarkdownEditorDialog board={item} onChange={handleBoardChange}>
            <Button
              variant={'ghost'}
              className="text-gray-500 bg-transparent w-auto"
            >
              Edit Contents
            </Button>
          </MarkdownEditorDialog>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5">
          <MarkdownEditorDialog board={item} onChange={handleBoardChange}>
            <Button variant={'ghost'} className="text-gray-500 bg-transparent">
              Add Contents
            </Button>
          </MarkdownEditorDialog>
        </div>
      )}
    </div>
  );
}

export default BoardItem;
