(() => {
  const refreshIcons = () => window.lucide?.createIcons();
  refreshIcons();

  document.querySelectorAll('.friction-action').forEach((button) => {
    button.addEventListener('click', () => {
      const active = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(active));
      button.closest('.friction-item').classList.toggle('is-resolved', active);
      button.querySelector('span').textContent = active ? button.dataset.active : button.dataset.idle;
    });
  });

  if ('IntersectionObserver' in window) {
    const navLinks = [...document.querySelectorAll('.desktop-nav a')];
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-90px 0px -65% 0px', threshold: 0 });
    navLinks.forEach((link) => {
      const section = document.querySelector(link.hash);
      if (section) navObserver.observe(section);
    });
  }

  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');

  const closeMenu = () => {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    mobileNav.hidden = true;
    menuButton.innerHTML = '<i data-lucide="menu"></i>';
    refreshIcons();
  };

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    if (open) {
      closeMenu();
      return;
    }
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Close navigation');
    mobileNav.hidden = false;
    menuButton.innerHTML = '<i data-lucide="x"></i>';
    refreshIcons();
  });

  mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) closeMenu();
  });

  const dialog = document.querySelector('#contact-dialog');
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#contact-status');
  const audience = document.querySelector('#contact-audience');

  document.querySelectorAll('[data-contact]').forEach((button) => {
    button.addEventListener('click', () => {
      closeMenu();
      if (button.dataset.audience && audience) audience.value = button.dataset.audience;
      if (!dialog) return;
      dialog.showModal();
      requestAnimationFrame(() => dialog.querySelector('input')?.focus());
    });
  });

  document.querySelector('.dialog-close')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = form.querySelector('button[type="submit"]');
    const data = new FormData(form);
    const note = String(data.get('message') || '').trim();
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      message: `Audience: ${data.get('audience')}\n\n${note || 'No additional details provided.'}`
    };

    submit.disabled = true;
    submit.textContent = 'Sending...';
    status.hidden = true;
    status.classList.remove('is-error');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'We could not send your request.');
      form.reset();
      status.textContent = 'Thanks. Your early-access request is on its way to the HireOn team.';
      status.hidden = false;
      submit.textContent = 'Request received';
    } catch (error) {
      status.textContent = error.message || 'Something went wrong. Please try again.';
      status.classList.add('is-error');
      status.hidden = false;
      submit.disabled = false;
      submit.innerHTML = 'Try again <i data-lucide="arrow-up-right"></i>';
      refreshIcons();
    }
  });

  const channelCopy = {
    email: {
      kicker: 'EMAIL / PERSONALIZED OUTREACH',
      state: 'Delivered',
      timeline: '<i data-lucide="send"></i>Invite delivered'
    },
    whatsapp: {
      kicker: 'WHATSAPP / TWO-WAY CONVERSATION',
      state: 'Candidate replied',
      timeline: '<i data-lucide="message-circle-check"></i>Reply received'
    },
    phone: {
      kicker: 'PHONE / STRUCTURED AI INTERVIEW',
      state: 'Interview in progress',
      timeline: '<i data-lucide="audio-lines"></i>Evidence captured'
    }
  };

  const channelTabs = [...document.querySelectorAll('[data-channel]')];
  const setChannel = (channel, focus = false) => {
    const selected = channelTabs.find((tab) => tab.dataset.channel === channel);
    if (!selected) return;
    channelTabs.forEach((tab) => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    document.querySelectorAll('[data-channel-view]').forEach((view) => {
      view.hidden = view.dataset.channelView !== channel;
    });
    document.querySelector('#channel-panel')?.setAttribute('aria-labelledby', selected.id);
    document.querySelector('#channel-kicker').textContent = channelCopy[channel].kicker;
    document.querySelector('#channel-state-text').textContent = channelCopy[channel].state;
    document.querySelector('#channel-timeline-last').innerHTML = channelCopy[channel].timeline;
    if (focus) selected.focus();
    refreshIcons();
  };

  channelTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setChannel(tab.dataset.channel));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const change = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
      const next = channelTabs[(index + change + channelTabs.length) % channelTabs.length];
      setChannel(next.dataset.channel, true);
    });
  });

  let callSeconds = 6 * 60 + 18;
  window.setInterval(() => {
    const time = document.querySelector('#outreach-call-time');
    if (!time || document.hidden) return;
    callSeconds += 1;
    time.textContent = `${String(Math.floor(callSeconds / 60)).padStart(2, '0')}:${String(callSeconds % 60).padStart(2, '0')}`;
  }, 1000);

  document.querySelectorAll('.faq-list details').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      document.querySelectorAll('.faq-list details[open]').forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  const revealTargets = document.querySelectorAll('.problem-board, .product-window, .capability, .outreach-console, .audience-grid article, .faq-list details');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealTargets.forEach((element) => element.classList.add('reveal'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' });
    revealTargets.forEach((element) => observer.observe(element));
  }
})();
