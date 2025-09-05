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

// Track if player has moved from spawn position
var hasPlayerMoved = false;
var initialX = x;
var initialY = y;





// Statue system configuration
// Each statue defines a collision rectangle (player cannot enter)
// and an optional interaction padding to allow interacting slightly around it.
var STATUE_DEFAULT_INTERACT_PADDING = 10;

var statues = [
   // Example statue. Duplicate and edit for more statues.
   { id: "Mirror", rect: { x1: 0, y1: 110, x2: 30, y2: 160 }, text: "Hey a mirror! Maybe I can see what I look like in it.", interactPadding: 10 },
];

function pointInRect(px, py, rect) {
   return px >= rect.x1 && px <= rect.x2 && py >= rect.y1 && py <= rect.y2;
}

function inflateRect(rect, padding) {
   return {
      x1: rect.x1 - padding,
      y1: rect.y1 - padding,
      x2: rect.x2 + padding,
      y2: rect.y2 + padding,
   };
}

function isCollidingWithAnyStatue(nextX, nextY) {
   for (var i = 0; i < statues.length; i++) {
      var s = statues[i];
      if (pointInRect(nextX, nextY, s.rect)) {
         return true;
      }
   }
   return false;
}

function getNearbyStatue(px, py) {
   for (var i = 0; i < statues.length; i++) {
      var s = statues[i];
      var padding = (typeof s.interactPadding === 'number') ? s.interactPadding : STATUE_DEFAULT_INTERACT_PADDING;
      var interactRect = inflateRect(s.rect, padding);
      if (pointInRect(px, py, interactRect)) {
         return s;
      }
   }
   return null;
}

const placeCharacter = () => {
   
   var pixelSize = getCurrentPixelSize();
   
   const held_direction = held_directions[0];
   if (held_direction) {
      var dx = 0;
      var dy = 0;
      if (held_direction === directions.left) { dx += speed; }
      if (held_direction === directions.right) { dx -= speed; }
      if (held_direction === directions.up) { dy += speed; }
      if (held_direction === directions.down) { dy -= speed; }

      // Attempt horizontal move if not colliding with any statue
      if (dx !== 0) {
         var nextX = x + dx;
         if (!isCollidingWithAnyStatue(nextX, y)) {
            x = nextX;
         }
      }

      // Attempt vertical move if not colliding with any statue
      if (dy !== 0) {
         var nextY = y + dy;
         if (!isCollidingWithAnyStatue(x, nextY)) {
            y = nextY;
         }
      }

      character.setAttribute("facing", held_direction);

      // Check if player has moved from initial position
      if (!hasPlayerMoved && (x !== initialX || y !== initialY)) {
         hasPlayerMoved = true;
      }
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
   
   var dialogueBox = document.querySelector('.dialogueBox');
   
   // Show welcome message automatically at spawn, hide when player moves
   if (!hasPlayerMoved) {
      dialogueBox.innerHTML = "Welcome to my portfolio showcase game! Navigate with the arrow keys. Press Spacebar or E to interact. To exit, interact with the door.";
      dialogueBox.style.display = 'block';
   } else {
      // Handle other interactions after player has moved
      var nearbyStatue = getNearbyStatue(x, y);
      if (nearbyStatue && interact && !previousInteract) {
         dialogueBox.innerHTML = nearbyStatue.text || "";
         dialogueBox.style.display = 'block';
      } else if (!nearbyStatue) {
         dialogueBox.style.display = 'none';
      }
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
   if ((e.key === ' ' || (typeof e.key === 'string' && e.key.toLowerCase() === 'e')) && x > 70 && x < 130 && y < 100) {
    window.location.href = '/index.html'
   }

   if (dir && held_directions.indexOf(dir) === -1) {
      held_directions.unshift(dir)
   }

   if (e.key === ' ' || (typeof e.key === 'string' && e.key.toLowerCase() === 'e')) { interact = true }
})

document.addEventListener("keyup", (e) => {
   var dir = keys[e.which];
   var index = held_directions.indexOf(dir);
   if (index > -1) {
      held_directions.splice(index, 1)
   }

   if (e.key === ' ' || (typeof e.key === 'string' && e.key.toLowerCase() === 'e')) { interact = false }
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