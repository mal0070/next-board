export interface Board {
    id: number; //board만의 id
    title: string;
    from_date: Date;
    to_date: Date;
    contents: string;
    is_checked: boolean;
    todo_id: number;
  }
  