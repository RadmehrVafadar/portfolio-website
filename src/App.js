import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { easing } from 'maath'

function Suzanne(props) {
  const mesh = useRef()
  const { nodes } = useGLTF('./suzanne.glb')
  const [dummy] = useState(() => new THREE.Object3D())
  useFrame((state, dt) => {
    dummy.lookAt(state.pointer.x, state.pointer.y, 1)
    easing.dampQ(mesh.current.quaternion, dummy.quaternion, 0.15, dt)
  })
  return (
    <mesh ref={mesh} geometry={nodes.Suzanne.geometry} {...props}>
      <meshNormalMaterial />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0.1, 12] }}>
      <ambientLight />
      <directionalLight position={[10, 10, 10]} />
      <Suzanne />
    </Canvas>
  )
}



var TxtType = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
  this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
  this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
  delta = this.period;
  this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
  this.isDeleting = false;
  this.loopNum++;
  delta = 500;
  }

  setTimeout(function() {
  that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('typewrite');
  for (var i=0; i<elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-type');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
  document.body.appendChild(css);
};
