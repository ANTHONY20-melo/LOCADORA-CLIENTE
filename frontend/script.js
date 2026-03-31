document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Controle do Menu Mobile ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if(menuToggle.querySelector('i')) {
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }

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

    // --- 2.1 Simulação de envio do formulário de contato ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
            contactForm.reset();
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

    // --- 4. Carregar Frota Dinamicamente ---
    const fleetContainer = document.getElementById('fleet-container');

    async function loadFleet() {
        if (!fleetContainer) return; 

        try {
            fleetContainer.innerHTML = '<p style="text-align:center; width:100%;">Carregando veículos...</p>';

            // Usa URL relativa para evitar problemas de CORS e ambientes hospedados em subdomínios
            const response = await fetch('/api/cars');
            const cars = await response.json();

            // fallback se endpoint não devolver array
            if (!Array.isArray(cars)) {
                throw new Error('Resposta do catálogo inválida');
            }

            fleetContainer.innerHTML = '';

            if (cars.length === 0) {
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
            console.error("Erro ao carregar a frota:", error);
            // Fallback local com alguns carros de modelo se o servidor estiver inacessível
            const fallbackCars = [
                {
                    id: 101,
                    name: 'Audi RS7',
                    price: 450.00,
                    seats: 4,
                    luggage: 2,
                    transmission: 'Automático',
                    ac: true,
                    image_url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1200'
                },
                {
                    id: 102,
                    name: 'Range Rover Velar',
                    price: 520.00,
                    seats: 5,
                    luggage: 4,
                    transmission: 'Automático',
                    ac: true,
                    image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200'
                }
            ];

            fleetContainer.innerHTML = '';
            fallbackCars.forEach(car => {
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
                if (isAnnual) {
                    amount.innerText = amount.getAttribute('data-annual');
                } else {
                    amount.innerText = amount.getAttribute('data-monthly');
                }
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
            // Se o usuário está logado, remove botões de Login/Cadastro e exibe "Olá, Nome" e "Sair"
            const user = JSON.parse(userStr);
            const userName = user.email.split('@')[0]; // Pega parte antes do @
            
            authContainer.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="font-weight: 500; color: var(--text-dark);">
                        <i class="fas fa-user-circle" style="color: var(--primary-color);"></i> Olá, ${userName}
                    </span>
                    <button onclick="logout()" class="btn btn-outline" style="padding: 8px 15px;">Sair</button>
                    <div class="menu-toggle" style="display: none;"><i class="fas fa-bars"></i></div>
                </div>
            `;
        }
    }
});

// --- 7. Lógica de Reserva ---
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
        const response = await fetch('http://localhost:3000/api/reserve', {
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
        console.error("Erro ao fazer reserva:", error);
        alert('Erro ao conectar com o servidor.');
    }
}

// --- 8. Lógica de Assinatura de Plano ---
function checkLoginAndSubscribe(planName) {
    const token = localStorage.getItem('driveNowToken');
    
    if (!token) {
        alert('Você precisa estar logado para assinar o plano ' + planName + '.');
        window.location.href = 'login.html'; 
    } else {
        alert('🎉 Redirecionando para a tela de pagamento do Plano ' + planName + '!');
        // Aqui você chamaria a rota de pagamento ou criaria a assinatura no BD
    }
}

// --- 9. Função de Logout ---
function logout() {
    if(confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('driveNowToken');
        localStorage.removeItem('driveNowUser');
        window.location.reload(); // Recarrega a página para atualizar o Header
    }
}