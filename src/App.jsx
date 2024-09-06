import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dept from './Dept';
import Details from './Details';
import DeptFaculties from './DeptFaculties';
import FacultyDetails from './FacultyDetails';
import SignIn from './SignIn';
import logo from './assets/logo.png';
import departmentsData from './Dept.json';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const addTask = (task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const deleteTask = (id) => {
    return new Promise((resolve, reject) => {
      try {
        setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleFindClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  if (!isLoggedIn) {
    return <SignIn onLogin={setIsLoggedIn} />;
  }

  return (
    <Router>
      <div className="header">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav className="list">
          <ul>
            <li>
              <Link className="btn" to="/">Home</Link>
            </li>
            <li>
              <Link className="btn" to="/dashboard">Dashboard</Link>
            </li>
            <li ref={dropdownRef} className='DropDown'>
              <button className="btn" onClick={handleFindClick} aria-haspopup="true" aria-expanded={showDropdown}>
                Find
              </button>
              {showDropdown && (
                <ul className="dropdown" role="menu">
                  {departmentsData.map((dept) => (
                    <li key={dept.id}>
                      <Link to={`/department/${dept.id}`} role="menuitem">{dept.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <button className="btn" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<Dept />} />
        <Route path="/dashboard" element={<Details tasks={tasks} updateTaskStatus={updateTaskStatus} />} />
        <Route path="/department/:id" element={<DeptFaculties />} />
        <Route
          path="/faculty/:name"
          element={
            <FacultyDetails
              addTask={addTask}
              tasks={tasks}
              updateTaskStatus={updateTaskStatus}
              deleteTask={deleteTask}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;