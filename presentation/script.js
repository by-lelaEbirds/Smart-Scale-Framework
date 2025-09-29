document.addEventListener('DOMContentLoaded', () => {

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.05
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

});
