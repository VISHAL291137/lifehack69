// script.js - front-end logic (vanilla JS)
document.getElementById('year').textContent = new Date().getFullYear();

// theme toggle
const root = document.documentElement;
document.getElementById('themeToggle').addEventListener('click', () => {
  const t = root.getAttribute('data-theme') || 'light';
  root.setAttribute('data-theme', t === 'light' ? 'dark' : 'light');
});

// load data from backend
async function loadData() {
  try {
    const res = await fetch('http://localhost:3000/api/home');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    renderData(data);
  } catch (err) {
    console.error(err);
    document.getElementById('hero-title').textContent = 'New Yuga — Design the future';
    document.getElementById('hero-desc').textContent = 'Ideas, community, and tools for those who want to create a better era.';
  }
}

function renderData(data) {
  document.getElementById('hero-title').textContent = data.hero.title;
  document.getElementById('hero-desc').textContent = data.hero.subtitle;

  // features
  const feat = document.getElementById('feature-list');
  feat.innerHTML = '';
  data.features.forEach(f => {
    const d = document.createElement('div');
    d.className = 'feature';
    d.innerHTML = `<strong>${escapeHtml(f.title)}</strong><div class="muted" style="font-size:13px">${escapeHtml(f.desc)}</div>`;
    feat.appendChild(d);
  });

  // services
  const sgrid = document.getElementById('services-grid');
  sgrid.innerHTML = '';
  data.services.forEach(s => {
    const d = document.createElement('div');
    d.className = 'feature';
    d.innerHTML = `<strong>${escapeHtml(s.title)}</strong><div class="muted" style="font-size:13px">${escapeHtml(s.desc)}</div>`;
    sgrid.appendChild(d);
  });

  // blog
  const blog = document.getElementById('blog-list');
  blog.innerHTML = '';
  data.blog.forEach(b => {
    const li = document.createElement('li');
    li.textContent = b;
    blog.appendChild(li);
  });

  // about & contact
  document.getElementById('about-text').textContent = data.about;
  document.getElementById('contact-info').innerHTML = `Email: <a href="mailto:${data.contact.email}">${data.contact.email}</a> — Social: ${escapeHtml(data.contact.social)}`;
}

// simple email subscribe demo
document.getElementById('subscribe').addEventListener('click', () => {
  const email = document.getElementById('email').value.trim();
  if (!email) return alert('Please enter an email');
  alert(`Thanks — ${email} added to the list (demo)`);
  document.getElementById('email').value = '';
});

// contact form opens mail client (demo)
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const name = encodeURIComponent(f.name.value.trim());
  const email = encodeURIComponent(f.email.value.trim());
  const message = encodeURIComponent(f.message.value.trim());
  if (!name || !email || !message) return alert('Fill all fields');
  const body = `From: ${decodeURIComponent(name)} (${decodeURIComponent(email)})\n\n${decodeURIComponent(message)}`;
  window.location.href = `mailto:hello@newyuga.example?subject=${encodeURIComponent('New Yuga contact from ' + decodeURIComponent(name))}&body=${encodeURIComponent(body)}`;
});

// small helper to avoid injection
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// initial load
loadData();

