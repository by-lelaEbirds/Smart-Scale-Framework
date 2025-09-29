document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const simularBtn = document.getElementById('simular-btn');
    const logContainer = document.getElementById('log-container');
    const dynamicIsland = document.getElementById('dynamic-island');
    const islandLayouts = { compact: document.getElementById('island-compact'), expanded: document.getElementById('island-expanded') };
    const tabButtons = document.querySelectorAll('.tab-button');
    const offersBadge = document.getElementById('offers-badge');
    const offersList = document.getElementById('offers-list');
    const kpis = { ticket: document.getElementById('kpi-ticket'), crossSells: document.getElementById('kpi-cross-sells') };

    // --- ESTADO INICIAL E VARIÁVEIS ---
    const initialState = { sells: 132, ticket: 87.50, demandHistory: [18, 22, 19, 25, 28, 24, null, null], sentiment: [65, 25, 10] };
    let currentState = JSON.parse(JSON.stringify(initialState));
    let simulationRunning = false;
    let demandChart, sentimentChart;

    // --- SETUP DOS GRÁFICOS (CHART.JS) ---
    function setupCharts() {
        if (demandChart) demandChart.destroy();
        if (sentimentChart) sentimentChart.destroy();
        Chart.defaults.color = 'rgba(110, 110, 115, 0.7)';
        Chart.defaults.borderColor = 'rgba(224, 224, 224, 0.5)';
        const demandCtx = document.getElementById('demand-forecast-chart').getContext('2d');
        demandChart = new Chart(demandCtx, { type: 'line', data: { labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom (IA)', 'Seg (IA)'], datasets: [ { label: 'Vendas Históricas', data: currentState.demandHistory, borderColor: 'rgba(172, 172, 174, 1)', tension: 0.4, borderWidth: 2 }, { label: 'Previsão IA', data: simulationRunning && demandChart ? demandChart.data.datasets[1].data : [], borderColor: 'rgba(0, 122, 255, 1)', borderDash: [5, 5], tension: 0.4, borderWidth: 3, pointBackgroundColor: 'rgba(0, 122, 255, 1)', pointRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } } });
        const sentimentCtx = document.getElementById('sentiment-analysis-chart').getContext('2d');
        sentimentChart = new Chart(sentimentCtx, { type: 'doughnut', data: { labels: ['Positivo', 'Neutro', 'Negativo'], datasets: [{ data: currentState.sentiment, backgroundColor: ['rgba(52, 199, 89, 0.8)', 'rgba(142, 142, 147, 0.8)', 'rgba(255, 59, 48, 0.8)'], borderColor: '#ffffff', borderWidth: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } } } });
    }
    
    // --- LÓGICA DA SIMULAÇÃO ---
    // --- CORREÇÃO FINAL E DEFINITIVA À PROVA DE FALHAS ---
    function executarOferta(option) {
        addToLog(`Oferta do Teste A/B (${option}) enviada ao cliente.`);
        islandController('show', { layout: 'compact', content: { icon: 'check_circle', text: `Oferta ${option} enviada` } });
        
        if (option === 'A') {
            addToLog("RESULTADO: Cliente converteu com a Oferta A!");

            // Lógica realista para o Ticket Médio
            const valorQueijo = 25.00;
            const receitaAdicional = valorQueijo * 0.70; // 30% de desconto
            const totalReceitaAntiga = currentState.ticket * currentState.sells;
            const novaReceitaTotal = totalReceitaAntiga + receitaAdicional;
            const novasVendasTotais = currentState.sells + 1;
            const novoTicketMedio = novaReceitaTotal / novasVendasTotais;

            // 1. Atualiza o estado interno PRIMEIRO
            currentState.sells = novasVendasTotais;
            currentState.ticket = novoTicketMedio;
            
            // 2. Atualiza a tela com os novos valores (sem animação, para 100% de robustez)
            kpis.crossSells.textContent = currentState.sells;
            kpis.ticket.textContent = `R$ ${currentState.ticket.toFixed(2).replace('.', ',')}`;

            // Efeito visual de "highlight" para mostrar a mudança
            kpis.crossSells.classList.add('highlight-update');
            kpis.ticket.classList.add('highlight-update');
            setTimeout(() => {
                kpis.crossSells.classList.remove('highlight-update');
                kpis.ticket.classList.remove('highlight-update');
            }, 1000);

        } else { // Opção B
            addToLog("RESULTADO: Cliente recusou a Oferta B. Indicadores inalterados.");
        }
        
        offersList.innerHTML = `<p class="empty-state">Aguardando próxima oportunidade...</p>`;
    }

    // (Resto do JS sem alterações)
    let islandAnimation;
    function islandController(action, { layout = 'compact', content = {}, isExpanded = false, duration = 3000 } = {}) { if (islandAnimation) islandAnimation.pause(); const timeline = anime.timeline({ easing: 'spring(1, 80, 10, 0)' }); if (action === 'show') { const targetLayout = islandLayouts[layout]; Object.values(islandLayouts).forEach(l => l.classList.remove('active')); targetLayout.classList.add('active'); if (layout === 'compact') { targetLayout.querySelector('.material-symbols-outlined').textContent = content.icon; targetLayout.querySelector('p').textContent = content.text; } else if (layout === 'expanded') { targetLayout.querySelector('.icon-wrapper .material-symbols-outlined').textContent = content.icon; targetLayout.querySelector('.text-wrapper .title').textContent = content.title; targetLayout.querySelector('.text-wrapper .subtitle').textContent = content.subtitle; } timeline.add({ targets: dynamicIsland, width: isExpanded ? 320 : 180, height: isExpanded ? 80 : 36 }).add({ targets: targetLayout, opacity: 1 }, '-=400'); if (duration > 0) setTimeout(() => islandController('hide'), duration); } else if (action === 'hide') { timeline.add({ targets: '.island-layout', opacity: 0, duration: 150 }).add({ targets: dynamicIsland, width: 125, height: 36 }); } islandAnimation = timeline; }
    function executarSimulacao() { simulationRunning = true; simularBtn.textContent = "Resetar Simulação"; simularBtn.style.background = "var(--orange-accent)"; addToLog("Iniciando simulação..."); setTimeout(() => { addToLog("Geofence: Cliente no corredor de massas."); islandController('show', { layout: 'compact', content: { icon: 'pin_drop', text: 'Corredor de Massas' } }); }, 1500); setTimeout(() => { addToLog("IA: Lead de cross-sell (Queijo) gerado."); const lastHistoricalPoint = currentState.demandHistory[5]; const forecastData = Array(5).fill(null); forecastData.push(lastHistoricalPoint, 29, 27); demandChart.data.datasets[1].data = forecastData; demandChart.update(); }, 3500); setTimeout(() => { addToLog("AÇÃO REQUERIDA: Escolha uma estratégia de oferta (Teste A/B)."); offersBadge.classList.remove('hidden'); islandController('show', { layout: 'expanded', isExpanded: true, content: { icon: 'rule', title: 'Decisão Estratégica', subtitle: 'Escolha a oferta para enviar' }, duration: 6000 }); offersList.innerHTML = `<div class="card-highlight"><div class="card-text"><span class="card-category">OPORTUNIDADE DE VENDA</span><h3>Cliente 'João' (ID: 4815) propenso a comprar Queijo.</h3><p class="ab-test-title">Qual oferta enviar?</p><div class="ab-test-buttons"><button id="ab-test-A" class="main-action-btn option-a">A: 30% OFF</button><button id="ab-test-B" class="main-action-btn option-b">B: Leve 2, Pague 1</button></div></div></div>`; document.getElementById('ab-test-A').addEventListener('click', () => executarOferta('A')); document.getElementById('ab-test-B').addEventListener('click', () => executarOferta('B')); document.querySelector('.tab-button[data-screen="offers"]').click(); }, 5500); }
    function resetarSimulacao() { addToLog("--- Simulação Resetada ---"); simulationRunning = false; simularBtn.textContent = "▶ Iniciar Simulação"; simularBtn.style.background = "var(--blue-accent)"; currentState = JSON.parse(JSON.stringify(initialState)); kpis.crossSells.textContent = currentState.sells; kpis.ticket.textContent = `R$ ${currentState.ticket.toFixed(2).replace('.', ',')}`; setupCharts(); offersBadge.classList.add('hidden'); offersList.innerHTML = `<p class="empty-state">Suas ofertas personalizadas aparecerão aqui.</p>`; document.querySelector('.tab-button[data-screen="home"]').click(); islandController('hide'); }
    function animateKpi(element, endValue, isCurrency = false) { const startValue = parseFloat(element.textContent.replace('R$ ', '').replace(',', '.')) || 0; anime({ targets: { value: startValue }, value: endValue, round: isCurrency ? 100 : 1, easing: 'easeOutExpo', duration: 1000, update: function() { let displayValue = isCurrency ? `R$ ${(this.targets[0].value / 100).toFixed(2).replace('.', ',')}` : Math.round(this.targets[0].value); element.textContent = displayValue; } }); }
    function addToLog(message) { const entry = document.createElement('div'); entry.className = 'log-entry'; entry.textContent = `[${new Date().toLocaleTimeString('pt-BR')}] ${message}`; logContainer.appendChild(entry); entry.classList.add('animate-in'); logContainer.scrollTop = logContainer.scrollHeight; }
    
    // --- CORREÇÃO CRÍTICA AQUI ---
    simularBtn.addEventListener('click', () => {
        // A função correta a ser chamada é executarSimulacao
        if (simulationRunning) {
            resetarSimulacao();
        } else {
            executarSimulacao();
        }
    });

    tabButtons.forEach(button => { button.addEventListener('click', () => { tabButtons.forEach(btn => btn.classList.remove('active')); button.classList.add('active'); document.querySelectorAll('.app-page').forEach(page => page.classList.remove('active')); document.getElementById(`screen-${button.dataset.screen}`).classList.add('active'); if (button.dataset.screen === 'offers') offersBadge.classList.add('hidden'); }); });
    anime.timeline({ easing: 'easeOutExpo' }).add({ targets: ['#phone-column', '#dashboard-column', '#footer'], translateY: [20, 0], opacity: [0, 1], duration: 800, delay: anime.stagger(200, {start: 200}) });
    setupCharts();
});
