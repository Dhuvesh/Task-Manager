import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  filter: 'ALL'
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push({
        id: Date.now().toString(),
        ...action.payload,
        completed: false
      });
    },
    editTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    toggleTaskCompletion: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload);
      if (index !== -1) {
        state.tasks[index].completed = !state.tasks[index].completed;
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    }
  }
});

export const { 
  addTask, 
  editTask, 
  deleteTask, 
  toggleTaskCompletion, 
  setFilter 
} = taskSlice.actions;

export default taskSlice.reducer;