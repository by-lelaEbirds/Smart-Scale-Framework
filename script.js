// Aguarda o carregamento completo do HTML antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona os elementos que vamos manipular
    const simularBtn = document.getElementById('simular-btn');
    const pushNotification = document.getElementById('push-notification');
    const statusCompra = document.getElementById('status-compra');
    
    // Elementos do dashboard
    const ticketMedioEl = document.getElementById('ticket-medio');
    const crossSellsEl = document.getElementById('cross-sells');
    const combinacaoEl = document.getElementById('combinacao');

    // Estado inicial dos dados (para poder resetar a simulação se necessário)
    const estadoInicial = {
        ticket: 87.50,
        sells: 132,
        combinacao: "Pão de Alho + Linguiça"
    };

    // Função que executa a simulação da jornada
    function executarSimulacao() {
        // Desabilita o botão para evitar múltiplos cliques
        simularBtn.disabled = true;
        simularBtn.textContent = "Simulando...";

        // 1. A notificação aparece após um tempo (simula o cliente andando até o corredor)
        setTimeout(() => {
            pushNotification.classList.remove('hidden');
        }, 1500); // 1.5 segundos de espera

        // 2. O cliente "aceita" a oferta e o impacto é refletido nos painéis
        setTimeout(() => {
            // Atualiza a visão do cliente
            statusCompra.textContent = 'Queijo Parmesão adicionado com 30% OFF!';
            statusCompra.style.backgroundColor = '#27ae60';
            statusCompra.style.color = 'white';

            // Atualiza a visão do gerente (o impacto no negócio)
            let ticketAtual = parseFloat(ticketMedioEl.textContent.replace('R$ ', '').replace(',', '.'));
            let sellsAtuais = parseInt(crossSellsEl.textContent);
            
            // Vamos simular o aumento (Queijo custou R$ 12,50 com o desconto)
            ticketMedioEl.textContent = `R$ ${(ticketAtual + 12.50).toFixed(2).replace('.', ',')}`;
            crossSellsEl.textContent = sellsAtuais + 1;
            combinacaoEl.textContent = "Macarrão + Queijo Parmesão";
            
            // Efeito visual para destacar a mudança
            destacarElemento(ticketMedioEl);
            destacarElemento(crossSellsEl);
            destacarElemento(combinacaoEl);

        }, 3500); // 3.5 segundos depois (2s após a notificação)
        
        // 3. Reseta o botão para uma nova demonstração
        setTimeout(() => {
            simularBtn.disabled = false;
            simularBtn.textContent = "▶️ Simular Novamente";
        }, 4500);
    }
    
    // Função para adicionar um efeito visual de "piscar" quando um dado é atualizado
    function destacarElemento(elemento) {
        elemento.style.transition = 'transform 0.2s ease, color 0.2s ease';
        elemento.style.transform = 'scale(1.1)';
        elemento.style.color = '#e67e22';
        setTimeout(() => {
            elemento.style.transform = 'scale(1)';
            elemento.style.color = ''; // Volta à cor original do CSS
        }, 300);
    }

    // Adiciona o evento de clique ao botão
    simularBtn.addEventListener('click', executarSimulacao);
});
