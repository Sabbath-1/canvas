// Adding padding ie the scroll-padding-top
function headerHeightFix() {
    const header = document.querySelector('.header-container');
    if (header) {
        const headerHeight = header.offsetHeight;
        const extraPadding = 5;
        const totalHeight = headerHeight + extraPadding;
        document.documentElement.style.scrollPaddingTop = totalHeight + 'px';
    }
}

window.addEventListener('load', headerHeightFix);
window.addEventListener('resize', headerHeightFix);

// Hide all pages, show only the active one
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const navId = this.getAttribute('data-nav');

            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
            });

            document.getElementById(navId).classList.add('active');
            this.classList.add('active');
            this.focus();

            hideMainWrapper();
        });
    });

    // Media query functionality
    const element = document.querySelector('#highlighter');
    if (element) {
        const highlight = 'highlight';
        // Use standard media query syntax for better browser support
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

    // Initial call
    hideMainWrapper();
});

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

// Additional event listeners
window.addEventListener('load', hideMainWrapper);
window.addEventListener('hashchange', hideMainWrapper);