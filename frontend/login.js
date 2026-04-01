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
            formSubtitle.innerText = 'Crie sua conta';
        });

        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            formSubtitle.innerText = 'Entre na sua conta';
        });
    }

    // --- FUNÇÃO: ESQUECEU A SENHA ---
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = prompt("Digite o e-mail cadastrado para recuperar sua senha:");
            if (email) {
                // Simulação - em produção, enviaria e-mail
                alert(`Um link de recuperação foi enviado para: ${email}\n\nNota: Esta é uma simulação. Para redefinir a senha do admin, use: admin / 123`);
            }
        });
    }

    // --- FUNÇÃO: LOGIN ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Validação básica de e-mail ou usuário admin
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email !== 'admin' && !emailRegex.test(email)) {
                alert('Por favor, insira um e-mail válido ou usuário admin (admin).');
                return;
            }

            const btn = loginForm.querySelector('.btn-login');
            const originalHTML = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
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

                    if (data.user.email === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    alert(data.error);
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao conectar com o servidor.');
            } finally {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }
        });
    }

    // --- FUNÇÃO: CADASTRO ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            // Validação básica de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }

            if (password !== confirmPassword) {
                alert("As senhas não coincidem!");
                return;
            }

            if (password.length < 6) {
                alert("A senha deve ter pelo menos 6 caracteres!");
                return;
            }

            const btn = registerForm.querySelector('.btn-login');
            const originalHTML = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando...';
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
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }
        });
    }
});