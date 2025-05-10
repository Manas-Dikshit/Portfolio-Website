/**
 * Main JavaScript functionality for the portfolio website
 */

// DOM Elements
const body = document.body;
const preloader = document.querySelector('.preloader');
const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const extendedMenu = document.querySelector('.extended-menu');
const navLinks = document.querySelectorAll('.nav-link');
const typingText = document.querySelector('.typing-text');
const downloadBtn = document.querySelector('.download-cv');
const scrollTopBtn = document.querySelector('.scroll-top');
const contactForm = document.getElementById('contactForm');
const themePanelToggle = document.querySelector('.theme-panel-toggle');
const themePanel = document.querySelector('.theme-panel');
const themeColors = document.querySelectorAll('.theme-color');
const sections = document.querySelectorAll('section');
const skillProgressBars = document.querySelectorAll('.progress');

// Global variables
let isMenuOpen = false;
let lastScrollTop = 0;

// Initialize Website
document.addEventListener('DOMContentLoaded', () => {
  initializePreloader();
  initializeNavigation();
  initializeTypingEffect();
  initializeDownloadButton();
  initializeTiltEffect();
  initializeScrollTopButton();
  initializeContactForm();
  initializeThemePanel();
  initializeParticles();
  initializeObservers();
});

/**
 * Preloader Functionality
 */
function initializePreloader() {
  // Simulate loading process
  const loadingProgress = document.querySelector('.loading-progress');
  let progress = 0;
  const interval = setInterval(() => {
    progress += 5;
    loadingProgress.style.width = `${progress}%`;
    
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('hide');
        document.body.classList.add('loaded');
        
        // Play welcome sound after preloader is done
        playSoundEffect('welcome');
      }, 500);
    }
  }, 100);
}

/**
 * Navigation Functionality 
 */
function initializeNavigation() {
  // Navbar scroll behavior
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    // Add 'scrolled' class to navbar when page is scrolled
    if (scrollPosition > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Scroll direction detection
    if (scrollPosition > lastScrollTop && scrollPosition > 100) {
      // Scrolling down
      navbar.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      navbar.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollPosition;
    
    // Show or hide scroll-to-top button
    if (scrollPosition > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
  });
  
  // Menu toggle functionality
  if (menuToggle && extendedMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
      playSoundEffect('click');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !extendedMenu.contains(e.target) && isMenuOpen) {
        toggleMenu();
      }
    });
    
    // Close menu when pressing ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        toggleMenu();
      }
    });
    
    // Close menu when clicking a link
    extendedMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu();
        playSoundEffect('click');
      });
    });
  }
  
  // Smooth scrolling for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          playSoundEffect('click');
        }
      }
    });
  });
}

function toggleMenu() {
  isMenuOpen = !isMenuOpen;
  menuToggle.classList.toggle('open');
  extendedMenu.classList.toggle('active');
  menuToggle.setAttribute('aria-expanded', isMenuOpen);
}

function updateActiveNavLink() {
  const scrollPosition = window.scrollY;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active-link');
        }
      });
    }
  });
}

/**
 * Typing Effect
 */
function initializeTypingEffect() {
  if (!typingText) return;
  
  const roles = [
    'Java Developer',
    'Web Developer',
    'Spring Boot Developer',
    'Software Engineer'
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;
  
  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typingText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 50;
    } else {
      typingText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 150;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at the end of typing
      isDeleting = true;
      typingDelay = 2000;
    } else if (isDeleting && charIndex === 0) {
      // Move to next role when current one is deleted
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingDelay = 500;
    }
    
    setTimeout(type, typingDelay);
  }
  
  // Start typing effect
  setTimeout(type, 1000);
}

/**
 * Resume Download Button
 */
function initializeDownloadButton() {
  if (!downloadBtn) return;
  
  downloadBtn.addEventListener('click', function () {
    playSoundEffect('download');
    
    // Create a toast notification
    createToast('Downloading your resume!', 'success');
    
    // Set up download
    const link = document.createElement('a');
    link.href = 'Manas_Ranjan_DIkshit_Compressed.pdf';
    link.download = 'Manas_Ranjan_Dikshit.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

/**
 * 3D Tilt Effect
 */
function initializeTiltEffect() {
  // Using Vanilla Tilt library
  if (typeof VanillaTilt !== 'undefined') {
    const tiltElements = document.querySelectorAll('.tilt-card');
    
    VanillaTilt.init(tiltElements, {
      max: 15,
      speed: 400,
      glare: true,
      'max-glare': 0.3,
      gyroscope: true,
      scale: 1.05
    });
  }
}

/**
 * Scroll to top functionality
 */
function initializeScrollTopButton() {
  if (!scrollTopBtn) return;
  
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    playSoundEffect('click');
  });
}

/**
 * Contact Form Handling
 */
function initializeContactForm() {
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', (e) => {
    // Do not prevent default submission since we're using FormSubmit
    // Just add sound effects and notification
    
    playSoundEffect('success');
    createToast('Your message has been sent successfully!', 'success');
  });
}

/**
 * Theme Panel Functionality
 */
function initializeThemePanel() {
  if (!themePanelToggle || !themePanel || !themeColors) return;
  
  // Open/close theme panel
  themePanelToggle.addEventListener('click', () => {
    themePanel.classList.toggle('open');
    playSoundEffect('click');
  });
  
  // Close theme panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!themePanel.contains(e.target) && !themePanelToggle.contains(e.target)) {
      themePanel.classList.remove('open');
    }
  });
  
  // Theme color selection
  themeColors.forEach(color => {
    color.addEventListener('click', () => {
      const theme = color.getAttribute('data-theme');
      
      // Remove all theme classes
      body.classList.remove('light-theme', 'dark-theme', 'blue-theme', 'purple-theme', 'green-theme');
      
      // Add selected theme class
      body.classList.add(theme);
      
      // Save theme preference
      localStorage.setItem('theme', theme);
      
      // Set active color
      themeColors.forEach(c => c.classList.remove('active'));
      color.classList.add('active');
      
      playSoundEffect('click');
    });
  });
  
  // Set initial theme from localStorage or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark-theme';
  body.classList.add(savedTheme);
  
  // Mark active theme color
  themeColors.forEach(color => {
    if (color.getAttribute('data-theme') === savedTheme) {
      color.classList.add('active');
    }
  });
}

/**
 * Initialize Particles.js
 */
function initializeParticles() {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: { 
          value: 50, 
          density: { enable: true, value_area: 800 } 
        },
        color: { value: '#7c83ff' },
        shape: {
          type: 'circle',
          stroke: { width: 0, color: '#000000' },
          polygon: { nb_sides: 5 }
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#7c83ff',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 1,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: { enable: false, rotateX: 600, rotateY: 1200 }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 1 } },
          bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
          repulse: { distance: 200, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 }
        }
      },
      retina_detect: true
    });
  }
}

/**
 * Intersection Observer functionality
 */
function initializeObservers() {
  // Observer for section animations
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        
        // Add staggered animation to child elements if needed
        const staggerItems = entry.target.querySelectorAll('.stagger-item');
        if (staggerItems.length) {
          staggerItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('animate');
            }, 100 * index);
          });
        }
        
        // If it's the skills section, animate the skill bars
        if (entry.target.classList.contains('skills-section')) {
          animateSkillBars();
        }
      }
    });
  }, { threshold: 0.1 });
  
  // Observe all sections
  sections.forEach(section => {
    sectionObserver.observe(section);
  });
  
  // Observer for reveal text animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });
  
  // Observe all reveal text elements
  document.querySelectorAll('.reveal-text').forEach(el => {
    revealObserver.observe(el);
  });
}

/**
 * Animate skill bars when the skills section comes into view
 */
function animateSkillBars() {
  skillProgressBars.forEach(bar => {
    const width = bar.getAttribute('data-width');
    bar.style.width = width;
  });
}

/**
 * Create a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (success, error, warning, info)
 */
function createToast(message, type = 'info') {
  const toastContainer = document.querySelector('.toast-container');
  
  if (!toastContainer) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // Add icon based on type
  let icon = '';
  switch (type) {
    case 'success':
      icon = '<i class="fas fa-check-circle"></i>';
      break;
    case 'error':
      icon = '<i class="fas fa-exclamation-circle"></i>';
      break;
    case 'warning':
      icon = '<i class="fas fa-exclamation-triangle"></i>';
      break;
    case 'info':
    default:
      icon = '<i class="fas fa-info-circle"></i>';
  }
  
  toast.innerHTML = `${icon} <span>${message}</span>`;
  toastContainer.appendChild(toast);
  
  // Remove toast after animation completes
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Helper function to get random number in range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Sound effects for the portfolio website
 */

// Audio elements for different sound effects
let audioElements = {};
let soundsLoaded = false;
let soundEnabled = false;
let volumeLevel = 0;

// Sound file paths
const soundPaths = {
  click: 'mixkit-gear-metallic-lock-sound-2858.wav',
  hover: 'soft-wind-314944.mp3',
  success: 'success-48018.mp3',
  error: 'sounds/error.mp3',
  download: 'sounds/download.mp3',
  typing: 'sounds/typing.mp3',
  welcome: 'sounds/welcome.mp3',
  whoosh: 'sounds/whoosh.mp3'
};

// Initialize Sound System
document.addEventListener('DOMContentLoaded', () => {
  initSoundSystem();
  setupSoundToggles();
  setupSoundTriggers();
});

/**
 * Initialize the sound system and preload audio files
 */
function initSoundSystem() {
 // Create audio context
 const AudioContext = window.AudioContext || window.webkitAudioContext;
  
 // Check if Web Audio API is supported
 if (AudioContext) {
   window.audioContext = new AudioContext();
   
   // Preload sounds
   for (const [name, path] of Object.entries(soundPaths)) {
     const audio = new Audio();
     audio.src = path;
     audio.preload = 'auto';
     audio.volume = 0; // Start muted
     
     // Store audio element
     audioElements[name] = audio;
     
     // Preload
     audio.load();
   }
   
   soundsLoaded = true;
   
   // Try to resume audio context on user interaction
   document.addEventListener('click', function resumeAudio() {
     if (window.audioContext && window.audioContext.state === 'suspended') {
       window.audioContext.resume();
     }
     document.removeEventListener('click', resumeAudio);
   }, { once: true });
 }
}

/**
 * Set up sound toggle and volume control
 */
function setupSoundToggles() {
  const soundToggle = document.querySelector('.sound-toggle');
  const volumeControl = document.querySelector('.volume-control');
  const soundIcon = document.querySelector('.sound-toggle i');
  
  if (!soundToggle || !volumeControl || !soundIcon) return;
  
  // Load sound preference from localStorage
  const savedVolume = localStorage.getItem('sound-volume');
  if (savedVolume !== null) {
    volumeLevel = parseFloat(savedVolume);
    volumeControl.value = volumeLevel;
    updateSoundState();
  }
  
  // Toggle sound on/off
  soundToggle.addEventListener('click', () => {
    // If volume is 0, set to 0.5, otherwise set to 0
    if (volumeLevel === 0) {
      volumeLevel = 0.5;
    } else {
      volumeLevel = 0;
    }
    
    volumeControl.value = volumeLevel;
    updateSoundState();
    saveVolumePreference();
    
    // Play sound if turning on
    if (volumeLevel > 0) {
      playSoundEffect('click');
    }
  });
  
  // Adjust volume
  volumeControl.addEventListener('input', () => {
    volumeLevel = parseFloat(volumeControl.value);
    updateSoundState();
    saveVolumePreference();
    
    // Play click sound when adjusting volume (if volume > 0)
    if (volumeLevel > 0) {
      playSoundEffect('click');
    }
  });
  
  // Update sound state initially
  updateSoundState();
}

/**
 * Update sound state based on volume level
 */
function updateSoundState() {
  const soundIcon = document.querySelector('.sound-toggle i');
  if (!soundIcon) return;
  
  soundEnabled = volumeLevel > 0;
  
  // Update icon
  soundIcon.className = soundEnabled ? 'fas fa-volume-up active' : 'fas fa-volume-mute';
  
  // Update all audio elements' volume
  for (const audio of Object.values(audioElements)) {
    audio.volume = volumeLevel;
  }
}

/**
 * Save volume preference to localStorage
 */
function saveVolumePreference() {
  localStorage.setItem('sound-volume', volumeLevel.toString());
}

/**
 * Set up triggers for sound effects
 */
function setupSoundTriggers() {
  // Hover sounds for nav links
  document.querySelectorAll('.nav-link, .download-cv, .submit-btn, .project-link, .social-icon').forEach(element => {
    element.addEventListener('mouseenter', () => {
      playSoundEffect('hover');
    });
  });
  
  // Click sounds for buttons
  document.querySelectorAll('button, .project-link, .nav-link').forEach(element => {
    element.addEventListener('click', () => {
      playSoundEffect('click');
    });
  });
  
  // Scroll sounds
  let lastScrollPosition = 0;
  let scrollTimeout;
  
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(() => {
      const currentScrollPosition = window.pageYOffset;
      
      // Only play sound if scrolled significantly
      if (Math.abs(currentScrollPosition - lastScrollPosition) > 100) {
        playSoundEffect('whoosh');
        lastScrollPosition = currentScrollPosition;
      }
    }, 150);
  });
  
  // Form input sounds
  document.querySelectorAll('input, textarea').forEach(element => {
    element.addEventListener('focus', () => {
      playSoundEffect('click');
    });
  });
}

/**
 * Play a sound effect
 * @param {string} soundName - The name of the sound to play
 */
function playSoundEffect(soundName) {
  if (!soundsLoaded || !soundEnabled || volumeLevel <= 0) return;
  
  const audio = audioElements[soundName];
  if (!audio) return;
  
  // Clone the audio to allow overlapping sounds
  const clone = audio.cloneNode();
  clone.volume = volumeLevel;
  
  // For typing sound, make it shorter
  if (soundName === 'typing') {
    setTimeout(() => {
      clone.pause();
    }, 300);
  }
  
  // Play with error handling
  try {
    clone.play()
      .catch(error => {
        console.warn('Audio playback was prevented:', error);
      });
  } catch (error) {
    console.warn('Error playing sound:', error);
  }
}


// Make playSoundEffect available globally
window.playSoundEffect = playSoundEffect;


/**
 * Enhanced theme system for the portfolio website
 */

// Available themes
const themes = {
  'light-theme': {
    name: 'Light Theme',
    primary: '#ffffff',
    secondary: '#f4f4f8',
    accent: '#646cff',
    text: '#333333',
    textSecondary: '#666666'
  },
  'dark-theme': {
    name: 'Dark Theme',
    primary: '#1a1a1a',
    secondary: '#242424',
    accent: '#7c83ff',
    text: '#ffffff',
    textSecondary: '#cccccc'
  },
  'blue-theme': {
    name: 'Blue Theme',
    primary: '#0a192f',
    secondary: '#112240',
    accent: '#64ffda',
    text: '#e6f1ff',
    textSecondary: '#8892b0'
  },
  'purple-theme': {
    name: 'Purple Theme',
    primary: '#2d1950',
    secondary: '#3a1f63',
    accent: '#bb86fc',
    text: '#ffffff',
    textSecondary: '#d1c4e9'
  },
  'green-theme': {
    name: 'Green Theme',
    primary: '#0f2620',
    secondary: '#1a382e',
    accent: '#00e676',
    text: '#e0e0e0',
    textSecondary: '#b0bec5'
  }
};

// Initialize Theme System
document.addEventListener('DOMContentLoaded', () => {
  initializeThemeSystem();
  setupThemeToggle();
  setupThemePanel();
  setupThemeColorPickers();
  updateMetaThemeColor();
  setupColorSchemeListener();
});

/**
 * Initialize the theme system
 */
function initializeThemeSystem() {
  const savedTheme = localStorage.getItem('theme') || 'dark-theme';
  applyTheme(savedTheme);
}

/**
 * Set up theme toggle (sun/moon) for light/dark
 */
function setupThemeToggle() {
  if (!themeToggle || !sunIcon || !moonIcon) return;
  
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-theme');
    const newTheme = isDark ? 'light-theme' : 'dark-theme';
    
    applyTheme(newTheme);
    saveThemePreference(newTheme);
    playSoundEffect('click');
    updateMetaThemeColor();
    
    // Update icons
    if (newTheme === 'light-theme') {
      sunIcon.classList.add('active');
      moonIcon.classList.remove('active');
    } else {
      sunIcon.classList.remove('active');
      moonIcon.classList.add('active');
    }
  });
}

/**
 * Set up theme panel toggle
 */
function setupThemePanel() {
  if (!themePanelToggle || !themePanel) return;
  
  themePanelToggle.addEventListener('click', () => {
    themePanel.classList.toggle('open');
    playSoundEffect('click');
  });
  
  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!themePanel.contains(e.target) && !themePanelToggle.contains(e.target)) {
      themePanel.classList.remove('open');
    }
  });
}

/**
 * Set up theme color pickers
 */
function setupThemeColorPickers() {
  if (!themeColors) return;
  
  themeColors.forEach(colorButton => {
    const theme = colorButton.getAttribute('data-theme');
    
    // Set initial active state
    if (document.body.classList.contains(theme)) {
      colorButton.classList.add('active');
    }
    
    colorButton.addEventListener('click', () => {
      // Remove active class from all buttons
      themeColors.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to selected button
      colorButton.classList.add('active');
      
      // Apply theme
      applyTheme(theme);
      saveThemePreference(theme);
      playSoundEffect('click');
      updateMetaThemeColor();
    });
  });
}

/**
 * Apply a theme to the website
 * @param {string} theme - The theme name to apply
 */

function applyTheme(theme) {
  // Remove all theme classes
  Object.keys(themes).forEach(themeName => {
    document.body.classList.remove(themeName);
  });
  
  // Add selected theme class
  document.body.classList.add(theme);
  
  // Update sun/moon icon state
  if (sunIcon && moonIcon) {
    if (theme === 'light-theme') {
      sunIcon.classList.add('active');
      moonIcon.classList.remove('active');
    } else {
      sunIcon.classList.remove('active');
      moonIcon.classList.add('active');
    }
  }
}

/**
 * Save theme preference to localStorage
 * @param {string} theme - The theme to save
 */
function saveThemePreference(theme) {
  localStorage.setItem('theme', theme);
}

/**
 * Update meta theme-color for browser UI
 */
function updateMetaThemeColor() {
  // Get current theme
  let currentTheme = 'dark-theme';
  
  Object.keys(themes).forEach(themeName => {
    if (document.body.classList.contains(themeName)) {
      currentTheme = themeName;
    }
  });
  
  // Get theme color
  const themeColor = themes[currentTheme].secondary;
  
  // Update or create meta tag
  let metaThemeColor = document.querySelector('meta[name="theme-color"]');
  
  if (!metaThemeColor) {
    metaThemeColor = document.createElement('meta');
    metaThemeColor.name = 'theme-color';
    document.head.appendChild(metaThemeColor);
  }
  
  metaThemeColor.content = themeColor;
}

/**
 * Setup listener for system color scheme changes
 */
function setupColorSchemeListener() {
  if (window.matchMedia) {
    const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initial check
    const hasStoredPreference = localStorage.getItem('theme') !== null;
    
    // Listen for system theme changes
    try {
      // Chrome & Firefox
      colorSchemeMedia.addEventListener('change', (e) => {
        if (!hasStoredPreference) {
          const newTheme = e.matches ? 'dark-theme' : 'light-theme';
          applyTheme(newTheme);
          updateMetaThemeColor();
        }
      });
    } catch (error) {
      // Safari
      colorSchemeMedia.addListener((e) => {
        if (!hasStoredPreference) {
          const newTheme = e.matches ? 'dark-theme' : 'light-theme';
          applyTheme(newTheme);
          updateMetaThemeColor();
        }
      });
    }
  }

}

/**
 * Create a custom theme
 * @param {string} name - The theme name
 * @param {Object} colors - The theme colors
 */
function createCustomTheme(name, colors) {
   // Create theme class name
  const className = name.toLowerCase().replace(/\s+/g, '-') + '-theme';
  
  // Add to themes object
  themes[className] = {
    name: name,
    ...colors
  };
  
  // Create style element
  const style = document.createElement('style');
  
  // Create CSS for the theme
  const css = `
    body.${className} {
      --bg-primary: ${colors.primary};
      --bg-secondary: ${colors.secondary};
      --bg-tertiary: ${colors.tertiary || colors.secondary};
      --text-primary: ${colors.text};
      --text-secondary: ${colors.textSecondary};
      --text-tertiary: ${colors.textTertiary || colors.textSecondary};
      --accent-primary: ${colors.accent};
      --accent-secondary: ${colors.accentSecondary || colors.accent};
      --accent-tertiary: ${colors.accentTertiary || colors.accent};
      --border: ${colors.border || 'rgba(255, 255, 255, 0.1)'};
    }
  `;
  
  style.textContent = css;
  document.head.appendChild(style);
  
  // Create a button for the theme panel
  if (document.querySelector('.theme-colors')) {
    const themeButton = document.createElement('button');
    themeButton.className = 'theme-color';
    themeButton.dataset.theme = className;
    themeButton.style.backgroundColor = colors.primary;
    themeButton.style.borderColor = colors.accent;
    
    // Add event listener
    themeButton.addEventListener('click', () => {
      // Remove active class from all buttons
      document.querySelectorAll('.theme-color').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class to this button
      themeButton.classList.add('active');
      
      // Apply theme
      applyTheme(className);
      saveThemePreference(className);
      updateMetaThemeColor();
    });
    
    document.querySelector('.theme-colors').appendChild(themeButton);
  }
  
  return className;
}
window.themeUtils = {
  createCustomTheme,
  applyTheme,
  getAvailableThemes: () => Object.keys(themes)
};
/**
 * Advanced animations and effects for the portfolio website
 */

// DOM Elements for animations
const profileImage = document.querySelector('.profile-image');
const aboutImage = document.querySelector('.about-image');
const blobAnimation = document.querySelector('.blob-animation');
const signature = document.querySelector('.sign');
const educationCards = document.querySelectorAll('.education-card');
const projectCards = document.querySelectorAll('.project-card');
const achievementCards = document.querySelectorAll('.achievement-card');
const revealTextElements = document.querySelectorAll('.reveal-text');

// Initialize Animations
document.addEventListener('DOMContentLoaded', () => {
  initializeTextRevealAnimation();
  initializeParallaxEffect();
  initializeMouseFollowEffect();
  initializeScrollBasedAnimations();
  initializeHoverEffects();
  initializeSignatureAnimation();
  initializeNumberCounter();
});

/**
 * Text reveal animation for section titles
 */
function initializeTextRevealAnimation() {
  revealTextElements.forEach(element => {
    // Only run this once when the page loads, not for every intersection
    const text = element.textContent;
    element.innerHTML = '';
    
    // Create a wrapper span to hold the text
    const textWrapper = document.createElement('span');
    textWrapper.className = 'reveal-text-wrapper';
    element.appendChild(textWrapper);
    
    // Add each character with its own span
    for (const char of text) {
      const span = document.createElement('span');
      span.className = 'reveal-char';
      span.textContent = char === ' ' ? '\u00A0' : char; // Replace space with non-breaking space
      textWrapper.appendChild(span);
    }
  });
}

/**
 * Parallax effect for background elements
 */
function initializeParallaxEffect() {
  if (!profileImage && !aboutImage) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    if (profileImage) {
      const speed = 0.3;
      const yPos = -(scrolled * speed);
      profileImage.style.transform = `translateY(${yPos}px)`;
    }
    
    if (aboutImage) {
      const speed = 0.2;
      const yPos = -(scrolled * speed);
      aboutImage.style.transform = `translateY(${yPos}px)`;
    }
    
    if (blobAnimation) {
      const speed = 0.15;
      const yPos = -(scrolled * speed);
      blobAnimation.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.02}deg)`;
    }
  });
}

/**
 * Mouse follow effect for interactive elements
 */
function initializeMouseFollowEffect() {
  // Create cursor follower element
  const cursorFollower = document.createElement('div');
  cursorFollower.className = 'cursor-follower';
  document.body.appendChild(cursorFollower);
  
  // Create cursor dot element
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursorDot);
  
  // Variables for smooth movement
  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;
  let dotX = 0;
  let dotY = 0;
  
  // Get mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Animate cursor elements
  function animateCursor() {
    // Smooth movement for follower
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    // Faster movement for dot
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;
    
    // Apply positions
    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;
    
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  
  // Start animation
  animateCursor();
  
  // Hover effects on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .tilt-card, input, textarea, .menu-toggle, .theme-toggle');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursorFollower.classList.add('active');
      cursorDot.classList.add('active');
    });
    
    element.addEventListener('mouseleave', () => {
      cursorFollower.classList.remove('active');
      cursorDot.classList.remove('active');
    });
  });
}

/**
 * Scroll-based reveal animations
 */
function initializeScrollBasedAnimations() {
  const animatedElements = document.querySelectorAll('.skill-category, .project-card, .education-card, .achievement-card, .experience-item, .contact-item, .social-icon');
  
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add staggered delay based on index for groups
        if (entry.target.classList.contains('social-icon')) {
          const socialIcons = document.querySelectorAll('.social-icon');
          const index = Array.from(socialIcons).indexOf(entry.target);
          entry.target.style.animationDelay = `${index * 0.1}s`;
        }
        
        entry.target.classList.add('animate');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  animatedElements.forEach(element => {
    animationObserver.observe(element);
  });
}

/**
 * Hover effects for cards and buttons
 */
function initializeHoverEffects() {
  // Magnetic effect for buttons
  const magneticElements = document.querySelectorAll('.download-cv, .submit-btn, .nav-link');
  
  magneticElements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      const moveX = (x - centerX) / 10;
      const moveY = (y - centerY) / 10;
      
      element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
    });
  });
  
  // Image hover effects
  const projectImages = document.querySelectorAll('.project-image');
  
  projectImages.forEach(image => {
    image.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = image.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      image.querySelector('img').style.transform = `scale(1.1) translate(${(x - 0.5) * 10}px, ${(y - 0.5) * 10}px)`;
    });
    
    image.addEventListener('mouseleave', () => {
      image.querySelector('img').style.transform = '';
    });
  });
}

/**
 * Signature animation
 */
function initializeSignatureAnimation() {
  if (!signature) return;
  
  // Create SVG signature path
  const signatureSVG = document.createElement('svg');
  signatureSVG.className = 'signature-svg';
  signatureSVG.setAttribute('viewBox', '0 0 200 100');
  signatureSVG.setAttribute('width', '100%');
  signatureSVG.setAttribute('height', '100%');
  
  // Create SVG path
  const path = document.createElement('path');
  path.setAttribute('d', 'M10,50 C20,30 40,10 60,50 C80,90 100,30 120,50 C140,70 160,50 180,50');
  path.className = 'signature-path';
  
  signatureSVG.appendChild(path);
  
  // Replace text with SVG animation
  // signature.innerHTML = '';
  // signature.appendChild(signatureSVG);
  
  // Animate on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        path.classList.add('animate-signature');
        observer.unobserve(signature);
      }
    });
  }, { threshold: 0.5 });
  
  observer.observe(signature);
}

/**
 * Number counter animation for skills percentage
 */
function initializeNumberCounter() {
  const percentages = document.querySelectorAll('.skill-percentage');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const value = parseInt(target.textContent);
        let current = 0;
        
        const increment = value / 50; // Adjust for speed
        
        const updateCounter = () => {
          if (current < value) {
            current += increment;
            if (current > value) current = value;
            target.textContent = `${Math.round(current)}%`;
            requestAnimationFrame(updateCounter);
          }
        };
        
        updateCounter();
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });
  
  percentages.forEach(percentage => {
    observer.observe(percentage);
  });
}

/**
 * Add glitch effect to text
 * @param {HTMLElement} element - The element to apply the effect to
 * @param {string} newText - The new text to display after the effect
 */
function glitchText(element, newText) {
  if (!element) return;
  
  const originalText = element.textContent;
  const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
  let iteration = 0;
  
  const interval = setInterval(() => {
    element.textContent = originalText
      .split('')
      .map((char, index) => {
        if (index < iteration) {
          return newText[index] || char;
        }
        
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
      })
      .join('');
    
    if (iteration >= originalText.length) {
      clearInterval(interval);
      element.textContent = newText;
    }
    
    iteration += 1/3;
  }, 30);
}

/**
 * Scramble text animation
 * @param {HTMLElement} element - The element to animate
 * @param {string} finalText - The final text to display
 */
function scrambleText(element, finalText) {
  if (!element) return;
  
  const chars = '!<>-_\\/[]{}—=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const originalText = element.textContent;
  const length = Math.max(originalText.length, finalText.length);
  
  let iteration = 0;
  
  const interval = setInterval(() => {
    element.textContent = Array.from({ length })
      .map((_, index) => {
        if (index < iteration) {
          return finalText[index] || '';
        }
        
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');
    
    if (iteration >= length) {
      clearInterval(interval);
      element.textContent = finalText;
    }
    
    iteration += 1/3;
  }, 30);
}

/**
 * Create a ripple effect on an element
 * @param {Event} event - The click event
 * @param {HTMLElement} element - The element to create the ripple on
 */
function createRipple(event, element) {
  const ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  
  const rect = element.getBoundingClientRect();
  
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  
  element.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600); // Match with CSS animation duration
}

/**
 * Set up shake animation for an element
 * @param {HTMLElement} element - The element to animate
 */
function shakeElement(element) {
  if (!element) return;
  
  element.classList.add('shake');
  
  element.addEventListener('animationend', () => {
    element.classList.remove('shake');
  });
}

/**
 * Mouse trail effect
 */
function createMouseTrail() {
  const canvas = document.createElement('canvas');
  canvas.id = 'mouse-trail';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  const points = [];
  const maxPoints = 50;
  const trailColor = 'rgba(124, 131, 255, 0.3)';
  
  document.addEventListener('mousemove', (e) => {
    points.push({
      x: e.clientX,
      y: e.clientY,
      age: 0
    });
    
    if (points.length > maxPoints) {
      points.shift();
    }
  });
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      point.age++;
      
      if (point.age > maxPoints) {
        points.splice(i, 1);
        i--;
        continue;
      }
      
      const size = (maxPoints - point.age) / 2;
      const alpha = 1 - point.age / maxPoints;
      
      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
      ctx.fillStyle = trailColor.replace('0.3', alpha);
      ctx.fill();
    }
    
    requestAnimationFrame(draw);
  }
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  
  draw();
}

// Export utilities for use in other files
window.animationUtils = {
  glitchText,
  scrambleText,
  createRipple,
  shakeElement,
  createMouseTrail
};