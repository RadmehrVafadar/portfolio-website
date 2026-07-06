
import { useState } from 'react';
import './Background.css';

const Background = () => {
  function decideTime() {
    const time = new Date().getHours();
    return time < 18;
  }

  const [isDay, setIsDay] = useState(decideTime);

  const toggleDayNight = () => {
    setIsDay(!isDay);
  };

  return (
    <div>
      <div className={`app-container ${isDay ? '' : 'night'}`}>
        <div className="clouds" />
        <button className={`sphear ${isDay ? 'sun' : 'moon'}`} onClick={toggleDayNight} type="button">
          Click me
        </button>
      </div>
    </div>
  );
};

export default Background;
