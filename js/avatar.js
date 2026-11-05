/* ================= 3D AVATAR PEEK COMPANION (js/avatar.js) =================
   - Renders the interactive 3D hero avatar waving from behind the chatbot toggle.
   - Resets animation to frame 0 on every popup for uniform two-hand wave cycles.
   - Delays initial appearance until 3.5s after preloader completion.
   - Holds the visible greeting for 1.0 additional second before ducking down.
   - Halts WebGL draw loops when hidden to eliminate idle GPU load.
*/

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { assetUrl, rafThrottle } from './config.js';

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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // 3. Lighting Configuration
  const ambient = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
  keyLight.position.set(0, 2.5, 3);
  scene.add(keyLight);

  const purpleRim = new THREE.DirectionalLight(0xa855f7, 2.2);
  purpleRim.position.set(-1.8, 1.5, -1);
  scene.add(purpleRim);

  // 4. Align Directly Above Chatbot Floating Toggle Button
  function alignToButton() {
    const rect = chatbotBtn.getBoundingClientRect();
    if (!rect || rect.width === 0) return;

    const btnCenterX = rect.left + rect.width / 2;
    const wrapperWidth = 180;

    wrapper.style.left = `${btnCenterX - wrapperWidth / 2}px`;
    wrapper.style.bottom = `${window.innerHeight - (rect.top + 10)}px`;
  }

  alignToButton();
  window.addEventListener('resize', rafThrottle(alignToButton), { passive: true });

  // 5. Load GLB Model with Supabase CDN & Local Fallback
  let mixer = null;
  let waveAction = null;
  let clipDurationMs = 3800;
  let waveLoops = 1;

  const clock = new THREE.Clock();
  const loader = new GLTFLoader();
  const LOCAL_MODEL_PATH = 'assets/models/hero-2hand-wave.glb';
  const MODEL_URL = assetUrl(LOCAL_MODEL_PATH);

  const onModelSuccess = (gltf) => {
    const character = gltf.scene;
    character.scale.setScalar(0.99);

    // Positions chest and face above button rim with natural tilt
    character.position.set(0, 0.18, 0);
    character.rotation.z = 0.2;
    character.rotation.y = 0.04;

    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(character);
      const clip = gltf.animations[0];
      waveAction = mixer.clipAction(clip);

      waveLoops = clip.duration < 2.2 ? 2 : 1;
      clipDurationMs = Math.round(clip.duration * waveLoops * 1000);

      waveAction.setLoop(THREE.LoopRepeat, waveLoops);
      waveAction.clampWhenFinished = true;

      // Holds pose for 1.0 extra second after wave finishes before ducking down
      mixer.addEventListener('finished', () => {
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
          duckDown();
        }, 1000);
      });
    }

    scene.add(character);
    startPeekLoop();
  };

  loader.load(
    MODEL_URL,
    onModelSuccess,
    undefined,
    () => {
      if (MODEL_URL !== LOCAL_MODEL_PATH) {
        loader.load(LOCAL_MODEL_PATH, onModelSuccess, undefined, (err) => {
          console.error('[Avatar] Failed to load 3D model:', err);
        });
      }
    }
  );

  // 6. On-Demand Render Loop (Zero Idle GPU Usage When Hidden)
  let isRendering = false;
  let rafId = null;

  function renderFrame() {
    if (!isRendering) return;
    rafId = requestAnimationFrame(renderFrame);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    renderer.render(scene, camera);
  }

  function startRendering() {
    if (isRendering) return;
    isRendering = true;
    clock.getDelta();
    renderFrame();
  }

  function stopRendering() {
    isRendering = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // 7. Spawn & Visibility Controller
  let hideTimeout = null;
  let stopRenderTimeout = null;

  function isChatOpen() {
    if (!chatWindow) return false;
    const isHidden = chatWindow.classList.contains('hidden');
    const isDisplayNone = window.getComputedStyle(chatWindow).display === 'none';
    const isVisibilityHidden = window.getComputedStyle(chatWindow).visibility === 'hidden';
    return !(isHidden || isDisplayNone || isVisibilityHidden);
  }

  function duckDown() {
    clearTimeout(hideTimeout);
    wrapper.classList.remove('is-peeking');

    // Smooth 600ms render transition while avatar sinks behind the button
    clearTimeout(stopRenderTimeout);
    stopRenderTimeout = setTimeout(() => {
      if (!wrapper.classList.contains('is-peeking')) {
        stopRendering();
      }
    }, 600);
  }

  function showPeek() {
    if (isChatOpen() || document.body.classList.contains('beyond-world-open')) return;

    alignToButton();
    clearTimeout(stopRenderTimeout);

    // Restarts gesture cleanly from frame 0
    if (waveAction) {
      waveAction.reset();
      waveAction.paused = false;
      waveAction.setLoop(THREE.LoopRepeat, waveLoops);
      waveAction.play();
    }

    wrapper.classList.add('is-peeking');
    startRendering();

    // Fallback timer (+1000ms added for the extra visible hold time)
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      duckDown();
    }, clipDurationMs + 1350);
  }

  // Instant dismissal when user activates the chatbot button
  chatbotBtn.addEventListener('click', () => {
    clearTimeout(hideTimeout);
    clearTimeout(stopRenderTimeout);
    wrapper.classList.remove('is-peeking');
    stopRendering();
  });

  // 8. Start Peek Loop: Waits 3.5s after preloader finishes
  function startPeekLoop() {
    const beginInterval = () => {
      setTimeout(() => {
        showPeek();
        setInterval(showPeek, 15000);
      }, 3500); // 1.5s additional delay after preloader completes
    };

    if (document.getElementById('site-preloader')) {
      window.addEventListener('preloader:done', beginInterval, { once: true });
    } else {
      beginInterval();
    }
  }
}