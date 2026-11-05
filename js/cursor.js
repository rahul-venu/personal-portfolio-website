/* ================= INTERACTIVE DUAL CUSTOM CURSOR (js/cursor.js) =================
   - Renders a precision solid silver center dot and lerp-smoothed concentric follower ring.
   - Positions elements via GPU-accelerated translate3d transforms to prevent layout reflows.
   - Binds passive pointer listeners and expands on clickable UI targets.
*/

export function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  window.addEventListener(
    'mousemove',
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    },
    { passive: true }
  );

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.transform = `translate3d(${followerX.toFixed(2)}px, ${followerY.toFixed(2)}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderFollower);
  }
  renderFollower();

  const hoverTargets = document.querySelectorAll('a, button, article, [role="button"], input, textarea, .chat-chip');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'), { passive: true });
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'), { passive: true });
  });
}