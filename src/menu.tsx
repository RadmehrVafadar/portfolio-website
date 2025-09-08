import React, { useState } from 'react';
import './menu.css'


const Menu = () => {



    return (
        <>
        <div className="container">
            <a href="/portfolio-game/" className="button">Start</a>
            <a href="/blog/"  className='button'>Blog</a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className='button'>Resume</a> 

        </div>
        </>
    );
};


export default Menu;