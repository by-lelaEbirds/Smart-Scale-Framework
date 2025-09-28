document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const simularBtn = document.getElementById('simular-btn');
    const logContainer = document.getElementById('log-container');
    const dynamicIsland = document.getElementById('dynamic-island');
    const islandLayouts = {
        compact: document.getElementById('island-compact'),
        expanded: document.getElementById('island-expanded'),
    };
    const tabButtons = document.querySelectorAll('.tab-button');
    const offersBadge = document.getElementById('offers-badge');
    const offersList = document.getElementById('offers-list');
    const kpis = {
        ticket: document.getElementById('kpi-ticket'),
        crossSells: document.getElementById('kpi-cross-sells'),
    };

    // --- ESTADO INICIAL DA SIMULAÇÃO (para o Reset) ---
    const initialState = {
        sells: 132,
        ticket: 87.50,
        demandHistory: [18, 22, 19, 25, 28, 24],
        sentiment: [65, 25, 10] // Positivo, Neutro, Negativo
    };
    let currentState = JSON.parse(JSON.stringify(initialState));
    
    let simulationRunning = false;
    let demandChart, sentimentChart;

    // --- SETUP DOS GRÁFICOS (CHART.JS) ---
    function setupCharts() {
        Chart.defaults.color = 'rgba(245, 245, 247, 0.7)';
        Chart.defaults.borderColor = 'rgba(142, 142, 147, 0.2)';
        
        const demandCtx = document.getElementById('demand-forecast-chart').getContext('2d');
        demandChart = new Chart(demandCtx, {
            type: 'line',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
                datasets: [{
                    label: 'Vendas Históricas', data: currentState.demandHistory, borderColor: 'rgba(142, 142, 147, 0.8)', tension: 0.4, borderWidth: 2,
                }, {
                    label: 'Previsão IA', data: [], borderColor: 'rgba(0, 122, 255, 1)', borderDash: [5, 5], tension: 0.4, borderWidth: 2, pointBackgroundColor: 'rgba(0, 122, 255, 1)',
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } }
        });

        const sentimentCtx = document.getElementById('sentiment-analysis-chart').getContext('2d');
        sentimentChart = new Chart(sentimentCtx, {
            type: 'doughnut',
            data: {
                labels: ['Positivo', 'Neutro', 'Negativo'],
                datasets: [{ data: currentState.sentiment, backgroundColor: ['rgba(52, 199, 89, 0.8)', 'rgba(142, 142, 147, 0.8)', 'rgba(255, 59, 48, 0.8)'], borderColor: 'rgba(35, 35, 38, 0.7)', borderWidth: 4, }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } } }
        });
    }

    // --- CONTROLE DA ILHA DINÂMICA (ROBUSTO) ---
    let islandAnimation;
    function islandController(action, { layout = 'compact', content = {}, isExpanded = false, duration = 3000 } = {}) {
        if (islandAnimation) islandAnimation.pause();
        const timeline = anime.timeline({ easing: 'spring(1, 80, 10, 0)' });
        
        if (action === 'show') {
            const targetLayout = islandLayouts[layout];
            Object.values(islandLayouts).forEach(l => l.classList.remove('active'));
            targetLayout.classList.add('active');
            
            if (layout === 'compact') {
                targetLayout.querySelector('.material-symbols-outlined').textContent = content.icon;
                targetLayout.querySelector('p').textContent = content.text;
            } else if (layout === 'expanded') {
                targetLayout.querySelector('.icon-wrapper .material-symbols-outlined').textContent = content.icon;
                targetLayout.querySelector('.text-wrapper .title').textContent = content.title;
                targetLayout.querySelector('.text-wrapper .subtitle').textContent = content.subtitle;
            }

            timeline.add({ targets: dynamicIsland, width: isExpanded ? 320 : 180, height: isExpanded ? 80 : 36 })
                    .add({ targets: targetLayout, opacity: 1 }, '-=400');
            if (duration > 0) setTimeout(() => islandController('hide'), duration);

        } else if (action === 'hide') {
            timeline.add({ targets: '.island-layout', opacity: 0, duration: 150 })
                    .add({ targets: dynamicIsland, width: 125, height: 36 });
        }
        islandAnimation = timeline;
    }
    
    // --- LÓGICA DA SIMULAÇÃO E RESET ---
    function executarSimulacao() {
        simulationRunning = true;
        simularBtn.textContent = "Resetar Simulação";
        simularBtn.style.background = "var(--orange-glow)";
        addToLog("Iniciando simulação...");
        
        setTimeout(() => {
            addToLog("Geofence: Cliente no corredor de massas.");
            islandController('show', { layout: 'compact', content: { icon: 'pin_drop', text: 'Corredor de Massas' } });
        }, 1500);

        setTimeout(() => {
            addToLog("IA: Lead de cross-sell (Queijo) gerado.");
            const forecastData = [...currentState.demandHistory, 29];
            demandChart.data.datasets[1].data = forecastData; demandChart.update();
        }, 3500);

        setTimeout(() => {
            addToLog("Oferta enviada via push.");
            offersBadge.classList.remove('hidden');
            islandController('show', { layout: 'expanded', isExpanded: true, content: { icon: 'sell', title: 'Cesta Certa', subtitle: 'Você tem uma nova oferta!' }, duration: 4000 });
            offersList.innerHTML = `<div class="card-highlight"><div class="card-text"><span class="card-category">OFERTA ESPECIAL</span><h3>Queijo Parmesão Faixa Azul</h3></div><button id="accept-offer-btn" class="main-action-btn">Adicionar por + R$ 12,50</button></div>`;
            document.getElementById('accept-offer-btn').addEventListener('click', aceitarOferta);
        }, 5500);
    }
    
    function aceitarOferta() {
        addToLog("OFERTA ACEITA! Cliente converteu.");
        islandController('show', { layout: 'compact', content: { icon: 'check_circle', text: 'Adicionado' } });
        currentState.sells++;
        currentState.ticket += (12.50 / currentState.sells);
        animateKpi(kpis.crossSells, currentState.sells);
        animateKpi(kpis.ticket, currentState.ticket, true);
        
        sentimentChart.data.datasets[0].data[0] += 5;
        sentimentChart.data.datasets[0].data[2] = Math.max(0, sentimentChart.data.datasets[0].data[2] - 2);
        sentimentChart.update();
        
        this.textContent = "Adicionado!"; this.disabled = true;
    }
    
    function resetarSimulacao() {
        addToLog("--- Simulação Resetada ---");
        simulationRunning = false;
        simularBtn.textContent = "▶ Iniciar Simulação";
        simularBtn.style.background = "var(--blue-glow)";
        currentState = JSON.parse(JSON.stringify(initialState));
        kpis.crossSells.textContent = currentState.sells;
        kpis.ticket.textContent = `R$ ${currentState.ticket.toFixed(2).replace('.', ',')}`;
        demandChart.data.datasets[0].data = currentState.demandHistory; demandChart.data.datasets[1].data = []; demandChart.update();
        sentimentChart.data.datasets[0].data = currentState.sentiment; sentimentChart.update();
        offersBadge.classList.add('hidden');
        offersList.innerHTML = `<p class="empty-state">Suas ofertas personalizadas aparecerão aqui.</p>`;
        document.querySelector('.tab-button[data-screen="home"]').click();
        islandController('hide');
    }

    // --- INICIALIZAÇÃO E EVENTOS ---
    function animateKpi(element, endValue, isCurrency = false) { const startValue = parseFloat(element.textContent.replace('R$ ', '').replace(',', '.')) || 0; anime({ targets: { value: startValue }, value: endValue, round: isCurrency ? 100 : 1, easing: 'easeOutExpo', duration: 1000, update: function() { let displayValue = isCurrency ? `R$ ${(Math.round(this.targets[0].value) / 100).toFixed(2).replace('.', ',')}` : Math.round(this.targets[0].value); element.textContent = displayValue; } }); }
    function addToLog(message) { const entry = document.createElement('div'); entry.className = 'log-entry'; entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`; logContainer.appendChild(entry); entry.classList.add('animate-in'); logContainer.scrollTop = logContainer.scrollHeight; }

    simularBtn.addEventListener('click', () => { simulationRunning ? resetarSimulacao() : executarSimulacao(); });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active')); button.classList.add('active');
            document.querySelectorAll('.app-page').forEach(page => page.classList.remove('active'));
            document.getElementById(`screen-${button.dataset.screen}`).classList.add('active');
            if (button.dataset.screen === 'offers') offersBadge.classList.add('hidden');
        });
    });

    anime.timeline({ easing: 'easeOutExpo' })
        .add({ targets: ['#phone-column', '#dashboard-column', '#footer'], translateY: [20, 0], opacity: [0, 1], duration: 800, delay: anime.stagger(200, {start: 200}) });
    
    setupCharts();
});
