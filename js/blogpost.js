// blogpost.js
// Article-page specific logic (populate from URL params, read time, share buttons)

(function () {
  function q(name) {
    const p = new URLSearchParams(window.location.search);
    const v = p.get(name);
    return v ? decodeURIComponent(v) : null;
  }

  function calculateReadTime(text) {
    const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  function populateArticleFromParams() {
    const title = q('title');
    const img = q('img');
    const author = q('author') || '@Barca4L';
    const date = q('date') || '';
    const desc = q('desc');

    if (title) document.getElementById('article-title').textContent = title;
    if (author) document.getElementById('article-author').textContent = author;
    if (date) document.getElementById('article-date').textContent = date;
    if (img) {
      const el = document.getElementById('article-image');
      // If img value is relative (starts with /), use as-is; otherwise allow full URL
      el.src = img;
      el.alt = title || 'Article image';
    }
    if (desc) {
      // desc can be HTML-encoded; allow basic HTML
      document.getElementById('article-content').innerHTML = desc;
    } else {
      // If no desc passed, show a short placeholder lead if available
      if (!desc && title) {
        const lead = '<p class="article-lead">Read more about ' + (title || 'this article') + ' on Barca 4L.</p>';
        document.getElementById('article-content').innerHTML = lead;
      }
    }

    // update read time
    const readEl = document.getElementById('read-time');
    const minutes = calculateReadTime(document.getElementById('article-content').textContent || '');
    if (readEl) readEl.textContent = minutes + ' min read';
  }

  function initShareButtons() {
    document.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const url = window.location.href;
        const title = document.getElementById('article-title').textContent || document.title;
        if (this.classList.contains('twitter')) {
          window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url));
        } else if (this.classList.contains('facebook')) {
          window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url));
        } else if (this.classList.contains('whatsapp')) {
          window.open('https://wa.me/?text=' + encodeURIComponent(title + ' ' + url));
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    populateArticleFromParams();
    initShareButtons();
  });

})();