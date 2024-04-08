import React, { useState, useEffect } from 'react';

const SunMoon = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sunPosition, setSunPosition] = useState({ x: 0, y: 0 });
  const [moonPosition, setMoonPosition] = useState({ x: 0, y: 0 });
  const [showMoon, setShowMoon] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
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
  }, [currentTime]);

  return (
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
          backgroundColor: 'yellow',
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
  );
};

export default SunMoon;