(function () {
    'use strict';

    const USERS_KEY = 'cineverse_users_v1';
    const SESSION_KEY = 'cineverse_session_v1';

    function safeGet(storage, key) {
        try {
            return storage.getItem(key);
        } catch (err) {
            return null;
        }
    }

    function safeSet(storage, key, value) {
        try {
            storage.setItem(key, value);
            return true;
        } catch (err) {
            return false;
        }
    }

    function safeRemove(storage, key) {
        try {
            storage.removeItem(key);
        } catch (err) {
            /* ignore */
        }
    }

    /**
     * Pure-JS deterministic password digest so auth works identically
     * over both http(s):// and file:// without WebCrypto restrictions.
     */
    function hashPassword(password, salt) {
        const input = salt + '::' + password + '::cineverse2026';
        let h1 = 0x811c9dc5;
        let h2 = 0x9e3779b9;
        for (let i = 0; i < input.length; i++) {
            const ch = input.charCodeAt(i);
            h1 ^= ch;
            h1 = Math.imul(h1, 0x01000193);
            h2 ^= (ch + i);
            h2 = Math.imul(h2, 0x85ebca6b);
        }
        return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
    }

    function normalizeEmail(email) {
        return String(email || '').trim().toLowerCase();
    }

    function getDefaultUsers() {
        const demoEmail = 'demo@cineverse.com';
        return [
            {
                id: 'usr_demo_01',
                name: 'Sagar Samrat',
                email: demoEmail,
                phone: '9876543210',
                tier: 'CineVerse Gold',
                provider: 'email',
                passwordHash: hashPassword('CineVerse@2026', demoEmail),
                createdAt: '2026-09-01T10:00:00.000Z'
            }
        ];
    }

    function getUsers() {
        const raw = safeGet(localStorage, USERS_KEY);
        if (!raw) {
            const seeded = getDefaultUsers();
            safeSet(localStorage, USERS_KEY, JSON.stringify(seeded));
            return seeded;
        }
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        } catch (err) {
            /* fall through */
        }
        const seeded = getDefaultUsers();
        safeSet(localStorage, USERS_KEY, JSON.stringify(seeded));
        return seeded;
    }

    function saveUsers(users) {
        safeSet(localStorage, USERS_KEY, JSON.stringify(users));
    }

    function normalizeSeedUser(raw) {
        if (!raw || !raw.email) {
            return null;
        }
        const cleanEmail = normalizeEmail(raw.email);
        const passwordHash = raw.passwordHash ||
            (raw.password ? hashPassword(raw.password, cleanEmail) : '');
        if (!passwordHash) {
            return null;
        }
        return {
            id: raw.id || ('usr_' + cleanEmail.replace(/[^a-z0-9]/g, '')),
            name: String(raw.name || 'CineVerse Member').trim(),
            email: cleanEmail,
            phone: String(raw.phone || '').trim(),
            tier: raw.tier || 'CineVerse Member',
            provider: raw.provider || 'email',
            passwordHash: passwordHash,
            createdAt: raw.createdAt || new Date().toISOString()
        };
    }

    async function loadSeedUsersFromJson() {
        if (typeof fetch !== 'function') {
            return getUsers();
        }
        try {
            const response = await fetch('../data/users.json');
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            const seedList = await response.json();
            if (!Array.isArray(seedList)) {
                return getUsers();
            }

            const existing = getUsers();
            const existingEmails = new Set(existing.map(u => normalizeEmail(u.email)));
            let changed = false;

            seedList.forEach(item => {
                const normalized = normalizeSeedUser(item);
                if (normalized && !existingEmails.has(normalized.email)) {
                    existing.push(normalized);
                    existingEmails.add(normalized.email);
                    changed = true;
                }
            });

            if (changed) {
                saveUsers(existing);
            }
            return existing;
        } catch (err) {
            // Graceful fallback when opened directly over file:// without a local server
            return getUsers();
        }
    }

    const readyPromise = loadSeedUsersFromJson();

    function createSessionPayload(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            tier: user.tier || 'CineVerse Member',
            provider: user.provider || 'email',
            loggedInAt: new Date().toISOString()
        };
    }

    function setSession(user, remember) {
        const payload = JSON.stringify(createSessionPayload(user));
        safeRemove(localStorage, SESSION_KEY);
        safeRemove(sessionStorage, SESSION_KEY);
        if (remember) {
            safeSet(localStorage, SESSION_KEY, payload);
        } else {
            safeSet(sessionStorage, SESSION_KEY, payload);
        }
    }

    function getSession() {
        const raw = safeGet(localStorage, SESSION_KEY) || safeGet(sessionStorage, SESSION_KEY);
        if (!raw) {
            return null;
        }
        try {
            const parsed = JSON.parse(raw);
            return parsed && parsed.email ? parsed : null;
        } catch (err) {
            return null;
        }
    }

    function logout() {
        safeRemove(localStorage, SESSION_KEY);
        safeRemove(sessionStorage, SESSION_KEY);
    }

    function registerUser({ name, email, phone, password }) {
        const cleanName = String(name || '').trim();
        const cleanEmail = normalizeEmail(email);
        const cleanPhone = String(phone || '').trim();

        if (cleanName.length < 2) {
            return { ok: false, field: 'signupName', message: 'Please enter your full name (at least 2 characters).' };
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return { ok: false, field: 'signupEmail', message: 'Please enter a valid email address.' };
        }

        if (cleanPhone && !/^\+?[0-9\s-]{8,15}$/.test(cleanPhone)) {
            return { ok: false, field: 'signupPhone', message: 'Please enter a valid phone number.' };
        }

        if (!password || password.length < 8) {
            return { ok: false, field: 'signupPassword', message: 'Password must be at least 8 characters long.' };
        }

        const users = getUsers();
        if (users.some(u => normalizeEmail(u.email) === cleanEmail)) {
            return { ok: false, field: 'signupEmail', message: 'An account with this email already exists. Try signing in instead.' };
        }

        const newUser = {
            id: 'usr_' + Date.now().toString(36),
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            tier: 'CineVerse Member',
            provider: 'email',
            passwordHash: hashPassword(password, cleanEmail),
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);
        setSession(newUser, true);
        return { ok: true, user: createSessionPayload(newUser) };
    }

    function loginUser({ email, password, remember }) {
        const cleanEmail = normalizeEmail(email);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return { ok: false, field: 'loginEmail', message: 'Please enter a valid email address.' };
        }
        if (!password) {
            return { ok: false, field: 'loginPassword', message: 'Please enter your password.' };
        }

        const users = getUsers();
        const user = users.find(u => normalizeEmail(u.email) === cleanEmail);
        if (!user) {
            return { ok: false, field: 'loginEmail', message: 'No CineVerse account found for this email.' };
        }

        const attemptHash = hashPassword(password, cleanEmail);
        if (user.passwordHash !== attemptHash) {
            return { ok: false, field: 'loginPassword', message: 'Incorrect password. Please try again or use Forgot Password.' };
        }

        setSession(user, Boolean(remember));
        return { ok: true, user: createSessionPayload(user) };
    }

    function socialLogin(provider) {
        const cleanProvider = String(provider || 'Google');
        const email = cleanProvider.toLowerCase() === 'apple'
            ? 'apple.member@cineverse.com'
            : 'google.member@cineverse.com';
        const users = getUsers();
        let user = users.find(u => normalizeEmail(u.email) === email);

        if (!user) {
            user = {
                id: 'usr_' + cleanProvider.toLowerCase(),
                name: cleanProvider + ' Guest',
                email: email,
                phone: '',
                tier: 'CineVerse Gold',
                provider: cleanProvider.toLowerCase(),
                passwordHash: hashPassword(cleanProvider + '@SocialAuth2026', email),
                createdAt: new Date().toISOString()
            };
            users.push(user);
            saveUsers(users);
        }

        setSession(user, true);
        return { ok: true, user: createSessionPayload(user) };
    }

    function resetPassword({ email, newPassword }) {
        const cleanEmail = normalizeEmail(email);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return { ok: false, field: 'resetEmail', message: 'Please enter a valid registered email address.' };
        }
        if (!newPassword || newPassword.length < 8) {
            return { ok: false, field: 'resetNewPassword', message: 'New password must be at least 8 characters long.' };
        }

        const users = getUsers();
        const idx = users.findIndex(u => normalizeEmail(u.email) === cleanEmail);
        if (idx === -1) {
            return { ok: false, field: 'resetEmail', message: 'We could not find an account with that email.' };
        }

        users[idx].passwordHash = hashPassword(newPassword, cleanEmail);
        saveUsers(users);
        return { ok: true };
    }

    function getInitials(name) {
        const parts = String(name || 'CV').trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0].slice(0, 2).toUpperCase();
    }

    function injectNavbarStyles() {
        if (document.getElementById('cine-auth-nav-styles')) {
            return;
        }
        const style = document.createElement('style');
        style.id = 'cine-auth-nav-styles';
        style.textContent = `
            .cine-user-menu {
                position: relative;
                display: inline-flex;
                align-items: center;
            }
            .cine-user-pill {
                display: inline-flex;
                align-items: center;
                gap: 9px;
                background: #1a1a1f;
                border: 1px solid rgba(255, 255, 255, 0.16);
                color: #ffffff;
                padding: 7px 14px 7px 8px;
                border-radius: 99px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: 0.25s;
            }
            .cine-user-pill:hover {
                border-color: #e50914;
                background: #23232a;
            }
            .cine-user-avatar {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: #e50914;
                color: #ffffff;
                font-size: 12px;
                font-weight: 700;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
            .cine-user-dropdown {
                position: absolute;
                top: calc(100% + 10px);
                right: 0;
                min-width: 215px;
                background: #16161b;
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 12px;
                padding: 8px;
                box-shadow: 0 18px 40px rgba(0, 0, 0, 0.6);
                display: none;
                z-index: 1200;
            }
            .cine-user-dropdown.open {
                display: block;
            }
            .cine-user-header {
                padding: 8px 10px 10px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                margin-bottom: 6px;
            }
            .cine-user-header strong {
                display: block;
                font-size: 14px;
                color: #ffffff;
            }
            .cine-user-header span {
                display: block;
                font-size: 12px;
                color: #9c9ca3;
                word-break: break-all;
            }
            .cine-user-action {
                display: block;
                width: 100%;
                text-align: left;
                background: transparent;
                border: none;
                color: #e2e2e6;
                padding: 8px 10px;
                border-radius: 7px;
                font-size: 14px;
                text-decoration: none;
                cursor: pointer;
                transition: 0.2s;
            }
            .cine-user-action:hover {
                background: rgba(255, 255, 255, 0.08);
                color: #ffffff;
            }
            .cine-user-action.logout {
                color: #ff6b76;
            }
            .cine-user-action.logout:hover {
                background: rgba(229, 9, 20, 0.16);
                color: #ff858e;
            }
        `;
        document.head.appendChild(style);
    }

    function updateNavbarAuth() {
        const loginEl = document.querySelector('.cine-navbar .login-btn, .navbar .login-btn');
        if (!loginEl) {
            return;
        }

        const session = getSession();
        if (!session) {
            if (loginEl.tagName === 'A') {
                loginEl.setAttribute('href', 'login.html');
            } else {
                loginEl.addEventListener('click', function () {
                    window.location.href = 'login.html';
                });
            }
            return;
        }

        injectNavbarStyles();

        const firstName = session.name.trim().split(/\s+/)[0] || 'Member';
        const initials = getInitials(session.name);

        const wrapper = document.createElement('div');
        wrapper.className = 'cine-user-menu';

        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'cine-user-pill';
        pill.setAttribute('aria-expanded', 'false');
        pill.innerHTML =
            '<span class="cine-user-avatar"></span>' +
            '<span class="cine-user-name"></span>' +
            '<span aria-hidden="true" style="font-size:11px;opacity:0.75;">▾</span>';
        pill.querySelector('.cine-user-avatar').textContent = initials;
        pill.querySelector('.cine-user-name').textContent = firstName;

        const dropdown = document.createElement('div');
        dropdown.className = 'cine-user-dropdown';
        dropdown.innerHTML =
            '<div class="cine-user-header">' +
            '<strong></strong>' +
            '<span></span>' +
            '</div>' +
            '<a class="cine-user-action" href="login.html">My Account</a>' +
            '<a class="cine-user-action" href="booking.html">My Bookings</a>' +
            '<button type="button" class="cine-user-action logout">Sign Out</button>';

        dropdown.querySelector('.cine-user-header strong').textContent = session.name;
        dropdown.querySelector('.cine-user-header span').textContent = session.email;

        pill.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = dropdown.classList.toggle('open');
            pill.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        document.addEventListener('click', function () {
            dropdown.classList.remove('open');
            pill.setAttribute('aria-expanded', 'false');
        });

        dropdown.querySelector('.logout').addEventListener('click', function () {
            logout();
            window.location.reload();
        });

        wrapper.appendChild(pill);
        wrapper.appendChild(dropdown);
        loginEl.replaceWith(wrapper);
    }

    window.CineAuth = {
        ready: readyPromise,
        getUsers: getUsers,
        registerUser: registerUser,
        loginUser: loginUser,
        socialLogin: socialLogin,
        resetPassword: resetPassword,
        getSession: getSession,
        logout: logout,
        getInitials: getInitials,
        updateNavbarAuth: updateNavbarAuth
    };

    document.addEventListener('DOMContentLoaded', updateNavbarAuth);
})();
