// --- 1. FUNÇÃO BLINDADA DO MENU MOBILE ---
window.toggleMobileMenu = function() {
    const nav = document.querySelector('.nav-links');
    const icones = document.querySelectorAll('.menu-toggle i');

    if (nav) {
        nav.classList.toggle('active');
        const isAberto = nav.classList.contains('active');

        // Troca o ícone de todos os botões que existirem
        icones.forEach(icone => {
            if (isAberto) {
                icone.classList.remove('fa-bars');
                icone.classList.add('fa-times');
            } else {
                icone.classList.remove('fa-times');
                icone.classList.add('fa-bars');
            }
        });

        // Trava a rolagem da página quando o menu está aberto
        document.body.style.overflow = isAberto ? 'hidden' : '';
    }
};

// Captura os cliques na tela para o menu
document.addEventListener('click', function(e) {
    // Se clicou no botão do menu (hambúrguer)
    if (e.target.closest('.menu-toggle')) {
        e.preventDefault();
        window.toggleMobileMenu();
    } 
    // Se o menu estiver aberto e clicar em um link, ele fecha
    else if (e.target.closest('.nav-links a')) {
        const nav = document.querySelector('.nav-links');
        if (nav && nav.classList.contains('active')) {
            window.toggleMobileMenu();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // --- 2. Simulação de Formulário de Busca ---
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const btn = bookingForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Buscando disponibilidade...';
            btn.disabled = true;
            setTimeout(() => {
                alert('Busca realizada com sucesso! Desça a página para ver a frota.');
                btn.innerText = originalText;
                btn.disabled = false;
                window.location.href = '#frota'; 
            }, 1500);
        });
    }

    // --- 3. Destaque de link ativo no scroll ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    // --- 4. Carregar Frota Dinamicamente (SEM TIMEOUT) ---
    const fleetContainer = document.getElementById('fleet-container');

    async function loadFleet() {
        if (!fleetContainer) return; 

        try {
            // Mensagem avisando que o servidor pode estar acordando
            fleetContainer.innerHTML = '<p style="text-align:center; width:100%; color: var(--primary-color); font-weight: 500;"><i class="fas fa-spinner fa-spin"></i> Conectando ao sistema de veículos (Pode levar até 50 segundos no primeiro acesso)...</p>';

            // Faz a requisição e ESPERA o tempo que for necessário
            const response = await fetch('https://drivenow-backend-84d4.onrender.com/api/cars');
            
            if (!response.ok) throw new Error('Erro na comunicação com o servidor');

            const cars = await response.json();
            fleetContainer.innerHTML = '';

            if (!Array.isArray(cars) || cars.length === 0) {
                fleetContainer.innerHTML = '<p style="text-align:center; width:100%;">Nenhum veículo disponível no momento.</p>';
                return;
            }

            cars.forEach(car => {
                const carCard = `
                    <div class="car-card">
                        <div class="car-img">
                            <img src="${car.image_url}" alt="${car.name}">
                        </div>
                        <div class="car-info">
                            <div class="car-header">
                                <h3>${car.name}</h3>
                                <span class="price">R$ ${car.price.toFixed(2)}<span>/dia</span></span>
                            </div>
                            <ul class="car-features">
                                <li><i class="fas fa-user"></i> ${car.seats} Lugares</li>
                                <li><i class="fas fa-suitcase"></i> ${car.luggage} Malas</li>
                                <li><i class="fas fa-cog"></i> ${car.transmission}</li>
                                <li><i class="fas fa-snowflake"></i> ${car.ac ? 'Ar Condicionado' : 'Sem Ar'}</li>
                            </ul>
                            <button onclick="makeReservation(${car.id}, '${car.name}')" class="btn btn-primary btn-block">Alugar Agora</button>
                        </div>
                    </div>
                `;
                fleetContainer.innerHTML += carCard;
            });

        } catch (error) {
            console.error("Erro ao carregar a frota real:", error);
            fleetContainer.innerHTML = '<p style="text-align:center; width:100%; color: red;">Servidor em manutenção temporária. Tente recarregar a página.</p>';
        }
    }

    loadFleet();

    // --- 5. Lógica de Alternância de Preços (Mensal/Anual) ---
    const togglePricing = document.getElementById('toggle-pricing');
    const priceAmounts = document.querySelectorAll('.pricing-card .amount');
    const textMonthly = document.getElementById('text-monthly');
    const textAnnual = document.getElementById('text-annual');
    const periodTexts = document.querySelectorAll('.pricing-card .period');

    if (togglePricing) {
        togglePricing.addEventListener('change', (e) => {
            const isAnnual = e.target.checked;
            if (isAnnual) {
                textAnnual.classList.add('active');
                textMonthly.classList.remove('active');
            } else {
                textMonthly.classList.add('active');
                textAnnual.classList.remove('active');
            }
            priceAmounts.forEach(amount => {
                amount.innerText = isAnnual ? amount.getAttribute('data-annual') : amount.getAttribute('data-monthly');
            });
            periodTexts.forEach(period => {
                period.innerText = isAnnual ? '/ano' : '/mês';
            });
        });
    }

    // --- 6. Conexão do Login com a Landing Page (Mudar Header) ---
    const authContainer = document.getElementById('auth-container');
    const token = localStorage.getItem('driveNowToken');
    const userStr = localStorage.getItem('driveNowUser');

    if (authContainer) {
        if (token && userStr) {
            const user = JSON.parse(userStr);
            const userName = user.email.split('@')[0]; 
            
            authContainer.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="font-weight: 500; color: var(--text-dark);">
                        <i class="fas fa-user-circle" style="color: var(--primary-color);"></i> Olá, ${userName}
                    </span>
                    <button onclick="logout()" class="btn btn-outline" style="padding: 8px 15px;">Sair</button>
                    <div class="menu-toggle"><i class="fas fa-bars"></i></div>
                </div>
            `;
        }
    }

    // --- Máscara e FAQ ---
    initializeFAQ();
    initializePhoneMask();
});

// --- FUNÇÕES FORA DO DOMContentLoaded ---

// --- 7. Lógica de Reserva (REAL) ---
async function makeReservation(carId, carName) {
    const token = localStorage.getItem('driveNowToken');
    if (!token) {
        alert('Você precisa estar logado para alugar um carro.');
        window.location.href = 'login.html'; 
        return;
    }
    const confirmar = confirm(`Deseja confirmar a reserva do veículo: ${carName}?`);
    if (!confirmar) return;

    try {
        const response = await fetch('https://drivenow-backend-84d4.onrender.com/api/reserve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ carId: carId })
        });
        const data = await response.json();
        if (response.ok) {
            alert('🎉 ' + data.message + ' Sua reserva foi registrada!');
        } else {
            alert('Erro: ' + data.error);
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('driveNowToken'); 
                window.location.href = 'login.html';
            }
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor.');
    }
}

// --- 8. Lógica de Assinatura de Plano (REAL) ---
function checkLoginAndSubscribe(planName) {
    const token = localStorage.getItem('driveNowToken');
    if (!token) {
        alert('Você precisa estar logado para assinar o plano ' + planName + '.');
        window.location.href = 'login.html'; 
    } else {
        alert('🎉 Redirecionando para a tela de pagamento do Plano ' + planName + '!');
    }
}

// --- 9. Função de Logout ---
function logout() {
    if(confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('driveNowToken');
        localStorage.removeItem('driveNowUser');
        window.location.reload(); 
    }
}

// --- Funções Secundárias ---
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if(question && answer) {
            question.addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if(otherAnswer) otherAnswer.style.display = 'none';
                        otherItem.classList.remove('active');
                    }
                });
                const isOpen = answer.style.display === 'block';
                answer.style.display = isOpen ? 'none' : 'block';
                item.classList.toggle('active');
            });
        }
    });
}

function initializePhoneMask() {
    const phoneInput = document.getElementById('contact-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length <= 2) value = value;
                else if (value.length <= 6) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                else if (value.length <= 10) value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
                else value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            }
            e.target.value = value;
        });
    }
}