document.addEventListener('DOMContentLoaded', () => {
    const typingEl = document.getElementById('typing');
    const text = [
        "Welcome, Quamina Elvin Here",
        "I'm A Web Developer",
        "Design | Code | Innovate",
        "Let's Build Somethig Amazing",
        "Let's Build Your Next Project."
    ]
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 50;
    let eraseSpeed = 25;
    let pauseTime = 1500;

    function typerWritter () {
        const currentText = text[textIndex];

        if(!isDeleting) {
            typingEl.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;

            if(charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(typerWritter, pauseTime);
                return;
            }
        }else {
            typingEl.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;

            if(charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % text.length;
            }
        }

        const speed = isDeleting ? eraseSpeed : typingSpeed;
        setTimeout(typerWritter, speed);
    }
    setTimeout(typerWritter, 700);

    //for the hamburger
    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('#nav .info .navList');
    const overlay = document.getElementById('overlay');

    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        hamburger.classList.toggle('active');

        if(nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden'
        }else {
            document.body.style.overflow = "";
        }
    });
    //start clearing
    overlay.addEventListener('click', () => {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    //for links clearing
    const navLinks = document.querySelectorAll('#nav .info .navList a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        })
    })
    //for the esc
    document.addEventListener('keydown', (event) => {
        if(event.key === 'Escape' && nav.classList.contains('active')) {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = "";
        }
    })
})

// Theme toggle functionality
const themeToggle = document.querySelector('.theme');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        obs.unobserve(entry.target); // 🔥 KEY LINE
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.card').forEach(el => {
  observer.observe(el);
});
