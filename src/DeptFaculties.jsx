import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DeptData from './Dept.json';
import facultyData from './DeptFaculties.json';
import './Dept.css';

const importImages = import.meta.glob('./assets/Individuals/*/*.{png,jpg,jpeg,svg}');
const images = {};

// Preload images
for (const path in importImages) {
  importImages[path]().then((module) => {
    const imageName = path.split('/').pop();
    images[imageName] = module.default;
  });
}

function DeptFaculties() {
  const { id } = useParams();
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    document.title = 'Faculty-Logger-Faculties'; // Set the title here
  }, []);

  useEffect(() => {
    const departmentId = id;
    const facultyDataForDept = facultyData[departmentId] || [];

    const mappedFacultyData = facultyDataForDept.map(faculty => ({
      ...faculty,
      image: images[faculty.image] || null
    }));

    setFacultyList(mappedFacultyData);
  }, [id]);

  if (facultyList.length === 0) {
    return <p>No faculty found for this department</p>;
  }

  return (
    <div className='dept-container'>
      <div className='title'>
        <h1>{DeptData.find(dept => dept.id === parseInt(id)).name} Faculty</h1>
      </div>
      <div className='Entire'>
        <div className="container">
          {facultyList.map((faculty, index) => (
            <Link 
              to={`/faculty/${faculty.name}`} 
              key={faculty.id || index} 
              className="Box"
            >
              {faculty.image ? (
                <img src={faculty.image} alt={faculty.name || 'Faculty Image'} />
              ) : (
                <p>Image not available</p>
              )}
              <div className="Name">
                <p>{faculty.name}</p>
                {faculty.designation && <p>{faculty.designation}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <br/>
      <br/>
    </div>
  );
}

export default DeptFaculties;
