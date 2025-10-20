const headerContainer = document.querySelector('.header-container');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        headerContainer.classList.add('scrolled');
    } else {
        headerContainer.classList.remove('scrolled');
    }
});
//for the thursday special carousel
document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('.container.wrapper');
    const containerCaro = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.slide');
    const nextCaro = document.querySelector('.btn.next-caro');
    const previousCaro = document.querySelector('.btn.previous-caro');
    const indicators = document.querySelectorAll('.indicator');

    let currentSlide = 0;
    const totalSlides = slides.length;

    //func to update my caro index
    function updateCaro() {
        containerCaro.style.transform = `translateX(-${currentSlide * 100}%)`;

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    //working on the buttons
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
    //for the swipe mobile
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
    //for the background
   /* mainContainer.parentElement.style.backgroundColor = 'hsl(42, 55%, 95%)';
    mainContainer.parentElement.style.border = '5px solid transparent';
    mainContainer.parentElement.style.borderImage = 'linear-gradient(in lch, rgba(0,0,0,.3), rgba(0,0,0,.3)) 1 fill';
    mainContainer.parentElement.style.maxHeight = '100vh';
    mainContainer.parentElement.style.display = 'flex';
    mainContainer.parentElement.style.justifyContent = 'center';
    mainContainer.parentElement.style.alignContent = 'center'; */
    updateCaro();
});

//working on the hamburger functionality
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

    //just the overlay does the work ....urrm thats a lie
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


    


