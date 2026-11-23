const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

$('#year').textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = $('#menuToggle');
const mainNav = $('#mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
$$('#mainNav a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Scroll progress
const progress = $('#progress');
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Gentle reveal animations, with reduced-motion support
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => observer.observe(el));
} else {
  $$('.reveal').forEach(el => el.classList.add('visible'));
}

// Cinema notes panel
const filmPanel = $('#filmPanel');
$('#filmButton').addEventListener('click', () => {
  filmPanel.hidden = !filmPanel.hidden;
  if (!filmPanel.hidden) filmPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
$('#closeFilm').addEventListener('click', () => { filmPanel.hidden = true; });

// Hidden terminal
const terminal = $('#terminalOverlay');
const terminalInput = $('#terminalInput');
const terminalOutput = $('#terminalOutput');
const openTerminal = () => {
  terminal.hidden = false;
  terminalInput.focus();
};
const closeTerminal = () => { terminal.hidden = true; };
$('#terminalTrigger').addEventListener('click', openTerminal);
$('#closeTerminal').addEventListener('click', closeTerminal);
terminal.addEventListener('click', e => { if (e.target === terminal) closeTerminal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeTerminal();
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openTerminal();
  }
});
const commands = {
  help: 'Available commands: about, work, cinema, journey, contact, clear, close',
  about: 'A creative mind with a professional background. One curious soul, many chapters.',
  work: 'Trust & Safety · Policy · Quality · Audits · Root Cause Analysis · Collaboration',
  cinema: 'The Cinema Room is open. Favourite conversation starters: Spider-Man 2, Tumbbad, Jawan, Gangs of Wasseypur.',
  journey: 'Childhood acting → cinema & storytelling → Trust & Safety → learning → the road less travelled.',
  contact: 'Write to: YOUR_EMAIL@example.com (replace this placeholder with your real email address).',
  clear: '',
  close: 'Closing terminal…'
};
$('#terminalForm').addEventListener('submit', e => {
  e.preventDefault();
  const command = terminalInput.value.trim().toLowerCase();
  if (!command) return;
  if (command === 'clear') terminalOutput.textContent = '';
  else if (command === 'close') closeTerminal();
  else if (commands[command]) terminalOutput.textContent = `> ${command}\n${commands[command]}`;
  else terminalOutput.textContent = `> ${command}\nCommand not found. Type "help" to see what you can do.`;
  terminalInput.value = '';
});
