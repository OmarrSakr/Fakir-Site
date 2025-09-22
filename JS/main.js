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
        const href = this.getAttribute('href');
        // Check if href is not just "#" and is a valid ID
        if (href && href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth',
                });
            }
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
    const modal = document.querySelector('.image-modal');
    const modalImg = document.querySelector('.image-modal .modal-content');
    const modalClose = document.querySelector('.image-modal .modal-close');
    const viewLinks = document.querySelectorAll('.portfolio-links .view-link');
    const portfolioSection = document.querySelector('#portfolio_id'); // Select portfolio section

    // Filter buttons functionality
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

    // Image Modal functionality
    viewLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const imgSrc = link.getAttribute('data-img');
            modalImg.src = imgSrc;

            // Hide body content during scroll to avoid flash
            document.body.style.opacity = '0';

            // Scroll to the top of portfolio section
            if (portfolioSection) {
                const offsetTop = portfolioSection.offsetTop - 70; // Adjust for navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'auto' // Instant scroll to avoid visible jump
                });
            }

            // Open modal after scroll and restore body opacity
            setTimeout(() => {
                modal.style.display = 'flex';
                document.body.classList.add('modal-open');
                document.documentElement.style.overflow = 'hidden';
                modal.style.zIndex = '9999';
                modalImg.style.zIndex = '10000';
                modalClose.style.zIndex = '10001';
                document.body.style.opacity = '1'; // Restore visibility
            }, 150); 
        });
    });

    // Close modal on close button click
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        document.documentElement.style.overflow = '';
    });

    // Close modal on clicking outside image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
            document.documentElement.style.overflow = '';
        }
    });

    // Close modal on Esc key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
            document.documentElement.style.overflow = '';
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
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
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
    let isSubmitting = false; // لمنع الإرسال المتكرر

    // Regex patterns
    const patterns = {
        name: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        subject: /^[\w\s.,!?]{3,100}$/,
        message: /^[\s\S]{10,1000}$/,
    };

    // Error messages
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
    [nameField, emailField, subjectField, messageField].forEach(field => {
        field.addEventListener('input', () => {
            const fieldName = field.id.replace('form_', '').replace('control-', '');
            validateField(field, patterns[fieldName], errorMessages[fieldName]);
        });
    });

    // Form submission
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (isSubmitting) return; // منع الإرسال المتكرر

        // Validate all fields
        const isNameValid = validateField(nameField, patterns.name, errorMessages.name);
        const isEmailValid = validateField(emailField, patterns.email, errorMessages.email);
        const isSubjectValid = validateField(subjectField, patterns.subject, errorMessages.subject);
        const isMessageValid = validateField(messageField, patterns.message, errorMessages.message);

        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            isSubmitting = true; // بدء الإرسال
            const btnText = document.querySelector('.btn-text');
            const btnLoader = document.querySelector('.btn-loader');
            const submitBtn = document.querySelector('button[type="submit"]');
            const successMsg = document.getElementById('form-success');
            const formError = document.getElementById('form-error');

            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            submitBtn.disabled = true;

            // Store form values before reset
            const formValues = {
                Name: nameField.value,
                Email: emailField.value,
                Subject: subjectField.value,
                Message: messageField.value
            };

            // Retry function
            async function trySubmit(formData, retries = 2, delay = 1000) {
                for (let i = 0; i < retries; i++) {
                    try {
                        const response = await fetch(contactForm.action, {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'Accept': 'application/json',
                            },
                        });

                        let data;
                        // Try to parse JSON, but handle non-JSON responses
                        try {
                            data = await response.json();
                        } catch (jsonError) {
                            // If response is not JSON but status is OK, assume success
                            if (response.ok) {
                                data = { success: true }; // Assume success
                            } else {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                        }

                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        btnText.style.display = 'inline-block';
                        btnLoader.style.display = 'none';
                        submitBtn.disabled = false;
                        isSubmitting = false;

                        successMsg.style.display = 'flex';
                        formError.style.display = 'none';
                        contactForm.reset();
                        [nameField, emailField, subjectField, messageField].forEach(field => hideError(field.id));

                        // console.log('Form submitted successfully:', {
                        //     ...formValues,
                        //     Response: data
                        // });

                        setTimeout(() => {
                            successMsg.style.display = 'none';
                        }, 4000);

                        return true; // Success
                    } catch (error) {
                        if (i < retries - 1) {
                            await new Promise(resolve => setTimeout(resolve, delay));
                            continue; // Retry after delay
                        }
                        throw error; // Throw error if retries are exhausted
                    }
                }
            }

            // Submit to Sheet Monkey API
            const formData = new FormData(contactForm);
            try {
                await trySubmit(formData);
            } catch (error) {
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;
                isSubmitting = false;

                formError.style.display = 'flex';
                formError.querySelector('p').textContent =
                    error.message.includes('Failed to fetch')
                        ? 'No internet connection. Please check your network and try again.'
                        : error.message.includes('500')
                            ? 'Server error. Please try again or contact support.'
                            : 'Sorry, there was an error sending your message. Please try again.';

                setTimeout(() => {
                    formError.style.display = 'none';
                }, 4000);

                console.error('Form submission error:', error);
            }
        } else {
            formError.style.display = 'flex';
            formError.querySelector('p').textContent = 'Please fix the errors in the form and try again.';
            setTimeout(() => {
                formError.style.display = 'none';
            }, 4000);
        }
    });
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', initContactForm);

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