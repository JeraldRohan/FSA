import './App.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dept.css';
import departmentsData from './Dept.json';

// Dynamically import images
const importImages = import.meta.glob('./assets/DeptHead/*.{png,jpg,jpeg,svg}');
const images = {};

// Preload images and return a promise that resolves when all images are loaded
const preloadImages = () => {
  const promises = Object.keys(importImages).map((path) =>
    importImages[path]().then((module) => {
      const imageName = path.split('/').pop(); // Extract filename
      images[imageName] = module.default;
    })
  );
  return Promise.all(promises);
};

function DepartmentBox({ id, name, image }) {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const imagePath = images[image] || images['default-image.png'];
    setImageSrc(imagePath);
  }, [image]);

  return (
    <Link to={`/department/${id}`} className='Box1'> {/* Wrapped the entire Box1 in Link */}
      <div className='Box'>
        <img src={imageSrc} alt={name} className='deptimg' />
      </div>
      <div className='Name'>
        <h3>{name}</h3>
      </div>
    </Link>
  );
}

function Dept() {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    document.title = 'Faculty-Logger-Departments'; // Set the title here
  }, []);

  useEffect(() => {
    // Preload images and then set the state to true
    preloadImages().then(() => {
      setImagesLoaded(true);
    });
  }, []);

  // Render a loading state until images are loaded
  if (!imagesLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className='title'><h1>Departments</h1></div>
      <div className='Entire'>
        <div className='container'>
          {departmentsData.map(dept => (
            <DepartmentBox key={dept.id} id={dept.id} name={dept.name} image={dept.image} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Dept;
