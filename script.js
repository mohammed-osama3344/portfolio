/* script.js - Portfolio Interaction Logic */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Theme Management ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    // --- 2. Scroll Progress Bar ---
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        scrollProgress.style.width = scrolled + '%';
    });

    // --- 3. Responsive Mobile Menu ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-item a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside of nav container
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // --- 4. Active Navigation Observer ---
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section occupies the center of viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- 5. Interactive Hero Widget Optimization Calculator ---
    const sliderWorkforce = document.getElementById('slider-workforce');
    const sliderProcess = document.getElementById('slider-process');
    const workforceVal = document.getElementById('workforce-val');
    const processVal = document.getElementById('process-val');
    const metricValue = document.getElementById('metric-value');
    
    const barQ1 = document.getElementById('bar-q1');
    const barQ2 = document.getElementById('bar-q2');
    const barQ3 = document.getElementById('bar-q3');
    const barQ4 = document.getElementById('bar-q4');

    function calculateProductivity() {
        const u = parseInt(sliderWorkforce.value);
        const a = parseInt(sliderProcess.value);
        
        workforceVal.textContent = u + '%';
        processVal.textContent = a + '%';
        
        // Custom operational model: efficiency drops if workforce is over-utilized (burnout)
        // or under-utilized (idle time). Optimal workforce utilization is around 85%.
        const utilizationFactor = 100 - Math.abs(u - 85) * 0.8;
        
        // Automation adds direct improvement to throughput
        const automationFactor = a * 0.25;
        
        // Combine metrics and clamp to max 99.8%
        let efficiency = (utilizationFactor * 0.75) + automationFactor;
        if (efficiency > 99.8) efficiency = 99.8;
        
        const roundedEff = efficiency.toFixed(1);
        metricValue.textContent = roundedEff + '%';
        
        // Update Chart Bars
        barQ1.style.height = `${Math.min(95, Math.max(20, u - 20))}%`;
        barQ2.style.height = `${Math.min(95, Math.max(20, a + 15))}%`;
        barQ3.style.height = `${Math.min(95, Math.max(20, (u + a) / 2))}%`;
        barQ4.style.height = `${roundedEff}%`;
        barQ4.setAttribute('data-label', `Proj: ${roundedEff}%`);
    }

    if (sliderWorkforce && sliderProcess) {
        sliderWorkforce.addEventListener('input', calculateProductivity);
        sliderProcess.addEventListener('input', calculateProductivity);
        // Run initial calculation
        calculateProductivity();
    }

    // --- 6. Skill Progress Bars Animation ---
    const skillsSection = document.getElementById('skills');
    const skillFills = document.querySelectorAll('.skill-progress-fill');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillFills.forEach(fill => {
                    const width = fill.getAttribute('data-width');
                    fill.style.width = width;
                });
                // Unobserve once animation is triggered
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }

    // --- 7. Reveal Sections on Scroll (Fade-In Effect) ---
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });

    // --- 8. Contact Form Handling & Validation ---
    const contactForm = document.getElementById('contact-form');
    const toastMessage = document.getElementById('toast-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const subjectInput = document.getElementById('form-subject');
            const messageInput = document.getElementById('form-message');
            
            let isValid = true;
            
            // Basic custom validation styling
            [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#ef4444'; // Red error border
                    isValid = false;
                } else {
                    input.style.borderColor = ''; // Reset border
                }
            });
            
            // Simple Email regex verification
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() && !emailRegex.test(emailInput.value.trim())) {
                emailInput.style.borderColor = '#ef4444';
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Form is valid - mock sending state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const origBtnHTML = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            
            setTimeout(() => {
                // Success feedback
                showToast();
                
                // Reset form fields
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = origBtnHTML;
                
                // Clear any leftover red borders
                [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                    input.style.borderColor = '';
                });
            }, 1200);
        });
    }

    function showToast() {
        toastMessage.classList.add('show');
        setTimeout(() => {
            toastMessage.classList.remove('show');
        }, 3500);
    }
});
