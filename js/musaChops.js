// Header scroll logic (This remains outside DOMContentLoaded as it uses window events)
const headerContainer = document.querySelector('.header-container');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        // Ensure headerContainer exists before trying to add class
        if (headerContainer) headerContainer.classList.add('scrolled');
    } else {
        if (headerContainer) headerContainer.classList.remove('scrolled');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // --- CAROUSEL LOGIC ---
    const mainContainer = document.querySelector('.container.wrapper');
    const containerCaro = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.slide');
    const nextCaro = document.querySelector('.btn.next-caro');
    const previousCaro = document.querySelector('.btn.previous-caro');
    const indicators = document.querySelectorAll('.indicator');

    let currentSlide = 0;
    const totalSlides = slides.length;

    function updateCaro() {
        if (!containerCaro) return;
        containerCaro.style.transform = `translateX(-${currentSlide * 100}%)`;

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCaro();
    }
    function previousSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCaro();
    }

    if (nextCaro) nextCaro.addEventListener('click', nextSlide);
    if (previousCaro) previousCaro.addEventListener('click', previousSlide);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateCaro();
        })
    })

    let autoplay = setInterval(nextSlide, 3000);
    if (containerCaro && containerCaro.parentElement) {
        containerCaro.parentElement.addEventListener('mouseenter', () => {
            clearInterval(autoplay);
        });
        containerCaro.parentElement.addEventListener('mouseleave', () => {
            autoplay = setInterval(nextSlide, 3000);
        });
    }

    // Swipe mobile logic
    if (containerCaro) {
        let startX = 0;
        let endX = 0;
        containerCaro.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        containerCaro.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        });
        containerCaro.addEventListener('touchend', () => {
            if (startX - endX > 50) {
                nextSlide();
            } else if (endX - startX > 50) {
                previousSlide();
            }
        });
    }

    updateCaro();
    // --- END CAROUSEL LOGIC ---

    // --- HAMBURGER MENU LOGIC ---
    const hamburger = document.querySelector('#hamburger');
    const nav = document.querySelector('nav > ul');
    const overlay = document.querySelector('#overlay'); // Used for the hamburger menu only!

    const closeMenu = () => {
        if (nav) nav.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger && nav && overlay) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
            overlay.classList.toggle('active');
            hamburger.classList.toggle('active');

            if (nav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    if (overlay) overlay.addEventListener('click', closeMenu);

    document.addEventListener('click', (event) => {
        const clickOnNav = nav?.contains(event.target);
        const clickOnHamburger = hamburger?.contains(event.target);

        if (nav?.classList.contains('active') && !clickOnNav && !clickOnHamburger) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
            // Also check for the dish modal in the next block!
        }
    });

    const menuLink = document.querySelectorAll('nav > ul > li > a');
    menuLink.forEach(link => {
        link.addEventListener('click', closeMenu);
    })
    // --- END HAMBURGER MENU LOGIC ---


    // --- DISH MODAL POP-UP LOGIC (The Fix) ---

    // 1. Get dedicated modal elements (make sure you have an element with ID 'dishModal' in your HTML)
    const dishModal = document.querySelector('#dishModal'); 
    const modalCloseBtn = document.querySelector('#modalCloseBtn');
    const modalContent = document.querySelector('#dishModalContent');

    // 2. Helper function to close the modal with animation
    const hideModal = () => {
        if (!dishModal || !modalContent) return;
        // Start exit animation (scale down/fade out)
        modalContent.classList.add('scale-95', 'opacity-0');
        dishModal.classList.add('opacity-0');

        // Wait for transition to finish (300ms) before hiding completely
        setTimeout(() => {
            dishModal.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
        }, 300);
    };

    // 3. Complete popUp function
    function popUp() {
        // Define all dish elements you want to listen to
        const headerLinks = document.querySelectorAll('.dish-container .dish-info h3');
        
        // Ensure modal elements are present before continuing
        if (!dishModal || !modalContent) {
            console.error("Dish modal HTML structure is missing!");
            return;
        }

        headerLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); // Stop the link from trying to navigate

                // Get the parent container for data extraction
                const dishContainer = link.closest('.dish-container');
                if (!dishContainer) return;

                // --- DATA EXTRACTION ---
                // Get the data from elements inside the parent dish container
                const dishTitle = link.textContent;
                const dishDescription = dishContainer.querySelector('.dish-description')?.textContent || 'Detailed description unavailable.';
                const dishPrice = dishContainer.querySelector('.dish-price')?.textContent || '$0.00';
                const dishImageSrc = dishContainer.querySelector('img')?.src || '';

                // --- POPULATE MODAL CONTENT (Ensure these IDs exist in your HTML) ---
                document.getElementById('modalDishTitle').textContent = dishTitle;
                document.getElementById('modalDishDescription').textContent = dishDescription;
                document.getElementById('modalDishPrice').textContent = dishPrice;
                const modalImage = document.getElementById('modalDishImage');
                if (modalImage) modalImage.src = dishImageSrc;


                // --- SHOW MODAL WITH TRANSITION ---
                dishModal.classList.remove('hidden', 'opacity-0');
                
                // Small delay to allow the browser to register the class removal before transition starts
                setTimeout(() => {
                    modalContent.classList.remove('scale-95', 'opacity-0');
                    dishModal.classList.remove('opacity-0');
                }, 10);
                
                document.body.style.overflow = 'hidden'; // Prevent scroll
                console.log('Working: Dish Modal Active');
            })
        });

        // 4. Modal Closing Listeners (Dedicated to the dish modal)
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideModal);

        // Close on click outside (on the dark background)
        if (dishModal) {
            dishModal.addEventListener('click', (event) => {
                if (event.target === dishModal) {
                    hideModal();
                }
            });
        }
        
        // Re-add ESC key listener to cover the modal specifically
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !dishModal.classList.contains('hidden')){
                hideModal();
            }
        });
    }

    // This is the critical step: call the function to attach the listeners!
    popUp(); 
    // --- END DISH MODAL POP-UP LOGIC ---
});