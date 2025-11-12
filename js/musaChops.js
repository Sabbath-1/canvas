const headerContainer = document.querySelector('.header-container');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        headerContainer.classList.add('scrolled');
    } else {
        headerContainer.classList.remove('scrolled');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('.container.wrapper');
    const containerCaro = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.slide');
    const nextCaro = document.querySelector('.btn.next-caro');
    const previousCaro = document.querySelector('.btn.previous-caro');
    const indicators = document.querySelectorAll('.indicator');

    let currentSlide = 0;
    const totalSlides = slides.length;

    function updateCaro() {
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
        currentSlide = (currentSlide -1 + totalSlides) % totalSlides;
        updateCaro();
        }

    nextCaro.addEventListener('click', nextSlide);
    previousCaro.addEventListener('click', previousSlide);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateCaro();
            })
        })

    let autopaly = setInterval(nextSlide, 3000);
    containerCaro.parentElement.addEventListener('mouseenter', () => {
        clearInterval(autopaly);
    })
    containerCaro.parentElement.addEventListener('mouseleave', () => {
       autopaly = setInterval(nextSlide, 3000);
    });
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
    updateCaro();
});

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('#hamburger');
    const nav = document.querySelector('nav > ul');
    const overlay = document.querySelector('#overlay');
    
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        hamburger.classList.toggle('active');

        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden' ;
        } else {
            document.body.style.overflow = '';
        }
    });

    overlay.addEventListener('click', () => {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });


    document.addEventListener('click', (event) => {
        const clickAnywhere = nav.contains(event.target);
        const againClickAnywhere = hamburger.contains(event.target);

        if (nav.classList.contains('active') && !clickAnywhere && !againClickAnywhere) {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    })

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && nav.classList.contains('active')){
            nav.classList.remove('active');
            overlay.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        };
    })

    const menuLink = document.querySelectorAll('nav > ul > li > a');
    menuLink.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        })
    })
});


function createPopup() {
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';
    popupOverlay.id = 'popup-overlay';
    
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'popup-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close popup');
    
    const popupTitle = document.createElement('h2');
    popupTitle.className = 'popup-title';
    
    const popupBody = document.createElement('div');
    popupBody.className = 'popup-body';
    
    popupContent.appendChild(closeBtn);
    popupContent.appendChild(popupTitle);
    popupContent.appendChild(popupBody);
    popupOverlay.appendChild(popupContent);
    
    document.body.appendChild(popupOverlay);
    
    closeBtn.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });
    
    return { popupOverlay, popupTitle, popupBody };
}

function showPopup(title, content) {
    if (!window.popupElements) {
        window.popupElements = createPopup();
    }
    
    const { popupOverlay, popupTitle, popupBody } = window.popupElements;
    
    popupTitle.textContent = title;
    popupBody.innerHTML = content;
    popupOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePopup() {
    if (window.popupElements) {
        const { popupOverlay } = window.popupElements;
        popupOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function popUp() {
    const headerLinks = document.querySelectorAll('.dish-container .dish-info h3');
    
    headerLinks.forEach(link => {
        link.style.cursor = 'pointer';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const title = link.textContent;
            
            const content = `
                <p>This is the <strong>${title}</strong> and is bad delicious💯🎉.</p>
                <p> Caution: This is too good.</p>
                <div style="margin-top: 1rem;">
                    <button class="popup-action-btn" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Chow Is Coming!
                    </button>
                </div>
            `;
            
            showPopup(title, content);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    popUp();
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && window.popupElements && window.popupElements.popupOverlay.classList.contains('active')) {
            closePopup();
        }
    });
});