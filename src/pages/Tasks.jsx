import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/api';

const categories = ['Work', 'Personal', 'Study', 'Fitness'];

const categoryColors = {
  Work: 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100',
  Personal: 'bg-pink-100 text-pink-800 dark:bg-pink-700 dark:text-pink-100',
  Study: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100',
  Fitness: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100',
};

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [filter, setFilter] = useState('all');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from API
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getTasks();
      setTasks(response.tasks || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    
    try {
      const taskData = {
        title: newTask,
        dueDate: dueDate || null,
        category,
        completed: false,
      };
      
      const response = await apiService.createTask(taskData);
      setTasks([...tasks, response.task]);
      setNewTask('');
      setDueDate('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      await apiService.toggleTask(id);
      setTasks(tasks.map(task => 
        task._id === id ? { ...task, completed: !task.completed } : task
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await apiService.deleteTask(id);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const clearCompleted = async () => {
    try {
      const completedTasks = tasks.filter(task => task.completed);
      for (const task of completedTasks) {
        await apiService.deleteTask(task._id);
      }
      setTasks(tasks.filter(task => !task.completed));
    } catch (error) {
      console.error('Error clearing completed tasks:', error);
    }
  };

  const startEditing = (id, currentTitle) => {
    setEditingTaskId(id);
    setEditedTitle(currentTitle);
  };

  const saveEdit = async (id) => {
    if (!editedTitle.trim()) return;
    
    try {
      await apiService.updateTask(id, { title: editedTitle });
      setTasks(tasks.map(task => 
        task._id === id ? { ...task, title: editedTitle } : task
      ));
      setEditingTaskId(null);
      setEditedTitle('');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(filteredTasks);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    try {
      await apiService.reorderTasks(reordered);
      setTasks(reordered);
    } catch (error) {
      console.error('Error reordering tasks:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchStatus =
      filter === 'active' ? !task.completed :
      filter === 'completed' ? task.completed : true;
    const matchCategory = categoryFilter === 'All' || task.category === categoryFilter;
    return matchStatus && matchCategory;
  });

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4 md:p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4 md:p-6"
    >
      <h1 className="text-3xl font-extrabold mb-6 text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text drop-shadow-lg">📝 Tasks</h1>

      {/* Add Task Form */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 mb-6 bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 backdrop-blur-lg p-4"
      >
        <input
          type="text"
          placeholder="Enter task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="p-3 rounded-xl w-full md:w-1/2 border dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-3 rounded-xl border dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 rounded-xl border dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-pink-400 focus:outline-none"
        >
          {categories.map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <button
          onClick={addTask}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <FaPlus /> Add
        </button>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {['all', 'active', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-400
              ${filter === f
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900'}
            `}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 rounded-xl border dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-pink-400 focus:outline-none"
        >
          <option>All</option>
          {categories.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Task Stats */}
      <div className="mb-4 text-gray-700 dark:text-gray-300 font-medium bg-white/60 dark:bg-gray-800/60 rounded-xl px-4 py-2 shadow border border-white/20 dark:border-gray-700/20 inline-block">
        <span>Total: {total}</span> <span className="mx-2">|</span> <span>Completed: {completed}</span> <span className="mx-2">|</span> <span>Pending: {pending}</span>
        {completed > 0 && (
          <button
            onClick={clearCompleted}
            className="ml-4 px-3 py-1 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-semibold shadow hover:from-pink-500 hover:to-purple-500 transition-all focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            Clear Completed
          </button>
        )}
      </div>

      {/* Task List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <motion.li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 transition-all hover:shadow-xl ${
                          task.completed ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleComplete(task._id)}
                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          
                          <div className="flex-1">
                            {editingTaskId === task._id ? (
                              <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && saveEdit(task._id)}
                                onBlur={() => saveEdit(task._id)}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                autoFocus
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-white'}`}>
                                  {task.title}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[task.category]}`}>
                                  {task.category}
                                </span>
                                {task.dueDate && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditing(task._id, task.title)}
                              className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteTask(task._id)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {filteredTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500 dark:text-gray-400"
        >
          <div className="text-6xl mb-4">📝</div>
          <p className="text-lg">No tasks found. Add your first task above!</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Tasks;
