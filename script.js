// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if(menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
                // Only unobserve if it's not a recurring animation like the divider
                if (!entry.target.classList.contains('modern-divider')) { 
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
        observer.observe(element);
        
        // Add delay if specified
        const delay = element.getAttribute('data-delay');
        if(delay) {
            element.style.transitionDelay = `${delay}ms`;
        }
    });
    
    // Observe modern dividers separately if they don't already have .animate-on-scroll
    // Note: The CSS currently targets .animate-on-scroll.modern-divider, 
    // so this might be redundant if dividers always have both classes.
    // If dividers are *only* class .modern-divider, this ensures they animate.
    const dividers = document.querySelectorAll('.modern-divider:not(.animate-on-scroll)');
    dividers.forEach(divider => {
        observer.observe(divider);
    });
    
    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if(window.pageYOffset > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const consentCheckbox = document.getElementById('consent');
            let formIsValid = true;
            let firstErrorField = null;

            // Clear previous messages
            contactForm.querySelectorAll('.form-message').forEach(msg => msg.remove());

            // Simple validation
            if(!nameInput.value.trim()) {
                showFormMessage(nameInput, 'Full Name is required.', 'error');
                formIsValid = false;
                if (!firstErrorField) firstErrorField = nameInput;
            }
            if(!emailInput.value.trim() || !/\S+@\S+\.\S+/.test(emailInput.value)) {
                showFormMessage(emailInput, 'Please enter a valid email address.', 'error');
                formIsValid = false;
                if (!firstErrorField) firstErrorField = emailInput;
            }
            if(!messageInput.value.trim()) {
                showFormMessage(messageInput, 'Message cannot be empty.', 'error');
                formIsValid = false;
                if (!firstErrorField) firstErrorField = messageInput;
            }
            if(consentCheckbox && !consentCheckbox.checked) {
                showFormMessage(consentCheckbox, 'You must consent to processing your data.', 'error');
                formIsValid = false;
                 if (!firstErrorField) firstErrorField = consentCheckbox; // Focus handling might need adjustment for checkboxes
            }
            
            if(!formIsValid) {
                if (firstErrorField) firstErrorField.focus();
                return;
            }
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Simulate API call
            setTimeout(function() {
                // Reset form
                contactForm.reset();
                
                // Show success message (using the helper function)
                showFormMessage(submitBtn, 'Thank you! Your message has been sent successfully.', 'success', true);
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }, 1500);
        });
    }
    
    // Newsletter subscription
    const newsletterForm = document.getElementById('newsletterForm');
    if(newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const consentCheckbox = newsletterForm.querySelector('#newsletter-consent');
            let formIsValid = true;
            let firstErrorField = null;

            // Clear previous messages
            newsletterForm.querySelectorAll('.form-message').forEach(msg => msg.remove());

            if(!emailInput.value.trim() || !/\S+@\S+\.\S+/.test(emailInput.value)) {
                showFormMessage(emailInput, 'Please enter a valid email address.', 'error');
                formIsValid = false;
                if (!firstErrorField) firstErrorField = emailInput;
            }
            if(consentCheckbox && !consentCheckbox.checked) { // Check if consent exists
                showFormMessage(consentCheckbox, 'You must agree to receive emails.', 'error');
                 formIsValid = false;
                 if (!firstErrorField) firstErrorField = consentCheckbox;
            }

            if(!formIsValid) {
                if (firstErrorField) firstErrorField.focus();
                return;
            }
            
            // Simulate subscription
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing...';
            
            setTimeout(function() {
                newsletterForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Subscribe';
                
                // Show success message
                showFormMessage(submitBtn, 'Thank you for subscribing!', 'success', true);
            }, 1000);
        });
    }
    
    // Helper function for showing form messages
    function showFormMessage(element, message, type = 'error', insertAfter = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-${type}-message`;
        messageElement.textContent = message;

        // Insert after the element or its parent group
        const targetElement = element.closest('.form-group') || element;
        if (insertAfter && targetElement.parentNode) {
            targetElement.parentNode.insertBefore(messageElement, targetElement.nextSibling);
        } else {
            // Default: Insert inside the form, maybe near the button?
            // For simplicity, let's insert it before the element or its group's end
             targetElement.parentNode.insertBefore(messageElement, targetElement);
             // Or append to the form itself if element is the submit button
             // if (element.type === 'submit') element.form.appendChild(messageElement);
        }
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
    
    // Initialize any sliders/carousels if needed
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if(testimonialSlider) {
        // Simple manual slider implementation
        const slides = testimonialSlider.querySelectorAll('.slide');
        const nextBtn = testimonialSlider.querySelector('.next');
        const prevBtn = testimonialSlider.querySelector('.prev');
        let currentSlide = 0;
        
        function showSlide(index) {
            slides.forEach(slide => slide.style.display = 'none');
            slides[index].style.display = 'block';
        }
        
        if(nextBtn && prevBtn && slides.length > 0) {
            showSlide(currentSlide);
            
            nextBtn.addEventListener('click', function() {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            });
            
            prevBtn.addEventListener('click', function() {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
            });
        }
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const currentlyActive = document.querySelector('.faq-item.active');
                // Optional: Close other open FAQs
                if (currentlyActive && currentlyActive !== item) {
                    currentlyActive.classList.remove('active');
                }
                // Toggle the clicked item
                item.classList.toggle('active');
            });
        }
    });
});