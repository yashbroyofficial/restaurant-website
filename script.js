// =============================================
// LUMIERE RESTAURANT - script.js
// =============================================

// --- Page Navigation ---
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target page
  var target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
  }
  // Update nav links
  document.querySelectorAll('.nav-link').forEach(function(link) {
    link.classList.toggle('active', link.getAttribute('data-page') === pageId);
  });
  // Close mobile menu
  document.getElementById('nav-menu').classList.remove('open');
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Mobile Hamburger ---
document.getElementById('hamburger-btn').addEventListener('click', function() {
  document.getElementById('nav-menu').classList.toggle('open');
});

// --- Navbar scroll effect ---
window.addEventListener('scroll', function() {
  var nb = document.getElementById('navbar');
  if (window.scrollY > 20) {
    nb.classList.add('scrolled');
  } else {
    nb.classList.remove('scrolled');
  }
});

// --- Menu Tab Filtering ---
function filterMenu(category) {
  // Hide all categories
  document.querySelectorAll('.menu-category').forEach(function(cat) {
    cat.classList.remove('active');
  });
  // Show selected
  var el = document.getElementById('cat-' + category);
  if (el) el.classList.add('active');
  // Update tab buttons
  document.querySelectorAll('.menu-tab').forEach(function(tab) {
    tab.classList.toggle('active', tab.getAttribute('data-category') === category);
  });
}

// --- Reservation Form ---
function submitReservation(e) {
  e.preventDefault();
  var btn = document.querySelector('#reservation-form button[type="submit"]');
  if (btn) {
    btn.textContent = 'Confirming...';
    btn.disabled = true;
  }
  setTimeout(function() {
    document.getElementById('reservation-form').style.display = 'none';
    document.getElementById('res-success').style.display = 'block';
  }, 1000);
}

function resetForm() {
  document.getElementById('reservation-form').reset();
  document.getElementById('reservation-form').style.display = 'flex';
  document.getElementById('res-success').style.display = 'none';
  var btn = document.querySelector('#reservation-form button[type="submit"]');
  if (btn) {
    btn.textContent = 'Confirm Reservation';
    btn.disabled = false;
  }
}

// --- Contact Form ---
function submitContact(e) {
  e.preventDefault();
  var btn = document.querySelector('#contact-form button[type="submit"]');
  if (btn) {
    btn.textContent = 'Sending...';
    btn.disabled = true;
  }
  setTimeout(function() {
    document.getElementById('contact-form').style.display = 'none';
    document.getElementById('contact-success').style.display = 'block';
  }, 1000);
}

// --- Set min date for reservation ---
window.addEventListener('DOMContentLoaded', function() {
  var dateInput = document.getElementById('res-date');
  if (dateInput) {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = yyyy + '-' + mm + '-' + dd;
  }
});
