/**
 * Authentication Module
 * Handles login, signup, validation, and form toggling
 */

const MOCK_CREDENTIALS = {
    username: "MIND CRAFTS",
    password: "MIND CRAFTS@2026"
};

const rules = {
    length: val => val.length >= 8,
    upper: val => /[A-Z]/.test(val),
    lower: val => /[a-z]/.test(val),
    number: val => /[0-9]/.test(val),
    special: val => /[!@#$%^&*(),.?":{}|<>]/.test(val)
};

function initAuth(onSuccess) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const pwInput = document.getElementById('reg-password');
    const confirmInput = document.getElementById('confirm-password');

    if (loginForm) {
        loginForm.onsubmit = (e) => {
            e.preventDefault();
            const user = document.getElementById('login-username').value;
            const pass = document.getElementById('login-password').value;

            if (user === MOCK_CREDENTIALS.username && pass === MOCK_CREDENTIALS.password) {
                showNotice("Success", "Welcome back! Redirecting you now...", true);
                setTimeout(onSuccess, 1500);
            } else {
                showNotice("Access Denied", "Invalid username or password. Please try again.", false);
            }
        };
    }

    if (signupForm) {
        signupForm.onsubmit = (e) => {
            e.preventDefault();
            const val = pwInput.value;
            const allMet = Object.values(rules).every(validator => validator(val));

            if (!allMet) {
                showNotice("Insecure", "Please fulfill all password requirements.", false);
                return;
            }

            if (!checkMatch(pwInput, confirmInput)) {
                showNotice("Mismatch", "Confirmation password does not match.", false);
                return;
            }

            showNotice("Registered!", "Account created successfully. You can now sign in.", true);
            setTimeout(showLogin, 2500);
        };
    }

    setupPasswordToggles();
    setupValidation(pwInput, confirmInput);
    attachToggles();
}

function showLogin() {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const tagline = document.getElementById('tagline');
    const toggleWrapper = document.getElementById('toggle-wrapper');

    signupForm.classList.remove('active');
    setTimeout(() => {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        setTimeout(() => loginForm.classList.add('active'), 50);
        tagline.textContent = "Welcome back! Access your vault.";
        toggleWrapper.innerHTML = `Don't have an account? <a href="javascript:void(0)" id="go-to-signup" class="text-link">Create an Account</a>`;
        attachToggles();
    }, 400);
}

function showSignup() {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const tagline = document.getElementById('tagline');
    const toggleWrapper = document.getElementById('toggle-wrapper');

    loginForm.classList.remove('active');
    setTimeout(() => {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        setTimeout(() => signupForm.classList.add('active'), 50);
        tagline.textContent = "The future of secure creation";
        toggleWrapper.innerHTML = `Already have an account? <a href="javascript:void(0)" id="go-to-login" class="text-link">Sign In</a>`;
        attachToggles();
    }, 400);
}

function attachToggles() {
    const loginLink = document.getElementById('go-to-login');
    const signupLink = document.getElementById('go-to-signup');
    if (loginLink) loginLink.onclick = showLogin;
    if (signupLink) signupLink.onclick = showSignup;
}

function setupPasswordToggles() {
    document.querySelectorAll('.eye-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            input.type = input.type === 'password' ? 'text' : 'password';
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => btn.style.transform = 'scale(1)', 150);
        });
    });
}

function setupValidation(pwInput, confirmInput) {
    if (!pwInput) return;
    pwInput.addEventListener('input', () => {
        const val = pwInput.value;
        for (const [rule, validator] of Object.entries(rules)) {
            const el = document.querySelector(`[data-rule="${rule}"]`);
            if (el) {
                validator(val) ? el.classList.add('met') : el.classList.remove('met');
            }
        }
        checkMatch(pwInput, confirmInput);
    });

    if (confirmInput) {
        confirmInput.addEventListener('input', () => checkMatch(pwInput, confirmInput));
    }
}

function checkMatch(pwInput, confirmInput) {
    const confirmError = document.getElementById('confirm-error');
    if (!confirmInput || !pwInput) return true;
    if (confirmInput.value !== pwInput.value && confirmInput.value !== "") {
        if (confirmError) confirmError.classList.add('visible');
        return false;
    } else {
        if (confirmError) confirmError.classList.remove('visible');
        return true;
    }
}