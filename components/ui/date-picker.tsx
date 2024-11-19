import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
} from '@/components/ui';

interface Props {
  label: string;
}

function DatePicker({ label }: Props) {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="max-w-64 flex items-center gap-3">
      <small className="text-sm font-medium leading-none text-[#6D6D6D]">
        {label}
      </small>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[200px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon />
            {date ? format(date, 'PPP') : <span>날짜를 선택해주세요.</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { DatePicker };
