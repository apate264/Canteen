/**
 * Crusher's Canteen - Common Navigation JavaScript
 * This file handles the highlighting of the active navigation link based on the current page
 */
// Set up the navigation when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupMobileMenu();
});
/**
 * Sets up the navigation by adding the 'active' class to the appropriate nav link
 * based on the current page URL
 */
function setupNavigation() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Get the current page URL (pathname)
    const currentPage = window.location.pathname;
    
    // Loop through all navigation links
    navLinks.forEach(link => {
        // Get the href attribute of the link
        const linkHref = link.getAttribute('href');
        
        // Check if the current URL contains the link's href
        // This handles both exact matches and path-based matches
        if (currentPage.includes(linkHref)) {
            // Add the 'active' class to the matching link
            link.classList.add('active');
        } else {
            // Remove 'active' class from non-matching links (in case it was set)
            link.classList.remove('active');
        }
    });
    
    // Special case: If we're on the home page or root and no link is active yet
    if (currentPage === '/' && !document.querySelector('.nav-links a.active')) {
        // Find the home link and make it active
        const homeLink = document.querySelector('.nav-links a[href="canteen.html"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }
}
/**
 * Sets up the mobile menu toggle functionality
 */
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // Add click event listener to the mobile menu button
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            // Toggle the 'active' class on the navigation links
            navLinks.classList.toggle('active');
        });
    }
    
    // Close menu when a link is clicked
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Close menu when clicking outside navigation
    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 768 && 
            !event.target.closest('.navbar') && 
            navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
}