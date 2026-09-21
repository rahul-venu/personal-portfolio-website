export function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let dpr = 1;
  let particles = [];

  // Mouse tracking
  const mouse = {
    x: null,
    y: null,
    speed: 0,
    radius: 150,
    active: false,
  };

  // 3D Camera & Perspective
  const fov = 540;
  const cameraZ = 680;
  let rotX = 0.26;
  let rotY = -0.38;

  function resize() {
    const parent = canvas.parentElement;
    dpr = window.devicePixelRatio || 1;
    width = parent.offsetWidth;
    height = parent.offsetHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    buildAbstractManifold();
  }

  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    if (mouse.x !== null && mouse.y !== null) {
      mouse.speed = Math.hypot(curX - mouse.x, curY - mouse.y);
    }

    mouse.x = curX;
    mouse.y = curY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.speed = 0;
  });

  // Generates the Asymmetric 3D Fluid Wave
  function buildAbstractManifold() {
    particles = [];
    const scale = Math.min(width, height) * 0.32;

    const uSteps = 64;
    const vSteps = 50;

    for (let i = 0; i < uSteps; i++) {
      for (let j = 0; j < vSteps; j++) {
        const u = (i / (uSteps - 1) - 0.5) * 2.4;
        const v = (j / (vSteps - 1) - 0.5) * 2.0;

        const wave1 = Math.sin(u * 2.6 + v * 1.8) * 85;
        const wave2 = Math.cos(u * 3.8 - v * 2.2) * 45;
        const wave3 = Math.sin(Math.hypot(u, v) * 3.6) * 30;

        let x0 = u * scale + Math.sin(v * 2.2) * (scale * 0.25);
        let y0 = wave1 + wave2 - wave3;
        let z0 = v * scale * 0.9 + Math.cos(u * 2.4) * (scale * 0.3);

        const thick = (Math.random() - 0.5) * 32;
        x0 += Math.cos(u * 3) * thick;
        y0 += thick * 0.8;
        z0 += Math.sin(v * 3) * thick;

        const t = Math.min(1, Math.max(0, (u - v * 0.8 + 1.4) / 2.8));
        let r, g, b;
        let isSpark = false;

        if (t < 0.4) {
          const sub = t / 0.4;
          r = Math.floor(244 + (217 - 244) * sub);
          g = Math.floor(63 + (70 - 63) * sub);
          b = Math.floor(140 + (239 - 140) * sub);
        } else if (t < 0.72) {
          const sub = (t - 0.4) / 0.32;
          r = Math.floor(168 + (79 - 168) * sub);
          g = Math.floor(85 + (70 - 85) * sub);
          b = Math.floor(247 + (229 - 247) * sub);
        } else {
          const sub = (t - 0.72) / 0.28;
          r = Math.floor(6 + (224 - 6) * sub);
          g = Math.floor(182 + (242 - 182) * sub);
          b = Math.floor(212 + (254 - 212) * sub);
          if (sub > 0.85 && Math.random() > 0.5) isSpark = true;
        }

        particles.push({
          baseX: x0,
          baseY: y0,
          baseZ: z0,
          x: x0,
          y: y0,
          z: z0,
          vx: 0, vy: 0, vz: 0,
          projX: 0, projY: 0,
          scale: 1,
          rgb: `${r}, ${g}, ${b}`,
          isSpark: isSpark,
          disturbed: 0,
          part: (i + j) % 4,
          size: isSpark ? 2.4 : Math.random() * 0.8 + 1.4
        });
      }
    }
  }

  // Animation Loop
  let time = 0;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    time += 0.014;

    // Fluid 3D drift
    rotY += 0.0024;
    rotX = 0.24 + Math.sin(time * 0.3) * 0.05;

    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    const centerX = width > 1024 ? width * 0.54 : width * 0.5;
    const centerY = height * 0.44;

    const disturbedList = [];
    const pulseIntensity = Math.sin(time * 9) * 0.25 + 0.85;

    // 1. UPDATE 3D POSITIONS & PHYSICS
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      const wave = Math.sin(p.baseX * 0.015 + time * 1.6) * Math.cos(p.baseZ * 0.015 + time) * 6;
      const targetY = p.baseY + wave;

      const x1 = p.baseX * cosY - p.baseZ * sinY;
      const z1 = p.baseX * sinY + p.baseZ * cosY;

      const y1 = targetY * cosX - z1 * sinX;
      const z2 = targetY * sinX + z1 * cosX;

      const depth = cameraZ + p.z;
      p.scale = Math.min(1.2, Math.max(0.42, fov / depth));
      p.projX = centerX + p.x * p.scale;
      p.projY = centerY + p.y * p.scale;

      // 2. MOUSE DISTURBANCE (Direct impulse + momentum)
      if (mouse.active && mouse.x !== null) {
        const dx = p.projX - mouse.x;
        const dy = p.projY - mouse.y;
        const dist2D = Math.hypot(dx, dy);

        if (dist2D < mouse.radius) {
          const proximity = 1 - dist2D / mouse.radius;
          const energy = Math.pow(proximity, 1.2) * (18 + Math.min(mouse.speed * 0.7, 40));
          const angle = Math.atan2(dy, dx);

          p.vx += Math.cos(angle) * energy * 0.95 + (Math.random() - 0.5) * 8;
          p.vy += Math.sin(angle) * energy * 0.95 + (Math.random() - 0.5) * 8;
          p.vz += (Math.random() - 0.5) * energy * 2.5;

          p.disturbed = Math.min(1.0, p.disturbed + energy * 0.05);
        }
      }

      // 3. FREE 3D FLOATING PHYSICS & 4-PART STAGGERED RECOVERY
  if (p.disturbed > 0.04) {
    const freeDrag = 0.948;
    p.vx *= freeDrag;
    p.vy *= freeDrag;
    p.vz *= freeDrag;

    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;

    // 4 STAGGERED HANG-TIMES:
    // Part 0 calms down fast (0.955) -> Part 3 floats the longest (0.992)
    const partDecays = [0.975, 0.980, 0.985, 0.992];
    p.disturbed *= partDecays[p.part];

    disturbedList.push(p);

  } else {
    p.disturbed = 0;

    // 4 STAGGERED PULL SPEEDS:
    // Part 0 snaps home firmly -> Part 3 drifts back gently
    const springSpeeds = [0.040, 0.032, 0.024, 0.016];
    const gentleSpring = springSpeeds[p.part];
    const smoothDamping = 0.86;

    p.vx = (p.vx + (x1 - p.x) * gentleSpring) * smoothDamping;
    p.vy = (p.vy + (y1 - p.y) * gentleSpring) * smoothDamping;
    p.vz = (p.vz + (z2 - p.z) * gentleSpring) * smoothDamping;

    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;
  }
    }

    // ================= 4. SYNAPTIC CONNECTION PULSES =================

    // A. ELECTRIC ARCS DIRECTLY TO MOUSE CURSOR 
    if (mouse.active && mouse.x !== null) {
      const mouseReach = mouse.radius + 75; 
      let mouseArcs = 0;

      // Sample evenly across particles surrounding the cursor
      for (let i = 0; i < particles.length; i += 3) {
        if (mouseArcs >= 35) break;
        const p = particles[i];
        const dx = p.projX - mouse.x;
        const dy = p.projY - mouse.y;
        const dist = Math.hypot(dx, dy);

        // Fires lightning lines from surrounding particles into the mouse
        if (dist < mouseReach && dist > 25) {
          const arcAlpha = Math.max(0.2, (1 - dist / mouseReach) * 0.85 * pulseIntensity);
          ctx.strokeStyle = `rgba(56, 189, 248, ${arcAlpha})`;
          ctx.lineWidth = 1.1 * p.scale;
          ctx.beginPath();
          ctx.moveTo(p.projX, p.projY);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();

          // Spark dot at connection node
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(p.projX - 1.5, p.projY - 1.5, 3, 3);
          mouseArcs++;
        }
      }
    }

    // B. INTER-PARTICLE SYNAPTIC WEB 
    if (disturbedList.length > 0) {
      const maxDist = 105; 
      const maxDistSq = maxDist * maxDist;

      // Sample evenly from all directions of the cloud
      const stride = Math.max(1, Math.floor(disturbedList.length / 160));
      const sampled = [];
      for (let k = 0; k < disturbedList.length; k += stride) {
        sampled.push(disturbedList[k]);
      }

      for (let i = 0; i < sampled.length; i++) {
        const p1 = sampled[i];
        for (let j = i + 1; j < sampled.length; j++) {
          const p2 = sampled[j];
          const dx = p1.projX - p2.projX;
          const dy = p1.projY - p2.projY;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            // High-contrast, bright electric lines 
            const alpha = Math.max(0.2, (1 - dist / maxDist) * 0.8 * pulseIntensity);

            ctx.strokeStyle = `rgba(${p1.rgb}, ${alpha})`;
            ctx.lineWidth = 1.0 * Math.max(p1.scale, p2.scale);
            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            ctx.stroke();
          }
        }
      }
    }

    // 5. RENDER 3D DEPTH-SORTED VOXELS
    particles.sort((a, b) => b.z - a.z);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      const dotSize = Math.min(3.5, Math.max(1.1, p.size * p.scale));
      const depthAlpha = Math.min(0.95, Math.max(0.25, 0.48 + (p.z / 240) * 0.45));

      ctx.fillStyle = `rgba(${p.rgb}, ${depthAlpha})`;
      ctx.fillRect(p.projX - dotSize / 2, p.projY - dotSize / 2, dotSize, dotSize);

      if (p.isSpark || p.z > 70) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(p.projX - dotSize * 0.25, p.projY - dotSize * 0.25, dotSize * 0.5, dotSize * 0.5);
      }
    }

    requestAnimationFrame(animate);
  }

  resize();
  animate();
}