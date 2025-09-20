"use strict";

// ================================
// GLOBAL VARIABLES
// ================================
const navbar = document.querySelector('.navber');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.list');
const navLinks = document.querySelectorAll('.items a');
const sections = document.querySelectorAll('div[id], section[id]');

// ================================
// NAVBAR FUNCTIONALITY
// ================================

// Sticky Navbar
function handleStickyNavbar() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Active Section Detection with IntersectionObserver
function initActiveSectionObserver() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    navLinks.forEach((link) => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
            // Special case for Home section when at top of page
            if (window.scrollY < 100) {
                navLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#home_id') {
                        link.classList.add('active');
                    }
                });
            }
        },
        {
            root: null,
            rootMargin: '-100px 0px -50% 0px',
            threshold: 0.2,
        }
    );

    sections.forEach((section) => {
        observer.observe(section);
    });
}

// Mobile Navigation
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth',
            });
        }
    });
});


// ================================
// TYPING ANIMATION
// ================================
class TypeWriter {
    constructor(element) {
        this.element = element;
        this.words = ['Developer', 'Designer', 'Freelancer', 'Creator'];
        this.wordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.delayBetweenWords = 2000;

        this.init();
    }

    init() {
        setTimeout(() => this.type(), 1000);
    }

    type() {
        const currentWord = this.words[this.wordIndex];

        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.charIndex - 1);
            this.charIndex--;

            if (this.charIndex === 0) {
                this.isDeleting = false;
                this.wordIndex = (this.wordIndex + 1) % this.words.length;
            }

            setTimeout(() => this.type(), this.deleteSpeed);
        } else {
            this.element.textContent = currentWord.substring(0, this.charIndex + 1);
            this.charIndex++;

            if (this.charIndex === currentWord.length) {
                this.isDeleting = true;
                setTimeout(() => this.type(), this.delayBetweenWords);
            } else {
                setTimeout(() => this.type(), this.typeSpeed);
            }
        }
    }
}

// ================================
// PORTFOLIO FILTER
// ================================
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.btn[data-filter]');
    const portfolioItems = document.querySelectorAll('.card-portfolio');

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach((item) => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Image Modal
    const modal = document.querySelector('.image-modal');
    const modalImg = document.querySelector('.image-modal .modal-content');
    const modalClose = document.querySelector('.image-modal .modal-close');
    const viewLinks = document.querySelectorAll('.portfolio-links .view-link');

    viewLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const imgSrc = link.getAttribute('data-img');
            modalImg.src = imgSrc;
            modal.style.display = 'flex';
            document.body.classList.add('modal-open'); // Disable scroll
        });
    });

    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open'); // Re-enable scroll
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open'); // Re-enable scroll
        }
    });
}

// ================================
// COUNTER ANIMATION
// ================================
function animateCounters() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    });
}

// Intersection Observer for counters
function initCounterObserver() {
    const statsSection = document.querySelector('.statistics');
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !statsAnimated) {
                    animateCounters();
                    statsAnimated = true;
                }
            });
        },
        { threshold: 0.5 }
    );

    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

// ================================
// TESTIMONIALS SLIDER
// ================================
function initTestimonialsSlider() {
    let slideIndex = 1;
    let slideInterval;

    // Show specific slide
    function showSlide(n) {
        const slides = document.querySelectorAll('.TestimonialsSection .TestimonialCard');
        const dots = document.querySelectorAll('.TestimonialsSection .SliderDot');

        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }

        slides.forEach((slide) => {
            slide.classList.remove('active');
        });

        setTimeout(() => {
            slides[slideIndex - 1].classList.add('active');
        }, 50);

        dots.forEach((dot) => dot.classList.remove('active'));
        if (dots[slideIndex - 1]) {
            dots[slideIndex - 1].classList.add('active');
        }
    }

    // Auto-play functionality
    function autoSlide() {
        slideInterval = setInterval(() => {
            slideIndex++;
            showSlide(slideIndex);
        }, 4000);
    }

    // Pause on hover
    function pauseSlider() {
        clearInterval(slideInterval);
    }

    // Resume on mouse leave
    function resumeSlider() {
        autoSlide();
    }

    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
        pauseSlider();
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        resumeSlider();
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                slideIndex++;
            } else {
                slideIndex--;
            }
            showSlide(slideIndex);
        }
    }

    // Initialize slider
    showSlide(slideIndex);
    autoSlide();

    // Event listeners for slider
    const sliderContainer = document.querySelector('.TestimonialsSection .TestimonialsSlider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', pauseSlider);
        sliderContainer.addEventListener('mouseleave', resumeSlider);
        sliderContainer.addEventListener('touchstart', handleTouchStart);
        sliderContainer.addEventListener('touchend', handleTouchEnd);
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            clearInterval(slideInterval);
            slideIndex--;
            showSlide(slideIndex);
            autoSlide();
        } else if (e.key === 'ArrowRight') {
            clearInterval(slideInterval);
            slideIndex++;
            showSlide(slideIndex);
            autoSlide();
        }
    });
}

// ================================
// CONTACT FORM VALIDATION
// ================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const nameField = document.getElementById('form_name');
    const emailField = document.getElementById('form_email');
    const subjectField = document.getElementById('form_subject');
    const messageField = document.getElementById('control-message');

    // Regex patterns
    const patterns = {
        name: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        subject: /^[\w\s.,!?]{3,100}$/,
        message: /^[\s\S]{10,1000}$/,
    };

    // Error messages in English
    const errorMessages = {
        name: 'Name must be 2-50 characters (letters and spaces only)',
        email: 'Please enter a valid email address',
        subject: 'Subject must be 3-100 characters',
        message: 'Message must be 10-1000 characters',
    };

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId.replace('form_', '').replace('control-', '') + '-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
        if (field) {
            field.classList.add('error');
        }
    }

    function hideError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId.replace('form_', '').replace('control-', '') + '-error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        if (field) {
            field.classList.remove('error');
        }
    }

    function validateField(field, pattern, errorMessage) {
        const value = field.value.trim();
        const fieldId = field.id;

        if (!value) {
            showError(fieldId, 'This field is required');
            return false;
        } else if (!pattern.test(value)) {
            showError(fieldId, errorMessage);
            return false;
        } else {
            hideError(fieldId);
            return true;
        }
    }

    // Real-time validation
    nameField.addEventListener('input', () => {
        validateField(nameField, patterns.name, errorMessages.name);
    });

    emailField.addEventListener('input', () => {
        validateField(emailField, patterns.email, errorMessages.email);
    });

    subjectField.addEventListener('input', () => {
        validateField(subjectField, patterns.subject, errorMessages.subject);
    });

    messageField.addEventListener('input', () => {
        validateField(messageField, patterns.message, errorMessages.message);
    });

    // Form submission with Sheet Monkey API
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const isNameValid = validateField(nameField, patterns.name, errorMessages.name);
        const isEmailValid = validateField(emailField, patterns.email, errorMessages.email);
        const isSubjectValid = validateField(subjectField, patterns.subject, errorMessages.subject);
        const isMessageValid = validateField(messageField, patterns.message, errorMessages.message);

        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            // Show loading state
            const btnText = document.querySelector('.btn-text');
            const btnLoader = document.querySelector('.btn-loader');
            const submitBtn = contactForm.querySelector('button[type="submit"]');

            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            submitBtn.disabled = true;

            // Submit to Sheet Monkey API
            const formData = new FormData();
            formData.append('Name', nameField.value);
            formData.append('Email', emailField.value);
            formData.append('Subject', subjectField.value);
            formData.append('Message', messageField.value);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    btnText.style.display = 'inline-block';
                    btnLoader.style.display = 'none';
                    submitBtn.disabled = false;

                    const successMsg = document.getElementById('form-success');
                    const errorMsg = document.getElementById('form-error');
                    successMsg.style.display = 'block';
                    errorMsg.style.display = 'none';

                    contactForm.reset();
                    [nameField, emailField, subjectField, messageField].forEach((field) => hideError(field.id));

                    setTimeout(() => {
                        successMsg.style.display = 'none';
                    }, 5000);

                    console.log('Form submitted successfully to Sheet Monkey:', data);
                })
                .catch((error) => {
                    btnText.style.display = 'inline-block';
                    btnLoader.style.display = 'none';
                    submitBtn.disabled = false;

                    const errorMsg = document.getElementById('form-error');
                    errorMsg.style.display = 'block';
                    setTimeout(() => {
                        errorMsg.style.display = 'none';
                    }, 5000);

                    console.error('Form submission error:', error);
                });
        } else {
            const errorMsg = document.getElementById('form-error');
            errorMsg.style.display = 'block';
            setTimeout(() => {
                errorMsg.style.display = 'none';
            }, 5000);
        }
    });
}

// ================================
// SCROLL ANIMATIONS & INTERSECTION OBSERVER
// ================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos], .about');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('about')) {
                        entry.target.classList.add('animate-in');
                    } else {
                        entry.target.classList.add('aos-animate');
                    }
                }
            });
        },
        {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    animatedElements.forEach((el) => {
        observer.observe(el);
    });
}

// ================================
// INITIALIZATION
// ================================
document.addEventListener('DOMContentLoaded', function () {
    // Initialize typing animation
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        new TypeWriter(typingElement);
    }

    // Initialize all components
    initPortfolioFilter();
    initCounterObserver();
    initTestimonialsSlider();
    initContactForm();
    initScrollAnimations();
    initActiveSectionObserver();
});

// ================================
// EVENT LISTENERS
// ================================
window.addEventListener('scroll', handleStickyNavbar, { passive: true });

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// ================================
// UTILITY FUNCTIONS
// ================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced sticky navbar handler
const debouncedStickyNavbar = debounce(handleStickyNavbar, 10);
window.removeEventListener('scroll', handleStickyNavbar);
window.addEventListener('scroll', debouncedStickyNavbar, { passive: true });







let slideIndex = 1;
let slideInterval;

// Initialize slider
function initSlider() {
    showSlide(slideIndex);
    autoSlide();
}

// Show specific slide
function showSlide(n) {
    const slides = document.querySelectorAll('.TestimonialsSection .TestimonialCard');
    const dots = document.querySelectorAll('.TestimonialsSection .SliderDot');

    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }

    // Remove active class from all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // Add active class to target slide with small delay for smooth transition
    setTimeout(() => {
        slides[slideIndex - 1].classList.add('active');
    }, 50);

    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add('active');
    }
}

// Go to specific slide (from dots)
function currentSlide(n) {
    clearInterval(slideInterval);
    slideIndex = n;
    showSlide(slideIndex);
    autoSlide();
}

// Auto-play functionality
function autoSlide() {
    slideInterval = setInterval(() => {
        slideIndex++;
        showSlide(slideIndex);
    }, 4000); // Change slide every 4 seconds
}

// Pause on hover
function pauseSlider() {
    clearInterval(slideInterval);
}

// Resume on mouse leave
function resumeSlider() {
    autoSlide();
}

// Touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    pauseSlider();
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    resumeSlider();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            slideIndex++;
        } else {
            // Swipe right - previous slide
            slideIndex--;
        }
        showSlide(slideIndex);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', initSlider);

const sliderContainer = document.querySelector('.TestimonialsSection .TestimonialsSlider');
if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', pauseSlider);
    sliderContainer.addEventListener('mouseleave', resumeSlider);
    sliderContainer.addEventListener('touchstart', handleTouchStart);
    sliderContainer.addEventListener('touchend', handleTouchEnd);
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        clearInterval(slideInterval);
        slideIndex--;
        showSlide(slideIndex);
        autoSlide();
    } else if (e.key === 'ArrowRight') {
        clearInterval(slideInterval);
        slideIndex++;
        showSlide(slideIndex);
        autoSlide();
    }
});