import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setFilter, 
  deleteTask, 
  toggleTaskCompletion 
} from '../store/taskSlice';
import TaskModal from './TaskModal';
import ConfirmModal from './ConfirmModal';
import { 
  HomeIcon, 
  PlusIcon, 
  CheckIcon, 
  ClockIcon, 
  CalendarIcon, 
  TrashIcon, 
  EditIcon, 
  SearchIcon 
} from 'lucide-react';

function TaskDashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const dispatch = useDispatch();
  const { tasks, filter } = useSelector(state => state.tasks);

  const filterOptions = [
    { value: 'ALL', label: 'All Tasks', icon: HomeIcon },
    { value: 'COMPLETED', label: 'Completed', icon: CheckIcon },
    { value: 'PENDING', label: 'Pending', icon: ClockIcon },
    { value: 'OVERDUE', label: 'Overdue', icon: CalendarIcon }
  ];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const today = new Date();
    const dueDate = new Date(task.dueDate);

    switch (filter) {
      case 'COMPLETED':
        return task.completed && matchesSearch;
      case 'PENDING':
        return !task.completed && matchesSearch;
      case 'OVERDUE':
        return !task.completed && dueDate < today && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const handleDelete = () => {
    if (deleteTaskId) {
      dispatch(deleteTask(deleteTaskId));
      setDeleteTaskId(null);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20 animate-gradient-x opacity-50 -z-10"></div>

      <div className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        bg-white/80 backdrop-blur-lg shadow-2xl transition-all duration-300 ease-in-out
        border-r border-blue-100/50 rounded-r-2xl
      `}>
        <div className="flex items-center justify-between p-4 border-b border-blue-100/50">
          <h2 className={`
            ${isSidebarOpen ? 'block' : 'hidden'} 
            text-2xl font-bold bg-clip-text text-transparent 
            bg-gradient-to-r from-blue-600 to-purple-600
          `}>
            TaskMaster
          </h2>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-blue-600 hover:text-purple-600 transition-colors duration-300 
            bg-blue-50 hover:bg-purple-50 p-2 rounded-full"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <nav className="mt-6">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => dispatch(setFilter(option.value))}
              className={`
                w-full flex items-center p-4 hover:bg-blue-50/50 
                transition-all duration-300 group
                ${filter === option.value 
                  ? 'bg-gradient-to-r from-blue-100/50 to-purple-100/50 text-blue-700' 
                  : 'text-blue-600 hover:text-purple-700'}
              `}
            >
              <option.icon 
                className={`mr-3 transition-transform duration-300 
                  group-hover:scale-110 
                  ${filter === option.value ? 'text-blue-700' : 'text-blue-500'}`} 
                size={20} 
              />
              <span className={isSidebarOpen ? 'block' : 'hidden'}>
                {option.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
   
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/80 backdrop-blur-lg shadow-md p-4 flex justify-between items-center">
          <div className="relative flex-grow max-w-md mr-4">
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-blue-100 
              rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50
              bg-blue-50/50 text-blue-800 placeholder-blue-400"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white 
            px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 
            transition-all duration-300 flex items-center group"
          >
            <PlusIcon className="mr-2 group-hover:rotate-90 transition-transform duration-300" size={20} />
            Add Task
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden">
            {filteredTasks.length === 0 ? (
              <div className="p-4 text-center text-blue-500">No tasks found</div>
            ) : (
              <ul>
                {filteredTasks.map(task => (
                  <li 
                    key={task.id} 
                    className={`p-4 border-b border-blue-100/50 flex justify-between items-center 
                      transition-all duration-300 hover:bg-blue-50/50
                      ${task.completed ? 'bg-green-50/50' : 
                      new Date(task.dueDate) < new Date() ? 'bg-red-50/50' : ''}`}
                  >
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        onChange={() => dispatch(toggleTaskCompletion(task.id))}
                        className="mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500 
                        border-blue-300 rounded-md transition-transform 
                        hover:scale-110 hover:border-purple-500"
                      />
                      <div>
                        <h3 className={`font-semibold 
                          ${task.completed 
                            ? 'line-through text-blue-400' 
                            : 'text-blue-800'}`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-blue-600">{task.description}</p>
                        <p className="text-sm text-blue-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setEditingTask(task)}
                        className="text-blue-500 hover:text-purple-600 
                        flex items-center transition-colors duration-300 
                        hover:scale-105 group"
                      >
                        <EditIcon 
                          size={18} 
                          className="mr-1 group-hover:rotate-12 transition-transform" 
                        /> 
                        Edit
                      </button>
                      <button 
                        onClick={() => setDeleteTaskId(task.id)}
                        className="text-red-500 hover:text-red-700 
                        flex items-center transition-colors duration-300 
                        hover:scale-105 group"
                      >
                        <TrashIcon 
                          size={18} 
                          className="mr-1 group-hover:rotate-12 transition-transform" 
                        /> 
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>

      {isAddModalOpen && (
        <TaskModal 
          onClose={() => setIsAddModalOpen(false)} 
          task={null} 
        />
      )}

      {editingTask && (
        <TaskModal 
          onClose={() => setEditingTask(null)} 
          task={editingTask} 
        />
      )}

      {deleteTaskId && (
        <ConfirmModal 
          message="Are you sure you want to delete this task?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTaskId(null)}
        />
      )}
    </div>
  );
}

export default TaskDashboard;