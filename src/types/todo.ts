export type TodoItemApi = {
  templateId: number;
  content: string;
  isCompleted: boolean;
  completedAt?: string | null;
};

export type TodoListApi = {
  todoItems: TodoItemApi[];
  totalCount: number;
  completedCount: number;
  completionRate: number;
};