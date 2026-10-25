/* ==========================================================================
   C.L.O.S. AUTHENTICATION CONTROLLER & LOGIN WINDOW
   ========================================================================== */

export class AuthController {
  constructor(options = {}) {
    this.onLoginSuccess = options.onLoginSuccess || (() => {});
    this.onLogout = options.onLogout || (() => {});
    this.container = null;
    this.currentUser = null;

    // Accepted user accounts for Pal Optical C.L.O.S.
    this.validUsers = [
      { username: 'pal', password: 'pal', name: 'Pal Staff', role: 'Front Desk & Dispensing' },
      { username: 'doctor', password: 'pal', name: 'Dr. Robbins', role: 'Optometrist' },
      { username: 'optician', password: 'pal', name: 'James / Lab', role: 'Lead Optician' },
      { username: 'lab', password: 'pal', name: 'Pal Lab', role: 'Optician Technician' },
      { username: 'admin', password: 'pal', name: 'Administrator', role: 'System Admin' }
    ];
  }

  isAuthenticated() {
    try {
      const sessionAuth = sessionStorage.getItem('clos-authenticated');
      const localAuth = localStorage.getItem('clos-authenticated');
      if (sessionAuth === 'true' || localAuth === 'true') {
        const storedUser = sessionStorage.getItem('clos-user') || localStorage.getItem('clos-user');
        if (storedUser) {
          try {
            this.currentUser = JSON.parse(storedUser);
          } catch (e) {
            this.currentUser = { name: 'Pal Staff', role: 'Front Desk & Dispensing' };
          }
        }
        return true;
      }
    } catch (e) {
      console.warn('Auth check error:', e);
    }
    return false;
  }

  getCurrentUser() {
    return this.currentUser || { name: 'Pal Staff', role: 'Front Desk & Dispensing' };
  }

  showLogin() {
    let overlay = document.getElementById('clos-auth-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'clos-auth-overlay';
      document.body.appendChild(overlay);
    }

    overlay.className = '';
    overlay.style.display = 'flex';

    overlay.innerHTML = `
      <div class="auth-ambient-orb"></div>

      <div class="clos-login-card">
        <div class="clos-auth-header">
          <div class="clos-auth-emblem">
            <img src="/clos-logo.png" alt="C.L.O.S. Logo" class="clos-login-logo-img" />
          </div>
          <h2 class="clos-auth-title">C.L.O.S. <span>PORTAL</span></h2>
          <p class="clos-auth-subtitle">Contact Lens Ordering & Pickup Tracking System</p>
        </div>

        <!-- Quick 1-Click Role Presets -->
        <div class="clos-role-preset-wrap">
          <span class="clos-role-preset-label">Quick Sign-In Station:</span>
          <div class="clos-role-buttons">
            <button type="button" class="clos-role-btn active" data-preset="pal">
              <span class="role-icon">👩‍💼</span>
              <span>Front Desk</span>
            </button>
            <button type="button" class="clos-role-btn" data-preset="doctor">
              <span class="role-icon">🩺</span>
              <span>Dr. Robbins</span>
            </button>
            <button type="button" class="clos-role-btn" data-preset="optician">
              <span class="role-icon">🔬</span>
              <span>Optician Lab</span>
            </button>
          </div>
        </div>

        <form class="clos-auth-form" id="clos-login-form" onsubmit="return false;">
          <div class="clos-form-group">
            <label class="clos-input-label" for="clos-user-input">Staff Username</label>
            <div class="clos-input-wrap">
              <svg class="clos-input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input type="text" id="clos-user-input" class="clos-auth-input" placeholder="e.g. pal or doctor" autocomplete="username" value="pal">
            </div>
          </div>

          <div class="clos-form-group">
            <label class="clos-input-label" for="clos-pass-input">Station Password</label>
            <div class="clos-input-wrap">
              <svg class="clos-input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input type="password" id="clos-pass-input" class="clos-auth-input" placeholder="••••••••" autocomplete="current-password" value="pal">
              <button type="button" class="clos-toggle-password" id="btn-toggle-pass" title="Toggle password visibility">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          <div class="clos-auth-options">
            <label class="clos-checkbox-label">
              <input type="checkbox" id="clos-remember-me" checked>
              <span>Keep Station Signed In</span>
            </label>
            <span class="clos-staff-hint">Default: pal / pal</span>
          </div>

          <button type="submit" class="clos-auth-submit-btn" id="clos-submit-btn">
            <span>Access C.L.O.S. Workspace</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>

          <div class="clos-auth-error" id="clos-auth-error"></div>
        </form>
      </div>
    `;

    this.container = overlay;
    this.bindEvents();
  }

  bindEvents() {
    if (!this.container) return;

    const userInput = this.container.querySelector('#clos-user-input');
    const passInput = this.container.querySelector('#clos-pass-input');
    const submitBtn = this.container.querySelector('#clos-submit-btn');
    const form = this.container.querySelector('#clos-login-form');
    const errorEl = this.container.querySelector('#clos-auth-error');
    const togglePassBtn = this.container.querySelector('#btn-toggle-pass');
    const presetBtns = this.container.querySelectorAll('.clos-role-btn');
    const rememberMe = this.container.querySelector('#clos-remember-me');

    // Preset role buttons
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const preset = btn.getAttribute('data-preset');
        userInput.value = preset;
        passInput.value = 'pal';
        errorEl.textContent = '';
        passInput.focus();
      });
    });

    // Toggle password visibility
    if (togglePassBtn) {
      togglePassBtn.addEventListener('click', () => {
        if (passInput.type === 'password') {
          passInput.type = 'text';
          togglePassBtn.style.color = '#38bdf8';
        } else {
          passInput.type = 'password';
          togglePassBtn.style.color = '#64748b';
        }
      });
    }

    const handleLogin = () => {
      const username = userInput.value.trim().toLowerCase();
      const password = passInput.value.trim().replace(/\s+/g, '').toLowerCase();

      if (!username || !password) {
        this.showError('Please enter both username and password.');
        return;
      }

      const matched = this.validUsers.find(u => u.username === username && u.password === password);

      if (matched) {
        this.currentUser = {
          username: matched.username,
          name: matched.name,
          role: matched.role,
          loggedAt: new Date().toLocaleTimeString()
        };

        const isRemember = rememberMe ? rememberMe.checked : true;
        if (isRemember) {
          localStorage.setItem('clos-authenticated', 'true');
          localStorage.setItem('clos-user', JSON.stringify(this.currentUser));
        }
        sessionStorage.setItem('clos-authenticated', 'true');
        sessionStorage.setItem('clos-user', JSON.stringify(this.currentUser));

        submitBtn.innerHTML = `
          <span>Access Granted! Opening C.L.O.S...</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        `;
        submitBtn.style.background = '#059669';

        setTimeout(() => {
          this.hideLogin();
          this.onLoginSuccess(this.currentUser);
        }, 350);
      } else {
        this.showError('Invalid credentials. Pal Optical default is: pal / pal');
        passInput.value = '';
        passInput.focus();
      }
    };

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', handleLogin);
    }
  }

  showError(msg) {
    const errorEl = this.container ? this.container.querySelector('#clos-auth-error') : null;
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.remove('has-error');
      void errorEl.offsetWidth; // trigger reflow
      errorEl.classList.add('has-error');
    }
  }

  hideLogin() {
    if (this.container) {
      this.container.classList.add('auth-hidden');
      setTimeout(() => {
        if (this.container) {
          this.container.style.display = 'none';
        }
      }, 350);
    }
  }

  logout() {
    try {
      localStorage.removeItem('clos-authenticated');
      localStorage.removeItem('clos-user');
      sessionStorage.removeItem('clos-authenticated');
      sessionStorage.removeItem('clos-user');
      this.currentUser = null;
    } catch (e) {}

    if (typeof this.onLogout === 'function') {
      this.onLogout();
    }
    this.showLogin();
  }
}
