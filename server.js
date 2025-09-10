// server.js - minimal API to serve home page data
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

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

app.get('/api/home', (req, res) => {
  res.json(homeData);
});

// optional: serve static files from 'public' if you prefer
// app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
