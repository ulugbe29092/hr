// Check authentication
const token = localStorage.getItem('token');
if (!token && !window.location.pathname.includes('/login')) {
  window.location.href = '/login';
}

// Mobile menu toggle
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('active');
}

// Active nav item
const currentPath = window.location.pathname;
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
  if (item.getAttribute('href') === currentPath) {
    item.classList.add('active');
  } else {
    item.classList.remove('active');
  }
});

// Dropdown toggle
function toggleDropdown(id) {
  const dropdown = document.getElementById(id);
  const allDropdowns = document.querySelectorAll('.dropdown-menu');
  
  allDropdowns.forEach(d => {
    if (d.id !== id) {
      d.classList.remove('show');
    }
  });
  
  dropdown.classList.toggle('show');
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown-menu').forEach(d => {
      d.classList.remove('show');
    });
  }
});

// Settings Modal
function openSettings() {
  document.getElementById('settingsModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeSettings() {
  document.getElementById('settingsModal').classList.remove('show');
  document.body.style.overflow = '';
}

function saveSettings() {
  // Save settings logic here
  showToast('Settings saved successfully!', 'success');
  closeSettings();
}

// Settings Tabs
function switchTab(tabName) {
  // Remove active class from all tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Add active class to clicked tab
  event.target.classList.add('active');
  
  // Show corresponding content
  const contentId = tabName === 'notifications' ? 'notificationsTab' : tabName;
  document.getElementById(contentId).classList.add('active');
}

// Theme switcher
function setTheme(theme) {
  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  
  localStorage.setItem('theme', theme);
  showToast(`Theme changed to ${theme}`, 'success');
}

// Logout
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}

// Toast notification
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Global search
const searchInput = document.getElementById('globalSearch');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length > 2) {
      // Implement search logic here
      console.log('Searching for:', query);
    }
  });
}

// Add modal function
function showAddModal() {
  showToast('Add new feature coming soon!', 'info');
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSettings();
  }
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
}
