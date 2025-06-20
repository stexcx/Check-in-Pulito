// ===== NAVIGATION FUNCTIONALITY =====

class NavigationManager {
    constructor() {
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.contentSections = document.querySelectorAll('.content-section');
        
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupNavigation();
        this.setupActiveStates();
        this.setupKeyboardNavigation();
        this.setupResponsiveHandling();
    }
    
    // Mobile Menu Toggle
    setupMobileMenu() {
        if (this.mobileMenu) {
            this.mobileMenu.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.mobileMenu.classList.toggle('active');
        
        // Update ARIA attributes for accessibility
        const isExpanded = this.navMenu.classList.contains('active');
        this.mobileMenu.setAttribute('aria-expanded', isExpanded);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? 'hidden' : '';
        
        // Announce to screen readers
        this.announceMenuState(isExpanded);
    }
    
    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        this.mobileMenu.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
    
    announceMenuState(isOpen) {
        const announcement = isOpen ? 'Menu aperto' : 'Menu chiuso';
        const ariaLive = document.createElement('div');
        ariaLive.setAttribute('aria-live', 'polite');
        ariaLive.setAttribute('aria-atomic', 'true');
        ariaLive.className = 'sr-only';
        ariaLive.textContent = announcement;
        document.body.appendChild(ariaLive);
        
        setTimeout(() => document.body.removeChild(ariaLive), 1000);
    }
    
    // Navigation between sections
    setupNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                this.navigateToSection(targetId);
                
                // Close mobile menu after navigation
                if (window.innerWidth <= 767) {
                    this.closeMobileMenu();
                }
            });
        });
    }
    
    navigateToSection(sectionId) {
        // Hide all sections with fade effect
        this.contentSections.forEach(section => {
            section.style.opacity = '0';
            setTimeout(() => {
                section.classList.remove('active');
            }, 150);
        });
        
        // Show target section with fade effect
        setTimeout(() => {
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                setTimeout(() => {
                    targetSection.style.opacity = '1';
                }, 50);
                
                // Update browser history
                this.updateHistory(sectionId);
                
                // Update active nav link
                this.updateActiveNavLink(sectionId);
                
                // Focus management for accessibility
                this.manageFocus(targetSection);
            }
        }, 200);
    }
    
    updateHistory(sectionId) {
        const newPath = sectionId === 'dashboard' ? '/' : `/#${sectionId}`;
        if (window.location.pathname + window.location.hash !== newPath) {
            history.pushState({section: sectionId}, '', newPath);
        }
    }
    
    updateActiveNavLink(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    manageFocus(targetSection) {
        // Set focus to the main heading of the section for screen readers
        const heading = targetSection.querySelector('h1');
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus();
            
            // Remove tabindex after focus to not interfere with natural tab order
            setTimeout(() => {
                heading.removeAttribute('tabindex');
            }, 100);
        }
    }
    
    // Setup active states and URL handling
    setupActiveStates() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const sectionId = e.state?.section || this.getSectionFromURL();
            this.navigateToSection(sectionId);
        });
        
        // Handle initial page load
        window.addEventListener('DOMContentLoaded', () => {
            const initialSection = this.getSectionFromURL();
            this.navigateToSection(initialSection);
        });
    }
    
    getSectionFromURL() {
        const hash = window.location.hash.substring(1);
        return hash || 'dashboard';
    }
    
    // Keyboard navigation support
    setupKeyboardNavigation() {
        this.navLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                let targetIndex;
                
                switch(e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        targetIndex = (index + 1) % this.navLinks.length;
                        this.navLinks[targetIndex].focus();
                        break;
                        
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        targetIndex = index === 0 ? this.navLinks.length - 1 : index - 1;
                        this.navLinks[targetIndex].focus();
                        break;
                        
                    case 'Home':
                        e.preventDefault();
                        this.navLinks[0].focus();
                        break;
                        
                    case 'End':
                        e.preventDefault();
                        this.navLinks[this.navLinks.length - 1].focus();
                        break;
                }
            });
        });
    }
    
    // Responsive handling
    setupResponsiveHandling() {
        let resizeTimer;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Close mobile menu if window is resized to desktop
                if (window.innerWidth > 767 && this.navMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
                
                // Reset body overflow on resize
                if (window.innerWidth > 767) {
                    document.body.style.overflow = '';
                }
            }, 250);
        });
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (window.innerWidth > 767 && this.navMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            }, 100);
        });
    }
    
    // Public methods for external use
    openSection(sectionId) {
        this.navigateToSection(sectionId);
    }
    
    getCurrentSection() {
        return document.querySelector('.content-section.active')?.id || 'dashboard';
    }
    
    isMenuOpen() {
        return this.navMenu.classList.contains('active');
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationManager;
}
