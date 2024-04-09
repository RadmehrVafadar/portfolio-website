import React, { useState, useEffect } from 'react';
import './Background.css';

const Background = () => {
  const [bgColor, setBgColor] = useState('');
  const [transition, setTransition] = useState(false);
  const [sunPosition, setSunPosition] = useState({ x: 0, y: 0 });
  const [moonPosition, setMoonPosition] = useState({ x: 0, y: 0 });
  const [showMoon, setShowMoon] = useState(false);

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

  useEffect(() => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    const angle = ((hours * 60 + minutes) * 60 + seconds) / 86400 * 360;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const radius = Math.min(centerX, centerY) * 0.8;

    const sunX = centerX + radius * Math.cos((angle * Math.PI) / 180);
    const sunY = centerY + radius * Math.sin((angle * Math.PI) / 180);

    const moonX = centerX + radius * Math.cos(((angle + 180) * Math.PI) / 180);
    const moonY = centerY + radius * Math.sin(((angle + 180) * Math.PI) / 180);

    setSunPosition({ x: sunX, y: sunY });
    setMoonPosition({ x: moonX, y: moonY });

    const isNight = hours >= 18 || hours < 6;
    const isEvening = hours >= 16 && hours < 18;
    setShowMoon(isNight || isEvening);
  }, []);

  return (
    <div>
      <div
        className={transition ? 'app-container transition' : 'app-container'}
        style={{ backgroundImage: bgColor }}
      >
        <div
          style={{
            backgroundImage: 'url(./assets/clouds.png)',
            backgroundRepeat: 'repeat-x',
            width: '100%',
            height: '100vh',
          }}
        ></div>

        <div>
          <div
            className="sun"
            onClick={() => window.open('https://google.com')}
            style={{
              position: 'absolute',
              left: sunPosition.x - 25,
              top: sunPosition.y - 25,
              width: '100px',
              height: '100px',
              background:
                'radial-gradient(circle, rgba(248,251,63,1) 0%, rgba(252,189,70,1) 100%)',
              borderRadius: '50%',
            }}
          />
          {showMoon && (
            <div
              className="moon"
              onClick={() => window.open('https://google.com')}
              style={{
                position: 'absolute',
                left: moonPosition.x - 20,
                top: moonPosition.y - 20,
                width: '60px',
                height: '60px',
                backgroundColor: 'gray',
                borderRadius: '50%',
                opacity: showMoon ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Background;

