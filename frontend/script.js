document.addEventListener('DOMContentLoaded', () => {
    
   // --- 1. Controle do Menu Mobile (Corrigido com Delegação de Eventos) ---
    // Usamos o 'document' para ouvir os cliques, assim o botão funciona mesmo se o HTML for recriado pelo Login.
    
    document.addEventListener('click', (e) => {
        const menuToggleBtn = e.target.closest('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        const header = document.querySelector('header');

        // 1. Ação de Abrir/Fechar ao clicar no botão de Menu (Hambúrguer)
        if (menuToggleBtn && navLinks) {
            e.stopPropagation(); // Evita conflito com o clique fora do menu
            navLinks.classList.toggle('active');
            
            const icon = menuToggleBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                // Impede scroll do body quando menu está aberto
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // Libera scroll do body
                document.body.style.overflow = '';
            }
            return; // Sai da função para não executar os comandos abaixo juntos
        }

        // 2. Fecha menu ao clicar em um dos links internos
        if (e.target.closest('.nav-links a') && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const toggleIcon = document.querySelector('.menu-toggle i');
            if (toggleIcon) {
                toggleIcon.classList.remove('fa-times');
                toggleIcon.classList.add('fa-bars');
            }
            document.body.style.overflow = '';
        }

        // 3. Fecha menu ao clicar fora dele (qualquer lugar da tela que não seja o header)
        if (navLinks && navLinks.classList.contains('active') && header && !header.contains(e.target)) {
            navLinks.classList.remove('active');
            const toggleIcon = document.querySelector('.menu-toggle i');
            if (toggleIcon) {
                toggleIcon.classList.remove('fa-times');
                toggleIcon.classList.add('fa-bars');
            }
            document.body.style.overflow = '';
        }
    });

    // 4. Fecha menu caso o usuário rotacione o celular ou aumente a tela (Resize)
    window.addEventListener('resize', () => {
        const navLinks = document.querySelector('.nav-links');
        if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const toggleIcon = document.querySelector('.menu-toggle i');
            if (toggleIcon) {
                toggleIcon.classList.remove('fa-times');
                toggleIcon.classList.add('fa-bars');
            }
            document.body.style.overflow = '';
        }
    });

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

            const apiUrls = [
                'http://localhost:3000/api/cars'
            ];

            let cars = null;
            const timeoutMs = 8000;

            for (const url of apiUrls) {
                try {
                    const controller = new AbortController();
                    const timeout = setTimeout(() => controller.abort(), timeoutMs);

                    const response = await fetch(url, { signal: controller.signal });
                    clearTimeout(timeout);

                    if (!response.ok) throw new Error(`Status ${response.status}`);

                    const data = await response.json();
                    if (Array.isArray(data) && data.length > 0) {
                        cars = data;
                        break;
                    }
                } catch (error) {
                    console.warn(`Falha no endpoint ${url}:`, error.message);
                }
            }

            if (!Array.isArray(cars)) {
                throw new Error('Resposta do catálogo inválida ou indisponível');
            }

            // fallback se endpoint não devolver array
            if (cars.length === 0) {
                fleetContainer.innerHTML = '<p style="text-align:center; width:100%;">Nenhum veículo disponível no momento.</p>';
                return;
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
                ,{
                    id: 103,
                    name: 'BMW 320i',
                    price: 320.00,
                    seats: 5,
                    luggage: 3,
                    transmission: 'Automático',
                    ac: true,
                    image_url: 'https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&q=80&w=1200'
                },{
                    id: 104,
                    name: 'Toyota Corolla',
                    price: 220.00,
                    seats: 5,
                    luggage: 2,
                    transmission: 'Automático',
                    ac: true,
                    image_url: 'https://images.unsplash.com/photo-1563720223624-c83bcec2b7c8?auto=format&fit=crop&q=80&w=1200'
                },{
                    id: 105,
                    name: 'Jeep Renegade',
                    price: 280.00,
                    seats: 5,
                    luggage: 3,
                    transmission: 'Manual',
                    ac: true,
                    image_url: 'https://images.unsplash.com/photo-1588309495821-b9f0b103f3e1?auto=format&fit=crop&q=80&w=1200'
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
                    <div class="menu-toggle"><i class="fas fa-bars"></i></div>
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

// === 10. FUNCIONALIDADES DA SEÇÃO CONTATO ===

// Formulário de Contato
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Desabilitar botão e mostrar loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            // Simular envio (substitua por chamada real para API)
            try {
                await simulateContactSubmission(new FormData(contactForm));

                // Sucesso
                formStatus.className = 'form-status success';
                formStatus.innerHTML = '<i class="fas fa-check-circle"></i> Mensagem enviada com sucesso! Entraremos em contato em breve.';
                formStatus.style.display = 'block';
                contactForm.reset();

                // Scroll para o status
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            } catch (error) {
                // Erro
                formStatus.className = 'form-status error';
                formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Erro ao enviar mensagem. Tente novamente.';
                formStatus.style.display = 'block';
            }

            // Reabilitar botão
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            // Esconder status após 5 segundos
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        });
    }

    // FAQ Interativo
    initializeFAQ();

    // Máscara para telefone
    initializePhoneMask();
});

// Simulação de envio do formulário de contato
async function simulateContactSubmission(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simular 90% de sucesso, 10% de erro
            if (Math.random() > 0.1) {
                resolve({ success: true });
            } else {
                reject(new Error('Falha na conexão'));
            }
        }, 2000);
    });
}

// FAQ Interativo
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            // Fechar outras FAQs abertas
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.display = 'none';
                    otherItem.classList.remove('active');
                }
            });

            // Toggle da FAQ atual
            const isOpen = answer.style.display === 'block';
            answer.style.display = isOpen ? 'none' : 'block';
            item.classList.toggle('active');

            // Animação suave
            if (!isOpen) {
                answer.style.animation = 'slideDown 0.3s ease';
            }
        });
    });
}

// Máscara para telefone brasileiro
function initializePhoneMask() {
    const phoneInput = document.getElementById('contact-phone');

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                } else if (value.length <= 10) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
                } else {
                    value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
                }
            }

            e.target.value = value;
        });
    }
}

// Validação em tempo real dos campos
document.addEventListener('DOMContentLoaded', () => {
    const formGroups = document.querySelectorAll('.contact-form .form-group');

    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const label = group.querySelector('label');

        if (input && label) {
            input.addEventListener('focus', () => {
                label.style.color = 'var(--primary-color)';
            });

            input.addEventListener('blur', () => {
                label.style.color = 'var(--text-dark)';
            });

            // Validação visual
            input.addEventListener('input', () => {
                if (input.checkValidity()) {
                    input.style.borderColor = '#10b981';
                } else {
                    input.style.borderColor = '#ef4444';
                }
            });
        }
    });
});

// Animações de entrada para elementos da seção contato
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos da seção contato
    document.querySelectorAll('.info-card, .contact-form-container, .map-container, .faq-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Animação CSS para FAQ
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            max-height: 0;
            padding-top: 0;
            padding-bottom: 0;
        }
        to {
            opacity: 1;
            max-height: 200px;
            padding-top: 20px;
            padding-bottom: 20px;
        }
    }

    .faq-item.active .faq-question {
        background: linear-gradient(135deg, #004494, #e55a00);
    }
`;
document.head.appendChild(style);