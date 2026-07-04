var character = document.querySelector('.character');
var map = document.querySelector('.map');
var dialogueBox = document.querySelector('.dialogueBox');
var actionPrompt = document.querySelector('.actionPrompt');
var roomName = document.querySelector('.roomName');

var directions = {
   up: 'up',
   down: 'down',
   left: 'left',
   right: 'right',
};

var keys = {
   37: directions.left,
   38: directions.up,
   39: directions.right,
   40: directions.down,
};

var speed = 2;
var heldDirections = [];
var interact = false;
var previousInteract = false;
var openedLinkThisPress = false;
var hasPlayerMoved = false;
var transitionCooldown = 0;
var recentTouchUntil = 0;

var PLAYER = {
   width: 32,
   height: 32,
   feetLeft: 9,
   feetTop: 23,
   feetRight: 23,
   feetBottom: 31,
};

var ROOMS = {
   lobby: {
      name: 'Lobby',
      theme: 'lobby',
      spawn: { x: 59, y: 128, facing: 'down' },
      bounds: { x1: 8, y1: 24, x2: 142, y2: 176 },
      intro: 'Welcome to the Raddest arcade. Arrow keys move. Space reads. E opens links. Walk into glowing doors.',
      exits: [
         { id: 'projects', label: 'Projects', rect: { x1: 59, y1: 22, x2: 91, y2: 34 }, targetRoom: 'projects', spawn: { x: 59, y: 128, facing: 'up' } },
         { id: 'lab', label: 'Lab', rect: { x1: 118, y1: 86, x2: 148, y2: 122 }, targetRoom: 'lab', spawn: { x: 18, y: 140, facing: 'right' } },
         { id: 'skills', label: 'Skills', rect: { x1: 2, y1: 86, x2: 32, y2: 122 }, targetRoom: 'skills', spawn: { x: 84, y: 104, facing: 'left' } },
         { id: 'exit', label: 'Exit', rect: { x1: 59, y1: 166, x2: 91, y2: 198 }, targetRoom: 'exit', spawn: { x: 59, y: 44, facing: 'down' } },
      ],
      props: [
         { id: 'desk', rect: { x1: 42, y1: 82, x2: 108, y2: 106 }, type: 'desk', solid: true },
         { id: 'lamp-left', rect: { x1: 20, y1: 42, x2: 38, y2: 64 }, type: 'plant', solid: true },
         { id: 'lamp-right', rect: { x1: 112, y1: 42, x2: 130, y2: 64 }, type: 'plant', solid: true },
      ],
      interactables: [
         {
            id: 'mirror',
            label: 'LinkedIn mirror',
            rect: { x1: 20, y1: 122, x2: 44, y2: 154 },
            type: 'mirror',
            solid: true,
            text: 'A professional mirror. It opens my LinkedIn profile.',
            url: 'https://www.linkedin.com/in/radmehrv/',
         },
         {
            id: 'map',
            label: 'Map terminal',
            rect: { x1: 110, y1: 122, x2: 134, y2: 154 },
            type: 'terminal',
            solid: true,
            text: 'Map: Projects north, Lab east, Skills west, Exit south.',
         },
      ],
   },
   projects: {
      name: 'Projects',
      theme: 'projects',
      spawn: { x: 59, y: 128, facing: 'up' },
      bounds: { x1: 8, y1: 24, x2: 142, y2: 176 },
      intro: 'Project cabinets are arranged with clear walkways. Space reads, E opens project links.',
      exits: [
         { id: 'lobby', label: 'Lobby', rect: { x1: 59, y1: 166, x2: 91, y2: 198 }, targetRoom: 'lobby', spawn: { x: 59, y: 44, facing: 'down' } },
         { id: 'archive', label: 'Archive', rect: { x1: 118, y1: 86, x2: 148, y2: 122 }, targetRoom: 'archive', spawn: { x: 18, y: 104, facing: 'right' } },
      ],
      props: [
         { id: 'bench', rect: { x1: 38, y1: 72, x2: 112, y2: 92 }, type: 'bench', solid: true },
      ],
      interactables: [
         {
            id: 'boids',
            label: 'Boids',
            rect: { x1: 18, y1: 104, x2: 46, y2: 138 },
            type: 'terminal',
            solid: true,
            text: 'Boids Algorithm Demo: simple local rules become flocking behavior.',
            url: 'https://radmehrvafadar.github.io/Boids-algorithm-demo/',
         },
         {
            id: 'fake-news',
            label: 'Fake News',
            rect: { x1: 62, y1: 104, x2: 90, y2: 138 },
            type: 'monitor',
            solid: true,
            text: 'AI Fake News Detector: a machine learning project for suspicious headlines.',
            url: 'https://github.com/RadmehrVafadar/AI-fake-news-detector',
         },
         {
            id: 'video',
            label: 'Distributed Video',
            rect: { x1: 106, y1: 104, x2: 134, y2: 138 },
            type: 'screen',
            solid: true,
            text: 'Distributed Video Streaming: playback assembled from multiple sources.',
            url: 'https://github.com/RadmehrVafadar/Distributed-Video-Streaming',
         },
      ],
   },
   lab: {
      name: 'Lab',
      theme: 'lab',
      spawn: { x: 18, y: 140, facing: 'right' },
      bounds: { x1: 8, y1: 24, x2: 142, y2: 176 },
      intro: 'The lab keeps smaller experiments and prototypes.',
      exits: [
         { id: 'lobby', label: 'Lobby', rect: { x1: 2, y1: 86, x2: 32, y2: 122 }, targetRoom: 'lobby', spawn: { x: 82, y: 104, facing: 'left' } },
         { id: 'projects', label: 'Projects', rect: { x1: 59, y1: 166, x2: 91, y2: 198 }, targetRoom: 'projects', spawn: { x: 59, y: 32, facing: 'down' } },
      ],
      props: [
         { id: 'table', rect: { x1: 42, y1: 62, x2: 108, y2: 84 }, type: 'lab-table', solid: true },
         { id: 'rack', rect: { x1: 112, y1: 36, x2: 136, y2: 84 }, type: 'server', solid: true },
      ],
      interactables: [
         {
            id: 'orb',
            label: 'Music Orb',
            rect: { x1: 36, y1: 118, x2: 66, y2: 148 },
            type: 'orb',
            solid: true,
            text: 'Voice Emotion Visualizer: audio turned into expressive motion.',
            url: 'https://github.com/RadmehrVafadar/voiceEmotionVisualizer',
         },
         {
            id: 'minesweeper',
            label: 'Minesweeper',
            rect: { x1: 86, y1: 118, x2: 116, y2: 148 },
            type: 'grid',
            solid: true,
            text: 'Minesweeper rebuilt from scratch in Python with pygame.',
            url: 'https://github.com/RadmehrVafadar/mine-sweeper',
         },
      ],
   },
   skills: {
      name: 'Skills',
      theme: 'skills',
      spawn: { x: 84, y: 104, facing: 'left' },
      bounds: { x1: 8, y1: 24, x2: 142, y2: 176 },
      intro: 'Skills are grouped as readable stations with open walkways.',
      exits: [
         { id: 'lobby', label: 'Lobby', rect: { x1: 118, y1: 86, x2: 148, y2: 122 }, targetRoom: 'lobby', spawn: { x: 50, y: 104, facing: 'right' } },
      ],
      props: [
         { id: 'shelf', rect: { x1: 34, y1: 62, x2: 116, y2: 84 }, type: 'bench', solid: true },
      ],
      interactables: [
         { id: 'frontend', label: 'Frontend', rect: { x1: 24, y1: 112, x2: 52, y2: 142 }, type: 'screen', solid: true, text: 'Frontend: React, TypeScript, CSS, and practical UI work.' },
         { id: 'systems', label: 'Systems', rect: { x1: 64, y1: 112, x2: 92, y2: 142 }, type: 'terminal', solid: true, text: 'Systems: networking, distributed playback, and debugging moving parts.' },
         { id: 'ai', label: 'AI', rect: { x1: 104, y1: 140, x2: 132, y2: 168 }, type: 'orb', solid: true, text: 'AI: experiments that connect model behavior to product behavior.' },
      ],
   },
   archive: {
      name: 'Archive',
      theme: 'archive',
      spawn: { x: 18, y: 104, facing: 'right' },
      bounds: { x1: 8, y1: 24, x2: 142, y2: 176 },
      intro: 'The archive keeps writing and paper links.',
      exits: [
         { id: 'projects', label: 'Projects', rect: { x1: 2, y1: 86, x2: 32, y2: 122 }, targetRoom: 'projects', spawn: { x: 84, y: 140, facing: 'left' } },
      ],
      props: [
         { id: 'shelves-top', rect: { x1: 26, y1: 50, x2: 124, y2: 70 }, type: 'crate', solid: true },
         { id: 'shelves-bottom', rect: { x1: 26, y1: 152, x2: 124, y2: 172 }, type: 'crate', solid: false },
      ],
      interactables: [
         { id: 'blog', label: 'Blog', rect: { x1: 52, y1: 100, x2: 82, y2: 134 }, type: 'terminal', solid: true, text: 'Open the blog archive.', url: '../blog/' },
         { id: 'resume', label: 'Resume', rect: { x1: 96, y1: 102, x2: 126, y2: 132 }, type: 'paper', solid: true, text: 'Open the resume PDF.', url: '../resume.pdf' },
      ],
   },
   exit: {
      name: 'Exit',
      theme: 'exit',
      spawn: { x: 59, y: 44, facing: 'down' },
      bounds: { x1: 8, y1: 24, x2: 142, y2: 176 },
      intro: 'The south door returns to the main portfolio. The north door returns to the lobby.',
      exits: [
         { id: 'lobby', label: 'Lobby', rect: { x1: 59, y1: 22, x2: 91, y2: 34 }, targetRoom: 'lobby', spawn: { x: 59, y: 128, facing: 'up' } },
         { id: 'home', label: 'Home', rect: { x1: 59, y1: 166, x2: 91, y2: 198 }, url: '../' },
      ],
      props: [
         { id: 'gate-left', rect: { x1: 24, y1: 106, x2: 54, y2: 130 }, type: 'bench', solid: true },
         { id: 'gate-right', rect: { x1: 96, y1: 106, x2: 126, y2: 130 }, type: 'bench', solid: true },
      ],
      interactables: [
         { id: 'sign', label: 'Exit sign', rect: { x1: 54, y1: 82, x2: 96, y2: 106 }, type: 'board', solid: true, text: 'Thanks for playing. Walk south to return to the website.' },
      ],
   },
};

var currentRoomId = 'lobby';
var currentRoom = ROOMS[currentRoomId];
var x = currentRoom.spawn.x;
var y = currentRoom.spawn.y;
var initialX = x;
var initialY = y;

function getCurrentPixelSize() {
   return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'), 10);
}

function normalizeRect(rect) {
   return {
      x1: Math.min(rect.x1, rect.x2),
      y1: Math.min(rect.y1, rect.y2),
      x2: Math.max(rect.x1, rect.x2),
      y2: Math.max(rect.y1, rect.y2),
   };
}

function rectsOverlap(a, b) {
   var ra = normalizeRect(a);
   var rb = normalizeRect(b);
   return ra.x1 < rb.x2 && ra.x2 > rb.x1 && ra.y1 < rb.y2 && ra.y2 > rb.y1;
}

function inflateRect(rect, padding) {
   var r = normalizeRect(rect);
   return { x1: r.x1 - padding, y1: r.y1 - padding, x2: r.x2 + padding, y2: r.y2 + padding };
}

function playerFeetAt(nextX, nextY) {
   return {
      x1: nextX + PLAYER.feetLeft,
      y1: nextY + PLAYER.feetTop,
      x2: nextX + PLAYER.feetRight,
      y2: nextY + PLAYER.feetBottom,
   };
}

function setPixelRect(element, rect) {
   var r = normalizeRect(rect);
   element.style.left = 'calc(var(--pixel-size) * ' + r.x1 + ')';
   element.style.top = 'calc(var(--pixel-size) * ' + r.y1 + ')';
   element.style.width = 'calc(var(--pixel-size) * ' + (r.x2 - r.x1) + ')';
   element.style.height = 'calc(var(--pixel-size) * ' + (r.y2 - r.y1) + ')';
}

function createRoomNode(item, role) {
   var node = document.createElement('div');
   node.className = 'room-prop ' + role;
   if (item.type) {
      node.className += ' prop-' + item.type;
   }
   node.dataset.id = item.id;
   node.setAttribute('aria-label', item.label || item.id);
   setPixelRect(node, item.rect);
   map.appendChild(node);
}

function renderRoom() {
   map.querySelectorAll('.room-prop, .room-title').forEach(function (node) {
      node.remove();
   });

   map.className = 'map pixel-art room-' + currentRoom.theme;
   map.style.width = 'calc(var(--pixel-size) * 150)';
   map.style.height = 'calc(var(--pixel-size) * 200)';

   var title = document.createElement('div');
   title.className = 'room-title';
   title.textContent = currentRoom.name;
   map.appendChild(title);

   currentRoom.exits.forEach(function (exit) {
      createRoomNode(exit, 'room-door');
   });
   currentRoom.props.forEach(function (prop) {
      createRoomNode(prop, 'room-blocker');
   });
   currentRoom.interactables.forEach(function (item) {
      createRoomNode(item, 'room-interactable');
   });

   map.appendChild(character);

   if (roomName) {
      roomName.textContent = currentRoom.name;
   }
}

function solidObjects() {
   return currentRoom.props.concat(currentRoom.interactables).filter(function (item) {
      return item.solid;
   });
}

function blocked(nextX, nextY) {
   var feet = playerFeetAt(nextX, nextY);
   var bounds = normalizeRect(currentRoom.bounds);

   if (feet.x1 < bounds.x1 || feet.x2 > bounds.x2 || feet.y1 < bounds.y1 || feet.y2 > bounds.y2) {
      return true;
   }

   return solidObjects().some(function (item) {
      return rectsOverlap(feet, item.rect);
   });
}

function nearbyInteractable() {
   var feet = playerFeetAt(x, y);
   for (var i = 0; i < currentRoom.interactables.length; i++) {
      var item = currentRoom.interactables[i];
      if (rectsOverlap(feet, inflateRect(item.rect, 12))) {
         return item;
      }
   }
   return null;
}

function nearbyExit() {
   var feet = playerFeetAt(x, y);
   for (var i = 0; i < currentRoom.exits.length; i++) {
      var exit = currentRoom.exits[i];
      if (rectsOverlap(feet, inflateRect(exit.rect, 8))) {
         return exit;
      }
   }
   return null;
}

function enteredExit() {
   var feet = playerFeetAt(x, y);
   for (var i = 0; i < currentRoom.exits.length; i++) {
      if (rectsOverlap(feet, currentRoom.exits[i].rect)) {
         return currentRoom.exits[i];
      }
   }
   return null;
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

function setActionPrompt(text) {
   if (!actionPrompt) {
      return;
   }
   actionPrompt.textContent = text || '';
   actionPrompt.style.display = text ? 'block' : 'none';
}

function enterRoom(roomId, spawnOverride) {
   currentRoomId = roomId;
   currentRoom = ROOMS[currentRoomId];

   var spawn = spawnOverride || currentRoom.spawn;
   x = spawn.x;
   y = spawn.y;
   initialX = x;
   initialY = y;
   hasPlayerMoved = false;
   transitionCooldown = 15;
   heldDirections = [];
   interact = false;
   previousInteract = false;
   openedLinkThisPress = false;

   character.setAttribute('facing', spawn.facing || 'down');
   character.setAttribute('walking', 'false');

   renderRoom();
   showDialogue(currentRoom.intro);
   setActionPrompt('');
   placeCharacter();
}

function useExit(exit) {
   if (!exit) {
      return;
   }
   if (exit.targetRoom) {
      enterRoom(exit.targetRoom, exit.spawn);
      return;
   }
   if (exit.url) {
      window.location.href = exit.url;
   }
}

function readOrInteract() {
   var item = nearbyInteractable();
   if (item) {
      showDialogue(item.text);
      return;
   }

   useExit(nearbyExit());
}

function openLink() {
   var item = nearbyInteractable();
   if (item && item.url && !openedLinkThisPress) {
      openedLinkThisPress = true;
      window.open(item.url, '_blank', 'noopener');
      return;
   }

   var exit = nearbyExit();
   if (exit && exit.url) {
      useExit(exit);
   }
}

function updateMovement() {
   var dir = heldDirections[0];
   if (!dir) {
      character.setAttribute('walking', 'false');
      return;
   }

   var dx = 0;
   var dy = 0;
   if (dir === directions.left) { dx = -speed; }
   if (dir === directions.right) { dx = speed; }
   if (dir === directions.up) { dy = -speed; }
   if (dir === directions.down) { dy = speed; }

   if (dx !== 0 && !blocked(x + dx, y)) {
      x += dx;
   }
   if (dy !== 0 && !blocked(x, y + dy)) {
      y += dy;
   }

   character.setAttribute('facing', dir);
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

   var exit = enteredExit();
   if (exit && exit.targetRoom) {
      useExit(exit);
   }
}

function updateUi() {
   var item = nearbyInteractable();
   var exit = nearbyExit();

   if (item) {
      setActionPrompt(item.url ? 'Space: read  E: open' : 'Space: read');
      return;
   }

   if (exit) {
      setActionPrompt(exit.targetRoom ? 'Doorway: walk through' : 'Space or E: exit');
      return;
   }

   setActionPrompt('');
   if (hasPlayerMoved) {
      hideDialogue();
   }
}

function placeCharacter() {
   var pixelSize = getCurrentPixelSize();

   updateMovement();
   updateDoorways();

   if (interact && !previousInteract) {
      readOrInteract();
   } else if (!hasPlayerMoved) {
      showDialogue(currentRoom.intro);
   }

   updateUi();
   previousInteract = interact;

   map.style.transform = 'translate3d(0, 0, 0)';
   character.style.transform = 'translate3d(' + (x * pixelSize) + 'px, ' + (y * pixelSize) + 'px, 0)';
}

function step() {
   placeCharacter();
   window.requestAnimationFrame(step);
}

document.addEventListener('keydown', function (e) {
   var dir = keys[e.which];
   var isAction = e.key === ' ' || (typeof e.key === 'string' && e.key.toLowerCase() === 'e');

   if (dir || isAction) {
      e.preventDefault();
   }

   if (dir && heldDirections.indexOf(dir) === -1) {
      heldDirections.unshift(dir);
   }

   if (isAction) {
      interact = true;
   }

   if (typeof e.key === 'string' && e.key.toLowerCase() === 'e') {
      openLink();
   }
});

document.addEventListener('keyup', function (e) {
   var dir = keys[e.which];
   var index = heldDirections.indexOf(dir);
   if (index > -1) {
      heldDirections.splice(index, 1);
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

function stopDpad() {
   isPressed = false;
   heldDirections = [];
   removePressedAll();
}

document.body.addEventListener('mouseup', stopDpad);
document.body.addEventListener('touchend', stopDpad);
document.body.addEventListener('touchcancel', stopDpad);

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

   heldDirections = isPressed ? [direction] : [];

   if (isPressed) {
      removePressedAll();
      var button = document.querySelector('.dpad-' + visualButton);
      if (button) {
         button.classList.add('pressed');
      }
   }
}

function bindDpad(selector, visualButton, direction) {
   var button = document.querySelector(selector);
   if (!button) {
      return;
   }
   button.addEventListener('touchstart', function (e) { handleDpadPress(visualButton, direction, true, e); });
   button.addEventListener('mousedown', function (e) { handleDpadPress(visualButton, direction, true, e); });
   button.addEventListener('mouseover', function (e) { handleDpadPress(visualButton, direction, false, e); });
   button.addEventListener('mouseleave', stopDpad);
}

bindDpad('.dpad-left', 'left', directions.left);
bindDpad('.dpad-up', 'up', directions.up);
bindDpad('.dpad-right', 'right', directions.right);
bindDpad('.dpad-down', 'down', directions.down);

window.addEventListener('resize', function () {
   window.requestAnimationFrame(placeCharacter);
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
   interact = true;
   openLink();
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

enterRoom(currentRoomId);
step();
