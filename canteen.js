document.addEventListener('DOMContentLoaded', () => {
    // Image carousel setup
    const images = [
        {
            url: 'https://racpquarterly.racp.edu.au/image/9950162.1670386641000/gettyimages-1138234731-170667a.jpg.webp',
            alt: 'Fresh and healthy canteen food'
        },
        {
            url: 'https://www.moretonbay.qld.gov.au/files/content/msec/v/47/events/casual-badminton-sessions/badminton.jpg?w=1200',
            alt: 'Local sports club activities'
        },
        {
            url: 'https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/06/grain-bowl-1296x728-header.jpg?w=1155&h=1528',
            alt: 'Healthy meal options'
        },
        {
            url: 'https://sportsfacilities.com/wp-content/uploads/2021/09/Screen-Shot-2021-09-01-at-11.06.58-AM-1024x489.jpg',
            alt: 'Sports facilities'
        }
    ];

let currentSlide = 0;
const carouselContainer = document.querySelector('.carousel-container');
const indicatorsContainer = document.querySelector('.carousel-indicators');

// Create slides and indicators
images.forEach((image, index) => {
    // Create slide
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    const img = document.createElement('img');
    img.src = image.url;
    img.alt = image.alt;
    img.loading = 'lazy';
    slide.appendChild(img);
    carouselContainer.appendChild(slide);

    // Create indicator
    const indicator = document.createElement('div');
    indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
    indicator.addEventListener('click', () => goToSlide(index));
    indicatorsContainer.appendChild(indicator);
});

    // Navigation functions
    function updateSlidePosition() {
        carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateIndicators();
    }

    function updateIndicators() {
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlidePosition();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % images.length;
        updateSlidePosition();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + images.length) % images.length;
        updateSlidePosition();
    }

// Event listeners for controls
document.querySelector('.carousel-btn.next').addEventListener('click', nextSlide);
document.querySelector('.carousel-btn.prev').addEventListener('click', prevSlide);

// Auto-advance carousel
setInterval(nextSlide, 5000);

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

// Preload images
images.forEach(image => {
    const img = new Image();
    img.src = image.url;
});
});
