// script.js - Complete front-end logic with all fixes
document.getElementById('year').textContent = new Date().getFullYear();

// Theme management with localStorage persistence
const themeManager = {
  init() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
      });
    }
  },
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update button text
    const button = document.getElementById('themeToggle');
    if (button) {
      button.textContent = theme === 'light' ? '🌙 Dark' : '☀️ Light';
    }
  }
};

// API client with improved error handling
const apiClient = {
  baseUrl: 'http://localhost:3000/api',
  
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error - please check your connection');
      }
      
      throw error;
    }
  }
};

// UI helpers
const ui = {
  showMessage(message, type = 'info') {
    // Remove existing message
    const existingMessage = document.getElementById('toast-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create new message element
    const messageEl = document.createElement('div');
    messageEl.id = 'toast-message';
    messageEl.className = `toast toast-${type}`;
    messageEl.textContent = message;
    
    document.body.appendChild(messageEl);
    
    // Trigger animation
    setTimeout(() => {
      messageEl.classList.add('toast-show');
    }, 10);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      messageEl.classList.remove('toast-show');
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.remove();
        }
      }, 300);
    }, 4000);
  },
  
  setLoading(elementId, isLoading, originalText = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (isLoading) {
      element.disabled = true;
      element.dataset.originalText = element.textContent;
      element.textContent = 'Loading...';
      element.classList.add('loading');
    } else {
      element.disabled = false;
      element.textContent = element.dataset.originalText || originalText;
      element.classList.remove('loading');
    }
  }
};

// Data loading with better error handling
async function loadData() {
  try {
    const response = await apiClient.request('/home');
    renderData(response.data);
  } catch (error) {
    console.error('Failed to load data:', error);
    
    // Fallback content
    const fallbackData = {
      hero: {
        title: 'New Yuga — Design the future',
        subtitle: 'Ideas, community, and tools for those who want to create a better era.'
      },
      features: [
        { title: 'Workshops', desc: 'Practical sessions on product, mindset, and design.' },
        { title: 'Mentorship', desc: '1:1 and group coaching for founders and creators.' },
        { title: 'Resources', desc: 'Guides, playbooks, and templates to ship faster.' }
      ],
      services: [
        { title: 'Strategy & Consulting', desc: 'Market-fit, product strategy, and launch plans.' },
        { title: 'Design Sprints', desc: 'Rapid prototyping with measurable outcomes.' },
        { title: 'Community Building', desc: 'Member programs, forums, and events.' },
        { title: 'Courses', desc: 'Skill-based short courses for creators.' }
      ],
      blog: [
        'Designing for a kinder web — 5 practical steps',
        'Micro-habits that scale — for founders and teams',
        'Why slow growth wins — the long-game playbook'
      ],
      about: 'New Yuga stands for intentional progress — a curated space where technology and mindful practices meet.',
      contact: {
        email: 'hello@newyuga.example',
        social: '@newyuga'
      }
    };
    
    renderData(fallbackData);
    ui.showMessage('Using offline content. Server may be unavailable.', 'warning');
  }
}

function renderData(data) {
  // Update hero section
  const heroTitle = document.getElementById('hero-title');
  const heroDesc = document.getElementById('hero-desc');
  
  if (heroTitle) heroTitle.textContent = data.hero.title;
  if (heroDesc) heroDesc.textContent = data.hero.subtitle;

  // Render features
  const featuresContainer = document.getElementById('feature-list');
  if (featuresContainer && data.features) {
    featuresContainer.innerHTML = '';
    data.features.forEach(feature => {
      const featureEl = document.createElement('div');
      featureEl.className = 'feature';
      featureEl.innerHTML = `
        <strong>${escapeHtml(feature.title)}</strong>
        <div class="muted" style="font-size:13px">${escapeHtml(feature.desc)}</div>
      `;
      featuresContainer.appendChild(featureEl);
    });
  }

  // Render services
  const servicesContainer = document.getElementById('services-grid');
  if (servicesContainer && data.services) {
    servicesContainer.innerHTML = '';
    data.services.forEach(service => {
      const serviceEl = document.createElement('div');
      serviceEl.className = 'feature';
      serviceEl.innerHTML = `
        <strong>${escapeHtml(service.title)}</strong>
        <div class="muted" style="font-size:13px">${escapeHtml(service.desc)}</div>
      `;
      servicesContainer.appendChild(serviceEl);
    });
  }

  // Render blog posts
  const blogContainer = document.getElementById('blog-list');
  if (blogContainer && data.blog) {
    blogContainer.innerHTML = '';
    data.blog.forEach(post => {
      const listItem = document.createElement('li');
      listItem.textContent = post;
      blogContainer.appendChild(listItem);
    });
  }

  // Update about and contact sections
  const aboutText = document.getElementById('about-text');
  const contactInfo = document.getElementById('contact-info');
  
  if (aboutText) aboutText.textContent = data.about;
  if (contactInfo && data.contact) {
    contactInfo.innerHTML = `
      Email: <a href="mailto:${escapeHtml(data.contact.email)}">${escapeHtml(data.contact.email)}</a> — 
      Social: ${escapeHtml(data.contact.social)}
    `;
  }
}

// Newsletter subscription with API integration
async function handleSubscription() {
  const emailInput = document.getElementById('email');
  const subscribeBtn = document.getElementById('subscribe');
  
  if (!emailInput || !subscribeBtn) return;
  
  const email = emailInput.value.trim();
  
  if (!email) {
    ui.showMessage('Please enter an email address', 'error');
    emailInput.focus();
    return;
  }
  
  if (!validateEmail(email)) {
    ui.showMessage('Please enter a valid email address', 'error');
    emailInput.focus();
    return;
  }
  
  try {
    ui.setLoading('subscribe', true);
    
    await apiClient.request('/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    
    ui.showMessage('Successfully subscribed to newsletter!', 'success');
    emailInput.value = '';
  } catch (error) {
    ui.showMessage(error.message || 'Failed to subscribe', 'error');
  } finally {
    ui.setLoading('subscribe', false, 'Subscribe');
  }
}

// Contact form with API integration
async function handleContactForm(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const data = {
    name: formData.get('name')?.trim() || '',
    email: formData.get('email')?.trim() || '',
    message: formData.get('message')?.trim() || ''
  };
  
  // Client-side validation
  if (!data.name || !data.email || !data.message) {
    ui.showMessage('Please fill in all fields', 'error');
    return;
  }
  
  if (!validateEmail(data.email)) {
    ui.showMessage('Please enter a valid email address', 'error');
    return;
  }
  
  if (data.name.length < 2) {
    ui.showMessage('Name must be at least 2 characters long', 'error');
    return;
  }
  
  if (data.message.length < 10) {
    ui.showMessage('Message must be at least 10 characters long', 'error');
    return;
  }
  
  try {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }
    
    await apiClient.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    ui.showMessage('Message sent successfully!', 'success');
    form.reset();
  } catch (error) {
    ui.showMessage(error.message || 'Failed to send message', 'error');
  } finally {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  }
}

// Email validation helper
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// XSS protection helper
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 New Yuga app initializing...');
  
  // Initialize theme manager
  themeManager.init();
  
  // Load data from API
  loadData();
  
  // Set up event listeners
  const subscribeBtn = document.getElementById('subscribe');
  const contactForm = document.getElementById('contactForm');
  
  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', handleSubscription);
  }
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }
  
  // Handle Enter key in email input
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSubscription();
      }
    });
  }
  
  console.log('✅ New Yuga app initialized successfully');
});

// Handle online/offline status
window.addEventListener('online', () => {
  ui.showMessage('Connection restored', 'success');
  loadData();
});

window.addEventListener('offline', () => {
  ui.showMessage('You are offline. Some features may not work.', 'warning');
});

// Handle page visibility for better UX
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Page became visible, refresh data if needed
    const lastLoad = localStorage.getItem('lastDataLoad');
    const now = Date.now();
    
    // Refresh data if it's been more than 5 minutes
    if (!lastLoad || (now - parseInt(lastLoad)) > 5 * 60 * 1000) {
      loadData();
      localStorage.setItem('lastDataLoad', now.toString());
    }
  }
});