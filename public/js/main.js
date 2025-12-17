// Toast Notification System
function showToast(message, type = 'info') {
  const container = document.querySelector('.toast-container') || createToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const userSidebar = document.querySelector('.user-sidebar');
  const adminSidebar = document.querySelector('.admin-sidebar');
  const sidebar = userSidebar || adminSidebar;
  const overlay = document.getElementById('sidebarOverlay');

  if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
      if (overlay) {
        overlay.classList.toggle('active');
      }
    });

    // Close sidebar when clicking on overlay
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        overlay.classList.remove('active');
      });
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('active') &&
          !sidebar.contains(e.target) &&
          !mobileMenuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        if (overlay) {
          overlay.classList.remove('active');
        }
      }
    });

    // Close sidebar when clicking on a link
    const sidebarLinks = sidebar.querySelectorAll('a:not(.no-link)');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        if (overlay) {
          overlay.classList.remove('active');
        }
      });
    });
  }
});

// Bookshelf - Book opening animation
document.addEventListener('DOMContentLoaded', () => {
  const books = document.querySelectorAll('.book');

  books.forEach(book => {
    book.addEventListener('click', (e) => {
      // Only animate if not already opening
      if (!book.classList.contains('book-opening')) {
        book.classList.add('book-opening');

        // Allow navigation after animation starts
        setTimeout(() => {
          // Link will navigate naturally
        }, 400);
      }
    });
  });
});

// Rating functionality
document.addEventListener('DOMContentLoaded', () => {
  // Star rating
  const stars = document.querySelectorAll('.star');
  const ratingInput = document.getElementById('rating-input');

  stars.forEach((star, index) => {
    star.addEventListener('click', () => {
      const rating = index + 1;
      if (ratingInput) {
        ratingInput.value = rating;
      }

      stars.forEach((s, i) => {
        if (i < rating) {
          s.classList.add('filled');
        } else {
          s.classList.remove('filled');
        }
      });
    });

    star.addEventListener('mouseenter', () => {
      stars.forEach((s, i) => {
        if (i <= index) {
          s.classList.add('filled');
        } else {
          s.classList.remove('filled');
        }
      });
    });
  });

  const ratingSection = document.querySelector('.rating-section');
  if (ratingSection) {
    ratingSection.addEventListener('mouseleave', () => {
      const currentRating = ratingInput ? parseInt(ratingInput.value) : 0;
      stars.forEach((s, i) => {
        if (i < currentRating) {
          s.classList.add('filled');
        } else {
          s.classList.remove('filled');
        }
      });
    });
  }

  // Auto-hide flash messages
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 300);
    }, 5000);
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Active sidebar link highlighting
  const currentPath = window.location.pathname;
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  sidebarLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
});

// File upload for HTML/MD files
function uploadFile(inputElement, editorId) {
  const file = inputElement.files[0];
  if (!file) return;

  console.log('Uploading file:', file.name);

  const formData = new FormData();
  formData.append('file', file);

  fetch('/admin/upload-file', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Response data:', data);
    console.log('Content length:', data.content ? data.content.length : 0);
    console.log('Content preview:', data.content ? data.content.substring(0, 200) : 'empty');

    if (data.success && data.content) {
      if (window.quillEditor) {
        // Use clipboard API to properly parse and insert HTML
        const delta = window.quillEditor.clipboard.convert(data.content);
        console.log('Delta created:', delta);
        window.quillEditor.setContents(delta, 'silent');
        console.log('Content set in editor');
        showToast('File uploaded successfully!', 'success');
      } else {
        console.error('Quill editor not found');
        showToast('Editor not initialized', 'error');
      }
    } else {
      showToast('Failed to upload file: ' + (data.error || 'Unknown error'), 'error');
    }
  })
  .catch(error => {
    console.error('Upload error:', error);
    showToast('Failed to upload file: ' + error.message, 'error');
  });
}

// Confirm delete actions
function confirmDelete(message) {
  return confirm(message || 'Are you sure you want to delete this item?');
}
