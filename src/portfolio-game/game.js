var character = document.querySelector(".character");
var map = document.querySelector(".map");
var previousInteract = false;
var interact = false


//start in the middle of the map
var x = 90;
var y = 94;
var held_directions = []; //State of which arrow keys we are holding down
var speed = 2; //How fast the character moves in pixels per frame





const placeCharacter = () => {
   
   var pixelSize = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--pixel-size')
   );
   
   const held_direction = held_directions[0];
   if (held_direction) {
      if (held_direction === directions.right) {x += speed;}
      if (held_direction === directions.left) {x -= speed;}
      if (held_direction === directions.down) {y += speed;}
      if (held_direction === directions.up) {y -= speed;}
      character.setAttribute("facing", held_direction);
   }
   character.setAttribute("walking", held_direction ? "true" : "false");


   //Limits (gives the illusion of walls)
   var leftLimit = -7;
   var rightLimit = (16 * 11)+7;
   var topLimit = 80;
   var bottomLimit = (16 * 31.5);
   if (x < leftLimit) { x = leftLimit; }
   if (x > rightLimit) { x = rightLimit; }
   if (y < topLimit) { y = topLimit; }
   if (y > bottomLimit) { y = bottomLimit; }



   //Standing points (gives placement to text pop ups)

   if (interact) {
      console.log([x,y])
   }
   //Interaction points change when pixel ratio size changes **needs updating
   if (x > 80 && x < 100 && y > 100 && y < 120) {
      if (interact && !previousInteract) {
            var dialogueBox = document.querySelector('.dialogueBox');
            dialogueBox.textContent = "";
            var text = document.createTextNode("Hello and welcome to my game...");
            dialogueBox.appendChild(text);
            dialogueBox.style.display = 'block';
      }
   } else if (x > 28 && x < 46 && y > 278 && y < 300) {
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
   38: directions.up,
   37: directions.left,
   39: directions.right,
   40: directions.down,
}
document.addEventListener("keydown", (e) => {
   var dir = keys[e.which];

   if (e.key == 'e') {
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

document.getElementById('exit_button').addEventListener('mouseup', () => { window.location.href = '/index.html'})