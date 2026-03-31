document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos da UI
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    const formSubtitle = document.getElementById('form-subtitle');
    const forgotPasswordBtn = document.getElementById('forgot-password');

    // --- ALTERNAR ENTRE LOGIN E CADASTRO ---
    if (showRegisterBtn && showLoginBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            formSubtitle.innerText = 'Crie sua conta e comece a dirigir.';
        });

        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            formSubtitle.innerText = 'Bem-vindo de volta! Faça login para continuar.';
        });
    }

    // --- FUNÇÃO: ESQUECEU A SENHA (Simulação) ---
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = prompt("Digite o e-mail cadastrado para recuperar sua senha:");
            if (email) {
                // Em um sistema real, isso chamaria uma rota no back-end para enviar o e-mail
                alert(`Um link de recuperação foi enviado para: ${email}\n(Simulação)`);
            }
        });
    }

    // --- FUNÇÃO: LOGIN REAL ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const btn = loginForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Autenticando...';
            btn.disabled = true;

            try {
                const response = await fetch('https://drivenow-backend-84d4.onrender.com/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('driveNowToken', data.token);
                    localStorage.setItem('driveNowUser', JSON.stringify(data.user));
                    
                    // Se for o admin, manda pro painel admin. Se for cliente, manda pra Home.
                    if (data.user.email === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    alert(data.error);
                    btn.innerText = originalText;
                    btn.disabled = false;
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao conectar com o servidor. O servidor Node.js está rodando?');
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }

    // --- FUNÇÃO: CADASTRO REAL ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            const btn = registerForm.querySelector('button');
            const originalText = btn.innerText;

            if (password !== confirmPassword) {
                alert("As senhas não coincidem!");
                return;
            }

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando conta...';
            btn.disabled = true;

            try {
                const response = await fetch('https://drivenow-backend-84d4.onrender.com/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('🎉 ' + data.message + ' Faça login para continuar.');
                    // Volta para a tela de login
                    showLoginBtn.click();
                    document.getElementById('email').value = email; // Já preenche o e-mail
                } else {
                    alert('Erro: ' + data.error);
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao conectar com o servidor.');
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }
});