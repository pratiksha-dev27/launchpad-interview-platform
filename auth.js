/**
 * auth.js - Authentication logic for LaunchPad Interview Portal
 * Uses localStorage for client-side user management.
 */

'use strict';

// ─── Utilities ─────────────────────────────────────────────────────────────

function $(id) { return document.getElementById(id); }

function showMsg(type, text) {
    const el = $('auth-message');
    if (!el) return;
    el.className = `auth-msg ${type}`;
    el.innerHTML = `<i class="fas ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i> ${text}`;
    el.classList.remove('hidden');
}

function clearMsg() {
    const el = $('auth-message');
    if (el) el.classList.add('hidden');
}

function setError(fieldId, msg) {
    const el = $(fieldId);
    if (el) el.textContent = msg;
}

function clearErrors(...ids) {
    ids.forEach(id => { const el = $(id); if (el) el.textContent = ''; });
}

function markInvalid(inputId, invalid) {
    const inp = $(inputId);
    if (!inp) return;
    inp.classList.toggle('is-invalid', invalid);
    inp.classList.toggle('is-valid', !invalid);
}

function setLoading(btnId, loading, defaultContent) {
    const btn = $(btnId);
    if (!btn) return;
    if (loading) {
        btn.classList.add('loading');
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Please wait...`;
    } else {
        btn.classList.remove('loading');
        btn.innerHTML = defaultContent;
    }
}

// ─── Storage Helpers ────────────────────────────────────────────────────────

function getUsers() {
    return JSON.parse(localStorage.getItem('lp_users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('lp_users', JSON.stringify(users));
}

function getSession() {
    return JSON.parse(localStorage.getItem('lp_session') || 'null');
}

function saveSession(user, remember) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('lp_session', JSON.stringify(user));
}

function clearSession() {
    localStorage.removeItem('lp_session');
    sessionStorage.removeItem('lp_session');
}

// ─── Validation ─────────────────────────────────────────────────────────────

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function passwordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score; // 0-5
}

// ─── Password Visibility Toggle ─────────────────────────────────────────────

function togglePass(inputId, btn) {
    const inp = $(inputId);
    if (!inp) return;
    const isText = inp.type === 'text';
    inp.type = isText ? 'password' : 'text';
    btn.querySelector('i').className = isText ? 'fas fa-eye' : 'fas fa-eye-slash';
}

// ─── Strength Meter ─────────────────────────────────────────────────────────

function updateStrength(password) {
    const fill = $('strengthFill');
    const label = $('strengthLabel');
    if (!fill || !label) return;

    const score = passwordStrength(password);
    const levels = [
        { width: '0%',   color: 'transparent',    text: '' },
        { width: '20%',  color: '#ff4f6a',          text: 'Very Weak' },
        { width: '40%',  color: '#ff8c42',          text: 'Weak' },
        { width: '60%',  color: '#ffd60a',          text: 'Fair' },
        { width: '80%',  color: '#00f2ff',          text: 'Strong' },
        { width: '100%', color: '#00ff88',          text: 'Very Strong' },
    ];
    const lvl = levels[score] || levels[0];
    fill.style.width = lvl.width;
    fill.style.background = lvl.color;
    label.textContent = `Password strength: ${lvl.text}`;
    label.style.color = lvl.color;
}

// ─── Social Login Placeholder ────────────────────────────────────────────────

function socialLogin(provider) {
    showMsg('error', `${provider.charAt(0).toUpperCase() + provider.slice(1)} login requires a backend. Coming soon!`);
}

// ─── Multi-Step Register ─────────────────────────────────────────────────────

let currentStep = 1;

function goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active', 'completed'));
    document.querySelectorAll('.step-line').forEach(el => el.classList.remove('active'));

    // Mark past steps as completed
    for (let i = 1; i < step; i++) {
        const dot = $(`step-dot-${i}`);
        if (dot) { dot.classList.add('completed'); dot.innerHTML = '<i class="fas fa-check"></i>'; }
        const line = document.querySelectorAll('.step-line')[i - 1];
        if (line) line.classList.add('active');
    }

    // Activate current step dot
    const activeDot = $(`step-dot-${step}`);
    if (activeDot) {
        activeDot.classList.add('active');
        activeDot.innerHTML = `<span>${step}</span>`;
    }

    // Show active form step
    const activeForm = $(`form-step-${step}`);
    if (activeForm) activeForm.classList.add('active');

    currentStep = step;
    clearMsg();
}

function nextStep(fromStep) {
    if (fromStep === 1) {
        const name = $('regName') ? $('regName').value.trim() : '';
        const email = $('regEmail') ? $('regEmail').value.trim() : '';
        let valid = true;

        clearErrors('nameError', 'regEmailError');
        if (!name || name.length < 2) {
            setError('nameError', 'Please enter your full name (at least 2 characters).');
            markInvalid('regName', true);
            valid = false;
        } else markInvalid('regName', false);

        if (!isValidEmail(email)) {
            setError('regEmailError', 'Please enter a valid email address.');
            markInvalid('regEmail', true);
            valid = false;
        } else {
            const users = getUsers();
            if (users.find(u => u.email === email)) {
                setError('regEmailError', 'An account with this email already exists.');
                markInvalid('regEmail', true);
                valid = false;
            } else markInvalid('regEmail', false);
        }

        if (valid) goToStep(2);

    } else if (fromStep === 2) {
        const pass = $('regPassword') ? $('regPassword').value : '';
        const confirm = $('regConfirm') ? $('regConfirm').value : '';
        let valid = true;

        clearErrors('regPassError', 'confirmError');
        if (pass.length < 8) {
            setError('regPassError', 'Password must be at least 8 characters.');
            markInvalid('regPassword', true);
            valid = false;
        } else markInvalid('regPassword', false);

        if (pass !== confirm) {
            setError('confirmError', 'Passwords do not match.');
            markInvalid('regConfirm', true);
            valid = false;
        } else if (confirm) markInvalid('regConfirm', false);

        if (valid) goToStep(3);
    }
}

function prevStep(fromStep) {
    goToStep(fromStep - 1);
}

// ─── Register Submit ─────────────────────────────────────────────────────────

function handleRegister(e) {
    e.preventDefault();

    const agreeTerms = $('agreeTerms') ? $('agreeTerms').checked : false;
    clearErrors('termsError');

    if (!agreeTerms) {
        setError('termsError', 'You must accept the Terms of Service to create an account.');
        return;
    }

    const name = $('regName').value.trim();
    const email = $('regEmail').value.trim();
    const password = $('regPassword').value;
    const goal = document.querySelector('input[name="goal"]:checked')?.value || 'campus';

    setLoading('registerSubmitBtn', true, `<span class="btn-label">Create Account</span> <i class="fas fa-rocket"></i>`);

    // Simulate async registration
    setTimeout(() => {
        const users = getUsers();
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: btoa(password), // obfuscated (NOT real encryption - demo only)
            goal,
            joinedAt: new Date().toISOString(),
            xp: 0,
            streak: 0,
        };
        users.push(newUser);
        saveUsers(users);

        // Auto-login
        const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, goal };
        saveSession(sessionUser, true);

        showMsg('success', `🎉 Welcome aboard, ${name.split(' ')[0]}! Redirecting...`);
        setLoading('registerSubmitBtn', false, `<span class="btn-label">Create Account</span> <i class="fas fa-rocket"></i>`);

        setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    }, 800);
}

// ─── Login Submit ───────────────────────────────────────────────────────────

function handleLogin(e) {
    e.preventDefault();

    const email = $('loginEmail') ? $('loginEmail').value.trim() : '';
    const password = $('loginPassword') ? $('loginPassword').value : '';
    const remember = $('rememberMe') ? $('rememberMe').checked : false;

    clearErrors('emailError', 'passError');
    let valid = true;

    if (!isValidEmail(email)) {
        setError('emailError', 'Please enter a valid email address.');
        markInvalid('loginEmail', true);
        valid = false;
    } else markInvalid('loginEmail', false);

    if (!password) {
        setError('passError', 'Password cannot be empty.');
        markInvalid('loginPassword', true);
        valid = false;
    }

    if (!valid) return;

    setLoading('loginBtn', true, `<span class="btn-label">Sign In</span> <i class="fas fa-arrow-right"></i>`);
    clearMsg();

    setTimeout(() => {
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === btoa(password));

        if (!user) {
            showMsg('error', 'Invalid email or password. Please check your credentials.');
            markInvalid('loginEmail', true);
            markInvalid('loginPassword', true);
            setLoading('loginBtn', false, `<span class="btn-label">Sign In</span> <i class="fas fa-arrow-right"></i>`);
            return;
        }

        const sessionUser = { id: user.id, name: user.name, email: user.email, goal: user.goal };
        saveSession(sessionUser, remember);

        showMsg('success', `Welcome back, ${user.name.split(' ')[0]}! Redirecting...`);
        setLoading('loginBtn', false, `<span class="btn-label">Sign In</span> <i class="fas fa-arrow-right"></i>`);

        setTimeout(() => { window.location.href = 'index.html'; }, 1300);
    }, 700);
}

// ─── Redirect if already logged in ──────────────────────────────────────────

function redirectIfLoggedIn() {
    const session = getSession() || JSON.parse(sessionStorage.getItem('lp_session') || 'null');
    if (session) {
        window.location.href = 'index.html';
    }
}

// ─── Init ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    redirectIfLoggedIn();

    // Attach login form handler
    const loginForm = $('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    // Attach register form handler
    const registerForm = $('registerForm');
    if (registerForm) registerForm.addEventListener('submit', handleRegister);

    // Password strength listener
    const regPass = $('regPassword');
    if (regPass) {
        regPass.addEventListener('input', () => updateStrength(regPass.value));
    }

    // Real-time validation
    const loginEmail = $('loginEmail');
    if (loginEmail) {
        loginEmail.addEventListener('blur', () => {
            if (loginEmail.value && !isValidEmail(loginEmail.value)) {
                setError('emailError', 'Please enter a valid email address.');
                markInvalid('loginEmail', true);
            } else {
                clearErrors('emailError');
                if (loginEmail.value) markInvalid('loginEmail', false);
            }
        });
    }
});

// ─── Index Page - Auth Nav Update ───────────────────────────────────────────
// Called from index.html script.js to update nav based on session

function getLoggedInUser() {
    return JSON.parse(localStorage.getItem('lp_session') || null) ||
           JSON.parse(sessionStorage.getItem('lp_session') || null);
}

function logout() {
    clearSession();
    window.location.reload();
}
