/**
 * OSUS ALMRAFIQ - Core JavaScript
 * Handles all dynamic layouts and interactions for the standalone HTML files.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initDropdowns();
  initStatsCounter();
  initAccordions();
  initContactForm();
});

/**
 * 1. Navbar Mobile Menu Toggle and Drawer
 */
function initNavbar() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-menu-drawer');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const closeBtn = document.getElementById('mobile-menu-close');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openMenu() {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function closeMenu() {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  toggleBtn.addEventListener('click', openMenu);
  backdrop.addEventListener('click', closeMenu);
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // Handle mobile drawer links
  const drawerLinks = drawer.querySelectorAll('a, button');
  drawerLinks.forEach(link => {
    if (link.id !== 'mobile-services-toggle' && !link.closest('#mobile-services-dropdown')) {
      link.addEventListener('click', closeMenu);
    }
  });
}

/**
 * 2. Dropdown Menus (Desktop Services & Mobile Services)
 */
function initDropdowns() {
  // Desktop Services Dropdown
  const desktopBtn = document.getElementById('services-dropdown-toggle');
  const desktopDropdown = document.getElementById('services-dropdown');
  const desktopChevron = document.getElementById('services-dropdown-chevron');

  if (desktopBtn && desktopDropdown) {
    // Toggle on click
    desktopBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !desktopDropdown.classList.contains('hidden');
      if (isOpen) {
        desktopDropdown.classList.add('hidden');
        if (desktopChevron) desktopChevron.classList.remove('rotate-180', 'text-[#cc9b4c]');
      } else {
        desktopDropdown.classList.remove('hidden');
        if (desktopChevron) desktopChevron.classList.add('rotate-180', 'text-[#cc9b4c]');
      }
    });

    // Close when clicking anywhere else
    document.addEventListener('click', (e) => {
      if (!desktopBtn.contains(e.target) && !desktopDropdown.contains(e.target)) {
        desktopDropdown.classList.add('hidden');
        if (desktopChevron) desktopChevron.classList.remove('rotate-180', 'text-[#cc9b4c]');
      }
    });
  }

  // Mobile Services Accordion (in drawer)
  const mobileBtn = document.getElementById('mobile-services-toggle');
  const mobileDropdown = document.getElementById('mobile-services-dropdown');
  const mobileChevron = document.getElementById('mobile-services-chevron');

  if (mobileBtn && mobileDropdown) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = !mobileDropdown.classList.contains('hidden');
      if (isOpen) {
        mobileDropdown.classList.add('hidden');
        mobileDropdown.style.maxHeight = '0px';
        if (mobileChevron) mobileChevron.classList.remove('rotate-180', 'text-[#cc9b4c]');
        mobileBtn.classList.remove('bg-[#cc9b4c]/10', 'text-[#cc9b4c]', 'border-r-4', 'border-[#cc9b4c]');
        mobileBtn.classList.add('text-white/70');
      } else {
        mobileDropdown.classList.remove('hidden');
        mobileDropdown.style.maxHeight = '500px'; // Allow auto-height animation
        if (mobileChevron) mobileChevron.classList.add('rotate-180', 'text-[#cc9b4c]');
        mobileBtn.classList.add('bg-[#cc9b4c]/10', 'text-[#cc9b4c]', 'border-r-4', 'border-[#cc9b4c]');
        mobileBtn.classList.remove('text-white/70');
      }
    });
  }
}

/**
 * 3. Stats Counter Animation (Intersection Observer)
 */
function initStatsCounter() {
  const counters = document.querySelectorAll('.stats-counter');
  if (counters.length === 0) return;

  const countUp = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const stepTime = 16; // ~60fps
    const increment = target / (duration / stepTime);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target;
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current);
      }
    }, stepTime);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        if (!counter.classList.contains('counted')) {
          counter.classList.add('counted');
          countUp(counter);
        }
      }
    });
  }, { threshold: 0.1 });

  counters.forEach(counter => observer.observe(counter));
}

/**
 * 4. FAQ Accordion Toggle
 */
function initAccordions() {
  const faqBlocks = document.querySelectorAll('.faq-accordion-block');
  if (faqBlocks.length === 0) return;

  faqBlocks.forEach(block => {
    const button = block.querySelector('.faq-accordion-button');
    const content = block.querySelector('.faq-accordion-content');
    const chevron = block.querySelector('.faq-accordion-chevron');

    if (!button || !content || !chevron) return;

    button.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');

      // Optional: Close all other accordions in the same container for cleaner UI
      const parent = block.parentElement;
      if (parent) {
        parent.querySelectorAll('.faq-accordion-content').forEach(otherContent => {
          if (otherContent !== content) {
            otherContent.classList.add('hidden');
            otherContent.style.maxHeight = '0px';
            const otherBlock = otherContent.closest('.faq-accordion-block');
            if (otherBlock) {
              const otherChevron = otherBlock.querySelector('.faq-accordion-chevron');
              if (otherChevron) otherChevron.classList.remove('rotate-180');
            }
          }
        });
      }

      if (isOpen) {
        content.classList.add('hidden');
        content.style.maxHeight = '0px';
        chevron.classList.remove('rotate-180');
      } else {
        content.classList.remove('hidden');
        content.style.maxHeight = content.scrollHeight + 'px';
        chevron.classList.add('rotate-180');
      }
    });
  });
}

/**
 * 5. Contact Form Validation and Simulation
 */
function initContactForm() {
  const form = document.getElementById('contact-inquiry-form');
  const successMessage = document.getElementById('contact-success-message');

  if (!form) return;

  const inputs = {
    name: document.getElementById('name'),
    phone: document.getElementById('phone'),
    email: document.getElementById('email'),
    service: document.getElementById('service'),
    message: document.getElementById('message')
  };

  const errors = {
    name: document.getElementById('error-name'),
    phone: document.getElementById('error-phone'),
    email: document.getElementById('error-email'),
    service: document.getElementById('error-service'),
    message: document.getElementById('error-message')
  };

  // Clear errors on input change
  Object.keys(inputs).forEach(key => {
    const input = inputs[key];
    if (input) {
      input.addEventListener('input', () => {
        if (errors[key]) {
          errors[key].textContent = '';
          errors[key].classList.add('hidden');
        }
        input.classList.remove('border-red-500');
        input.classList.add('border-slate-200');
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!inputs.name.value.trim()) {
      showError('name', 'حقل الاسم مطلوب');
      isValid = false;
    }

    // Validate Phone
    const phoneVal = inputs.phone.value.trim();
    if (!phoneVal) {
      showError('phone', 'حقل رقم الجوال مطلوب');
      isValid = false;
    } else if (!/^(05\d{8})$/.test(phoneVal) && !/^\+?\d{9,14}$/.test(phoneVal)) {
      showError('phone', 'صيغة رقم الجوال غير صحيحة، يرجى كتابة الـ 10 أرقام بدءاً بـ 05');
      isValid = false;
    }

    // Validate Email
    const emailVal = inputs.email.value.trim();
    if (!emailVal) {
      showError('email', 'حقل البريد الجاري مطلوب');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailVal)) {
      showError('email', 'صيغة البريد الإلكتروني غير صحيحة');
      isValid = false;
    }

    // Validate Service
    if (!inputs.service.value) {
      showError('service', 'يرجى تحديد إحدى الخدمات');
      isValid = false;
    }

    // Validate Message
    if (!inputs.message.value.trim()) {
      showError('message', 'يرجى كتابة نص الرسالة أو متطلبات الفحص');
      isValid = false;
    }

    if (isValid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHtml = submitBtn.innerHTML;

      // Show submitting state
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
      submitBtn.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 border-2 border-[#111921] border-t-transparent rounded-full animate-spin"></div>
          <span>قيد المعالجة الإجرائية من طاقمنا...</span>
        </div>
      `;

      // Simulate API call
      setTimeout(() => {
        form.classList.add('hidden');
        if (successMessage) {
          successMessage.classList.remove('hidden');
          successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Reset form
        form.reset();
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        submitBtn.innerHTML = originalHtml;
      }, 1200);
    }
  });

  function showError(field, msg) {
    if (errors[field]) {
      errors[field].textContent = msg;
      errors[field].classList.remove('hidden');
    }
    if (inputs[field]) {
      inputs[field].classList.remove('border-slate-200');
      inputs[field].classList.add('border-red-500');
    }
  }

  // Handle "Submit another inquiry" button inside success message
  const resetBtn = document.getElementById('contact-reset-button');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (successMessage) successMessage.classList.add('hidden');
      form.classList.remove('hidden');
    });
  }
}
