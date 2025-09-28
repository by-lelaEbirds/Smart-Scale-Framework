document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const simularBtn = document.getElementById('simular-btn');
    const logContainer = document.getElementById('log-container');
    const dynamicIsland = document.getElementById('dynamic-island');
    const islandContent = dynamicIsland.querySelector('.island-content');
    const tabButtons = document.querySelectorAll('.tab-button');
    const appPages = document.querySelectorAll('.app-page');
    const offersBadge = document.getElementById('offers-badge');
    const offersList = document.getElementById('offers-list');

    // Elementos do Dashboard
    const kpis = {
        ticket: document.getElementById('kpi-ticket'),
        crossSells: document.getElementById('kpi-cross-sells'),
        revenue: document.getElementById('kpi-revenue'),
        conversion: document.getElementById('kpi-conversion'),
        funilGerados: document.getElementById('funil-gerados'),
        funilConvertidos: document.getElementById('funil-convertidos'),
        barConvertidos: document.getElementById('bar-convertidos')
    };

    // --- ESTADO INICIAL DA SIMULAÇÃO ---
    let state = {
        baseTicket: 87.50,
        baseSells: 132,
        baseRevenue: 1650.00,
        baseLeads: 471,
        convertidos: 132
    };
    
    let simulationRunning = false;

    // --- FUNÇÕES DE LÓGICA ---
    
    function addToLog(message, level = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.innerHTML = `<span>${timestamp}</span> - ${message}`;
        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    function updateKpi(element, value) {
        element.textContent = value;
        element.classList.add('highlight-update');
        setTimeout(() => element.classList.remove('highlight-update'), 1000);
    }
    
    function islandController(action, { text = '', expanded = false, duration = 3000 } = {}) {
        if (action === 'show') {
            islandContent.innerHTML = text;
            dynamicIsland.classList.add('active');
            if (expanded) dynamicIsland.classList.add('expanded');
            setTimeout(() => islandController('hide'), duration);
        } else if (action === 'hide') {
            dynamicIsland.classList.remove('active', 'expanded');
        }
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (simulationRunning) return;
            const targetScreen = button.dataset.screen;
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            appPages.forEach(page => {
                page.classList.remove('active');
                if (page.id === `screen-${targetScreen}`) page.classList.add('active');
            });
            if (targetScreen === 'offers') offersBadge.classList.add('hidden');
        });
    });

    function executarSimulacao() {
        simularBtn.disabled = true;
        simulationRunning = true;
        simularBtn.textContent = "Simulação em Andamento...";
        addToLog("Iniciando simulação: Jornada do cliente 'João'.");

        setTimeout(() => {
            addToLog("Geofence da loja detectou João no corredor 5 (Massas).");
            islandController('show', { text: '<span class="material-symbols-outlined">pin_drop</span><p>Corredor de Massas</p>' });
        }, 1500);

        setTimeout(() => {
            addToLog("Plataforma processando dados em tempo real...");
            addToLog("Histórico de compras: macarrão (recorrência alta).");
            addToLog("Regra de negócio #C-14 (cross-sell queijo) acionada.");
            state.baseLeads++;
            updateKpi(kpis.funilGerados, state.baseLeads);
        }, 3500);

        setTimeout(() => {
            addToLog("Oferta de Queijo Parmesão (30% OFF) enviada via push.");
            offersBadge.textContent = "1";
            offersBadge.classList.remove('hidden');
            islandController('show', { 
                text: `<div><span class="material-symbols-outlined">sell</span></div><div><p style="font-weight:bold; font-size:0.9rem;">Cesta Certa</p><p style="font-size:0.8rem; color: #999;">Você tem uma nova oferta!</p></div>`,
                expanded: true,
                duration: 4000
            });
            
            offersList.innerHTML = `
                <div class="card-highlight">
                    <div class="card-text">
                        <span class="card-category">OFERTA ESPECIAL</span>
                        <h3>Queijo Parmesão Faixa Azul</h3>
                    </div>
                    <button id="accept-offer-btn" class="main-action-btn">Adicionar por + R$ 12,50</button>
                </div>`;
            
            document.getElementById('accept-offer-btn').addEventListener('click', aceitarOferta);
        }, 5500);

        setTimeout(() => {
            addToLog("Cliente notificado. Navegando para a tela de ofertas...");
            document.querySelector('.tab-button[data-screen="offers"]').click();
        }, 7000);
    }

    function aceitarOferta() {
        addToLog("OFERTA ACEITA! Cliente adicionou o Queijo à cesta.");
        islandController('show', { text: '<span class="material-symbols-outlined">check_circle</span><p>Adicionado</p>', duration: 2000 });

        const valorQueijo = 12.50;
        state.baseSells++;
        state.baseRevenue += valorQueijo;
        state.convertidos++;
        
        updateKpi(kpis.crossSells, state.baseSells);
        updateKpi(kpis.revenue, `R$ ${state.baseRevenue.toFixed(2).replace('.',',')}`);
        updateKpi(kpis.funilConvertidos, state.convertidos);
        
        const conversao = (state.convertidos / state.baseLeads) * 100;
        updateKpi(kpis.conversion, `${conversao.toFixed(0)}%`);
        kpis.barConvertidos.style.width = `${conversao.toFixed(0)}%`;

        this.textContent = "Adicionado!";
        this.disabled = true;
        
        setTimeout(() => {
            simularBtn.disabled = false;
            simulationRunning = false;
            simularBtn.textContent = "▶️ Iniciar Nova Simulação";
            addToLog("Fim do ciclo da simulação.");
            document.querySelector('.tab-button[data-screen="home"]').click();
        }, 2000);
    }
    
    simularBtn.addEventListener('click', executarSimulacao);
});
