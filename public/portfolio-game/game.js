var character = document.querySelector('.character');
var map = document.querySelector('.map');
var dialogueBox = document.querySelector('.dialogueBox');
var actionPrompt = document.querySelector('.actionPrompt');
var roomName = document.querySelector('.roomName');

var previousInteract = false;
var interact = false;
var openedLinkThisPress = false;
var transitionCooldown = 0;
var recentTouchUntil = 0;

var speed = 2;
var held_directions = [];

var directions = {
   up: 'up',
   down: 'down',
   left: 'left',
   right: 'right',
};

var keys = {
   40: directions.up,
   39: directions.left,
   37: directions.right,
   38: directions.down,
};

var ROOM_DATA = {
   lobby: {
      id: 'lobby',
      name: 'Portfolio Lobby',
      theme: 'lobby',
      size: { width: 224, height: 224 },
      bounds: { x1: 18, y1: 72, x2: 190, y2: 190 },
      spawn: { x: 104, y: 150, facing: 'down' },
      dialogue: 'Welcome to my portfolio showcase game! Navigate with the arrow keys. Press Spacebar or E to interact. Walk through side doors to visit more rooms.',
      exits: [
         {
            id: 'main-site',
            label: 'Exit',
            rect: { x1: 82, y1: 54, x2: 138, y2: 78 },
            text: 'The front door leads to the exit arcade.',
            targetRoom: 'exit',
            spawn: { x: 104, y: 154, facing: 'up' },
         },
         {
            id: 'projects-door',
            label: 'Projects',
            rect: { x1: 190, y1: 126, x2: 222, y2: 170 },
            text: 'The workshop is full of project demos and build notes.',
            targetRoom: 'projects',
            spawn: { x: 30, y: 148, facing: 'right' },
         },
         {
            id: 'lab-door',
            label: 'Experiments',
            rect: { x1: 2, y1: 126, x2: 30, y2: 170 },
            text: 'The lab glows with smaller experiments and prototypes.',
            targetRoom: 'lab',
            spawn: { x: 178, y: 148, facing: 'left' },
         },
         {
            id: 'skills-door',
            label: 'Skills',
            rect: { x1: 82, y1: 190, x2: 138, y2: 222 },
            text: 'A side room turns the portfolio into a skills shelf.',
            targetRoom: 'skills',
            spawn: { x: 104, y: 82, facing: 'down' },
         },
      ],
      blockers: [
         { id: 'welcome-desk', rect: { x1: 82, y1: 116, x2: 142, y2: 140 }, type: 'desk' },
         { id: 'plant-left', rect: { x1: 38, y1: 78, x2: 58, y2: 104 }, type: 'plant' },
         { id: 'plant-right', rect: { x1: 164, y1: 78, x2: 184, y2: 104 }, type: 'plant' },
         { id: 'bench', rect: { x1: 70, y1: 180, x2: 154, y2: 198 }, type: 'bench' },
      ],
      interactables: [
         {
            id: 'mirror',
            label: 'Mirror',
            rect: { x1: 32, y1: 118, x2: 58, y2: 154 },
            text: 'Hey, a mirror! Maybe I can see what I look like in it.',
            url: 'https://www.linkedin.com/in/radmehrv/',
            type: 'mirror',
            solid: true,
            interactPadding: 12,
         },
         {
            id: 'map-board',
            label: 'Room Map',
            rect: { x1: 156, y1: 118, x2: 184, y2: 154 },
            text: 'The map splits this portfolio into rooms: projects to the right, experiments to the left, and the main site through the front door.',
            type: 'board',
            solid: true,
            interactPadding: 12,
         },
      ],
   },
   projects: {
      id: 'projects',
      name: 'Project Workshop',
      theme: 'workshop',
      size: { width: 260, height: 224 },
      bounds: { x1: 22, y1: 72, x2: 232, y2: 190 },
      spawn: { x: 30, y: 148, facing: 'right' },
      dialogue: 'This workshop collects the larger builds. Press Space near a display to read about it, or E when a display has a link.',
      exits: [
         {
            id: 'lobby-door',
            label: 'Lobby',
            rect: { x1: 0, y1: 126, x2: 28, y2: 170 },
            text: 'Back to the portfolio lobby.',
            targetRoom: 'lobby',
            spawn: { x: 176, y: 148, facing: 'left' },
         },
         {
            id: 'lab-service-door',
            label: 'Lab',
            rect: { x1: 232, y1: 126, x2: 258, y2: 170 },
            text: 'A service door connects the workshop to the experiments lab.',
            targetRoom: 'lab',
            spawn: { x: 30, y: 148, facing: 'right' },
         },
      ],
      blockers: [
         { id: 'workbench-top', rect: { x1: 70, y1: 82, x2: 188, y2: 104 }, type: 'bench' },
         { id: 'tool-cart', rect: { x1: 204, y1: 86, x2: 226, y2: 124 }, type: 'cart' },
         { id: 'parts-crate', rect: { x1: 44, y1: 174, x2: 84, y2: 198 }, type: 'crate' },
      ],
      interactables: [
         {
            id: 'boids',
            label: 'Boids Algorithm',
            rect: { x1: 48, y1: 118, x2: 86, y2: 154 },
            text: 'A bird simulation? Maybe I can learn something from its flocking behavior.',
            url: 'https://radmehrvafadar.github.io/Boids-algorithm-demo/',
            type: 'terminal',
            solid: true,
            interactPadding: 12,
         },
         {
            id: 'fake-news',
            label: 'Fake News Detector',
            rect: { x1: 112, y1: 120, x2: 150, y2: 158 },
            text: 'An AI fake news detector? I wonder how it checks a headline before trusting it.',
            url: 'https://github.com/RadmehrVafadar/AI-fake-news-detector',
            type: 'monitor',
            solid: true,
            interactPadding: 12,
         },
         {
            id: 'distributed-video',
            label: 'Distributed Video Player',
            rect: { x1: 176, y1: 120, x2: 216, y2: 158 },
            text: 'A distributed video player that can play videos from multiple sources.',
            url: 'https://github.com/RadmehrVafadar/Distributed-Video-Streaming',
            type: 'screen',
            solid: true,
            interactPadding: 12,
         },
      ],
   },
   lab: {
      id: 'lab',
      name: 'Experiment Lab',
      theme: 'lab',
      size: { width: 240, height: 224 },
      bounds: { x1: 20, y1: 72, x2: 210, y2: 190 },
      spawn: { x: 178, y: 148, facing: 'left' },
      dialogue: 'The experiment lab keeps the smaller playful builds. The glowing objects are readable, and some open project links with E.',
      exits: [
         {
            id: 'lobby-door',
            label: 'Lobby',
            rect: { x1: 210, y1: 126, x2: 238, y2: 170 },
            text: 'Back to the portfolio lobby.',
            targetRoom: 'lobby',
            spawn: { x: 34, y: 148, facing: 'right' },
         },
         {
            id: 'workshop-door',
            label: 'Workshop',
            rect: { x1: 0, y1: 126, x2: 28, y2: 170 },
            text: 'The workshop door leads to the larger project displays.',
            targetRoom: 'projects',
            spawn: { x: 218, y: 148, facing: 'left' },
         },
         {
            id: 'archive-door',
            label: 'Archive',
            rect: { x1: 92, y1: 190, x2: 148, y2: 222 },
            text: 'A quiet archive keeps writing and notes nearby.',
            targetRoom: 'archive',
            spawn: { x: 116, y: 82, facing: 'down' },
         },
      ],
      blockers: [
         { id: 'lab-table', rect: { x1: 76, y1: 82, x2: 164, y2: 106 }, type: 'lab-table' },
         { id: 'server-rack', rect: { x1: 32, y1: 86, x2: 58, y2: 132 }, type: 'server' },
         { id: 'cabinet', rect: { x1: 184, y1: 84, x2: 206, y2: 128 }, type: 'cabinet' },
      ],
      interactables: [
         {
            id: 'music-orb',
            label: 'Music Orb',
            rect: { x1: 68, y1: 126, x2: 106, y2: 164 },
            text: 'A magical orb that visualises my favourite songs.',
            url: 'https://github.com/RadmehrVafadar/voiceEmotionVisualizer',
            type: 'orb',
            solid: true,
            interactPadding: 12,
         },
         {
            id: 'minesweeper',
            label: 'MineSweeper',
            rect: { x1: 134, y1: 126, x2: 174, y2: 164 },
            text: 'A recreation of the classic game Minesweeper from scratch in Python using pygame.',
            url: 'https://github.com/RadmehrVafadar/mine-sweeper',
            type: 'grid',
            solid: true,
            interactPadding: 12,
         },
         {
            id: 'resume',
            label: 'Resume',
            rect: { x1: 102, y1: 174, x2: 140, y2: 198 },
            text: 'A neatly printed resume rests here for anyone who wants the non-game version.',
            url: '/resume.pdf',
            type: 'paper',
            solid: true,
            interactPadding: 10,
         },
      ],
   },
   skills: {
      id: 'skills',
      name: 'Skills Room',
      theme: 'skills',
      size: { width: 224, height: 224 },
      bounds: { x1: 18, y1: 72, x2: 190, y2: 190 },
      spawn: { x: 104, y: 82, facing: 'down' },
      dialogue: 'The skills room keeps the toolkit compact: frontend, Python, AI experiments, graphics, and distributed systems.',
      exits: [
         {
            id: 'lobby-door',
            label: 'Lobby',
            rect: { x1: 82, y1: 54, x2: 138, y2: 78 },
            text: 'Back to the portfolio lobby.',
            targetRoom: 'lobby',
            spawn: { x: 104, y: 176, facing: 'up' },
         },
      ],
      blockers: [
         { id: 'skills-shelf', rect: { x1: 54, y1: 90, x2: 172, y2: 112 }, type: 'bench' },
         { id: 'server-rack', rect: { x1: 164, y1: 120, x2: 190, y2: 170 }, type: 'server' },
      ],
      interactables: [
         {
            id: 'frontend',
            label: 'Frontend',
            rect: { x1: 38, y1: 126, x2: 72, y2: 160 },
            text: 'Frontend: React, TypeScript, CSS, and interfaces that keep their intent readable.',
            type: 'screen',
            solid: true,
            interactPadding: 12,
         },
         {
            id: 'systems',
            label: 'Systems',
            rect: { x1: 96, y1: 128, x2: 130, y2: 162 },
            text: 'Systems: networking, distributed playback, and debugging behavior across moving parts.',
            type: 'terminal',
            solid: true,
            interactPadding: 12,
         },
         {
            id: 'ai-tools',
            label: 'AI Tools',
            rect: { x1: 38, y1: 170, x2: 72, y2: 200 },
            text: 'AI: practical experiments that connect model behavior to product behavior.',
            type: 'orb',
            solid: true,
            interactPadding: 12,
         },
      ],
   },
   archive: {
      id: 'archive',
      name: 'Blog Archive',
      theme: 'archive',
      size: { width: 240, height: 224 },
      bounds: { x1: 20, y1: 72, x2: 210, y2: 190 },
      spawn: { x: 116, y: 82, facing: 'down' },
      dialogue: 'The archive stores writing, notes, and a few paper trails for anyone who wants the non-arcade version.',
      exits: [
         {
            id: 'lab-door',
            label: 'Lab',
            rect: { x1: 92, y1: 54, x2: 148, y2: 78 },
            text: 'Back to the experiment lab.',
            targetRoom: 'lab',
            spawn: { x: 116, y: 176, facing: 'up' },
         },
      ],
      blockers: [
         { id: 'top-shelves', rect: { x1: 38, y1: 90, x2: 202, y2: 110 }, type: 'crate' },
         { id: 'bottom-shelves', rect: { x1: 38, y1: 174, x2: 202, y2: 194 }, type: 'crate' },
      ],
      interactables: [
         {
            id: 'blog',
            label: 'Blog',
            rect: { x1: 70, y1: 124, x2: 108, y2: 158 },
            text: 'Blog portal: open the writing archive from the main site.',
            url: '/blog/',
            type: 'terminal',
            solid: true,
            interactPadding: 12,
         },
         {
            id: 'resume',
            label: 'Resume',
            rect: { x1: 134, y1: 126, x2: 172, y2: 156 },
            text: 'A neatly printed resume rests here for anyone who wants the paper version.',
            url: '/resume.pdf',
            type: 'paper',
            solid: true,
            interactPadding: 12,
         },
      ],
   },
   exit: {
      id: 'exit',
      name: 'Exit Arcade',
      theme: 'exit',
      size: { width: 224, height: 224 },
      bounds: { x1: 18, y1: 72, x2: 190, y2: 190 },
      spawn: { x: 104, y: 154, facing: 'up' },
      dialogue: 'Exit Arcade: Space or E at the home door returns to the main portfolio. The north door goes back to the lobby.',
      exits: [
         {
            id: 'lobby-door',
            label: 'Lobby',
            rect: { x1: 82, y1: 54, x2: 138, y2: 78 },
            text: 'Back to the portfolio lobby.',
            targetRoom: 'lobby',
            spawn: { x: 104, y: 86, facing: 'down' },
         },
         {
            id: 'home-door',
            label: 'Home',
            rect: { x1: 82, y1: 176, x2: 138, y2: 214 },
            text: 'Return to the main portfolio menu.',
            url: '/index.html',
         },
      ],
      blockers: [
         { id: 'ticket-left', rect: { x1: 42, y1: 122, x2: 78, y2: 150 }, type: 'bench' },
         { id: 'ticket-right', rect: { x1: 150, y1: 122, x2: 186, y2: 150 }, type: 'bench' },
      ],
      interactables: [
         {
            id: 'goodbye-sign',
            label: 'Goodbye Sign',
            rect: { x1: 88, y1: 106, x2: 132, y2: 136 },
            text: 'Thanks for playing. The main portfolio is one glowing door south.',
            type: 'board',
            solid: true,
            interactPadding: 12,
         },
      ],
   },
};

var currentRoomId = 'lobby';
var currentRoom = ROOM_DATA[currentRoomId];
var x = currentRoom.spawn.x;
var y = currentRoom.spawn.y;
var initialX = x;
var initialY = y;
var hasPlayerMoved = false;

function getCurrentPixelSize() {
   return parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'),
      10
   );
}

function getRectBounds(rect) {
   return {
      left: Math.min(rect.x1, rect.x2),
      right: Math.max(rect.x1, rect.x2),
      top: Math.min(rect.y1, rect.y2),
      bottom: Math.max(rect.y1, rect.y2),
   };
}

function pointInRect(px, py, rect) {
   var bounds = getRectBounds(rect);
   return px >= bounds.left && px <= bounds.right && py >= bounds.top && py <= bounds.bottom;
}

function inflateRect(rect, padding) {
   var bounds = getRectBounds(rect);
   return {
      x1: bounds.left - padding,
      y1: bounds.top - padding,
      x2: bounds.right + padding,
      y2: bounds.bottom + padding,
   };
}

function setPixelRect(element, rect) {
   var bounds = getRectBounds(rect);
   element.style.left = 'calc(var(--pixel-size) * ' + bounds.left + ')';
   element.style.top = 'calc(var(--pixel-size) * ' + bounds.top + ')';
   element.style.width = 'calc(var(--pixel-size) * ' + (bounds.right - bounds.left) + ')';
   element.style.height = 'calc(var(--pixel-size) * ' + (bounds.bottom - bounds.top) + ')';
}

function createRoomNode(className, item) {
   var node = document.createElement('div');
   node.className = className;
   if (item.type) {
      node.className += ' prop-' + item.type;
   }
   if (item.label) {
      node.setAttribute('aria-label', item.label);
   }
   node.dataset.id = item.id;
   setPixelRect(node, item.rect);
   map.appendChild(node);
}

function renderRoom() {
   map.querySelectorAll('.room-prop, .room-title').forEach(function (node) {
      node.remove();
   });

   map.className = 'map pixel-art room-' + currentRoom.theme;
   map.style.width = 'calc(var(--pixel-size) * ' + currentRoom.size.width + ')';
   map.style.height = 'calc(var(--pixel-size) * ' + currentRoom.size.height + ')';

   var title = document.createElement('div');
   title.className = 'room-title';
   title.textContent = currentRoom.name;
   map.appendChild(title);

   currentRoom.exits.forEach(function (exit) {
      createRoomNode('room-prop room-exit', exit);
   });
   currentRoom.blockers.forEach(function (blocker) {
      createRoomNode('room-prop room-blocker', blocker);
   });
   currentRoom.interactables.forEach(function (interactable) {
      createRoomNode('room-prop room-interactable', interactable);
   });

   map.appendChild(character);

   if (roomName) {
      roomName.textContent = currentRoom.name;
   }
}

function getSolidRects() {
   var solids = currentRoom.blockers.map(function (blocker) {
      return blocker.rect;
   });

   currentRoom.interactables.forEach(function (interactable) {
      if (interactable.solid) {
         solids.push(interactable.rect);
      }
   });

   return solids;
}

function isBlocked(nextX, nextY) {
   var solids = getSolidRects();
   for (var i = 0; i < solids.length; i++) {
      if (pointInRect(nextX, nextY, solids[i])) {
         return true;
      }
   }
   return false;
}

function getNearbyInteractable(px, py) {
   for (var i = 0; i < currentRoom.interactables.length; i++) {
      var item = currentRoom.interactables[i];
      var padding = typeof item.interactPadding === 'number' ? item.interactPadding : 10;
      if (pointInRect(px, py, inflateRect(item.rect, padding))) {
         return item;
      }
   }
   return null;
}

function getNearbyExit(px, py) {
   for (var i = 0; i < currentRoom.exits.length; i++) {
      var exit = currentRoom.exits[i];
      if (pointInRect(px, py, inflateRect(exit.rect, 8))) {
         return exit;
      }
   }
   return null;
}

function getEnteredExit(px, py) {
   for (var i = 0; i < currentRoom.exits.length; i++) {
      var exit = currentRoom.exits[i];
      if (pointInRect(px, py, exit.rect)) {
         return exit;
      }
   }
   return null;
}

function clampToRoomBounds() {
   var bounds = getRectBounds(currentRoom.bounds);
   if (x < bounds.left) { x = bounds.left; }
   if (x > bounds.right) { x = bounds.right; }
   if (y < bounds.top) { y = bounds.top; }
   if (y > bounds.bottom) { y = bounds.bottom; }
}

function setRoom(roomId, spawnOverride) {
   currentRoomId = roomId;
   currentRoom = ROOM_DATA[currentRoomId];

   var spawn = spawnOverride || currentRoom.spawn;
   x = spawn.x;
   y = spawn.y;
   initialX = x;
   initialY = y;
   hasPlayerMoved = false;
   transitionCooldown = 18;

   if (spawn.facing) {
      character.setAttribute('facing', spawn.facing);
   }

   renderRoom();
   showDialogue(currentRoom.dialogue);
   if (actionPrompt) {
      actionPrompt.style.display = 'none';
   }
}

function useExit(exit) {
   if (!exit) {
      return;
   }

   if (exit.targetRoom) {
      setRoom(exit.targetRoom, exit.spawn);
      return;
   }

   if (exit.url) {
      window.location.href = exit.url;
   }
}

function showDialogue(text) {
   if (!dialogueBox) {
      return;
   }

   dialogueBox.textContent = text || '';
   dialogueBox.style.display = text ? 'block' : 'none';
}

function hideDialogue() {
   if (dialogueBox) {
      dialogueBox.style.display = 'none';
   }
}

function updateActionPrompt() {
   if (!actionPrompt) {
      return;
   }

   var nearbyInteractable = getNearbyInteractable(x, y);
   var nearbyExit = getNearbyExit(x, y);

   if (nearbyInteractable) {
      actionPrompt.textContent = nearbyInteractable.url ? 'Space: read  E: open link' : 'Space: read';
      actionPrompt.style.display = 'block';
      return;
   }

   if (nearbyExit) {
      if (nearbyExit.targetRoom) {
         actionPrompt.textContent = 'Doorway: walk through  Space: enter';
      } else {
         actionPrompt.textContent = 'Space or E: exit';
      }
      actionPrompt.style.display = 'block';
      return;
   }

   actionPrompt.style.display = 'none';
}

function performReadOrInteract() {
   var nearbyInteractable = getNearbyInteractable(x, y);
   if (nearbyInteractable) {
      showDialogue(nearbyInteractable.text);
      return;
   }

   var nearbyExit = getNearbyExit(x, y);
   if (nearbyExit) {
      useExit(nearbyExit);
   }
}

function performOpen() {
   var nearbyInteractable = getNearbyInteractable(x, y);
   if (nearbyInteractable && nearbyInteractable.url && !openedLinkThisPress) {
      window.open(nearbyInteractable.url, '_blank', 'noopener');
      openedLinkThisPress = true;
      return;
   }

   var nearbyExit = getNearbyExit(x, y);
   if (nearbyExit && nearbyExit.url) {
      useExit(nearbyExit);
   }
}

function updateMovement() {
   var heldDirection = held_directions[0];
   if (!heldDirection) {
      character.setAttribute('walking', 'false');
      return;
   }

   var dx = 0;
   var dy = 0;
   if (heldDirection === directions.left) { dx += speed; }
   if (heldDirection === directions.right) { dx -= speed; }
   if (heldDirection === directions.up) { dy += speed; }
   if (heldDirection === directions.down) { dy -= speed; }

   if (dx !== 0) {
      var nextX = x + dx;
      if (!isBlocked(nextX, y)) {
         x = nextX;
      }
   }

   if (dy !== 0) {
      var nextY = y + dy;
      if (!isBlocked(x, nextY)) {
         y = nextY;
      }
   }

   clampToRoomBounds();
   character.setAttribute('facing', heldDirection);
   character.setAttribute('walking', 'true');

   if (!hasPlayerMoved && (x !== initialX || y !== initialY)) {
      hasPlayerMoved = true;
      hideDialogue();
   }
}

function updateDoorways() {
   if (transitionCooldown > 0) {
      transitionCooldown -= 1;
      return;
   }

   var enteredExit = getEnteredExit(x, y);
   if (enteredExit && enteredExit.targetRoom) {
      useExit(enteredExit);
   }
}

function placeCharacter() {
   var pixelSize = getCurrentPixelSize();

   updateMovement();
   updateDoorways();

   if (interact && !previousInteract) {
      performReadOrInteract();
   } else if (!hasPlayerMoved) {
      showDialogue(currentRoom.dialogue);
   } else if (!getNearbyInteractable(x, y) && !getNearbyExit(x, y)) {
      hideDialogue();
   }

   updateActionPrompt();
   previousInteract = interact;

   var cameraLeft = pixelSize * 66;
   var cameraTop = pixelSize * 84;

   map.style.transform = 'translate3d( ' + (-x * pixelSize + cameraLeft) + 'px, ' + (-y * pixelSize + cameraTop) + 'px, 0 )';
   character.style.transform = 'translate3d( ' + (x * pixelSize) + 'px, ' + (y * pixelSize) + 'px, 0 )';
}

function step() {
   placeCharacter();
   window.requestAnimationFrame(function () {
      step();
   });
}

document.addEventListener('keydown', function (e) {
   var dir = keys[e.which];

   if (dir || e.key === ' ' || (typeof e.key === 'string' && e.key.toLowerCase() === 'e')) {
      e.preventDefault();
   }

   if (typeof e.key === 'string' && e.key.toLowerCase() === 'e') {
      performOpen();
   }

   if (dir && held_directions.indexOf(dir) === -1) {
      held_directions.unshift(dir);
   }

   if (e.key === ' ' || (typeof e.key === 'string' && e.key.toLowerCase() === 'e')) {
      interact = true;
   }
});

document.addEventListener('keyup', function (e) {
   var dir = keys[e.which];
   var index = held_directions.indexOf(dir);
   if (index > -1) {
      held_directions.splice(index, 1);
   }

   if (e.key === ' ' || (typeof e.key === 'string' && e.key.toLowerCase() === 'e')) {
      interact = false;
   }
   if (typeof e.key === 'string' && e.key.toLowerCase() === 'e') {
      openedLinkThisPress = false;
   }
});

var isPressed = false;
function removePressedAll() {
   document.querySelectorAll('.dpad-button').forEach(function (button) {
      button.classList.remove('pressed');
   });
}

document.body.addEventListener('mousedown', function () {
   isPressed = true;
});
document.body.addEventListener('mouseup', function () {
   isPressed = false;
   held_directions = [];
   removePressedAll();
});
document.body.addEventListener('touchend', function () {
   isPressed = false;
   held_directions = [];
   removePressedAll();
});
document.body.addEventListener('touchcancel', function () {
   isPressed = false;
   held_directions = [];
   removePressedAll();
});

function handleDpadPress(visualButton, direction, click, event) {
   if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
   }
   if (event && event.type === 'touchstart') {
      recentTouchUntil = Date.now() + 700;
   }
   if (event && event.type === 'mousedown' && Date.now() < recentTouchUntil) {
      return;
   }

   if (click) {
      isPressed = true;
   }
   held_directions = isPressed ? [direction] : [];

   if (isPressed) {
      removePressedAll();
      var btn = document.querySelector('.dpad-' + visualButton);
      if (btn) {
         btn.classList.add('pressed');
      }
   }
}

document.querySelector('.dpad-left').addEventListener('touchstart', function (e) {
   handleDpadPress('left', directions.right, true, e);
});
document.querySelector('.dpad-up').addEventListener('touchstart', function (e) {
   handleDpadPress('up', directions.down, true, e);
});
document.querySelector('.dpad-right').addEventListener('touchstart', function (e) {
   handleDpadPress('right', directions.left, true, e);
});
document.querySelector('.dpad-down').addEventListener('touchstart', function (e) {
   handleDpadPress('down', directions.up, true, e);
});

document.querySelector('.dpad-left').addEventListener('mousedown', function (e) {
   handleDpadPress('left', directions.right, true, e);
});
document.querySelector('.dpad-up').addEventListener('mousedown', function (e) {
   handleDpadPress('up', directions.down, true, e);
});
document.querySelector('.dpad-right').addEventListener('mousedown', function (e) {
   handleDpadPress('right', directions.left, true, e);
});
document.querySelector('.dpad-down').addEventListener('mousedown', function (e) {
   handleDpadPress('down', directions.up, true, e);
});

document.querySelector('.dpad-left').addEventListener('mouseover', function () {
   handleDpadPress('left', directions.right);
});
document.querySelector('.dpad-up').addEventListener('mouseover', function () {
   handleDpadPress('up', directions.down);
});
document.querySelector('.dpad-right').addEventListener('mouseover', function () {
   handleDpadPress('right', directions.left);
});
document.querySelector('.dpad-down').addEventListener('mouseover', function () {
   handleDpadPress('down', directions.up);
});

window.addEventListener('resize', function () {
   window.requestAnimationFrame(function () {
      placeCharacter();
   });
});

var btnSpace = document.querySelector('.btn-space');
var btnE = document.querySelector('.btn-e');

function handleSpaceDown(e) {
   if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
   }
   if (e && e.type === 'touchstart') {
      recentTouchUntil = Date.now() + 700;
   }
   if (e && e.type === 'mousedown' && Date.now() < recentTouchUntil) {
      return;
   }
   interact = true;
}

function handleSpaceUp(e) {
   if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
   }
   interact = false;
}

function handleEDown(e) {
   if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
   }
   if (e && e.type === 'touchstart') {
      recentTouchUntil = Date.now() + 700;
   }
   if (e && e.type === 'mousedown' && Date.now() < recentTouchUntil) {
      return;
   }
   performOpen();
   interact = true;
}

function handleEUp(e) {
   if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
   }
   interact = false;
   openedLinkThisPress = false;
}

if (btnSpace) {
   btnSpace.addEventListener('touchstart', handleSpaceDown);
   btnSpace.addEventListener('mousedown', handleSpaceDown);
   btnSpace.addEventListener('touchend', handleSpaceUp);
   btnSpace.addEventListener('mouseup', handleSpaceUp);
   btnSpace.addEventListener('mouseleave', handleSpaceUp);
}
if (btnE) {
   btnE.addEventListener('touchstart', handleEDown);
   btnE.addEventListener('mousedown', handleEDown);
   btnE.addEventListener('touchend', handleEUp);
   btnE.addEventListener('mouseup', handleEUp);
   btnE.addEventListener('mouseleave', handleEUp);
}

renderRoom();
step();
