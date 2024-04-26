import React, { useState } from 'react';
import './menu.css'


const Menu = () => {



    return (
        <>
        <div className="container">
            <a href="/src/portfolio-game/game.html" className="button">Start</a>
            <div className='button'>Blog</div>
            <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className='button'>Resume</a> 

        </div>
        </>
    );
};


export default Menu;