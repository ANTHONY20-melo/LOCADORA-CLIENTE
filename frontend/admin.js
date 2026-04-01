document.addEventListener('DOMContentLoaded', () => {

    // === 1. SISTEMA DE SEGURANÇA ===
    const token = localStorage.getItem('driveNowToken');
    const userStr = localStorage.getItem('driveNowUser');

    if (!token || !userStr) {
        alert('Acesso negado. Por favor, faça login.');
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(userStr);

    if (user.email !== 'admin') {
        alert('Acesso restrito. Você não tem permissão de administrador.');
        window.location.href = 'index.html';
        return;
    }

    // === 2. NAVEGAÇÃO DO PAINEL ===
    const menuLinks = document.querySelectorAll('.sidebar-menu a[data-target]');
    const adminSections = document.querySelectorAll('.admin-section');
    const pageTitle = document.getElementById('page-title');

    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('data-target');
            const menuText = this.innerText.trim();

            // Atualizar menu ativo
            document.querySelectorAll('.sidebar-menu li').forEach(li => {
                li.classList.remove('active');
            });
            this.parentElement.classList.add('active');

            // Esconder todas as seções
            adminSections.forEach(section => {
                section.style.display = 'none';
            });

            // Mostrar seção alvo
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.opacity = 0;
                targetSection.style.display = 'block';
                setTimeout(() => {
                    targetSection.style.transition = 'opacity 0.3s ease';
                    targetSection.style.opacity = 1;
                }, 10);
            }

            // Atualizar título
            if (pageTitle) {
                pageTitle.innerText = menuText;
            }

            // Carregar dados específicos da seção
            loadSectionData(targetId);
        });
    });

    // === 3. CONTROLE DO MENU MOBILE ===
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (hamburger && sidebar && overlay) {
        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('show');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        });
    }

    // === 4. SISTEMA DE ABAS DAS CONFIGURAÇÕES ===
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsContents = document.querySelectorAll('.settings-content');

    settingsTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover classe active de todas as abas
            settingsTabs.forEach(t => t.classList.remove('active'));
            // Adicionar classe active na aba clicada
            tab.classList.add('active');

            // Esconder todos os conteúdos
            settingsContents.forEach(content => content.classList.remove('active'));

            // Mostrar conteúdo correspondente
            const targetTab = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(`tab-${targetTab}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // === 3. FUNCIONALIDADES DE BUSCA ===
    setupSearchFunctionality();

    // === 4. CARREGAR DADOS INICIAIS ===
    loadSectionData('sec-dashboard');
});

// === 3. FUNÇÕES DE LOGOUT ===
function adminLogout() {
    if(confirm('Deseja realmente sair do painel?')) {
        localStorage.removeItem('driveNowToken');
        localStorage.removeItem('driveNowUser');
        window.location.href = 'index.html';
    }
}

// === 4. FUNÇÕES DOS MODAIS E AÇÕES ===

// Veículos
function openAddVehicleModal() {
    alert('📝 Modal: Adicionar novo veículo\n\nFormulário com campos:\n• Nome do veículo\n• Placa\n• Valor por dia\n• Número de lugares\n• Malas\n• Transmissão\n• Ar condicionado\n• URL da imagem\n\n✅ Funcionalidade será implementada completamente');
}

function editVehicle(vehicleId) {
    alert(`✏️ Editar veículo ID: ${vehicleId}\n\nCarregando dados do veículo...`);
}

function deleteVehicle(vehicleId) {
    if(confirm(`🗑️ Tem certeza que deseja excluir o veículo ID: ${vehicleId}?`)) {
        alert('Veículo excluído com sucesso!');
        // Recarregar lista de veículos
        location.reload();
    }
}

// Locatários
function viewClientDetails(clientId) {
    alert(`👤 Detalhes do cliente ID: ${clientId}\n\n• Histórico de locações\n• Plano atual\n• Dados de contato\n• Avaliações\n• Preferências de veículos\n\n✅ Funcionalidade será implementada completamente`);
}

function editClient(clientId) {
    alert(`✏️ Editar cliente ID: ${clientId}\n\n• Alterar dados pessoais\n• Modificar plano\n• Atualizar informações de contato\n\n✅ Funcionalidade será implementada completamente`);
}

function openAddClientModal() {
    alert('👥 Modal: Adicionar novo cliente\n\nFormulário com campos:\n• Nome completo\n• Email\n• CPF\n• Telefone\n• Endereço\n• Plano inicial\n\n✅ Funcionalidade será implementada completamente');
}

// Locações
function editReservation(reservationId) {
    alert(`📋 Editar reserva ID: ${reservationId}\n\n• Alterar datas\n• Modificar veículo\n• Atualizar valor\n• Mudar status\n\n✅ Funcionalidade será implementada completamente`);
}

function completeReservation(reservationId) {
    if(confirm(`✅ Finalizar reserva ${reservationId}?`)) {
        alert('Reserva finalizada com sucesso!\n\nVeículo liberado para novas locações.');
        location.reload();
    }
}

function cancelReservation(reservationId) {
    if(confirm(`❌ Cancelar reserva ${reservationId}?\n\nEsta ação não pode ser desfeita.`)) {
        alert('Reserva cancelada.\n\nCliente será notificado.');
        location.reload();
    }
}

function confirmReservation(reservationId) {
    if(confirm(`✅ Confirmar reserva ${reservationId}?`)) {
        alert('Reserva confirmada!\n\nCliente será notificado por email.');
        location.reload();
    }
}

function viewReservationDetails(reservationId) {
    alert(`📄 Detalhes da reserva ${reservationId}\n\n• Informações do cliente\n• Dados do veículo\n• Período da locação\n• Valor total\n• Histórico de pagamentos\n\n✅ Funcionalidade será implementada completamente`);
}

function generateReceipt(reservationId) {
    alert(`🧾 Gerando recibo para ${reservationId}...\n\n📄 PDF será baixado automaticamente`);
}

// Manutenção
function editMaintenance(maintenanceId) {
    alert(`🔧 Editar manutenção ${maintenanceId}\n\n• Alterar tipo\n• Modificar datas\n• Atualizar custo\n• Mudar status\n\n✅ Funcionalidade será implementada completamente`);
}

function completeMaintenance(maintenanceId) {
    if(confirm(`✅ Finalizar manutenção ${maintenanceId}?`)) {
        alert('Manutenção finalizada!\n\nVeículo liberado para locação.');
        location.reload();
    }
}

function viewMaintenanceDetails(maintenanceId) {
    alert(`📋 Detalhes da manutenção ${maintenanceId}\n\n• Peças utilizadas\n• Custo detalhado\n• Tempo de trabalho\n• Observações técnicas\n\n✅ Funcionalidade será implementada completamente`);
}

function generateMaintenanceReceipt(maintenanceId) {
    alert(`🧾 Gerando recibo de manutenção ${maintenanceId}...\n\n📄 PDF será baixado automaticamente`);
}

function updateMaintenanceStatus(maintenanceId) {
    alert(`📅 Atualizar status da manutenção ${maintenanceId}\n\n• Em Andamento\n• Aguardando Peças\n• Concluído\n• Cancelado\n\n✅ Funcionalidade será implementada completamente`);
}

function openNewReservationModal() {
    alert('📝 Modal: Nova Locação\n\nFormulário com campos:\n• Selecionar cliente\n• Escolher veículo\n• Data de retirada/devolução\n• Calcular valor\n• Aplicar descontos\n\n✅ Funcionalidade será implementada completamente');
}

// Locações
function editReservation(reservationId) {
    alert(`📋 Editar reserva ID: ${reservationId}\n\n• Alterar datas\n• Modificar veículo\n• Atualizar status\n\n✅ Funcionalidade será implementada completamente`);
}

// Manutenção
function openAddMaintenanceModal() {
    alert('🔧 Modal: Registrar manutenção\n\nFormulário com campos:\n• Veículo\n• Tipo de manutenção\n• Data de início\n• Previsão de conclusão\n• Custo estimado\n• Observações\n\n✅ Funcionalidade será implementada completamente');
}

// Relatórios
function generateReport(type) {
    const reports = {
        'monthly': '📊 Gerando relatório de desempenho mensal...\n\n• Receita total\n• Número de locações\n• Veículos mais alugados\n• Taxa de ocupação\n• Gráficos de tendência',
        'clients': '👥 Gerando análise de clientes...\n\n• Demografia\n• Preferências de veículos\n• Frequência de locação\n• Ticket médio\n• Satisfação',
        'fleet': '🚗 Gerando relatório da frota...\n\n• Utilização por veículo\n• Manutenções pendentes\n• Receita por veículo\n• Status atual\n• Recomendações'
    };

    if(reports[type]) {
        alert(reports[type] + '\n\n⏳ Relatório sendo gerado...');
        setTimeout(() => {
            alert('✅ Relatório gerado com sucesso!\n\n📄 Abrindo em nova aba...');
        }, 2000);
    }
}

function exportData() {
    alert('📤 Exportando dados...\n\nFormatos disponíveis:\n• PDF (Relatório completo)\n• Excel (Dados brutos)\n• CSV (Para análise)\n\n⏳ Preparando arquivos...');

    setTimeout(() => {
        alert('✅ Dados exportados com sucesso!\n\n📁 Arquivos salvos na pasta Downloads');
    }, 3000);
}

// Configurações
function saveSettings() {
    alert('⚙️ Salvando configurações...\n\n• Taxa de comissão: 15%\n• Multa por atraso: R$ 50/dia\n• Email para notificações: admin@drivenow.com\n\n⏳ Aplicando alterações...');

    setTimeout(() => {
        alert('✅ Configurações salvas com sucesso!\n\n🔄 Sistema atualizado');
    }, 1500);
}

// === 5. CARREGAR DADOS DAS SEÇÕES ===
function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'sec-dashboard':
            loadDashboardData();
            break;
        case 'sec-veiculos':
            loadVehiclesData();
            break;
        case 'sec-locatarios':
            loadClientsData();
            break;
        case 'sec-locacoes':
            loadReservationsData();
            break;
        case 'sec-financeiro':
            loadFinancialData();
            break;
        case 'sec-manutencao':
            loadMaintenanceData();
            break;
    }
}

// === 6. FUNÇÕES DE CARREGAMENTO DE DADOS ===
function loadDashboardData() {
    // Atualizar estatísticas em tempo real
    console.log('Carregando dados do dashboard...');
    // Aqui seria feita uma chamada para a API para atualizar os números
}

async function loadVehiclesData() {
    console.log('Carregando dados dos veículos...');

    const tbody = document.getElementById('vehicles-table-body');
    const statTotal = document.querySelector('#sec-veiculos .fleet-stats .stat-mini:nth-child(1) .stat-number');
    const statAvailable = document.querySelector('#sec-veiculos .fleet-stats .stat-mini:nth-child(2) .stat-number');
    const statRented = document.querySelector('#sec-veiculos .fleet-stats .stat-mini:nth-child(3) .stat-number');
    const statMaintenance = document.querySelector('#sec-veiculos .fleet-stats .stat-mini:nth-child(4) .stat-number');

    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Carregando lista de veículos...</td></tr>';
    }

    try {
        const response = await fetch(window.location.origin + '/api/cars');
        if (!response.ok) throw new Error('Erro ao buscar carros');

        const cars = await response.json();
        if (!Array.isArray(cars)) throw new Error('Resposta de carros inválida');

        const total = cars.length;
        const available = cars.filter(c => c.status === undefined || c.status === 'Disponível').length;
        const rented = cars.filter(c => c.status === 'Alugado').length;
        const maintenance = cars.filter(c => c.status === 'Manutenção').length;

        if (statTotal) statTotal.textContent = total;
        if (statAvailable) statAvailable.textContent = available;
        if (statRented) statRented.textContent = rented;
        if (statMaintenance) statMaintenance.textContent = maintenance;

        if (tbody) {
            if (total === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhum veículo encontrado.</td></tr>';
            } else {
                tbody.innerHTML = cars.map(car => {
                    const status = car.status || 'Disponível';
                    const statusClass = status.toLowerCase() === 'disponível' ? 'active'
                        : status.toLowerCase() === 'alugado' ? 'completed'
                        : status.toLowerCase() === 'manutenção' ? 'pending'
                        : 'unknown';

                    return `
                        <tr>
                            <td>#${car.id.toString().padStart(3, '0')}</td>
                            <td>${car.name}</td>
                            <td>${car.plate || '---'}</td>
                            <td>R$ ${Number(car.price).toFixed(2)}</td>
                            <td><span class="status ${statusClass}">${status}</span></td>
                            <td>
                                <button class="btn-action" title="Editar" onclick="editVehicle(${car.id})"><i class="fas fa-edit"></i></button>
                                <button class="btn-action" title="Deletar" onclick="deleteVehicle(${car.id})"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }
    } catch (error) {
        console.error('Erro ao carregar vehicles:', error);
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#dc2626">Não foi possível carregar carros. Tente novamente.</td></tr>';
        }
    }
}

function loadClientsData() {
    console.log('Carregando dados dos clientes...');
    // Aqui seria feita uma chamada para a API
}

function loadReservationsData() {
    console.log('Carregando dados das reservas...');
    // Aqui seria feita uma chamada para a API
}

function loadFinancialData() {
    console.log('Carregando dados financeiros...');
    // Aqui seria feita uma chamada para a API
}

function loadMaintenanceData() {
    console.log('Carregando dados de manutenção...');
    // Aqui seria feita uma chamada para a API
}

// === 7. CONFIGURAR FUNCIONALIDADES DE BUSCA ===
function setupSearchFunctionality() {
    // Busca de veículos
    const vehicleSearch = document.getElementById('vehicle-search');
    if (vehicleSearch) {
        vehicleSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#sec-veiculos tbody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Busca de clientes
    const clientSearch = document.getElementById('client-search');
    if (clientSearch) {
        clientSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#sec-locatarios tbody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
}

// === 8. FUNCIONALIDADES DAS CONFIGURAÇÕES ===
function saveSettings() {
    // Simular salvamento das configurações
    const saveStatus = document.getElementById('save-status');
    if (saveStatus) {
        saveStatus.style.display = 'flex';
        setTimeout(() => {
            saveStatus.style.display = 'none';
        }, 3000);
    }

    // Aqui seria feita uma chamada para a API para salvar as configurações
    console.log('Configurações salvas com sucesso!');
    alert('Configurações salvas com sucesso!');
}

function resetSettings() {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão? Esta ação não pode ser desfeita.')) {
        // Resetar todos os campos para valores padrão
        const inputs = document.querySelectorAll('#sec-config input');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = input.hasAttribute('checked');
            } else {
                // Resetar para valores padrão (simulação)
                switch(input.name || input.id) {
                    case 'commission-rate':
                        input.value = '15';
                        break;
                    case 'late-fee':
                        input.value = '50';
                        break;
                    // Adicionar outros casos conforme necessário
                }
            }
        });

        alert('Configurações restauradas para os valores padrão.');
    }
}

function testEmailConnection() {
    // Simular teste de conexão de email
    alert('Testando conexão com servidor SMTP...');
    setTimeout(() => {
        alert('Conexão estabelecida com sucesso! Email de teste enviado.');
    }, 2000);
}

function runBackup() {
    // Simular execução de backup
    alert('Iniciando backup do sistema...');
    setTimeout(() => {
        alert('Backup concluído com sucesso! Arquivo salvo em: backup_2026-03-31.zip');
    }, 3000);
}

// === 5. FUNÇÕES DA ABA CONTATO ===

// Marcar mensagem como lida
function markAsRead(messageId) {
    event.stopPropagation(); // Evitar abrir o modal
    const messageItem = document.querySelector(`[onclick="openMessageModal(${messageId})"]`);
    if (messageItem) {
        messageItem.classList.remove('unread');
        messageItem.classList.add('read');
        // Aqui seria feita uma chamada para o backend para atualizar o status
        showNotification('Mensagem marcada como lida', 'success');
    }
}

// Marcar todas como lidas
function markAllAsRead() {
    const unreadMessages = document.querySelectorAll('.message-item.unread');
    unreadMessages.forEach(message => {
        message.classList.remove('unread');
        message.classList.add('read');
    });
    showNotification(`${unreadMessages.length} mensagens marcadas como lidas`, 'success');
}

// Arquivar mensagem
function archiveMessage(messageId) {
    event.stopPropagation(); // Evitar abrir o modal
    const messageItem = document.querySelector(`[onclick="openMessageModal(${messageId})"]`);
    if (messageItem) {
        messageItem.style.opacity = '0.5';
        messageItem.style.pointerEvents = 'none';
        // Aqui seria feita uma chamada para o backend para arquivar
        showNotification('Mensagem arquivada', 'info');
    }
}

// Abrir modal de mensagem
function openMessageModal(messageId) {
    const messages = {
        1: {
            sender: 'João Silva',
            email: 'joao.silva@email.com',
            subject: 'Problema com reserva do BMW X5',
            time: 'há 2 horas',
            priority: 'urgent',
            content: `Olá,

Acabei de fazer uma reserva para o BMW X5 para o próximo fim de semana, mas ao tentar confirmar recebi uma mensagem dizendo que o veículo não está disponível na data selecionada.

Poderia verificar o que aconteceu? A reserva foi feita através do site hoje de manhã.

Atenciosamente,
João Silva`
        },
        2: {
            sender: 'Maria Santos',
            email: 'maria.santos@email.com',
            subject: 'Informações sobre seguro adicional',
            time: 'há 4 horas',
            priority: 'normal',
            content: `Olá equipe DriveNow,

Estou interessada em alugar um veículo para uma viagem de férias e gostaria de saber mais sobre as opções de seguro adicional disponíveis.

Quais são as coberturas oferecidas? Há diferença de preço entre elas?

Obrigada,
Maria Santos`
        },
        3: {
            sender: 'Pedro Costa',
            email: 'pedro.costa@email.com',
            subject: 'Confirmação de reserva',
            time: 'há 1 dia',
            priority: 'normal',
            content: `Olá,

Gostaria de confirmar que minha reserva foi realizada com sucesso. O veículo Audi RS7 estará disponível para retirada amanhã às 14h.

Obrigado pelo excelente atendimento!

Pedro Costa`
        },
        4: {
            sender: 'Ana Oliveira',
            email: 'ana.oliveira@email.com',
            subject: 'Elogio ao atendimento',
            time: 'há 2 dias',
            priority: 'normal',
            content: `Olá equipe,

Quero deixar meu elogio pelo atendimento excepcional que recebi hoje. O processo de locação foi muito simples e os veículos estão em excelente estado.

Com certeza recomendarei a DriveNow para meus amigos e familiares.

Parabéns pelo profissionalismo!

Ana Oliveira`
        }
    };

    const message = messages[messageId];
    if (!message) return;

    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content contact-modal">
            <div class="modal-header">
                <h3><i class="fas fa-envelope"></i> ${message.subject}</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="message-details">
                    <div class="message-meta">
                        <div class="meta-item">
                            <strong>De:</strong> ${message.sender} &lt;${message.email}&gt;
                        </div>
                        <div class="meta-item">
                            <strong>Data:</strong> ${message.time}
                        </div>
                        <div class="meta-item">
                            <strong>Prioridade:</strong>
                            <span class="priority-badge ${message.priority}">
                                ${message.priority === 'urgent' ? 'Urgente' : 'Normal'}
                            </span>
                        </div>
                    </div>
                    <div class="message-content-display">
                        <pre>${message.content}</pre>
                    </div>
                </div>

                <div class="message-actions-modal">
                    <button class="btn btn-primary" onclick="replyToMessage(${messageId})">
                        <i class="fas fa-reply"></i> Responder
                    </button>
                    <button class="btn btn-outline" onclick="forwardMessage(${messageId})">
                        <i class="fas fa-share"></i> Encaminhar
                    </button>
                    <button class="btn btn-outline" onclick="archiveMessage(${messageId})">
                        <i class="fas fa-archive"></i> Arquivar
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Marcar como lida automaticamente ao abrir
    markAsRead(messageId);

    // Animação de entrada
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Responder mensagem
function replyToMessage(messageId) {
    alert(`📝 Abrindo editor de resposta para a mensagem ${messageId}\n\nFuncionalidade: Editor de email com templates, anexos e histórico de conversa`);
}

// Encaminhar mensagem
function forwardMessage(messageId) {
    alert(`📤 Encaminhando mensagem ${messageId}\n\nFuncionalidade: Selecionar destinatários e adicionar comentários`);
}

// Usar resposta rápida
function useQuickReply(type) {
    const replies = {
        confirmacao: `Olá!\n\nSua reserva foi confirmada com sucesso. Aqui estão os detalhes:\n\n- Veículo: [Modelo]\n- Data de retirada: [Data]\n- Local: [Endereço]\n\nPara alterações, entre em contato conosco.\n\nAtenciosamente,\nEquipe DriveNow`,
        disponibilidade: `Olá!\n\nObrigado pelo interesse! Atualmente temos os seguintes veículos disponíveis:\n\n- Sedans: [Lista]\n- SUVs: [Lista]\n- Esportivos: [Lista]\n\nPara verificar disponibilidade em datas específicas, acesse nosso site ou entre em contato.\n\nAtenciosamente,\nEquipe DriveNow`,
        documentacao: `Olá!\n\nPara realizar a locação, você precisará apresentar:\n\n✅ CNH válida (mínimo 2 anos)\n✅ Comprovante de endereço\n✅ Cartão de crédito\n✅ Documento de identidade\n\nPara locações especiais, documentação adicional pode ser solicitada.\n\nAtenciosamente,\nEquipe DriveNow`,
        suporte: `Olá!\n\nIdentificamos um problema técnico. Nossa equipe de suporte está trabalhando para resolver.\n\nTempo estimado: 2-4 horas\nStatus: Em andamento\n\nAgradecemos sua paciência!\n\nAtenciosamente,\nEquipe DriveNow`
    };

    const reply = replies[type];
    if (reply) {
        // Copiar para área de transferência (simulado)
        navigator.clipboard.writeText(reply).then(() => {
            showNotification('Resposta rápida copiada para a área de transferência!', 'success');
        }).catch(() => {
            showNotification('Resposta rápida: ' + reply.substring(0, 50) + '...', 'info');
        });
    }
}

// Fechar modal
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remover notificações existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Animação de entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Auto-remover após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}