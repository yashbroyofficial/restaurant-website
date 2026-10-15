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

// Current user state
var currentUser = null;

// =============================================
// AUTHENTICATION MODAL & UI LOGIC
// =============================================

function openAuthModal(tab) {
  var modal = document.getElementById('auth-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    switchAuthTab(tab || 'signin');
  }
}

function closeAuthModal() {
  var modal = document.getElementById('auth-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    clearAuthAlert();
  }
}

function handleOverlayClick(e) {
  if (e.target && e.target.id === 'auth-modal') {
    closeAuthModal();
  }
}

// Close on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeAuthModal();
    closeUserDropdown();
  }
});

function switchAuthTab(tab) {
  clearAuthAlert();
  var tabsContainer = document.getElementById('auth-tabs');
  var titleEl = document.getElementById('auth-modal-title');
  var subtitleEl = document.getElementById('auth-modal-subtitle');
  var formSignin = document.getElementById('form-signin');
  var formSignup = document.getElementById('form-signup');
  var formMagic = document.getElementById('form-magic');
  var formForgot = document.getElementById('form-forgot');

  // Reset tab buttons
  document.querySelectorAll('.auth-tab-btn').forEach(function(b) {
    b.classList.remove('active');
  });

  // Hide all forms
  if (formSignin) formSignin.style.display = 'none';
  if (formSignup) formSignup.style.display = 'none';
  if (formMagic) formMagic.style.display = 'none';
  if (formForgot) formForgot.style.display = 'none';

  if (tab === 'signin') {
    if (tabsContainer) tabsContainer.style.display = 'flex';
    var tabBtn = document.getElementById('tab-btn-signin');
    if (tabBtn) tabBtn.classList.add('active');
    if (titleEl) titleEl.textContent = 'Welcome to Lumiere';
    if (subtitleEl) subtitleEl.textContent = 'Sign in to manage your fine dining reservations and preferences.';
    if (formSignin) formSignin.style.display = 'flex';
  } else if (tab === 'signup') {
    if (tabsContainer) tabsContainer.style.display = 'flex';
    var tabBtn = document.getElementById('tab-btn-signup');
    if (tabBtn) tabBtn.classList.add('active');
    if (titleEl) titleEl.textContent = 'Join Lumiere Club';
    if (subtitleEl) subtitleEl.textContent = 'Create an account for personalized dining and priority reservations.';
    if (formSignup) formSignup.style.display = 'flex';
  } else if (tab === 'magic') {
    if (tabsContainer) tabsContainer.style.display = 'flex';
    var tabBtn = document.getElementById('tab-btn-magic');
    if (tabBtn) tabBtn.classList.add('active');
    if (titleEl) titleEl.textContent = 'Passwordless Sign In';
    if (subtitleEl) subtitleEl.textContent = 'Instant, secure access delivered directly to your email inbox.';
    if (formMagic) formMagic.style.display = 'flex';
  } else if (tab === 'forgot') {
    if (tabsContainer) tabsContainer.style.display = 'none';
    if (titleEl) titleEl.textContent = 'Reset Password';
    if (subtitleEl) subtitleEl.textContent = 'Enter your email address to receive secure reset instructions.';
    if (formForgot) formForgot.style.display = 'flex';
  }
}

function showAuthAlert(message, type) {
  var alertEl = document.getElementById('auth-alert');
  if (alertEl) {
    alertEl.textContent = message;
    alertEl.className = 'auth-alert ' + (type === 'success' ? 'success' : 'error');
    alertEl.style.display = 'block';
  }
}

function clearAuthAlert() {
  var alertEl = document.getElementById('auth-alert');
  if (alertEl) {
    alertEl.style.display = 'none';
    alertEl.textContent = '';
  }
}

function showToast(message, icon) {
  var toast = document.getElementById('toast-notification');
  var msg = document.getElementById('toast-message');
  var iconEl = document.getElementById('toast-icon');
  if (toast && msg) {
    msg.textContent = message;
    if (iconEl && icon) iconEl.textContent = icon;
    toast.style.display = 'block';
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(function() {
      toast.style.display = 'none';
    }, 4500);
  }
}

// User Profile dropdown
function toggleUserDropdown(e) {
  if (e) e.stopPropagation();
  var container = document.getElementById('user-chip-container');
  var btn = document.getElementById('user-chip-btn');
  if (container) {
    var isOpen = container.classList.toggle('open');
    if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }
}

function closeUserDropdown() {
  var container = document.getElementById('user-chip-container');
  var btn = document.getElementById('user-chip-btn');
  if (container) {
    container.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.user-chip-container')) {
    closeUserDropdown();
  }
});

function quickFillReservation() {
  closeUserDropdown();
  showPage('reservations');
  if (currentUser) {
    prefillUserForms(currentUser);
  }
}

// Update UI based on authenticated user
function updateAuthState(user) {
  currentUser = user;
  var loginBtn = document.getElementById('nav-auth-login-btn');
  var chipContainer = document.getElementById('user-chip-container');
  var mobileBtn = document.getElementById('mobile-auth-btn');

  if (user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (chipContainer) chipContainer.style.display = 'block';

    var fullName = (user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name : '';
    var displayName = fullName || user.email.split('@')[0];
    var initial = (fullName ? fullName.charAt(0) : user.email.charAt(0)).toUpperCase();

    var initialEl = document.getElementById('user-avatar-initial');
    var chipNameEl = document.getElementById('user-chip-name');
    var emailEl = document.getElementById('user-dropdown-email');
    if (initialEl) initialEl.textContent = initial;
    if (chipNameEl) chipNameEl.textContent = displayName;
    if (emailEl) emailEl.textContent = user.email;

    if (mobileBtn) {
      mobileBtn.textContent = 'Sign Out (' + displayName + ')';
      mobileBtn.onclick = handleSignOut;
    }

    prefillUserForms(user);
  } else {
    if (loginBtn) loginBtn.style.display = 'block';
    if (chipContainer) chipContainer.style.display = 'none';
    if (mobileBtn) {
      mobileBtn.textContent = 'Sign In';
      mobileBtn.onclick = function() {
        document.getElementById('nav-menu').classList.remove('open');
        openAuthModal('signin');
      };
    }
  }
}

function prefillUserForms(user) {
  if (!user) return;
  var fullName = (user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name.trim() : '';
  var firstName = '';
  var lastName = '';
  if (fullName) {
    var parts = fullName.split(' ');
    firstName = parts[0] || '';
    lastName = parts.slice(1).join(' ') || '';
  }

  var resFirst = document.getElementById('res-first');
  var resLast = document.getElementById('res-last');
  var resEmail = document.getElementById('res-email');
  var cName = document.getElementById('c-name');
  var cEmail = document.getElementById('c-email');

  if (resFirst && !resFirst.value && firstName) resFirst.value = firstName;
  if (resLast && !resLast.value && lastName) resLast.value = lastName;
  if (resEmail && !resEmail.value && user.email) resEmail.value = user.email;
  if (cName && !cName.value && fullName) cName.value = fullName;
  if (cEmail && !cEmail.value && user.email) cEmail.value = user.email;
}

// =============================================
// SUPABASE AUTHENTICATION HANDLERS
// =============================================

async function handleEmailSignIn(e) {
  e.preventDefault();
  if (!supabaseClient) {
    showAuthAlert('Supabase authentication client is not available.', 'error');
    return;
  }
  var email = document.getElementById('signin-email').value.trim();
  var password = document.getElementById('signin-password').value;
  var submitBtn = document.getElementById('btn-submit-signin');

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Authenticating...';
  }

  try {
    var { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      showAuthAlert(error.message, 'error');
    } else {
      closeAuthModal();
      var name = (data.user && data.user.user_metadata && data.user.user_metadata.full_name)
        ? data.user.user_metadata.full_name
        : email.split('@')[0];
      showToast('Welcome back, ' + name + '!', '✓');
    }
  } catch (err) {
    showAuthAlert(err.message || 'An unexpected error occurred during sign in.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  }
}

async function handleEmailSignUp(e) {
  e.preventDefault();
  if (!supabaseClient) {
    showAuthAlert('Supabase authentication client is not available.', 'error');
    return;
  }
  var name = document.getElementById('signup-name').value.trim();
  var email = document.getElementById('signup-email').value.trim();
  var password = document.getElementById('signup-password').value;
  var submitBtn = document.getElementById('btn-submit-signup');

  if (password.length < 6) {
    showAuthAlert('Password must be at least 6 characters long.', 'error');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';
  }

  try {
    var { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: name
        }
      }
    });

    if (error) {
      showAuthAlert(error.message, 'error');
    } else {
      if (data && data.session) {
        closeAuthModal();
        showToast('Account created! Welcome, ' + name + '.', '✓');
      } else {
        showAuthAlert('Account created! A confirmation link has been sent to ' + email + '. Please verify your email to log in.', 'success');
      }
    }
  } catch (err) {
    showAuthAlert(err.message || 'An error occurred during account creation.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
    }
  }
}

async function handleMagicLinkSignIn(e) {
  e.preventDefault();
  if (!supabaseClient) {
    showAuthAlert('Supabase authentication client is not available.', 'error');
    return;
  }
  var email = document.getElementById('magic-email').value.trim();
  var submitBtn = document.getElementById('btn-submit-magic');

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending Magic Link...';
  }

  try {
    var { error } = await supabaseClient.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: window.location.origin + window.location.pathname
      }
    });

    if (error) {
      showAuthAlert(error.message, 'error');
    } else {
      showAuthAlert('Magic sign-in link dispatched! Please check your email inbox at ' + email + '.', 'success');
    }
  } catch (err) {
    showAuthAlert(err.message || 'Could not send magic login link.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Magic Link';
    }
  }
}

async function handlePasswordReset(e) {
  e.preventDefault();
  if (!supabaseClient) {
    showAuthAlert('Supabase authentication client is not available.', 'error');
    return;
  }
  var email = document.getElementById('forgot-email').value.trim();
  var submitBtn = document.getElementById('btn-submit-forgot');

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending Instructions...';
  }

  try {
    var { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname
    });

    if (error) {
      showAuthAlert(error.message, 'error');
    } else {
      showAuthAlert('Password reset instructions sent! Please check ' + email + '.', 'success');
    }
  } catch (err) {
    showAuthAlert(err.message || 'Failed to send password reset email.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Reset Instructions';
    }
  }
}

async function handleSignOut() {
  closeUserDropdown();
  if (supabaseClient) {
    try {
      await supabaseClient.auth.signOut();
      updateAuthState(null);
      showToast('You have been signed out.', '✓');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }
}

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
      var reservationPayload = {
        name: fullName,
        email: email,
        phone: phone,
        reservation_date: resDate,
        reservation_time: resTime,
        guests: guests,
        special_requests: specialRequests
      };
      
      var { error } = await supabaseClient.from('reservations').insert([reservationPayload]);
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
  if (currentUser) {
    prefillUserForms(currentUser);
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

// --- Initialize App & Supabase Auth Session ---
window.addEventListener('DOMContentLoaded', function() {
  // Set min date for reservation
  var dateInput = document.getElementById('res-date');
  if (dateInput) {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = yyyy + '-' + mm + '-' + dd;
  }

  // Supabase Auth listener & session restore
  if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange(function(event, session) {
      updateAuthState(session ? session.user : null);
    });

    supabaseClient.auth.getSession().then(function(res) {
      if (res && res.data && res.data.session) {
        updateAuthState(res.data.session.user);
      }
    }).catch(function(err) {
      console.warn('Session check failed:', err);
    });
  }
});
