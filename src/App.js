import React, { useEffect, useState } from 'react';

const App = () => {
  const Task = ({ task, onDragStart }) => {
    return (
      <div
        draggable
        onDragStart={(e) => onDragStart(e, task.id)}
        className="bg-white p-3 my-2 rounded-lg shadow-md cursor-pointer border border-gray-300 hover:bg-gray-100 transition"
      >
        {task.content}
      </div>
    );
  };

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [buckets, setBuckets] = useState({
    "Important & Urgent": [],
    "Important & Not Urgent": [],
    "Unimportant & Urgent": [],
    "Unimportant & Not Urgent": [],
  });
  const [organizedTasks, setOrganizedTasks] = useState('');

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, bucketName) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find((t) => t.id.toString() === taskId);
    if (task) {
      setBuckets((prevBuckets) => {
        const updatedBuckets = { ...prevBuckets };
        Object.keys(updatedBuckets).forEach((key) => {
          updatedBuckets[key] = updatedBuckets[key].filter((t) => t.id !== task.id);
        });
        updatedBuckets[bucketName] = [...updatedBuckets[bucketName], task];
        return updatedBuckets;
      });
    }
  };

  useEffect(() => {
    handleOrganizeTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buckets]);

  const handleBulkAddTasks = () => {
    const tasksArray = newTask.split('\n').filter((task) => task.trim() !== '');
    const taskObjects = tasksArray.map((task, index) => ({
      id: tasks.length + index + 1,
      content: task.trim(),
    }));

    setTasks([...tasks, ...taskObjects]);
    setBuckets((prevBuckets) => ({
      ...prevBuckets,
      "Unimportant & Not Urgent": [...prevBuckets["Unimportant & Not Urgent"], ...taskObjects],
    }));
    setNewTask('');
  };

  const handleOrganizeTasks = () => {
    const organizedTaskList = Object.keys(buckets).map((bucketName) => {
      const tasksInBucket = buckets[bucketName];
      return `${bucketName}:
${tasksInBucket.map((task) => task.content).join('\n')}`;
    }).join('\n\n');

    setOrganizedTasks(organizedTaskList);
  };

  const handleCopyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(organizedTasks)
        .then(() => {
          alert('Organized tasks copied to clipboard!');
        })
        .catch((error) => {
          console.error('Failed to copy to clipboard:', error);
        });
    }
  };

  return (
    <div className="flex flex-col font-serif items-center p-8 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 text-center">Organize My Tasks</h1>
      <p className="text-center text-gray-600 max-w-lg">
        Organize your tasks efficiently using the Eisenhower Matrix. Focus on what's important and maximize your productivity.
      </p>

      <div className="w-full max-w-2xl bg-blue-100 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 1: Enter Your Tasks</h2>
        <textarea
          rows="4"
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Enter tasks (one per line)..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          className="mt-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full font-medium"
          onClick={handleBulkAddTasks}
        >
          Add Tasks
        </button>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        <div
          className="border rounded-lg p-6 shadow-md transition bg-green-200 border-green-400"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'Important & Urgent')}
        >
          <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">DO</h2>
          <p className="mb-4 text-sm text-center text-gray-600">Important & Urgent: Do these tasks immediately.</p>
          {buckets['Important & Urgent'].map((task) => (
            <Task key={task.id} task={task} onDragStart={handleDragStart} />
          ))}
        </div>

        <div
          className="border rounded-lg p-6 shadow-md transition bg-yellow-200 border-yellow-400"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'Important & Not Urgent')}
        >
          <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">DECIDE</h2>
          <p className="mb-4 text-sm text-center text-gray-600">Important & Not Urgent: Schedule a time to do these tasks.</p>
          {buckets['Important & Not Urgent'].map((task) => (
            <Task key={task.id} task={task} onDragStart={handleDragStart} />
          ))}
        </div>

        <div
          className="border rounded-lg p-6 shadow-md transition bg-blue-200 border-blue-400"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'Unimportant & Urgent')}
        >
          <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">DELEGATE</h2>
          <p className="mb-4 text-sm text-center text-gray-600">Unimportant & Urgent: Delegate these tasks to someone else.</p>
          {buckets['Unimportant & Urgent'].map((task) => (
            <Task key={task.id} task={task} onDragStart={handleDragStart} />
          ))}
        </div>

        <div
          className="border rounded-lg p-6 shadow-md transition bg-red-200 border-red-400"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'Unimportant & Not Urgent')}
        >
          <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">DELETE</h2>
          <p className="mb-4 text-sm text-center text-gray-600">Unimportant & Not Urgent: Eliminate these tasks if possible.</p>
          {buckets['Unimportant & Not Urgent'].map((task) => (
            <Task key={task.id} task={task} onDragStart={handleDragStart} />
          ))}
        </div>
      </div>

      <div className="w-full max-w-2xl mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Organized Tasks</h2>
        <textarea
          rows="6"
          className="w-full p-3 border rounded focus:outline-none bg-gray-100"
          value={organizedTasks}
          readOnly
        />
        <button
          className="mt-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full font-medium"
          onClick={handleCopyToClipboard}
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
};

export default App;
