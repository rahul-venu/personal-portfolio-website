export function initScrollAnimations() {
  const sections = document.querySelectorAll('section');
  if (!sections.length) return;

  // Hero is 100% focused immediately
  sections[0].classList.add('page-active');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('page-active');
        } else {
          entry.target.classList.remove('page-active');
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -15% 0px',
    }
  );

  sections.forEach((sec) => observer.observe(sec));

  // ================= TIGHT-RANGE (35px) NAVBAR DOCKING (DESKTOP ONLY) =================
  // Only gently aligns full-viewport sections (#about, #contact) when the user stops
  // scrolling within 35px of the navbar — zero spring-back when scrolling up!
  if (window.matchMedia('(min-width: 1024px)').matches) {
    const NAV_HEIGHT = 56; // Exact 3.5rem (h-14) navbar height
    const SNAP_THRESHOLD = 45; // Only docks if within 45px of navbar (tight, no huge jump)
    let scrollTimer = null;
    let lastScrollY = window.scrollY;

    window.addEventListener(
      'scroll',
      () => {
        const currentY = window.scrollY;
        const scrollingDown = currentY >= lastScrollY;
        lastScrollY = currentY;

        clearTimeout(scrollTimer);

        // Wait 110ms after wheel stops so we NEVER fight active scrolling
        scrollTimer = setTimeout(() => {
          // Only dock when scrolling down into a section (never yank back when scrolling up!)
          if (!scrollingDown) return;

          sections.forEach((sec) => {
            if (sec.id === 'home') return;
            const rect = sec.getBoundingClientRect();
            const distFromNav = rect.top - NAV_HEIGHT;

            // If section top stopped super close to the navbar (-35px to +45px), dock flush
            if (Math.abs(distFromNav) > 2 && Math.abs(distFromNav) <= SNAP_THRESHOLD) {
              window.scrollTo({
                top: window.scrollY + distFromNav,
                behavior: 'smooth',
              });
            }
          });
        }, 110);
      },
      { passive: true }
    );
  }
}