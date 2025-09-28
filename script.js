document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const simularBtn = document.getElementById('simular-btn');
    const logContainer = document.getElementById('log-container');
    
    // Elementos do App
    const dynamicIsland = document.getElementById('dynamic-island');
    const islandContent = dynamicIsland.querySelector('.island-content');
    const tabButtons = document.querySelectorAll('.tab-button');
    const appPages = document.querySelectorAll('.app-page');
    const offersBadge = document.getElementById('offers-badge');
    const offersList = document.getElementById('offers-list');

    // Elementos do Dashboard (KPIs)
    const kpiTicket = document.getElementById('kpi-ticket');
    const kpiCrossSells = document.getElementById('kpi-cross-sells');
    const kpiRevenue = document.getElementById('kpi-revenue');
    const kpiConversion = document.getElementById('kpi-conversion');
    const funilGerados = document.getElementById('funil-gerados');
    const funilConvertidos = document.getElementById('funil-convertidos');

    // --- ESTADO INICIAL DA SIMULAÇÃO ---
    let state = {
        baseTicket: 87.50,
        baseSells: 132,
        baseRevenue: 1650.00,
        baseLeads: 471
    };
    
    let simulationRunning = false;
    
    // --- FUNÇÕES DE LÓGICA ---
    
    // Adiciona uma entrada ao log de eventos
    function addToLog(message, level = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.classList.add('log-entry');
        entry.innerHTML = `<span class="timestamp">[${timestamp}]</span> <span class="level-${level}">[${level.toUpperCase()}]</span> ${message}`;
        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight; // Auto-scroll
    }

    // Atualiza um KPI no dashboard com animação
    function updateKpi(element, value) {
        element.textContent = value;
        element.classList.add('highlight-update');
        setTimeout(() => element.classList.remove('highlight-update'), 1000);
    }
    
    // Controla a Ilha Dinâmica
    function islandController(action, text = '', duration = 3000) {
        if (action === 'show') {
            islandContent.innerHTML = text;
            dynamicIsland.classList.add('active');
            setTimeout(() => islandController('hide'), duration);
        } else if (action === 'hide') {
            dynamicIsland.classList.remove('active', 'expanded');
        }
    }
    
    // Navegação do App
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (simulationRunning) return; // Trava navegação durante a simulação
            
            const targetScreen = button.dataset.screen;
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            appPages.forEach(page => {
                page.classList.remove('active');
                if (page.id === `screen-${targetScreen}`) {
                    page.classList.add('active');
                }
            });
            
            if (targetScreen === 'offers') {
                offersBadge.classList.add('hidden');
            }
        });
    });

    // Função principal da simulação
    function executarSimulacao() {
        simularBtn.disabled = true;
        simulationRunning = true;
        simularBtn.textContent = "Simulação em Andamento...";
        addToLog("Iniciando simulação: Jornada do cliente 'João'.");

        // STEP 1: João entra no corredor de massas
        setTimeout(() => {
            addToLog("Geofence da loja detectou João no corredor 5 (Massas).");
            document.querySelector('.tab-button[data-screen="scanner"]').click(); // Simula que ele está com o scanner aberto
            islandController('show', '<span class="material-symbols-outlined" style="font-size:1.2rem; margin-right: 5px;">pin_drop</span> Corredor de Massas');
        }, 1500);

        // STEP 2: Plataforma DataSpark processa os dados
        setTimeout(() => {
            addToLog("Plataforma processando dados de João...");
            addToLog("Histórico de compras: macarrão (recorrência alta).");
            addToLog("Regra de negócio #C-14 (cross-sell queijo) acionada.", "warn");
            addToLog(`Lead gerado para o cliente ID ${Math.floor(Math.random() * 1000)}.`);
            updateKpi(funilGerados, ++state.baseLeads);
        }, 3500);

        // STEP 3: A oferta é enviada para o app
        setTimeout(() => {
            addToLog("Oferta de Queijo Parmesão (30% OFF) enviada via push.", "success");
            offersBadge.textContent = "1";
            offersBadge.classList.remove('hidden');
            islandController('show', '<span class="material-symbols-outlined" style="font-size:1.2rem; margin-right: 5px;">sell</span> Nova oferta para você!');
            
            // Cria o card da oferta dinamicamente
            offersList.innerHTML = `
                <div class="card-highlight">
                    <h4>Queijo Parmesão Faixa Azul</h4>
                    <p>Uma oferta especial para sua macarronada!</p>
                    <p style="font-size: 1.5rem; font-weight: bold; color: var(--secondary-color);">30% OFF</p>
                    <button id="accept-offer-btn" class="main-action-btn">Adicionar à Cesta</button>
                </div>`;
            
            document.getElementById('accept-offer-btn').addEventListener('click', aceitarOferta);
        }, 5500);

        // STEP 4: João navega para ver a oferta
        setTimeout(() => {
            addToLog("Cliente visualizou a notificação.");
            document.querySelector('.tab-button[data-screen="offers"]').click();
        }, 6500);
    }

    function aceitarOferta() {
        addToLog("OFERTA ACEITA! Cliente adicionou o Queijo à cesta.", "success");
        islandController('show', '<span class="material-symbols-outlined" style="font-size:1.2rem; margin-right: 5px;">check_circle</span> Item adicionado!');

        // Lógica de atualização dos KPIs
        const valorQueijo = 12.50; // Preço com desconto
        
        state.baseSells++;
        state.baseRevenue += valorQueijo;
        state.baseTicket += valorQueijo / (state.baseSells-1); // Simulação de aumento do ticket médio
        
        updateKpi(kpiCrossSells, state.baseSells);
        updateKpi(kpiRevenue, `R$ ${state.baseRevenue.toFixed(2).replace('.',',')}`);
        updateKpi(kpiTicket, `R$ ${state.baseTicket.toFixed(2).replace('.',',')}`);
        
        const convertidos = parseInt(funilConvertidos.textContent) + 1;
        updateKpi(funilConvertidos, convertidos);
        
        const conversao = (convertidos / state.baseLeads) * 100;
        updateKpi(kpiConversion, `${conversao.toFixed(0)}%`);

        // Finaliza a simulação
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
    
    // Adiciona o evento de clique ao botão principal
    simularBtn.addEventListener('click', executarSimulacao);
});
