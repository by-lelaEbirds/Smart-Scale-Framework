document.addEventListener('DOMContentLoaded', () => {

    // Seleciona todos os elementos que devem ser animados
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // Cria o observador de interseção
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Se o elemento estiver 5% visível na tela
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.05 // A animação começa quando 5% do elemento está visível
    });

    // Pede ao observador para "observar" cada um dos elementos animados
    animatedElements.forEach(element => {
        observer.observe(element);
    });

});
