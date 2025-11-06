// blogpost.js
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
    let author = q('author');
    const date = q('date') || '';
    const desc = q('desc');

    if (title) document.getElementById('article-title').textContent = title;

    // Style @Barca4L if used
    if (!author) {
      author = '<span class="barca-author">@Barca4L</span>';
    }
    const authorEl = document.getElementById('article-author');
    if (authorEl) authorEl.innerHTML = author;

    if (date) document.getElementById('article-date').textContent = date;
    if (img) {
      const el = document.getElementById('article-image');
      el.src = img;
      el.alt = title || 'Article image';
    }
    if (desc) {
      document.getElementById('article-content').innerHTML = desc;
    } // else: do not overwrite manual content

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