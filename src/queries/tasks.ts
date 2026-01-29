import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Task } from '../types/task'

const API_URL = 'https://696685ccf6de16bde44da6fe.mockapi.io/tasks'
export const useTasks = () => {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => fetch(API_URL).then(res => res.json()),
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (title: string) =>
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, isCompleted: false, createdAt: new Date().toISOString() }),
      }).then(res => res.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export const useToggleTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (task: Task) =>
      fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, isCompleted: !task.isCompleted }),
      }).then(res => res.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}
