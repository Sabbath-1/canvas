// site-state.js
// Shared client state handling between the main page and article pages.
// - Saves scroll/hash/active nav when opening an article
// - Restores active nav/hash/scroll on the main page (including pageshow/back)
// - Mirrors active nav on article pages without clearing the stored key

(function () {
  // Enable debug logging for troubleshooting
  const DEBUG = true;
  function log(...args) {
    if (DEBUG) console.log('[Site]', ...args);
  }

  // Storage keys (consistent naming is important)
  const keys = {
    scroll: 'barca_scroll',
    hash: 'barca_hash',
    activeNav: 'barca_active_nav'
  };

  // Save current page state before opening an article
  function saveMainPageState(href) {
    if (!href.includes('blogPost.html')) return;

    try {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const currentHash = location.hash || '';
      log('Saving state before article:', { scrollY, currentHash });

      // Save scroll and hash state
      sessionStorage.setItem(keys.scroll, String(scrollY));
      sessionStorage.setItem(keys.hash, currentHash);

      // Save active nav state
      const active = document.querySelector('.nav-link.active');
      if (active) {
        const activeNav = active.getAttribute('data-nav');
        if (activeNav) {
          log('Saving active nav:', activeNav);
          sessionStorage.setItem(keys.activeNav, activeNav);
        }
      }
    } catch (err) {
      console.warn('[Site] Error saving state:', err);
    }
  }

  // Apply pending nav on article pages (mirror header active state)
  function applyPendingNavOnArticle() {
    try {
      // Only run on blog post pages
      if (!document.querySelector('.blog-container')) {
        log('Not an article page, skipping nav sync');
        return;
      }

      const pending = sessionStorage.getItem(keys.activeNav);
      if (!pending) {
        log('No pending nav to apply on article');
        return;
      }

      log('Article page: applying pending nav:', pending);
      document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
      document.querySelectorAll('.nav-link[data-nav="' + pending + '"]').forEach(n => n.classList.add('active'));

      // Important: DO NOT remove the active nav here
      // The main page needs it when user hits Back
      log('Nav applied (keeping for back navigation)');
    } catch (e) {
      console.warn('[Site] Error applying article nav:', e);
    }
  }

  // Restore stored scroll/hash/nav on the main page
  function restoreMainPageState() {
    try {
      // Check if we're on the main page
      if (!document.querySelector('.main-container')) {
        log('Not on main page, skipping restore');
        return;
      }

      log('Main page: attempting state restore');

      // Gather all saved state
      const savedHash = sessionStorage.getItem(keys.hash);
      const savedScroll = parseInt(sessionStorage.getItem(keys.scroll) || '0', 10);
      const pendingNav = sessionStorage.getItem(keys.activeNav);
      log('Found stored values:', { savedHash, savedScroll, pendingNav });

      // 1. First restore navigation state
      if (pendingNav) {
        log('Restoring navigation to:', pendingNav);
        try {
          // Clear existing states
          document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
          document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));

          // Activate target page and nav links
          const targetPage = document.getElementById(pendingNav);
          if (targetPage) {
            log('Activating page:', pendingNav);
            targetPage.classList.add('active');
          }

          const navLinks = document.querySelectorAll('.nav-link[data-nav="' + pendingNav + '"]');
          navLinks.forEach(n => n.classList.add('active'));
          log('Activated', navLinks.length, 'nav links');

          // Sync layout visibility
          if (typeof hideMainWrapper === 'function') {
            log('Syncing main wrapper visibility');
            try { hideMainWrapper(); } catch (e) {}
          }

          // Only clear active_nav AFTER successful application
          sessionStorage.removeItem(keys.activeNav);
          log('Cleared active nav after applying');
        } catch (e) {
          console.warn('[Site] Error activating nav:', e);
        }
      }

      // 2. Then restore the hash if needed
      if (savedHash) {
        log('Restoring hash:', savedHash);
        if (savedHash !== location.hash) {
          location.hash = savedHash;
        }
        sessionStorage.removeItem(keys.hash);
      }

      // 3. Finally restore scroll position after a brief delay
      if (!Number.isNaN(savedScroll) && savedScroll > 0) {
        log('Will restore scroll to:', savedScroll);
        // Delay scroll restoration slightly to let layout settle
        setTimeout(function () {
          try {
            log('Restoring scroll position...');
            window.scrollTo({ top: savedScroll, left: 0, behavior: 'instant' });
          } catch (e) {
            console.warn('[Site] Fallback scroll:', e);
            window.scrollTo(0, savedScroll);
          }
          sessionStorage.removeItem(keys.scroll);
          log('Scroll restored and cleared');
        }, 100); // Slightly longer delay for more reliable restore
      }
    } catch (err) {
      console.warn('[Site] Error in restore:', err);
    }
  }

  // Click handler to save state before article navigation
  document.addEventListener('click', function (e) {
    const a = e.target.closest && e.target.closest('a');
    if (!a) return;
    try {
      const href = a.getAttribute('href') || '';
      if (href.indexOf('blogPost.html') === 0 || href.includes('blogPost.html?')) {
        // Only save state for normal clicks (not middle click/ctrl+click)
        if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
          saveMainPageState(href);
        }
      }
    } catch (err) {
      console.warn('[Site] Error in click handler:', err);
    }
  }, { capture: true }); // Capture phase to handle before navigation

  // Run restore handlers at appropriate times
  window.addEventListener('DOMContentLoaded', function() {
    log('DOMContentLoaded - syncing state...');
    applyPendingNavOnArticle();
    restoreMainPageState();
  });

  window.addEventListener('pageshow', function (event) {
    // pageshow fires on back/forward navigation including bfcache restore
    log('pageshow event - syncing state... (persisted:', event.persisted, ')');
    applyPendingNavOnArticle();
    restoreMainPageState();
  });
})();