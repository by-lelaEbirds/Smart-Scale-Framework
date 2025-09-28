document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const simularBtn = document.getElementById('simular-btn');
    const logContainer = document.getElementById('log-container');
    const dynamicIsland = document.getElementById('dynamic-island');
    const islandContentMain = dynamicIsland.querySelector('.island-content-main');
    const islandContentExpanded = dynamicIsland.querySelector('.island-content-expanded');
    // ... (resto dos seletores do DOM como na versão anterior)

    // --- ANIMAÇÃO DE ENTRADA ---
    anime.timeline({
        easing: 'easeOutExpo',
    })
    .add({
        targets: '#phone-column',
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 800,
        delay: 200
    })
    .add({
        targets: '#dashboard-column',
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 800,
    }, '-=600') // Começa 600ms antes da animação anterior terminar
    .add({
        targets: '#footer',
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 800,
    }, '-=600');

    
    // --- FUNÇÕES DE LÓGICA ---
    let islandAnimation;
    
    function islandController(action, { mainContent = '', expandedContent = '', isExpanded = false, duration = 3000 } = {}) {
        if (islandAnimation) islandAnimation.pause();

        const baseWidth = 125;
        const baseHeight = 36;
        const expandedWidth = document.querySelector('.iphone-mockup').clientWidth * 0.9;
        const expandedHeight = 80;

        const timeline = anime.timeline({
            easing: 'spring(1, 80, 10, 0)',
        });
        
        if (action === 'show') {
            islandContentMain.innerHTML = mainContent;
            islandContentExpanded.innerHTML = expandedContent;

            timeline.add({
                targets: dynamicIsland,
                width: isExpanded ? expandedWidth : baseWidth,
                height: isExpanded ? expandedHeight : baseHeight,
            })
            .add({
                targets: [islandContentMain, islandContentExpanded],
                opacity: 1,
                delay: 100
            }, '-=400');

            if (duration > 0) {
                setTimeout(() => islandController('hide'), duration);
            }
        } else if (action === 'hide') {
            timeline.add({
                targets: [islandContentMain, islandContentExpanded],
                opacity: 0,
                duration: 150
            })
            .add({
                targets: dynamicIsland,
                width: baseWidth,
                height: baseHeight,
            });
        }
        islandAnimation = timeline;
    }
    
    function animateKpi(element, endValue, isCurrency = false) {
        const startValue = parseFloat(element.textContent.replace('R$ ', '').replace(',', '.')) || 0;
        anime({
            targets: { value: startValue },
            value: endValue,
            round: isCurrency ? 100 : 1,
            easing: 'easeOutExpo',
            duration: 1000,
            update: function() {
                let displayValue = isCurrency 
                    ? `R$ ${(Math.round(this.targets[0].value) / 100).toFixed(2).replace('.', ',')}` 
                    : Math.round(this.targets[0].value);
                element.textContent = displayValue;
            }
        });
    }
    
    function addToLog(message) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.appendChild(entry);
        entry.classList.add('animate-in');
        logContainer.scrollTop = logContainer.scrollHeight;
    }
    
    // --- LÓGICA DA SIMULAÇÃO (FLUXO) ---
    // (A lógica de simulação permanece a mesma, mas agora chama as novas funções de animação)

    let simulationRunning = false;
    let state = { baseSells: 132, baseRevenue: 1650, baseLeads: 471, convertidos: 132 };
    
    function executarSimulacao() {
        if (simulationRunning) return;
        simularBtn.disabled = true;
        simulationRunning = true;
        simularBtn.textContent = "Simulação em Andamento...";
        addToLog("Iniciando simulação...");
        
        // ... (resto da lógica setTimeout como na versão anterior, mas chamando as novas funções)
        // Exemplo de como as chamadas mudam:
        setTimeout(() => {
            addToLog("Geofence da loja detectou cliente no corredor de massas.");
            islandController('show', { 
                mainContent: '<span class="material-symbols-outlined">pin_drop</span> Corredor de Massas'
            });
        }, 1500);
        
        setTimeout(() => {
            addToLog("Lead gerado pela plataforma DataSpark.");
            const newLeads = state.baseLeads + 1;
            animateKpi(document.getElementById('funil-gerados'), newLeads);
            state.baseLeads = newLeads;
        }, 3500);

        setTimeout(() => {
            addToLog("Oferta enviada via push.");
            document.getElementById('offers-badge').classList.remove('hidden');
            islandController('show', {
                isExpanded: true,
                mainContent: '<span class="material-symbols-outlined">sell</span>',
                expandedContent: '<div><p style="font-weight:bold;">Cesta Certa</p><p style="font-size:0.8rem; color: #999;">Você tem uma nova oferta!</p></div>',
                duration: 4000
            });
            document.getElementById('offers-list').innerHTML = `<div class="card-highlight"><div class="card-text"><span class="card-category">OFERTA ESPECIAL</span><h3>Queijo Parmesão Faixa Azul</h3></div><button id="accept-offer-btn" class="main-action-btn">Adicionar por + R$ 12,50</button></div>`;
            document.getElementById('accept-offer-btn').addEventListener('click', aceitarOferta);
        }, 5500);

        setTimeout(() => {
            document.querySelector('.tab-button[data-screen="offers"]').click();
        }, 7000);
    }
    
    function aceitarOferta() {
        addToLog("OFERTA ACEITA! Cliente converteu.");
        islandController('show', { 
            mainContent: '<span class="material-symbols-outlined">check_circle</span> Adicionado' 
        });

        // Atualiza KPIs com as novas animações
        const newSells = state.baseSells + 1;
        const newRevenue = state.baseRevenue + 12.50;
        const newConvertidos = state.convertidos + 1;
        
        animateKpi(document.getElementById('kpi-cross-sells'), newSells);
        animateKpi(document.getElementById('kpi-revenue'), newRevenue, true);
        animateKpi(document.getElementById('funil-convertidos'), newConvertidos);
        
        const conversao = (newConvertidos / state.baseLeads) * 100;
        document.getElementById('kpi-conversion').textContent = `${conversao.toFixed(0)}%`;
        anime({ targets: '#bar-convertidos', width: `${conversao.toFixed(0)}%`, easing: 'easeInOutSine' });

        state.baseSells = newSells;
        state.baseRevenue = newRevenue;
        state.convertidos = newConvertidos;

        this.textContent = "Adicionado!"; this.disabled = true;
        
        setTimeout(() => {
            simularBtn.disabled = false; simulationRunning = false;
            simularBtn.textContent = "▶ Iniciar Nova Simulação";
            addToLog("Fim do ciclo da simulação.");
            document.querySelector('.tab-button[data-screen="home"]').click();
        }, 2000);
    }

    simularBtn.addEventListener('click', executarSimulacao);
    
    // Lógica da Tab Bar (simplificada)
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            if(simulationRunning) return;
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            document.querySelectorAll('.app-page').forEach(page => page.classList.remove('active'));
            document.getElementById(`screen-${button.dataset.screen}`).classList.add('active');
            if (button.dataset.screen === 'offers') document.getElementById('offers-badge').classList.add('hidden');
        });
    });
});
