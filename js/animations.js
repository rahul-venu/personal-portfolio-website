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
}