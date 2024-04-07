import React, { useState, useEffect } from 'react';
import './App.css'; // Import CSS file for styling

const App = () => {
  const [bgColor, setBgColor] = useState('');
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    // Define your color schemes based on the time of day
    if (currentHour >= 6 && currentHour < 12) {
      setBgColor('linear-gradient(0deg, rgba(45,188,253,1) 0%, rgba(34,91,195,1) 100%)'); // Morning gradient
    } else if (currentHour >= 12 && currentHour < 18) {
      setBgColor('linear-gradient(0deg, rgba(45,98,253,1) 0%, rgba(254,135,15,1) 100%)'); // Afternoon gradient
    } else {
      setBgColor('linear-gradient(0deg, rgba(11,12,15,1) 0%, rgba(3,5,99,1) 100%)'); // Night gradient
    }

    // Enable transition after setting the initial color
    setTransition(true);
  }, []);

  return (
    <div
      className={transition ? 'app-container transition' : 'app-container'} // Add or remove transition class
      style={{ backgroundImage: bgColor }} // Use backgroundImage instead of backgroundColor for gradients
    >
      <h1>Hello world</h1>
      {/* Your website content goes here */}
    </div>
  );
};

export default App;

