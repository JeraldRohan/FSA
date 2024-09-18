import React, { useState, useEffect } from 'react';
import './Details.css';

function Details({ updateTaskStatus }) {
  const [filter, setFilter] = useState('All');
  const [updatedTasks, setUpdatedTasks] = useState([]);

  useEffect(() => {
    document.title = 'Faculty-Logger-Dashboard';

    // Retrieve tasks from local storage
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setUpdatedTasks(storedTasks);

    const updateTaskStatuses = () => {
      const now = new Date();
      setUpdatedTasks(prevTasks =>
        prevTasks.map(task => {
          const [endHour, endMinute] = task.endTime.split(' ')[0].split(':');
          const endAmpm = task.endTime.split(' ')[1];
          const endTime = new Date();
          endTime.setHours(endAmpm === 'PM' && endHour !== '12' ? parseInt(endHour) + 12 : parseInt(endHour), parseInt(endMinute), 0, 0);
          
          if (endTime <= now) {
            if (task.status !== 'Completed') {
              updateTaskStatus(task.id, 'Completed');
              return { ...task, status: 'Completed' };
            }
          }
          return task;
        })
      );
    };

    updateTaskStatuses();
    const intervalId = setInterval(updateTaskStatuses, 60000);
    return () => clearInterval(intervalId);
  }, [updateTaskStatus]);

  const filteredTasks = updatedTasks.filter(task => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  return (
    <>
      <div className='TasksData'>
        <h1>Tasks Data</h1>
        <div className='filter-buttons'>
          <button className="all" onClick={() => setFilter('All')}>All</button>
          <button className="active" onClick={() => setFilter('Active')}>Active</button>
          <button className="completed" onClick={() => setFilter('Completed')}>Completed</button>
          <button className="suspended" onClick={() => setFilter('Suspended')}>Suspended</button>
        </div>
      </div>
      <div className='Details'>
        <table>
          <thead>
            <tr>
              <th>Faculty Name</th>
              <th>Faculty Id</th>
              <th>Source</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.name}</td>
                  <td>{task.aicteID}</td>
                  <td>{task.source}</td>
                  <td style={{
                    color:
                      task.status === 'Active' ? 'red' :
                        task.status === 'Completed' ? 'lightgreen' :
                          task.status === 'Suspended' ? 'yellow' : 'black',
                  }}>
                    {task.status}
                  </td>
                  <td>{task.priority}</td>
                  <td>{task.startTime}</td>
                  <td>{task.endTime}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No tasks available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Details;