// Adding padding to fix the header 
function headerHeightFix() {
    const header = document.querySelector('.header-container');
    if (header) {
        const headerHeight = header.offsetHeight;
        const extraPadding = 5;
        const totalHeight = headerHeight + extraPadding;
        document.documentElement.style.scrollPaddingTop = totalHeight + 'px';
    }
}

// Hide all pages, show only the active one
function hideMainWrapper() {
    const homePage = document.getElementById('home');
    const mainWrapper = document.querySelector('.main-wrapper');
    if (homePage && mainWrapper) {
        if (homePage.classList.contains('active')) {
            mainWrapper.style.display = 'none';
        } else {
            mainWrapper.style.display = 'block';
        }
    }
}

// nav and page management
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const navId = this.getAttribute('data-nav');
            if (!navId) return;

            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            navLinks.forEach(l => l.classList.remove('active'));

            const targetPage = document.getElementById(navId);
            if (targetPage) {
                targetPage.classList.add('active');
                document.querySelectorAll('.nav-link[data-nav="' + navId + '"]').forEach(n => n.classList.add('active'));
            } else {
                // We're likely on a different page (e.g. blogPost.html) — navigate back to the main page
                // Save which nav should be active so the main page can restore it after navigation
                try {
                    const activeNav = navId;
                    sessionStorage.setItem('barca_active_nav', activeNav);
                } catch (err) {}
                // Redirect to the main site page (allInOneBarca.html) with the hash so main JS can pick it up
                window.location.href = 'allInOneBarca.html#' + navId;
                return;
            }
            // If the clicked element isn't the header link, try to focus the header nav link for keyboard users
            try {
                const headerNav = document.querySelector('.nav-link[data-nav="' + navId + '"]');
                if (headerNav) headerNav.focus(); else this.focus();
            } catch (e) { this.focus(); }

            hideMainWrapper();
            
            try {
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            } catch (err) {
                window.scrollTo(0, 0);
            }
        });
    });
}

// state management
function setupStateManagement() {
    // State management don been moved to siteState js
    // This  is kept as a placeholder in case I for add
    // page-specific state handling in the future
}

// media query func
function setupMediaQueryHighlighter() {
    const element = document.querySelector('#highlighter');
    if (element) {
        const highlight = 'highlight';
        const mediaQuery = window.matchMedia('(width < 635px)');
        function queryHandler(e) {
            if (e.matches && element.classList.contains(highlight)) {
                element.classList.remove(highlight);
            } else if (!e.matches && !element.classList.contains(highlight)) {
                element.classList.add(highlight);
            }
        }
        queryHandler(mediaQuery);
        mediaQuery.addEventListener('change', queryHandler);
    }
}

// search func
function setupSearch() {
    const menuSearchBtn = document.getElementById('menu-search');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearchBtn = document.querySelector('.close-search');
    const searchInput = searchOverlay ? searchOverlay.querySelector('.search-input') : null;

    // container for the search results
    let resultsContainer = null;
    if (searchOverlay) {
        const searchContainer = searchOverlay.querySelector('.search-container') || searchOverlay;
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        resultsContainer.style.marginTop = '1rem';
        resultsContainer.style.width = '90%';
        resultsContainer.style.maxWidth = '800px';
        resultsContainer.style.background = 'transparent';
        searchContainer.appendChild(resultsContainer);
    }

    function openOverlay() {
        if (!searchOverlay) return;
        searchOverlay.classList.add('active');
        if (searchInput) setTimeout(() => searchInput.focus(), 120);
    }

    function closeOverlay() {
        if (!searchOverlay) return;
        searchOverlay.classList.remove('active');
        if (searchInput) searchInput.value = '';
        if (resultsContainer) resultsContainer.innerHTML = '';
    }

    if (menuSearchBtn && searchOverlay) {
        menuSearchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (searchOverlay.classList.contains('active')) closeOverlay(); else openOverlay();
        });

        // keyboard activation
        menuSearchBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (searchOverlay.classList.contains('active')) closeOverlay(); else openOverlay();
            }
        });

        // close when clicking outside the container
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) closeOverlay();
        });

        if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeOverlay);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) closeOverlay();
        });
    }

    // Search logic: filter .blogPost elements by title/description
    function buildResultItem(post, term) {
        const titleEl = post.querySelector('h2');
        const descEl = post.querySelector('.description');
        const title = titleEl ? titleEl.innerText.trim() : '(untitled)';
        const desc = descEl ? descEl.innerText.trim() : '';
        const snippetIndex = desc.toLowerCase().indexOf(term);
        let snippet = desc;
        if (snippetIndex >= 0) {
            const start = Math.max(0, snippetIndex - 40);
            snippet = (desc.substring(start, snippetIndex + 120) + (desc.length > snippetIndex + 120 ? '…' : '')).trim();
        } else if (desc.length > 140) {
            snippet = desc.substring(0, 140) + '…';
        }

        const item = document.createElement('a');
        item.href = '#';
        item.className = 'search-result-item';
        item.style.display = 'block';
        item.style.padding = '12px 16px';
        item.style.borderRadius = '8px';
        item.style.marginBottom = '8px';
        item.style.background = 'rgba(255,255,255,0.03)';
        item.style.color = '#fff';
        item.style.textDecoration = 'none';

        const h = document.createElement('div');
        h.style.fontWeight = '700';
        h.style.marginBottom = '6px';
        h.innerText = title;

        const p = document.createElement('div');
        p.style.opacity = '0.85';
        p.style.fontSize = '0.95rem';
        p.innerText = snippet;

        item.appendChild(h);
        item.appendChild(p);

        item.addEventListener('click', function(ev) {
            ev.preventDefault();
            // Activate the page that contains this post and scroll to the post
            const page = post.closest('.page');
            if (page && page.id) {
                document.querySelectorAll('.page').forEach(pg => pg.classList.remove('active'));
                const targetPage = document.getElementById(page.id);
                if (targetPage) targetPage.classList.add('active');

                // Update nav links active state
                document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
                const navToActivate = Array.from(document.querySelectorAll('.nav-link')).find(n => n.getAttribute('data-nav') === page.id);
                if (navToActivate) navToActivate.classList.add('active');

                hideMainWrapper();

                // Close overlay and scroll
                closeOverlay();
                setTimeout(() => {
                    post.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 80);
            }
        });

        return item;
    }

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const term = (e.target.value || '').trim().toLowerCase();
            resultsContainer.innerHTML = '';
            if (!term) return;

            const posts = Array.from(document.querySelectorAll('.blogPost'));
            const matches = [];
            for (const post of posts) {
                const title = (post.querySelector('h2')?.innerText || '').toLowerCase();
                const desc = (post.querySelector('.description')?.innerText || '').toLowerCase();
                const combined = (title + ' ' + desc).toLowerCase();
                if (combined.includes(term)) matches.push(post);
                if (matches.length >= 20) break; // limit
            }

            if (matches.length === 0) {
                const none = document.createElement('div');
                none.innerText = 'No results found.';
                none.style.opacity = '0.8';
                resultsContainer.appendChild(none);
                return;
            }

            for (const m of matches) {
                resultsContainer.appendChild(buildResultItem(m, term));
            }
        });
    }
}

// blog post func
function getQueryParam(name) {
    const p = new URLSearchParams(window.location.search);
    const v = p.get(name);
    return v ? decodeURIComponent(v) : null;
}

function calculateReadTime(text) {
    const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

function calculateReadTimeForElement(selector) {
    const el = document.querySelector(selector);
    if (!el) return 0;
    const text = el.textContent || '';
    return calculateReadTime(text);
}

function populateArticleFromParams() {
    const title = getQueryParam('title');
    const img = getQueryParam('img');
    let author = getQueryParam('author');
    const date = getQueryParam('date') || '';
    const desc = getQueryParam('desc');

    if (title) {
        const titleEl = document.getElementById('article-title');
        if (titleEl) titleEl.textContent = title;
    }

    // If no author provided, keep the default styled author span (do not overwrite if manual content exists)
    const authorEl = document.getElementById('article-author');
    if (authorEl) {
        if (author) {
            authorEl.textContent = author;
        } else if (!authorEl.innerHTML.trim()) {
            // only insert default when there's no manual/previous content
            authorEl.innerHTML = '<span class="barca-author">@Barca4L</span>';
        }
    }

    if (date) {
        const dateEl = document.getElementById('article-date');
        if (dateEl) dateEl.textContent = date;
    }

    if (img) {
    const imageEl = document.getElementById('article-image');
    if (imageEl) {
        // Use the image path exactly as provided in the URL
        imageEl.src = img;
        imageEl.alt = title || 'Article image';
    }
}

    if (desc) {
        const contentEl = document.getElementById('article-content');
        if (contentEl) contentEl.innerHTML = desc;
    }

    const readEl = document.getElementById('read-time');
    const content = document.getElementById('article-content');
    const minutes = content ? calculateReadTime(content.textContent || '') : 0;
    if (readEl) readEl.textContent = minutes + ' min read';
}

function initShareButtons() {
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const url = window.location.href;
            const title = document.getElementById('article-title')?.textContent || document.title;
            if (this.classList.contains('twitter')) {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
            } else if (this.classList.contains('facebook')) {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
            } else if (this.classList.contains('whatsapp')) {
                window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`);
            }
        });
    });
}

function setupBlogPostPage() {
    populateArticleFromParams();
    initShareButtons();

    // for keeping the active state on the nav links across the pages
    try {
        const pending = sessionStorage.getItem('barca_active_nav');
        if (pending) {
            document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
            document.querySelectorAll('.nav-link[data-nav="' + pending + '"]').forEach(n => n.classList.add('active'));
        }
    } catch (e) { /* ignore */ }
}

// calling the functions

document.addEventListener('DOMContentLoaded', function() {
    // Core layout
    headerHeightFix();
    hideMainWrapper();
    
    // Navigation
    setupNavigation();
    setupStateManagement();
    setupMediaQueryHighlighter();
    
    // Search func
    setupSearch();
    
    // Blog post func
    if (window.location.pathname.includes('blogPost.html')) {
        setupBlogPostPage();
    }
});

// Additional event listeners
window.addEventListener('load', function() {
    headerHeightFix();
    hideMainWrapper();
});

window.addEventListener('resize', headerHeightFix);
window.addEventListener('hashchange', hideMainWrapper);