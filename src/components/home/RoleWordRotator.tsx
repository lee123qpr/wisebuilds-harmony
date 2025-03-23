
import React, { useState, useEffect } from 'react';

const RoleWordRotator = () => {
  const roles = [
    "Architects", 
    "Engineers", 
    "Surveyors", 
    "Project Managers", 
    "Contractors", 
    "Specialists"
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % roles.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <span className="text-logo-dark-green font-bold">{roles[currentIndex]}</span>
  );
};

export default RoleWordRotator;
