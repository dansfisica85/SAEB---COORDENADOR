// ============================================
// AUTENTICAÇÃO - auth.js
// Sistema de login para SAEB 2025
// ============================================

// Credenciais válidas
const VALID_CREDENTIALS = {
    username: 'COORDENADOR',
    password: 'SAEB2025FGV'
};

// Chave para localStorage
const AUTH_KEY = 'saeb_authenticated';
const USER_KEY = 'saeb_user';

/**
 * Verifica se o usuário está autenticado
 */
function isAuthenticated() {
    return localStorage.getItem(AUTH_KEY) === 'true';
}

/**
 * Obtém o usuário atual
 */
function getCurrentUser() {
    return localStorage.getItem(USER_KEY);
}

/**
 * Faz login do usuário
 */
function login(username, password) {
    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
        localStorage.setItem(AUTH_KEY, 'true');
        localStorage.setItem(USER_KEY, username);
        return true;
    }
    return false;
}

/**
 * Faz logout do usuário
 */
function logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = 'index.html';
}

/**
 * Protege páginas que requerem autenticação
 * Redireciona para login se não autenticado
 */
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

/**
 * Redireciona para chat se já autenticado
 * (usado na página de login)
 */
function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.href = 'chat.html';
    }
}

// ============================================
// PÁGINA DE LOGIN - Event Listeners
// ============================================
if (document.getElementById('loginForm')) {
    // Redireciona se já autenticado
    redirectIfAuthenticated();

    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // Esconde mensagem de erro anterior
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }

        // Tenta fazer login
        if (login(username, password)) {
            // Sucesso - redireciona para chat
            window.location.href = 'chat.html';
        } else {
            // Erro - mostra mensagem
            if (errorMessage) {
                errorMessage.textContent = 'Usuário ou senha inválidos. Tente novamente.';
                errorMessage.style.display = 'block';
            }

            // Limpa campos
            passwordInput.value = '';
            passwordInput.focus();

            // Adiciona animação de erro
            loginForm.classList.add('shake');
            setTimeout(() => {
                loginForm.classList.remove('shake');
            }, 500);
        }
    });

    // Remove erro ao digitar
    usernameInput.addEventListener('input', function() {
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    });

    passwordInput.addEventListener('input', function() {
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    });
}

// ============================================
// PÁGINA DE CHAT - Event Listeners
// ============================================
if (document.getElementById('logoutBtn')) {
    // Verifica autenticação
    requireAuth();

    // Exibe nome do usuário
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = getCurrentUser();
    }

    // Exibe iniciais do usuário no avatar
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar) {
        const user = getCurrentUser();
        userAvatar.textContent = user ? user.charAt(0) : 'C';
    }

    // Botão de logout
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (confirm('Deseja realmente sair do sistema?')) {
            logout();
        }
    });
}

// Adiciona animação de shake para erro de login
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    .shake {
        animation: shake 0.5s;
    }
`;
document.head.appendChild(style);
