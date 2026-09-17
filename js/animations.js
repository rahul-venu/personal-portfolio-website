export function initScrollAnimations() {
  const sections = document.querySelectorAll('section');
  if (!sections.length) return;

  // Hero is 100% focused 
  sections[0].classList.add('page-active');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Section glides into crystal focus smoothly
          entry.target.classList.add('page-active');
        } else {
          // Softly defocuses as you leave
          entry.target.classList.remove('page-active');
        }
      });
    },
    {
      threshold: 0.15, 
      rootMargin: '0px 0px -5% 0px',
    }
  );

  sections.forEach((sec) => observer.observe(sec));
}