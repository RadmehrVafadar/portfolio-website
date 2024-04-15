
import React, { useState } from 'react';
import './Background.css';

const Background = () => {
  const [isDay, setIsDay] = useState(true);

  const toggleDayNight = () => {
    setIsDay(!isDay);
  };

  return (
    <div>
      <div
        className={"app-container " + (isDay ? "" : "night")}
      >
        <div className="clouds" />
        <div>
          <div
            className={"sphear " + (isDay ? "sun" : "moon")}
            onClick={() => toggleDayNight()}
          />
        </div>
      </div>
    </div>
  );
};

export default Background;
