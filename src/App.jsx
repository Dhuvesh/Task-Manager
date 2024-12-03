import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import TaskDashboard from './components/TaskDashboard';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100">
        <TaskDashboard />
      </div>
    </Provider>
  );
}

export default App;