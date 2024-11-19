import { DatePicker, Button } from '@/components/ui';
import React from 'react';

function BoardItem() {
  return (
    <div className="flex flex-col gap-3 h-[180px] bg-[#ffffff] rounded-sm p-5">
      <div className="flex flex-col gap-3">
        {/** board-item-header */}
        <div className='items-center'>
          <input type="checkbox" id="todo" name="todo" className='w-[20px] h-[20px]' />
          <label
            htmlFor="todo"
            className="scroll-m-20 text-2xl font-semibold tracking-tight m-3"
          >
            Board Title
          </label>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-6">
            <DatePicker label="From" />
            <DatePicker label="To" />
          </div>
          <div className="flex gap-3">
            <Button>Duplicate</Button>
            <Button>Delete</Button>
          </div>
        </div>
      </div>
      <div className='flex flex-col items-center gap-5'>
        <hr className="w-full solid"></hr>
        <button type="submit">Add Contents</button>
      </div>
    </div>
  );
}

export default BoardItem;
