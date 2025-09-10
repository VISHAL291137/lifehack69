// server.js - improved API server with validation and error handling
const express = require('express');
const cors = require('cors');
const app = express();

// CORS configuration - restrict origins in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Replace with your actual domain
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Input validation helper
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, 1000); // Limit length and trim
};

const homeData = {
  hero: {
    title: "New Yuga — Design the future, live the change",
    subtitle: "Ideas, community, and tools for those who want to create a better era — blending tech, growth, and mindful living."
  },
  features: [
    { title: "Workshops", desc: "Practical sessions on product, mindset, and design." },
    { title: "Mentorship", desc: "1:1 and group coaching for founders and creators." },
    { title: "Resources", desc: "Guides, playbooks, and templates to ship faster." }
  ],
  services: [
    { title: "Strategy & Consulting", desc: "Market-fit, product strategy, and launch plans." },
    { title: "Design Sprints", desc: "Rapid prototyping with measurable outcomes." },
    { title: "Community Building", desc: "Member programs, forums, and events." },
    { title: "Courses", desc: "Skill-based short courses for creators." }
  ],
  blog: [
    "Designing for a kinder web — 5 practical steps",
    "Micro-habits that scale — for founders and teams",
    "Why slow growth wins — the long-game playbook"
  ],
  about: "New Yuga stands for intentional progress — a curated space where technology and mindful practices meet. We build tools, run programs, and host conversations that help people and teams move from idea to impact.",
  contact: {
    email: "hello@newyuga.example",
    social: "@newyuga"
  }
};

// API endpoints
app.get('/api/home', (req, res) => {
  try {
    res.json({
      success: true,
      data: homeData
    });
  } catch (error) {
    console.error('Error serving home data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Newsletter subscription endpoint
app.post('/api/subscribe', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const sanitizedEmail = sanitizeInput(email);
    
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address'
      });
    }

    // In production, you would save this to a database
    console.log(`New subscription: ${sanitizedEmail}`);
    
    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process subscription'
    });
  }
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedMessage = sanitizeInput(message);
    
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address'
      });
    }

    if (sanitizedName.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Name must be at least 2 characters long'
      });
    }

    if (sanitizedMessage.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Message must be at least 10 characters long'
      });
    }

    // In production, you would save this to a database or send an email
    console.log(`New contact form submission:`, {
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage
    });
    
    res.json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 New Yuga API server running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});