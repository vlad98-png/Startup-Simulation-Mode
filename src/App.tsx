import { useState } from 'react'
import { useTasks, useCreateTask, useToggleTask } from './queries/tasks'
import type { FilterType } from './types/task'

function App() {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  
  const { data: tasks = [], isLoading } = useTasks()
  const createTask = useCreateTask()
  const toggleTask = useToggleTask()

  const filteredTasks = (tasks || []).filter(task => {
    if (filter === 'active') return !task.isCompleted
    if (filter === 'completed') return task.isCompleted
    return true
  })

  return (
      <div className="app-container">
        {/* Heading */}
        <h1 style={{
          fontSize: '3rem', 
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
    
          Startup Tasks
        </h1>


        {/* Input + button */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl mb-8 border border-white/50">
          <div className="flex gap-4">
            <input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Новая startup задача..."
              className="flex-1 bg-white/70 rounded-2xl px-6 py-4 text-xl placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-300 border border-gray-200 hover:shadow-lg"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newTaskTitle.trim()) {
                  createTask.mutate(newTaskTitle)
                  setNewTaskTitle('')
                }
              }}
            />
            <button
              onClick={() => {
                if (newTaskTitle.trim()) {
                  createTask.mutate(newTaskTitle)
                  setNewTaskTitle('')
                }
              }}
              disabled={!newTaskTitle.trim() || createTask.isPending}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
            >
              {createTask.isPending ? 'Добавляем...' : 'Добавить'}
            </button>
          </div>
        </div>

        {/* Фильтры */}
        <div className="flex gap-3 mb-8 justify-center flex-wrap">
          {(['all', 'active', 'completed'] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                filter === type
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white/70 hover:bg-white text-gray-800 hover:shadow-lg'
              }`}
            >
              {type === 'all' ? 'Все' : type === 'active' ? 'Активные' : 'Выполненные'}
            </button>
          ))}
        </div>

        {/* Список задач */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xl text-gray-600">Загружаем задачи...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-20 bg-white/60 rounded-3xl backdrop-blur-xl">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">✨</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Пустой список</h2>
              <p className="text-lg text-gray-600 mb-6">Добавьте первую задачу!</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 hover:border-indigo-200 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleTask.mutate(task)}
                    disabled={toggleTask.isPending}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300 shadow-md ${
                      task.isCompleted
                        ? 'bg-green-500 text-white shadow-green-500/25'
                        : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 shadow-indigo-200/50 hover:shadow-indigo-300/50'
                    }`}
                  >
                    {task.isCompleted ? '✓' : '○'}
                  </button>
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold transition-all ${
                      task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
  {new Date(task.createdAt || Date.now()).toLocaleDateString('ru-RU')}
</p>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        </div>
  )
}

export default App