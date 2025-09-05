var character = document.querySelector(".character");
var map = document.querySelector(".map");
var previousInteract = false;
var interact = false

// Get current pixel size for scaling calculations
function getCurrentPixelSize() {
   return parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--pixel-size')
   );
}

//start in the middle of the map
var x = 90;
var y = 94;
var held_directions = []; //State of which arrow keys we are holding down
var speed = 2; //How fast the character moves in pixels per frame

// Store initial pixel size to maintain coordinate consistency
var initialPixelSize = getCurrentPixelSize();





const placeCharacter = () => {
   
   var pixelSize = getCurrentPixelSize();
   
   const held_direction = held_directions[0];
   if (held_direction) {
      if (held_direction === directions.left) {x += speed;}
      if (held_direction === directions.right) {x -= speed;}
      if (held_direction === directions.up) {y += speed;}
      if (held_direction === directions.down) {y -= speed;}
      character.setAttribute("facing", held_direction);
   }
   character.setAttribute("walking", held_direction ? "true" : "false");


   //Limits (gives the illusion of walls) - now scale with pixel size
   var leftLimit = 0;
   var rightLimit = (16 * 12) + 12;
   var topLimit = 90;
   var bottomLimit = (16 * 36.7);
   if (x < leftLimit) { x = leftLimit; }
   if (x > rightLimit) { x = rightLimit; }
   if (y < topLimit) { y = topLimit; }
   if (y > bottomLimit) { y = bottomLimit; }



   //Standing points (gives placement to text pop ups)
   //Now using grid-based coordinates that scale properly
   
   if (interact) {
      console.log([x,y])
   }
   
   // Interaction points now scale with the grid system (16px per grid cell)
   // Welcome message interaction area (approximately 5-6 grid cells from start, 6-7.5 cells down)
   var welcomeAreaLeft = 80;
   var welcomeAreaRight = 100;
   var welcomeAreaTop = 100;
   var welcomeAreaBottom = 120;
   
   // Statue interaction area (approximately 1.75-2.875 grid cells from left, 17.375-18.75 cells down)  
   var statueAreaLeft = 28;
   var statueAreaRight = 46;
   var statueAreaTop = 258;
   var statueAreaBottom = 300;
   
   if (x > welcomeAreaLeft && x < welcomeAreaRight && y > welcomeAreaTop && y < welcomeAreaBottom) {
      if (interact && !previousInteract) {
            var dialogueBox = document.querySelector('.dialogueBox');
            dialogueBox.textContent = "";
            var text = document.createTextNode("Hello and welcome to my game...");
            dialogueBox.appendChild(text);
            dialogueBox.style.display = 'block';
      }
   } else if (x > statueAreaLeft && x < statueAreaRight && y > statueAreaTop && y < statueAreaBottom) {
      if (interact && !previousInteract) {
            var dialogueBox = document.querySelector('.dialogueBox');
            dialogueBox.textContent = "";
            var text = document.createTextNode("this is going to be an explanation of a statue");
            dialogueBox.appendChild(text);
            dialogueBox.style.display = 'block';
      }
   } else {
        document.querySelector('.dialogueBox').style.display = 'none';
   }
      previousInteract = interact;

      
      var camera_left = pixelSize * 66;
      var camera_top = pixelSize * 42;
      
      map.style.transform = `translate3d( ${-x*pixelSize+camera_left}px, ${-y*pixelSize+camera_top}px, 0 )`;
      character.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0 )`;  
};


//Set up the game loop
const step = () => {
   placeCharacter();
   window.requestAnimationFrame(() => {
      step();
   })
}
step(); //kick off the first step!



/* Direction key state */
const directions = {
   up: "up",
   down: "down",
   left: "left",
   right: "right",
}
const keys = {
   40: directions.up,
   39: directions.left,
   37: directions.right,
   38: directions.down,
}
document.addEventListener("keydown", (e) => {
   var dir = keys[e.which];

   // Exit area interaction (top of the map)
   if (e.key == 'e' && x > 70 && x < 130 && y > 80) {
    window.location.href = '/index.html'
   }

   if (dir && held_directions.indexOf(dir) === -1) {
      held_directions.unshift(dir)
   }

   if (e.key == ' ') { interact = true }
})

document.addEventListener("keyup", (e) => {
   var dir = keys[e.which];
   var index = held_directions.indexOf(dir);
   if (index > -1) {
      held_directions.splice(index, 1)
   }

   if (e.key == ' ') { interact = false }
});



/* BONUS! Dpad functionality for mouse and touch */
var isPressed = false;
const removePressedAll = () => {
   document.querySelectorAll(".dpad-button").forEach(d => {
      d.classList.remove("pressed")
   })
}
document.body.addEventListener("mousedown", () => {
   isPressed = true;
})
document.body.addEventListener("mouseup", () => {
   isPressed = false;
   held_directions = [];
   removePressedAll();
})
const handleDpadPress = (direction, click) => {   
   if (click) {
      isPressed = true;
   }
   held_directions = (isPressed) ? [direction] : []
   
   if (isPressed) {
      removePressedAll();
      document.querySelector(".dpad-"+ direction).classList.add("pressed");
   }
}



//Bind a ton of events for the dpad
document.querySelector(".dpad-left").addEventListener("touchstart", (e) => handleDpadPress(directions.left, true));
document.querySelector(".dpad-up").addEventListener("touchstart", (e) => handleDpadPress(directions.up, true));
document.querySelector(".dpad-right").addEventListener("touchstart", (e) => handleDpadPress(directions.right, true));
document.querySelector(".dpad-down").addEventListener("touchstart", (e) => handleDpadPress(directions.down, true));

document.querySelector(".dpad-left").addEventListener("mousedown", (e) => handleDpadPress(directions.left, true));
document.querySelector(".dpad-up").addEventListener("mousedown", (e) => handleDpadPress(directions.up, true));
document.querySelector(".dpad-right").addEventListener("mousedown", (e) => handleDpadPress(directions.right, true));
document.querySelector(".dpad-down").addEventListener("mousedown", (e) => handleDpadPress(directions.down, true));

document.querySelector(".dpad-left").addEventListener("mouseover", (e) => handleDpadPress(directions.left));
document.querySelector(".dpad-up").addEventListener("mouseover", (e) => handleDpadPress(directions.up));
document.querySelector(".dpad-right").addEventListener("mouseover", (e) => handleDpadPress(directions.right));
document.querySelector(".dpad-down").addEventListener("mouseover", (e) => handleDpadPress(directions.down));

// Handle window resize to maintain proper scaling
window.addEventListener('resize', () => {
   // Force a recalculation on the next frame
   window.requestAnimationFrame(() => {
      placeCharacter();
   });
});