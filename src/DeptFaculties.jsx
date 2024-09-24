import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DeptData from './Dept.json';
import facultyData from './DeptFaculties.json';
import './Dept.css';

// Dynamically import images from the assets folder
const importImages = import.meta.glob('./assets/Individuals/*/*.{png,jpg,jpeg,svg}');
const images = {};

// Preload images function
const preloadImages = async () => {
  await Promise.all(
    Object.keys(importImages).map(async (path) => {
      const module = await importImages[path]();
      const imageName = path.split('/').pop();
      images[imageName] = module.default;
    })
  );
};

function DeptFaculties() {
  const { id } = useParams();
  const [facultyList, setFacultyList] = useState([]);
  const [filteredFacultyList, setFilteredFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'Faculty-Logger-Faculties'; // Set the title here
    const loadImages = async () => {
      await preloadImages();
      const departmentId = id;
      const facultyDataForDept = facultyData[departmentId] || [];

      const mappedFacultyData = facultyDataForDept.map(faculty => ({
        ...faculty,
        image: images[faculty.image] || null
      }));

      setFacultyList(mappedFacultyData);
      setFilteredFacultyList(mappedFacultyData);
      setLoading(false);
    };
    loadImages();
  }, [id]);

  // Handle search filter
  useEffect(() => {
    const filteredList = facultyList.filter(faculty => 
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFacultyList(filteredList);
  }, [searchQuery, facultyList]);

  if (loading) {
    return <p>Loading images...</p>;
  }

  if (facultyList.length === 0) {
    return <p>No faculty found for this department</p>;
  }

  return (
    <div className='dept-container'>
      <div className='title'>
        <h1>{DeptData.find(dept => dept.id === parseInt(id)).name} Faculty</h1>
      </div>

      {/* Search bar */}
      <div className='search-bar'>
        <input 
          type="text" 
          placeholder="     Search faculty by name..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>

      <div className='Entire'>
        <div className="container">
          {filteredFacultyList.length > 0 ? (
            filteredFacultyList.map((faculty, index) => (
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
            ))
          ) : (
            <p>No matching faculty found</p>
          )}
        </div>
      </div>
      <br/>
      <br/>
    </div>
  );
}

export default DeptFaculties;
