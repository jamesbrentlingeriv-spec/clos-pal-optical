/* ==========================================================================
   C.L.O.S. APPLICATION ENTRY POINT
   Contact Lens Ordering System - Pal Optical
   ========================================================================== */

// Exclusive Domain Access Enforcement: https://clordersystem.vercel.app/
(function enforceExclusiveDomain() {
  const currentHost = window.location.hostname;
  const isLocal = currentHost === 'localhost' || currentHost === '127.0.0.1' || currentHost.startsWith('192.168.');
  const targetHost = 'clordersystem.vercel.app';
  if (!isLocal && currentHost !== targetHost) {
    window.location.replace(`https://${targetHost}${window.location.pathname}${window.location.search}${window.location.hash}`);
  }
})();

import { SplashScreen } from './splash.js';
import { AuthController } from './auth.js';
import { ContactLensOrderForm } from './closCore.js';
import { DrawerRack } from './drawerRack.js';

class ClosApplication {
  constructor() {
    this.splash = null;
    this.auth = null;
    this.closCore = null;
    this.drawerRack = null;
    this.currentUser = null;
    this.showingDrawerRack = false;

    this.init();
  }

  init() {
    // Setup authentication controller
    this.auth = new AuthController({
      onLoginSuccess: (user) => {
        this.currentUser = user;
        this.mountApp();
      },
      onLogout: () => {
        this.unmountApp();
      }
    });

    // Setup 1.5-second splash screen
    this.splash = new SplashScreen({
      duration: 1500, // 1.5 seconds
      onComplete: () => {
        this.onSplashComplete();
      }
    });

    // Start 1.5-second splash screen immediately
    this.splash.show();
  }

  onSplashComplete() {
    if (this.auth.isAuthenticated()) {
      this.currentUser = this.auth.getCurrentUser();
      this.mountApp();
    } else {
      this.auth.showLogin();
    }
  }

  mountApp() {
    const appRoot = document.getElementById('clos-app-root');
    if (!appRoot) return;

    appRoot.style.display = 'flex';

    // Render Executive Header & Main Layout
    this.renderHeader();

    const formViewport = document.getElementById('clos-form-viewport');
    if (!formViewport) return;

    // Initialize the Contact Lens Order & Waiting core engine
    this.closCore = new ContactLensOrderForm(
      formViewport,
      {},
      () => this.updateStats(),
      { initialTab: 'pad' }
    );

    // Initial sync of body print class
    document.body.classList.add('active-form-contact-lens-order');

    // Setup Drawer Rack container
    const drawerContainer = document.getElementById('clos-drawer-viewport');
    if (drawerContainer) {
      this.drawerRack = new DrawerRack(this.closCore, drawerContainer);
    }

    this.updateStats();
    this.bindHeaderEvents();
  }

  renderHeader() {
    const headerEl = document.getElementById('clos-header-target');
    if (!headerEl) return;

    const user = this.currentUser || { name: 'Pal Staff', role: 'Front Desk' };

    headerEl.innerHTML = `
      <header class="clos-top-bar no-print">
        <div class="clos-bar-left">
          <div class="clos-brand-mark" id="btn-clos-brand" title="Pal Optical - Contact Lens Ordering System">
            <div class="clos-brand-icon">
              <img src="/clos-logo.png" alt="CLOS Logo" class="clos-nav-logo-img" />
            </div>
            <div class="clos-brand-text">
              <div class="clos-brand-name">
                C.L.O.S. <span class="badge-sys">v1.0</span>
              </div>
              <div class="clos-brand-sub">Contact Lens Ordering System • Pal Optical</div>
            </div>
          </div>
        </div>

        <div class="clos-bar-center">
          <div class="clos-stat-pill pill-blue" id="pill-daily-stat" title="Daily pad orders entered today">
            <span>📋 Pad:</span> <strong id="stat-pad-count">0</strong>/16
          </div>
          <div class="clos-stat-pill pill-amber" id="pill-doctor-stat" title="Orders pending doctor ordering & Rx">
            <span>🩺 Doctor:</span> <strong id="stat-doctor-count">0</strong>
          </div>
          <div class="clos-stat-pill pill-green" id="pill-waiting-stat" title="Orders awaiting patient pickup">
            <span>📦 Waiting:</span> <strong id="stat-waiting-count">0</strong>
          </div>
          <div class="clos-stat-pill" id="pill-drawer-stat" title="Orders currently sitting in drawers">
            <span>🗄️ In Drawers:</span> <strong id="stat-drawer-count">0</strong>
          </div>
        </div>

        <div class="clos-bar-right">
          <!-- Drawer Rack Quick View -->
          <button type="button" class="clos-icon-btn" id="btn-toggle-drawers" title="Visual Drawer Inventory Rack">
            <span>🗄️ Drawer Rack</span>
          </button>

          <!-- Export/Backup Menu -->
          <button type="button" class="clos-icon-btn" id="btn-export-json" title="Download JSON Database Backup">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Backup</span>
          </button>

          <button type="button" class="clos-icon-btn" id="btn-export-csv" title="Export Orders as Excel / CSV Spreadsheet">
            <span>CSV</span>
          </button>

          <button type="button" class="clos-icon-btn" id="btn-import-data" title="Restore from JSON Backup File">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span>Restore</span>
          </button>



          <!-- Replay 1.5s Splash Animation -->
          <button type="button" class="clos-icon-btn" id="btn-replay-splash" title="Replay 1.5-Second Splash Animation">
            <span>✨ Intro</span>
          </button>

          <!-- User Badge -->
          <div class="clos-user-badge" title="Station User">
            <div class="clos-user-avatar">
              ${(user.name || 'P')[0].toUpperCase()}
            </div>
            <div class="clos-user-meta">
              <span class="clos-user-name">${user.name}</span>
              <span class="clos-user-role">${user.role}</span>
            </div>
          </div>

          <!-- Sign Out -->
          <button type="button" class="clos-btn-signout" id="btn-clos-signout" title="Sign Out of C.L.O.S.">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Sign Out</span>
          </button>
        </div>
      </header>
    `;
  }

  updateStats() {
    if (!this.closCore) return;
    const stats = this.closCore.getStats ? this.closCore.getStats() : {
      filledPadCount: 0,
      pendingDoctor: 0,
      waitingPickup: 0,
      completed: 0,
      inDrawer: 0
    };

    const padEl = document.getElementById('stat-pad-count');
    const docEl = document.getElementById('stat-doctor-count');
    const waitEl = document.getElementById('stat-waiting-count');
    const drawEl = document.getElementById('stat-drawer-count');

    if (padEl) padEl.textContent = stats.filledPadCount;
    if (docEl) docEl.textContent = stats.pendingDoctor;
    if (waitEl) waitEl.textContent = stats.waitingPickup;
    if (drawEl) drawEl.textContent = stats.inDrawer;
  }

  bindHeaderEvents() {
    // Brand click: return to pad
    const brandBtn = document.getElementById('btn-clos-brand');
    if (brandBtn) {
      brandBtn.addEventListener('click', () => {
        this.hideDrawerRack();
        if (this.closCore) this.closCore.switchTab('pad');
      });
    }

    // Toggle Drawer Rack
    const drawerBtn = document.getElementById('btn-toggle-drawers');
    if (drawerBtn) {
      drawerBtn.addEventListener('click', () => {
        this.toggleDrawerRack();
      });
    }

    // Export JSON Backup
    const exportJsonBtn = document.getElementById('btn-export-json');
    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', () => {
        if (this.closCore && typeof this.closCore.exportDataJSON === 'function') {
          this.closCore.exportDataJSON();
        }
      });
    }

    // Export CSV
    const exportCsvBtn = document.getElementById('btn-export-csv');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        if (this.closCore && typeof this.closCore.exportDataCSV === 'function') {
          this.closCore.exportDataCSV();
        }
      });
    }

    // Import JSON Backup
    const importBtn = document.getElementById('btn-import-data');
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (re) => {
              if (this.closCore && typeof this.closCore.importDataJSON === 'function') {
                this.closCore.importDataJSON(re.target.result);
                this.updateStats();
              }
            };
            reader.readAsText(file);
          }
        };
        input.click();
      });
    }



    // Replay 1.5s Splash Animation
    const replayBtn = document.getElementById('btn-replay-splash');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        if (this.splash) {
          this.splash.replay(() => {});
        }
      });
    }

    // Sign Out
    const signoutBtn = document.getElementById('btn-clos-signout');
    if (signoutBtn) {
      signoutBtn.addEventListener('click', () => {
        if (confirm('Sign out of Contact Lens Ordering System?')) {
          this.auth.logout();
        }
      });
    }

    // Stat pill shortcuts
    const pillPad = document.getElementById('pill-daily-stat');
    if (pillPad) {
      pillPad.style.cursor = 'pointer';
      pillPad.addEventListener('click', () => {
        this.hideDrawerRack();
        if (this.closCore) this.closCore.switchTab('pad');
      });
    }

    const pillDoc = document.getElementById('pill-doctor-stat');
    if (pillDoc) {
      pillDoc.style.cursor = 'pointer';
      pillDoc.addEventListener('click', () => {
        this.hideDrawerRack();
        if (this.closCore) this.closCore.switchTab('doctor');
      });
    }

    const pillWait = document.getElementById('pill-waiting-stat');
    if (pillWait) {
      pillWait.style.cursor = 'pointer';
      pillWait.addEventListener('click', () => {
        this.hideDrawerRack();
        if (this.closCore) this.closCore.switchTab('pickup');
      });
    }

    const pillDraw = document.getElementById('pill-drawer-stat');
    if (pillDraw) {
      pillDraw.style.cursor = 'pointer';
      pillDraw.addEventListener('click', () => {
        this.showDrawerRack();
      });
    }
  }

  toggleDrawerRack() {
    if (this.showingDrawerRack) {
      this.hideDrawerRack();
    } else {
      this.showDrawerRack();
    }
  }

  showDrawerRack() {
    this.showingDrawerRack = true;
    const formViewport = document.getElementById('clos-form-viewport');
    const drawerViewport = document.getElementById('clos-drawer-viewport');

    if (formViewport) formViewport.style.display = 'none';
    if (drawerViewport) {
      drawerViewport.style.display = 'block';
      if (this.drawerRack) this.drawerRack.render();
    }
  }

  hideDrawerRack() {
    this.showingDrawerRack = false;
    const formViewport = document.getElementById('clos-form-viewport');
    const drawerViewport = document.getElementById('clos-drawer-viewport');

    if (formViewport) formViewport.style.display = 'block';
    if (drawerViewport) drawerViewport.style.display = 'none';
  }

  unmountApp() {
    const appRoot = document.getElementById('clos-app-root');
    if (appRoot) {
      appRoot.style.display = 'none';
    }
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.closApp = new ClosApplication();
});
