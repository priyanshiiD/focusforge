import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function Tasks() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  });

  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const task = {
      id: Date.now(),
      title: newTask,
      due: dueDate || null,
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTask('');
    setDueDate('');
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const startEditing = (id, currentTitle) => {
    setEditingTaskId(id);
    setEditedTitle(currentTitle);
  };

  const saveEdit = (id) => {
    if (!editedTitle.trim()) return;
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, title: editedTitle } : task
    ));
    setEditingTaskId(null);
    setEditedTitle('');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">📝 Tasks</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="p-3 rounded w-full md:w-1/2 border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-3 rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Add
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        {['all', 'active', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded ${
              filter === f
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <ul className="space-y-4">
        {filteredTasks.map(task => (
          <li
            key={task.id}
            className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow flex justify-between items-center"
          >
            <div className="flex flex-col gap-1 w-full">
              {editingTaskId === task.id ? (
                <input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={() => saveEdit(task.id)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                  autoFocus
                  className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              ) : (
                <div
                  className={`text-lg ${task.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'}`}
                >
                  {task.title}
                  {task.due && (
                    <span className="text-sm ml-2 text-blue-600 dark:text-blue-300">
                      (Due: {task.due})
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2 items-center ml-4">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
              />
              <button
                onClick={() =>
                  editingTaskId === task.id ? saveEdit(task.id) : startEditing(task.id, task.title)
                }
                className="text-blue-500 hover:text-blue-700"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {tasks.some((task) => task.completed) && (
        <button
          onClick={clearCompleted}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Clear Completed
        </button>
      )}
    </div>
  );
}

export default Tasks;
