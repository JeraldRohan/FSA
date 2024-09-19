import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import facultyData2 from './DeptFaculties.json';
import './FacultyDetails.css';
import Modal from 'react-modal';
import deleteIcon from './assets/delete.png';

const importImages = import.meta.glob('./assets/Individuals/*/*.{png,jpg,jpeg,svg}');
const images = {};

for (const path in importImages) {
  importImages[path]().then((module) => {
    const imageName = path.split('/').pop();
    images[imageName] = module.default;
  });
}

Modal.setAppElement('#root');

const isValidTime = (hour, minute, ampm) => {
  const validHours = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const validMinutes = Array.from({ length: 60 }, (_, i) => i.toString());
  const validAmpms = ['AM', 'PM'];
  return validHours.includes(hour) && validMinutes.includes(minute) && validAmpms.includes(ampm);
};

const timeToMinutes = (hour, minute, ampm) => {
  let totalMinutes = parseInt(hour) * 60 + parseInt(minute);
  if (ampm === 'PM' && hour !== '12') totalMinutes += 12 * 60;
  else if (ampm === 'AM' && hour === '12') totalMinutes -= 12 * 60;
  return totalMinutes;
};

const isValidTimeRange = (startHour, startMinute, startAmpm, endHour, endMinute, endAmpm) => {
  return timeToMinutes(startHour, startMinute, startAmpm) < timeToMinutes(endHour, endMinute, endAmpm);
};

function FacultyDetails({ addTask, tasks, updateTaskStatus, deleteTask }) {
  const { name } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [localTasks, setLocalTasks] = useState(tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [source, setSource] = useState('');
  const [startTime, setStartTime] = useState({ hour: '', minute: '', ampm: 'AM' });
  const [endTime, setEndTime] = useState({ hour: '', minute: '', ampm: 'AM' });
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    document.title = 'Faculty-Logger-Faculty';
  }, []);

  useEffect(() => {
    const facultyInfo = Object.values(facultyData2).flat().find(fac => fac.name === name);
    setFaculty(facultyInfo);
  }, [name]);

  useEffect(() => {
    const updateTaskStatuses = () => {
      const now = new Date();
      const currentTotalMinutes = timeToMinutes(now.getHours() % 12 || 12, now.getMinutes(), now.getHours() >= 12 ? 'PM' : 'AM');
             
      localTasks.forEach(task => {
        const [endHour, endMinute] = task.endTime.split(' ')[0].split(':');
        const endAmpm = task.endTime.split(' ')[1];
        const endTotalMinutes = timeToMinutes(endHour, endMinute, endAmpm);

        if (task.status === "Active" && endTotalMinutes <= currentTotalMinutes) {
          updateTaskStatus(task.id, "Completed");
          setLocalTasks(prevTasks =>
            prevTasks.map(t =>
              t.id === task.id ? { ...t, status: "Completed" } : t
            )
          );
        }
      });
    };

    updateTaskStatuses();
    const intervalId = setInterval(updateTaskStatuses, 60000);
    return () => clearInterval(intervalId);
  }, [localTasks, updateTaskStatus]);

  const filteredTasks = localTasks.filter(task => {
    if (filter === 'All') return task.name === name;
    return task.status === filter && task.name === name;
  });

  const handleAddTask = () => {
    if (!isValidTime(startTime.hour, startTime.minute, startTime.ampm) ||
      !isValidTime(endTime.hour, endTime.minute, endTime.ampm)) {
      alert("Invalid time format. Task not added.");
      return;
    }

    const now = new Date();
    const currentTotalMinutes = timeToMinutes(now.getHours() % 12 || 12, now.getMinutes(), now.getHours() >= 12 ? 'PM' : 'AM');
    const startTotalMinutes = timeToMinutes(startTime.hour, startTime.minute, startTime.ampm);
    const endTotalMinutes = timeToMinutes(endTime.hour, endTime.minute, endTime.ampm);

    if (startTotalMinutes < currentTotalMinutes) {
      alert("Start time must be greater than or equal to the current time. Task not added.");
      return;
    }

    if (!isValidTimeRange(startTime.hour, startTime.minute, startTime.ampm, endTime.hour, endTime.minute, endTime.ampm)) {
      alert("Start time must be less than end time. Task not added.");
      return;
    }

    let priority;
    switch (source) {
      case "T&P":
        priority = "2";
        break;
      case "Head Academics":
        priority = "1";
        break;
      case "HOD":
        priority = "3";
        break;
      default:
        alert("Invalid source. Task not added.");
        return;
    }

    const id = `${faculty.aicteID}-${Date.now()}`;
    const newTask = {
      id,
      name: faculty.name,
      aicteID: faculty.aicteID,
      source,
      startTime: `${startTime.hour}:${startTime.minute} ${startTime.ampm}`,
      endTime: `${endTime.hour}:${endTime.minute} ${endTime.ampm}`,
      status: "Active",
      priority
    };

    addTask(newTask);
    setLocalTasks((prevTasks) => [...prevTasks, newTask]);
    setIsModalOpen(false);
    setSource('');
    setStartTime({ hour: '', minute: '', ampm: 'AM' });
    setEndTime({ hour: '', minute: '', ampm: 'AM' });
  };

  const handleStatusChange = (id, newStatus) => {
    updateTaskStatus(id, newStatus);
    setLocalTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleDeleteTask = (id) => {
    if (typeof deleteTask === 'function') {
      deleteTask(id)
        .then(() => {
          setLocalTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        })
        .catch(error => {
          console.error("Error deleting task:", error);
        });
    } else {
      console.error("deleteTask is not a function");
    }
  };

  if (!faculty) {
    return <p>Loading...</p>;
  }

  const imageUrl = images[faculty.image] || '';

  return (
    <>
      <div className="head">
        <h1>Individual Faculty Data</h1>
      </div>
      <div className="outer">
        <div className="name-banner">{faculty.name}</div>
      </div>
      <div className="FacDetails">
        <div className="imgBorder">
          <img src={imageUrl} className="imgIn" alt={faculty.name || 'Faculty Image'} />
        </div>
        <div className="Fd">
          <h1>{faculty.name}<br /></h1>
          <h2>{faculty.designation}<br /></h2>
          {faculty.aicteID && <p>AICTE ID: {faculty.aicteID}<br /></p>}
          {faculty.mail && <p>{faculty.mail}<br /></p>}
          <button className="greenbtn"><a href={`mailto:${faculty.mail}`}>Send email</a></button>
        </div>
      </div>
      <div className="FacTask">
        <button onClick={() => setIsModalOpen(true)} className="greenbtn">Add Task</button>
        <table>
          <thead>
            <tr>
              <th>Faculty Name</th>
              <th>AICTE ID</th>
              <th>Source</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.name}</td>
                <td>{task.aicteID}</td>
                <td>{task.source}</td>
                <td>
                  <select className="statusSelect"
                    id={`status-${task.id}`}
                    name={`status-${task.id}`}
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    style={{
                      color:
                        task.status === "Active" ? "red" :
                          task.status === "Completed" ? "lightgreen" :
                            task.status === "Suspended" ? "yellow" : "black"
                    }}
                  >
                    <option style={{ color: "red" }} value="Active">Active</option>
                    <option style={{ color: "lightgreen" }} value="Completed">Completed</option>
                    <option style={{ color: "yellow" }} value="Suspended">Suspended</option>
                  </select>
                </td>
                <td>{task.priority}</td>
                <td>{task.startTime || "N/A"}</td>
                <td>{task.endTime || "N/A"}</td>
                <td>
                  <button className="delete-button" onClick={() => handleDeleteTask(task.id)}>
                    <img src={deleteIcon} alt="Delete" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <br />
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add Task"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Add Task</h2>

        <label htmlFor="source">Source:</label>
        <select
          id="source"
          name="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="">--Select--</option>
          <option value="T&P">T&P</option>
          <option value="Head Academics">Head Academics</option>
          <option value="HOD">HOD</option>
        </select>

        <div>
          <label htmlFor="startHour">Start Time:</label>
          <input
            id="startHour"
            name="startHour"
            type="number"
            value={startTime.hour}
            placeholder="Hour"
            autoComplete="off"
            onChange={(e) => setStartTime({ ...startTime, hour: e.target.value })}
          />
          <input
            id="startMinute"
            name="startMinute"
            type="number"
            value={startTime.minute}
            placeholder="Minute"
            autoComplete="off"
            onChange={(e) => setStartTime({ ...startTime, minute: e.target.value })}
          />
          <div className="ampm-toggle">
            <button
              type="button"
              className={`ampm-button ${startTime.ampm === 'AM' ? 'selected' : ''}`}
              onClick={() => setStartTime({ ...startTime, ampm: 'AM' })}
            >
              AM
            </button>
            <button
              type="button"
              className={`ampm-button ${startTime.ampm === 'PM' ? 'selected' : ''}`}
              onClick={() => setStartTime({ ...startTime, ampm: 'PM' })}
            >
              PM
            </button>
          </div>
          <br />
        </div>

        <div>
          <label htmlFor="endHour">End Time:</label>
          <input
            id="endHour"
            name="endHour"
            type="number"
            value={endTime.hour}
            placeholder="Hour"
            autoComplete="off"
            onChange={(e) => setEndTime({ ...endTime, hour: e.target.value })}
          />
          <input
            id="endMinute"
            name="endMinute"
            type="number"
            value={endTime.minute}
            placeholder="Minute"
            autoComplete="off"
            onChange={(e) => setEndTime({ ...endTime, minute: e.target.value })}
          />
          <div className="ampm-toggle">
            <button
              type="button"
              className={`ampm-button ${endTime.ampm === 'AM' ? 'selected' : ''}`}
              onClick={() => setEndTime({ ...endTime, ampm: 'AM' })}
            >
              AM
            </button>
            <button
              type="button"
              className={`ampm-button ${endTime.ampm === 'PM' ? 'selected' : ''}`}
              onClick={() => setEndTime({ ...endTime, ampm: 'PM' })}
            >
              PM
            </button>
          </div>
          <br />
        </div>

        <button onClick={handleAddTask}>Add Task</button>
        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
      </Modal>
    </>
  );
}

export default FacultyDetails;