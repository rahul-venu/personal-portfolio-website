// js/avatar.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function initAvatar() {
  const canvas = document.getElementById('avatar-peek-canvas');
  const wrapper = document.getElementById('avatar-peek-wrapper');
  const chatbotBtn = document.getElementById('chatbot-toggle');
  const chatWindow = document.getElementById('chatbot-window');

  if (!canvas || !wrapper || !chatbotBtn) return;

  // 1. Scene & Camera Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 180 / 130, 0.1, 50);
  camera.position.set(0, 1.28, 2.05); 

  // 2. WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(180, 130);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 3. Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
  keyLight.position.set(0, 2.5, 3);
  scene.add(keyLight);

  const purpleRim = new THREE.DirectionalLight(0xa855f7, 2.2);
  purpleRim.position.set(-1.8, 1.5, -1);
  scene.add(purpleRim);

  // 4. Align Directly to the Chatbot Circle Button
  // 4. Align Directly to the Chatbot Circle Button
  function alignToButton() {
    const rect = chatbotBtn.getBoundingClientRect();
    if (!rect || rect.width === 0) return;

    const btnCenterX = rect.left + rect.width / 2;
    const wrapperWidth = 180;

    // 1. Center him directly over the button horizontally
    wrapper.style.left = `${btnCenterX - wrapperWidth / 2}px`;

    // 2. Sinks his waist down halfway behind the circular button
    // (Increase 55 to sink him deeper; decrease to lift him higher)
    wrapper.style.bottom = `${window.innerHeight - (rect.top + 10)}px`;
  }

  alignToButton();
  window.addEventListener('resize', alignToButton);

  // 5. Load GLB Model
  let mixer;
  const clock = new THREE.Clock();
  const loader = new GLTFLoader();
  const MODEL_PATH = 'assets/models/hero-2hand-wave.glb';

  loader.load(
    MODEL_PATH,
    (gltf) => {
      const character = gltf.scene;

      character.scale.setScalar(0.99);

      // =====================================================================
      // 🎛️ RAISED POSITION: 0.20 lifts his face & chest out of the button
      // (Increase to 0.24 to show even more chest; decrease to 0.16 to lower)
      character.position.set(0, 0.18, 0); 

      // Left tilt
      character.rotation.z = 0.2; 
      character.rotation.y = 0.04;
      // =====================================================================

      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(character);
        const wave = mixer.clipAction(gltf.animations[0]);
        wave.play();
      }

      scene.add(character);
      startPeekLoop();
    },
    undefined,
    (err) => console.error('[Avatar] Error:', err)
  );

  // 6. Spawn Logic: Blocked when Chat is Open
  let hideTimeout;

  // Helper: Checks if the chat window is currently active/open
  function isChatOpen() {
    if (!chatWindow) return false;
    const isHidden = chatWindow.classList.contains('hidden');
    const isDisplayNone = window.getComputedStyle(chatWindow).display === 'none';
    const isVisibilityHidden = window.getComputedStyle(chatWindow).visibility === 'hidden';
    
    // If any of these are true, the chat is closed; otherwise, it's open
    return !(isHidden || isDisplayNone || isVisibilityHidden);
  }

  function showPeek() {
    // RULE: If chat is open, do NOT pop up
    if (isChatOpen()) return;

    alignToButton();
    wrapper.classList.add('is-peeking');

    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      wrapper.classList.remove('is-peeking');
    }, 3800);
  }

  // INSTANT DISMISS: If avatar is waving and user clicks to open chat, duck down immediately
  chatbotBtn.addEventListener('click', () => {
    clearTimeout(hideTimeout);
    wrapper.classList.remove('is-peeking');
  });

  function startPeekLoop() {
    setTimeout(() => {
      showPeek();
      // Runs every 15s, but skips automatically if chat is open
      setInterval(showPeek, 15000);
    }, 2000);
  }

  // 7. Render Loop
  function animate() {
  requestAnimationFrame(animate);
  // Only render when the avatar is visible on screen
  if (wrapper.classList.contains('is-peeking')) {
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    renderer.render(scene, camera);
  }
}
animate();
}