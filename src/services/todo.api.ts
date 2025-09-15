// src/services/todo.api.ts
import { http, type ApiEnvelope } from '@/services/http';
import type { TodoItemApi, TodoListApi } from '@/types/todo';

/** 투두 전체 조회: data만 반환 */
export async function getTodoList(): Promise<TodoListApi> {
  const res = await http<ApiEnvelope<TodoListApi>>('/v1/todo', { method: 'GET' });
  // 서버가 항상 data를 주는 계약이면 non-null 단언 사용
  return res.data ?? { todoItems: [], totalCount: 0, completedCount: 0, completionRate: 0 };
}

/** 특정 항목 토글 */
export async function toggleTodo(templateId: number) {
  return http<ApiEnvelope<TodoItemApi>>(`/v1/todo/${templateId}/toggle`, { method: 'POST' });
}