document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Form submission handling
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle form submission logic here
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    const reserveForm = document.querySelector('#reserve-form');
    if (reserveForm) {
        reserveForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle reservation logic here
            alert('Your reservation has been submitted!');
            reserveForm.reset();
        });
    }

    // Animation on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const options = {
        root: null,
        threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    const bookingRefInput = document.getElementById('booking-ref');
    if (bookingRefInput) {
        // Generate a random booking reference when the form loads
        const generateBookingRef = () => {
            const prefix = 'OIKOS';
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            return `${prefix}-${timestamp}-${random}`;
        };
        
        // Set the generated reference
        bookingRefInput.value = generateBookingRef();
        bookingRefInput.setAttribute('readonly', true);
    }
});