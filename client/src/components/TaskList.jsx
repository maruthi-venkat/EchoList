import React from 'react';
import { Trash2 } from 'lucide-react';

const TaskList = ({ tasks, onDeleteTask }) => {
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="task-list">
      <h2 className="task-list-title">Your Tasks</h2>
      {tasks.length === 0 ? (
        <div className="no-tasks">
          <p>No tasks yet. Try recording one!</p>
        </div>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="task-item">
            <div className="task-content">
              <p className="task-text">{task.text}</p>
              <div className="task-meta">
                <span className="task-timestamp">
                  {formatDate(task.timestamp)}
                </span>
                <button
                  className="delete-button"
                  onClick={() => onDeleteTask(task._id)}
                  aria-label="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;