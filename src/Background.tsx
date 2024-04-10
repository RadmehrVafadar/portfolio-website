import React, { useState, useEffect } from 'react';
import './Background.css';

const Background = () => {
  const [bgColor, setBgColor] = useState('');
  const [transition, setTransition] = useState(false);


  useEffect(() => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    if (currentHour >= 6 && currentHour < 12) {
      setBgColor(
        'linear-gradient(0deg, rgba(45,188,253,1) 0%, rgba(34,91,195,1) 100%)'
      ); // Morning gradient
    } else if (currentHour >= 12 && currentHour < 18) {
      setBgColor(
        'linear-gradient(0deg, rgba(45,98,253,1) 0%, rgba(254,135,15,1) 100%)'
      ); // Afternoon gradient
    } else {
      setBgColor(
        'linear-gradient(0deg, rgba(3,5,99,1) 0%, rgba(11,12,15,1) 40%)'
      ); // Night gradient
    }

    setTransition(true);
  }, []);


  return (
    <div>
      <div
        className={transition ? 'app-container transition' : 'app-container'}
        style={{ backgroundImage: bgColor }}
      >
        <div
        className='movingClouds'
        />

        <div>
          <div
            className="sun"
            onClick={() => window.open('https://google.com')}
          />
        </div>
      </div>
    </div>
  );
};

export default Background;

