// DOM Elements
const modal = document.getElementById('dynamic-content');
const contentLoader = document.getElementById('content-loader');
const timerElement = document.getElementById('timer');

// State
let currentScore = 0;
let userExp = 45; // percentage

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    startCountdown();
    loadDashboardPreview();
    updateNavForSession();

    // Smooth scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// --- Session-Aware Nav ---
function updateNavForSession() {
    const navArea = document.getElementById('navAuthArea');
    const user = (typeof getLoggedInUser === 'function') ? getLoggedInUser() : null;

    if (!navArea) return;

    if (user) {
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        navArea.innerHTML = `
            <div class="user-nav-badge">
                <div class="user-nav-avatar">${initials}</div>
                <span class="user-nav-name">${user.name.split(' ')[0]}</span>
                <button class="logout-btn" onclick="logout()" title="Sign out"><i class="fas fa-sign-out-alt"></i> Logout</button>
            </div>
        `;

        // Update dashboard user info
        const nameEl = document.getElementById('dashUserName');
        const avatarEl = document.getElementById('dashAvatar');
        if (nameEl) nameEl.textContent = user.name;
        if (avatarEl) avatarEl.textContent = initials;
    }
}

// --- Modal / Section Logic ---

function closeModal() {
    modal.classList.add('hidden');
    modal.style.display = 'none'; // Fallback
}

window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}

function loadSection(type) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    contentLoader.innerHTML = ''; // Clear previous content

    switch (type) {
        case 'mcq':
            renderMCQSection();
            break;
        case 'coding':
            renderCodingSection();
            break;
        case 'hr':
            renderHRSection();
            break;
    }
}

// --- Render Functions ---

function renderMCQSection() {
    let html = `<h2>Aptitude & Technical MCQs</h2><div class="mcq-container">`;

    questions.mcq.forEach((q, index) => {
        html += `
            <div class="test-card">
                <p class="question-text">${index + 1}. ${q.question}</p>
                <div class="options-grid">
                    ${q.options.map((opt, i) => `
                        <button class="option-btn" onclick="checkAnswer(this, ${q.id}, ${i})">${opt}</button>
                    `).join('')}
                </div>
                <div class="feedback" id="feedback-${q.id}"></div>
            </div>
        `;
    });

    html += `</div>`;
    contentLoader.innerHTML = html;
}

function checkAnswer(btn, qId, selectedOptionIndex) {
    const question = questions.mcq.find(q => q.id === qId);
    const feedback = document.getElementById(`feedback-${qId}`);
    const parent = btn.parentElement;

    // Disable all buttons in this question
    Array.from(parent.children).forEach(button => {
        button.disabled = true;
        if (button.textContent === question.options[question.answer]) {
            button.classList.add('correct');
        }
    });

    if (selectedOptionIndex === question.answer) {
        btn.classList.add('correct');
        feedback.innerHTML = '<span style="color: #00ff88"><i class="fas fa-check"></i> Correct!</span>';
        currentScore += 10;
        updateXP();
    } else {
        btn.classList.add('wrong');
        feedback.innerHTML = '<span style="color: #ff4d4d"><i class="fas fa-times"></i> Wrong Answer.</span>';
    }
}

function renderCodingSection() {
    let html = `<h2>Coding Challenges</h2><div class="coding-list">`;

    questions.coding.forEach(q => {
        let diffColor = q.difficulty === 'Easy' ? '#00ff88' : q.difficulty === 'Medium' ? '#ffaa00' : '#ff4d4d';

        html += `
            <div class="coding-item glass-panel" style="margin-bottom: 15px; padding: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3>${q.title}</h3>
                    <span style="color: ${diffColor}; border: 1px solid ${diffColor}; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${q.difficulty}</span>
                </div>
                <p style="color: #ccc; margin: 10px 0;">${q.problem}</p>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    ${q.tags.map(t => `<span class="tag" style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${t}</span>`).join('')}
                </div>
                <button class="btn-glow-small" onclick="window.open('https://leetcode.com/problemset/all/?search=${q.title}', '_blank')">Solve </button>
            </div>
        `;
    });

    html += `</div>`;
    contentLoader.innerHTML = html;
}

function renderHRSection() {
    let html = `<h2>HR Interview Prep</h2><div class="hr-container">`;

    questions.hr.forEach(q => {
        html += `
            <div class="hr-card glass-panel" style="margin-bottom: 20px; padding: 20px;">
                <h3 style="color: var(--neon-blue); margin-bottom: 10px;"><i class="fas fa-user-tie"></i> ${q.question}</h3>
                <div class="tip-box" style="background: rgba(189, 0, 255, 0.1); padding: 15px; border-left: 3px solid var(--neon-purple); border-radius: 0 10px 10px 0;">
                    <strong><i class="fas fa-lightbulb"></i> Pro Tip:</strong>
                    <p style="margin-top: 5px; color: #ddd;">${q.tip}</p>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    contentLoader.innerHTML = html;
}

// --- Mock Test Logic (Simplified) ---
function startMockTest() {
    alert("Starting Full Mock Test Sequence... (Simulation Mode)");
    // In a real app, this would redirect to a full-screen test page
    loadSection('mcq'); // For now, reuse MCQ section
}

// --- Daily Challenge ---
function startDailyChallenge() {
    document.getElementById('daily-question-title').innerText = questions.daily.title;
    document.getElementById('daily-question-desc').innerText = questions.daily.desc;
    alert("Challenge Started! Timer is running.");
}

function startCountdown() {
    // Simple 24h countdown simulation
    let hours = 12, minutes = 45, seconds = 0;

    setInterval(() => {
        if (seconds > 0) {
            seconds--;
        } else {
            if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else {
                hours--;
                minutes = 59;
                seconds = 59;
            }
        }

        // Format
        let h = hours < 10 ? "0" + hours : hours;
        let m = minutes < 10 ? "0" + minutes : minutes;
        let s = seconds < 10 ? "0" + seconds : seconds;

        if (timerElement) timerElement.innerText = `${h}:${m}:${s}`;
    }, 1000);
}

// --- Dashboard Logic ---
function updateXP() {
    userExp += 5;
    if (userExp > 100) userExp = 100;

    // Find the XP bar in the dashboard and update it
    const xpBar = document.querySelector('.stats-mini .progress-bar .fill');
    if (xpBar) xpBar.style.width = userExp + '%';

    // Also simulate a chart update
    const randomBar = document.querySelectorAll('.chart-area .bar')[Math.floor(Math.random() * 5)];
    if (randomBar) {
        let h = Math.floor(Math.random() * 80) + 20;
        randomBar.style.height = h + '%';
    }
}

function loadDashboardPreview() {
    // Initialize random chart heights
    document.querySelectorAll('.chart-area .bar').forEach(bar => {
        let h = Math.floor(Math.random() * 60) + 30;
        bar.style.height = h + '%';
    });
}
