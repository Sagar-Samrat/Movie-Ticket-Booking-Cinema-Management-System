(function () {
    'use strict';

    if (!window.CineAuth) {
        return;
    }

    const tabsContainer = document.getElementById('authTabs');
    const tabButtons = document.querySelectorAll('.auth-tab');
    const panels = {
        login: document.getElementById('loginPanel'),
        signup: document.getElementById('signupPanel'),
        forgot: document.getElementById('forgotPanel')
    };
    const accountView = document.getElementById('accountView');
    const authAlert = document.getElementById('authAlert');
    const authAlertText = document.getElementById('authAlertText');
    const authAlertIcon = document.getElementById('authAlertIcon');

    const cardTitle = document.getElementById('authCardTitle');
    const cardSubtitle = document.getElementById('authCardSubtitle');

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotForm = document.getElementById('forgotForm');

    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const rememberMe = document.getElementById('rememberMe');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');

    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPhone = document.getElementById('signupPhone');
    const signupPassword = document.getElementById('signupPassword');
    const signupConfirm = document.getElementById('signupConfirm');
    const agreeTerms = document.getElementById('agreeTerms');
    const signupSubmitBtn = document.getElementById('signupSubmitBtn');

    const resetEmail = document.getElementById('resetEmail');
    const resetNewPassword = document.getElementById('resetNewPassword');
    const resetConfirmPassword = document.getElementById('resetConfirmPassword');
    const resetSubmitBtn = document.getElementById('resetSubmitBtn');

    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.getElementById('strengthText');
    const strengthRules = document.getElementById('strengthRules');
    const confirmMatchHint = document.getElementById('confirmMatchHint');

    const params = new URLSearchParams(window.location.search);
    const redirectTarget = sanitizeRedirect(params.get('redirect'));

    function sanitizeRedirect(raw) {
        if (!raw) {
            return '';
        }
        const trimmed = raw.trim();
        const basePage = trimmed.split(/[?#]/)[0];
        if (!/^[a-zA-Z0-9_-]+\.html$/.test(basePage) || /[\r\n<>]/.test(trimmed)) {
            return '';
        }
        return trimmed;
    }

    function getRedirectNoticeMessage() {
        if (!redirectTarget) {
            return '';
        }
        const basePage = redirectTarget.split(/[?#]/)[0];
        if (basePage === 'booking.html') {
            return 'Please sign in or create an account first to book tickets.';
        }
        if (basePage === 'food-and-beverages.html') {
            return 'Please sign in or create an account first to order food & beverages.';
        }
        return 'Please sign in or create an account to continue.';
    }

    function showAlert(type, message) {
        authAlert.className = 'auth-alert show ' + type;
        authAlertText.textContent = message;
        if (type === 'success') {
            authAlertIcon.className = 'bi bi-check-circle-fill';
        } else if (type === 'info') {
            authAlertIcon.className = 'bi bi-info-circle-fill';
        } else {
            authAlertIcon.className = 'bi bi-exclamation-triangle-fill';
        }
    }

    function clearAlert() {
        authAlert.className = 'auth-alert';
        authAlertText.textContent = '';
    }

    function setFieldError(inputId, message) {
        const input = document.getElementById(inputId);
        const errorEl = document.getElementById(inputId + 'Error');
        if (input) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        }
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    }

    function clearFieldError(inputId) {
        const input = document.getElementById(inputId);
        const errorEl = document.getElementById(inputId + 'Error');
        if (input) {
            input.classList.remove('is-invalid');
        }
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('show');
        }
    }

    function clearAllFieldErrors() {
        document.querySelectorAll('.auth-input').forEach(el => {
            el.classList.remove('is-invalid', 'is-valid');
        });
        document.querySelectorAll('.field-error').forEach(el => {
            el.textContent = '';
            el.classList.remove('show');
        });
    }

    function switchMode(mode) {
        clearAlert();
        clearAllFieldErrors();

        accountView.classList.remove('active');
        Object.keys(panels).forEach(key => {
            panels[key].classList.toggle('active', key === mode);
        });

        if (mode === 'forgot') {
            tabsContainer.style.display = 'none';
            cardTitle.textContent = 'Reset Password';
            cardSubtitle.textContent = 'Enter your registered email to set a new CineVerse password.';
        } else {
            tabsContainer.style.display = 'grid';
            tabButtons.forEach(btn => {
                const active = btn.dataset.mode === mode;
                btn.classList.toggle('active', active);
                btn.setAttribute('aria-selected', active ? 'true' : 'false');
            });

            if (mode === 'signup') {
                cardTitle.textContent = 'Create Your Account';
                cardSubtitle.textContent = 'Join CineVerse to book tickets and earn member perks.';
            } else {
                cardTitle.textContent = 'Welcome Back';
                cardSubtitle.textContent = 'Sign in with your email and password to continue.';
            }
        }
    }

    function showSignedInState(session) {
        clearAlert();
        tabsContainer.style.display = 'none';
        Object.keys(panels).forEach(key => panels[key].classList.remove('active'));

        cardTitle.textContent = 'Signed In';
        cardSubtitle.textContent = 'Your CineVerse session is active across the site.';

        document.getElementById('accountAvatarLg').textContent = window.CineAuth.getInitials(session.name);
        document.getElementById('accountName').textContent = session.name;
        document.getElementById('accountEmail').textContent = session.email;
        document.getElementById('accountTier').textContent = session.tier || 'CineVerse Member';

        accountView.classList.add('active');
    }

    function evaluatePasswordStrength(value) {
        let score = 0;
        if (value.length >= 8) score++;
        if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;

        const levels = [
            { label: 'Too short', cls: '' },
            { label: 'Weak', cls: 'weak' },
            { label: 'Fair', cls: 'fair' },
            { label: 'Good', cls: 'good' },
            { label: 'Strong', cls: 'strong' }
        ];

        const activeLevel = value.length === 0 ? levels[0] : levels[Math.max(1, score)];
        strengthBars.forEach((bar, index) => {
            bar.className = 'strength-bar';
            if (value.length > 0 && index < Math.max(1, score)) {
                bar.classList.add(activeLevel.cls);
            }
        });

        strengthText.textContent = value.length === 0 ? 'Password strength' : activeLevel.label;

        const missing = [];
        if (value.length < 8) missing.push('8+ chars');
        if (!/[A-Z]/.test(value)) missing.push('uppercase');
        if (!/[0-9!@#$%^&*]/.test(value)) missing.push('number/symbol');
        strengthRules.textContent = missing.length ? 'Add: ' + missing.join(', ') : 'All checks met';
    }

    function updateConfirmHint() {
        const pw = signupPassword.value;
        const confirm = signupConfirm.value;
        if (!confirm) {
            confirmMatchHint.textContent = '';
            confirmMatchHint.className = 'field-hint';
            return;
        }
        if (pw === confirm) {
            confirmMatchHint.textContent = 'Passwords match';
            confirmMatchHint.className = 'field-hint match';
            signupConfirm.classList.remove('is-invalid');
            signupConfirm.classList.add('is-valid');
        } else {
            confirmMatchHint.textContent = 'Passwords do not match yet';
            confirmMatchHint.className = 'field-hint mismatch';
            signupConfirm.classList.remove('is-valid');
        }
    }

    function setLoading(button, isLoading) {
        button.disabled = isLoading;
        button.classList.toggle('loading', isLoading);
    }

    function completeAuthRedirect(user) {
        const destination = redirectTarget || 'home.html';
        showAlert('success', 'Welcome, ' + user.name + '! Redirecting to ' + (redirectTarget ? 'your page' : 'CineVerse Home') + '...');
        window.CineAuth.updateNavbarAuth();
        setTimeout(function () {
            window.location.href = destination;
        }, 1050);
    }

    // Tab clicks
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            switchMode(btn.dataset.mode);
        });
    });

    // Forgot password navigation
    document.getElementById('openForgotBtn').addEventListener('click', function () {
        switchMode('forgot');
        if (loginEmail.value.trim()) {
            resetEmail.value = loginEmail.value.trim();
        }
    });

    document.getElementById('backToLoginBtn').addEventListener('click', function () {
        switchMode('login');
    });

    // Password visibility toggles
    document.querySelectorAll('.toggle-password-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const targetId = btn.dataset.target;
            const input = document.getElementById(targetId);
            if (!input) return;
            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = isHidden ? 'bi bi-eye-slash' : 'bi bi-eye';
            }
            btn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
        });
    });

    // Demo quick-fill
    document.getElementById('demoFillBtn').addEventListener('click', function () {
        switchMode('login');
        loginEmail.value = 'demo@cineverse.com';
        loginPassword.value = 'CineVerse@2026';
        rememberMe.checked = true;
        loginEmail.classList.add('is-valid');
        loginPassword.classList.add('is-valid');
        showAlert('info', 'Demo credentials filled. Click "Sign In to CineVerse" to log in.');
        loginSubmitBtn.focus();
    });

    // Live input feedback
    [loginEmail, loginPassword, signupName, signupEmail, signupPhone, resetEmail, resetNewPassword, resetConfirmPassword].forEach(el => {
        if (!el) return;
        el.addEventListener('input', function () {
            clearFieldError(el.id);
        });
    });

    signupPassword.addEventListener('input', function () {
        clearFieldError('signupPassword');
        evaluatePasswordStrength(signupPassword.value);
        updateConfirmHint();
    });

    signupConfirm.addEventListener('input', function () {
        clearFieldError('signupConfirm');
        updateConfirmHint();
    });

    // Sign In submission
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearAlert();
        clearAllFieldErrors();

        const emailVal = loginEmail.value.trim();
        const passVal = loginPassword.value;
        let hasError = false;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
            setFieldError('loginEmail', 'Enter a valid email address.');
            hasError = true;
        }
        if (!passVal) {
            setFieldError('loginPassword', 'Please enter your password.');
            hasError = true;
        }
        if (hasError) {
            return;
        }

        setLoading(loginSubmitBtn, true);
        Promise.resolve(window.CineAuth.ready).then(function () {
            setTimeout(function () {
                const res = window.CineAuth.loginUser({
                    email: emailVal,
                    password: passVal,
                    remember: rememberMe.checked
                });
                setLoading(loginSubmitBtn, false);

                if (!res.ok) {
                    if (res.field) {
                        setFieldError(res.field, res.message);
                    }
                    showAlert('error', res.message);
                    return;
                }

                completeAuthRedirect(res.user);
            }, 380);
        });
    });

    // Sign Up submission
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearAlert();
        clearAllFieldErrors();

        const nameVal = signupName.value.trim();
        const emailVal = signupEmail.value.trim();
        const phoneVal = signupPhone.value.trim();
        const passVal = signupPassword.value;
        const confirmVal = signupConfirm.value;
        let hasError = false;

        if (nameVal.length < 2) {
            setFieldError('signupName', 'Full name must be at least 2 characters.');
            hasError = true;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
            setFieldError('signupEmail', 'Please enter a valid email address.');
            hasError = true;
        }
        if (phoneVal && !/^\+?[0-9\s-]{8,15}$/.test(phoneVal)) {
            setFieldError('signupPhone', 'Enter a valid 8–15 digit phone number.');
            hasError = true;
        }
        if (passVal.length < 8) {
            setFieldError('signupPassword', 'Password must be at least 8 characters.');
            hasError = true;
        }
        if (passVal !== confirmVal) {
            setFieldError('signupConfirm', 'Passwords do not match.');
            hasError = true;
        }
        if (!agreeTerms.checked) {
            showAlert('error', 'Please accept the Terms of Service & Privacy Policy to create an account.');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        setLoading(signupSubmitBtn, true);
        Promise.resolve(window.CineAuth.ready).then(function () {
            setTimeout(function () {
                const res = window.CineAuth.registerUser({
                    name: nameVal,
                    email: emailVal,
                    phone: phoneVal,
                    password: passVal
                });
                setLoading(signupSubmitBtn, false);

                if (!res.ok) {
                    if (res.field) {
                        setFieldError(res.field, res.message);
                    }
                    showAlert('error', res.message);
                    return;
                }

                completeAuthRedirect(res.user);
            }, 420);
        });
    });

    // Forgot Password submission
    forgotForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearAlert();
        clearAllFieldErrors();

        const emailVal = resetEmail.value.trim();
        const newPass = resetNewPassword.value;
        const confirmPass = resetConfirmPassword.value;
        let hasError = false;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
            setFieldError('resetEmail', 'Enter a valid registered email address.');
            hasError = true;
        }
        if (newPass.length < 8) {
            setFieldError('resetNewPassword', 'New password must be at least 8 characters.');
            hasError = true;
        }
        if (newPass !== confirmPass) {
            setFieldError('resetConfirmPassword', 'Passwords do not match.');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        setLoading(resetSubmitBtn, true);
        Promise.resolve(window.CineAuth.ready).then(function () {
            setTimeout(function () {
                const res = window.CineAuth.resetPassword({
                    email: emailVal,
                    newPassword: newPass
                });
                setLoading(resetSubmitBtn, false);

                if (!res.ok) {
                    if (res.field) {
                        setFieldError(res.field, res.message);
                    }
                    showAlert('error', res.message);
                    return;
                }

                switchMode('login');
                loginEmail.value = emailVal;
                loginPassword.value = '';
                showAlert('success', 'Password updated! You can now sign in with your new password.');
                loginPassword.focus();
            }, 380);
        });
    });

    // Social login buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const provider = btn.dataset.social || 'Google';
            Promise.resolve(window.CineAuth.ready).then(function () {
                const res = window.CineAuth.socialLogin(provider);
                if (res.ok) {
                    completeAuthRedirect(res.user);
                }
            });
        });
    });

    // Account view actions
    document.getElementById('logoutActionBtn').addEventListener('click', function () {
        window.CineAuth.logout();
        window.location.reload();
    });

    document.getElementById('switchAccountBtn').addEventListener('click', function () {
        window.CineAuth.logout();
        window.location.reload();
    });

    // Initialize view
    const existingSession = window.CineAuth.getSession();
    if (existingSession) {
        showSignedInState(existingSession);
    } else {
        switchMode(params.get('mode') === 'signup' ? 'signup' : 'login');
        const notice = getRedirectNoticeMessage();
        if (notice) {
            showAlert('info', notice);
        }
    }
})();
