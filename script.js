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

// --- Supabase Client Initialization ---
var SUPABASE_URL = "https://axafuzgbmujafbhwmleo.supabase.co";
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4YWZ1emdibXVqYWZiaHdtbGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5OTYyOTAsImV4cCI6MjEwNzU3MjI5MH0.ar9NU0TtWDxXyL829n3GcWbHfHV2cBVq8Iv6NMBObdg";
var supabaseClient = (typeof supabase !== 'undefined') ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// --- Reservation Form ---
async function submitReservation(e) {
  e.preventDefault();
  var btn = document.querySelector('#reservation-form button[type="submit"]');
  if (btn) {
    btn.textContent = 'Confirming...';
    btn.disabled = true;
  }

  var firstName = document.getElementById('res-first') ? document.getElementById('res-first').value.trim() : '';
  var lastName = document.getElementById('res-last') ? document.getElementById('res-last').value.trim() : '';
  var fullName = (firstName + ' ' + lastName).trim();
  var email = document.getElementById('res-email') ? document.getElementById('res-email').value.trim() : '';
  var phone = document.getElementById('res-phone') ? document.getElementById('res-phone').value.trim() : '';
  var resDate = document.getElementById('res-date') ? document.getElementById('res-date').value : '';
  var resTime = document.getElementById('res-time') ? document.getElementById('res-time').value : '';
  var resGuestsStr = document.getElementById('res-guests') ? document.getElementById('res-guests').value : '2 Guests';
  var guests = parseInt(resGuestsStr) || 2;
  var occasion = document.getElementById('res-occasion') ? document.getElementById('res-occasion').value : '';
  var notes = document.getElementById('res-notes') ? document.getElementById('res-notes').value.trim() : '';
  var specialRequests = occasion && occasion !== 'None' ? ('Occasion: ' + occasion + (notes ? ' | ' + notes : '')) : notes;

  try {
    if (supabaseClient) {
      var { error } = await supabaseClient.from('reservations').insert([
        {
          name: fullName,
          email: email,
          phone: phone,
          reservation_date: resDate,
          reservation_time: resTime,
          guests: guests,
          special_requests: specialRequests
        }
      ]);
      if (error) {
        console.error('Supabase reservation error:', error);
      }
    }
  } catch (err) {
    console.error('Reservation error:', err);
  }

  document.getElementById('reservation-form').style.display = 'none';
  document.getElementById('res-success').style.display = 'block';
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
async function submitContact(e) {
  e.preventDefault();
  var btn = document.querySelector('#contact-form button[type="submit"]');
  if (btn) {
    btn.textContent = 'Sending...';
    btn.disabled = true;
  }

  var name = document.getElementById('c-name') ? document.getElementById('c-name').value.trim() : '';
  var email = document.getElementById('c-email') ? document.getElementById('c-email').value.trim() : '';
  var subject = document.getElementById('c-subject') ? document.getElementById('c-subject').value.trim() : '';
  var message = document.getElementById('c-msg') ? document.getElementById('c-msg').value.trim() : '';

  try {
    if (supabaseClient) {
      var { error } = await supabaseClient.from('messages').insert([
        {
          name: name,
          email: email,
          subject: subject,
          message: message
        }
      ]);
      if (error) {
        console.error('Supabase contact message error:', error);
      }
    }
  } catch (err) {
    console.error('Contact error:', err);
  }

  document.getElementById('contact-form').style.display = 'none';
  document.getElementById('contact-success').style.display = 'block';
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
