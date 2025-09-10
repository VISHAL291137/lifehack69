// script.js - improved front-end logic with better error handling
document.getElementById('year').textContent = new Date().getFullYear();

// Theme management with localStorage persistence
const themeManager = {
  init() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
    
    document.getElementById('themeToggle').addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
    });
  },
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update button text
    const button = document.getElementById('themeToggle');
    button.textContent = theme === 'light' ? '🌙' : '☀️';
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
      throw error;
    }
  }
};

// UI helpers
const ui = {
  showMessage(message, type = 'info') {
    // Create or update message element
    let messageEl = document.getElementById('message');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.id = 'message';
      messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 16px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        max-width: 300px;
        transition: all 0.3s ease;
      `;
      document.body.appendChild(messageEl);
    }
    
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      info: '#3b82f6'
    };
    
    messageEl.style.backgroundColor = colors[type] || colors.info;
    messageEl.textContent = message;
    messageEl.style.opacity = '1';
    messageEl.style.transform = 'translateY(0)';
    
    setTimeout(() => {
      messageEl.style.opacity = '0';
      messageEl.style.transform = 'translateY(-20px)';
    }, 4000);
  },
  
  setLoading(elementId, isLoading) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (isLoading) {
      element.disabled = true;
      element.textContent = 'Loading...';
    } else {
      element.disabled = false;
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
        { title: 'Design Sprints', desc: 'Rapid prototyping with measurable outcomes.' }
      ],
      blog: ['Coming soon...'],
      about: 'New Yuga stands for intentional progress — a curated space where technology and mindful practices meet.',
      contact: {
        email: 'hello@newyuga.example',
        social: '@newyuga'
      }
    };
    
    renderData(fallbackData);
    ui.showMessage('Using offline content. Some features may be limited.', 'info');
  }
}

function renderData(data) {
  // Update hero section
  document.getElementById('hero-title').textContent = data.hero.title;
  document.getElementById('hero-desc').textContent = data.hero.subtitle;

  // Render features
  const featuresContainer = document.getElementById('feature-list');
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

  // Render services
  const servicesContainer = document.getElementById('services-grid');
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

  // Render blog posts
  const blogContainer = document.getElementById('blog-list');
  blogContainer.innerHTML = '';
  data.blog.forEach(post => {
    const listItem = document.createElement('li');
    listItem.textContent = post;
    blogContainer.appendChild(listItem);
  });

  // Update about and contact sections
  document.getElementById('about-text').textContent = data.about;
  document.getElementById('contact-info').innerHTML = `
    Email: <a href="mailto:${escapeHtml(data.contact.email)}">${escapeHtml(data.contact.email)}</a> — 
    Social: ${escapeHtml(data.contact.social)}
  `;
}

// Newsletter subscription with API integration
async function handleSubscription() {
  const emailInput = document.getElementById('email');
  const subscribeBtn = document.getElementById('subscribe');
  const email = emailInput.value.trim();
  
  if (!email) {
    ui.showMessage('Please enter an email address', 'error');
    return;
  }
  
  if (!validateEmail(email)) {
    ui.showMessage('Please enter a valid email address', 'error');
    return;
  }
  
  try {
    ui.setLoading('subscribe', true);
    subscribeBtn.textContent = 'Subscribing...';
    
    await apiClient.request('/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    
    ui.showMessage('Successfully subscribed to newsletter!', 'success');
    emailInput.value = '';
  } catch (error) {
    ui.showMessage(error.message || 'Failed to subscribe', 'error');
  } finally {
    subscribeBtn.disabled = false;
    subscribeBtn.textContent = 'Subscribe';
  }
}

// Contact form with API integration
async function handleContactForm(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const data = {
    name: formData.get('name').trim(),
    email: formData.get('email').trim(),
    message: formData.get('message').trim()
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
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
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
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send message';
  }
}

// Email validation helper
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// XSS protection helper
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Event listeners
document.getElementById('subscribe').addEventListener('click', handleSubscription);
document.getElementById('contactForm').addEventListener('submit', handleContactForm);

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  themeManager.init();
  loadData();
});

// Handle online/offline status
window.addEventListener('online', () => {
  ui.showMessage('Connection restored', 'success');
  loadData();
});

window.addEventListener('offline', () => {
  ui.showMessage('You are offline. Some features may not work.', 'info');
});