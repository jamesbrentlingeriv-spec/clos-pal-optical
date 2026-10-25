/* ==========================================================================
   C.L.O.S. 1.5-SECOND ANIMATED SPLASH SCREEN CONTROLLER
   ========================================================================== */

export class SplashScreen {
  constructor(options = {}) {
    this.duration = options.duration || 1500; // Exact 1.5s default
    this.onComplete = options.onComplete || (() => {});
    this.container = null;
    this.startTime = null;
    this.animFrame = null;
    this.isFinished = false;
  }

  show() {
    this.isFinished = false;
    let splashEl = document.getElementById('clos-splash-screen');
    if (!splashEl) {
      splashEl = document.createElement('div');
      splashEl.id = 'clos-splash-screen';
      document.body.appendChild(splashEl);
    }

    splashEl.className = '';
    splashEl.innerHTML = `
      <div class="splash-bg-glow"></div>

      <div class="splash-lens-container">
        <div class="splash-lens-outer-ring"></div>
        <div class="splash-lens-pulse-ring"></div>
        <div class="splash-optic-core">
          <img src="/clos-logo.png" alt="C.L.O.S. Logo" class="splash-logo-img" />
        </div>
      </div>

      <h1 class="splash-brand-title">C.L.O.S.</h1>
      <p class="splash-brand-subtitle">Contact Lens Ordering System</p>
      <div class="splash-org-tag">
        <span>PAL OPTICAL • JAMES BRENTLINGER A.B.O.C., N.C.L.E.C.</span>
      </div>

      <div class="splash-progress-track">
        <div class="splash-progress-bar" id="splash-bar"></div>
      </div>

      <div class="splash-status-text" id="splash-status">Initializing Optical Matrix...</div>

      <button type="button" class="splash-skip-btn" id="splash-skip-btn">
        Skip ⚡
      </button>
    `;

    this.container = splashEl;

    // Skip button click
    const skipBtn = splashEl.querySelector('#splash-skip-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => this.finish());
    }

    // Start precision progress animation
    this.startTime = performance.now();
    this.animate();
  }

  animate() {
    if (this.isFinished) return;

    const now = performance.now();
    const elapsed = now - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1.0);

    const bar = document.getElementById('splash-bar');
    const status = document.getElementById('splash-status');

    if (bar) {
      bar.style.width = `${(progress * 100).toFixed(1)}%`;
    }

    if (status) {
      if (progress < 0.3) {
        status.textContent = 'Initializing Optical Matrix...';
      } else if (progress < 0.65) {
        status.textContent = 'Calibrating CL Inventory & Waiting Queue...';
      } else if (progress < 0.9) {
        status.textContent = 'Synchronizing Drawer Registry...';
      } else {
        status.textContent = 'System Ready! Welcome to C.L.O.S.';
      }
    }

    if (progress < 1.0) {
      this.animFrame = requestAnimationFrame(() => this.animate());
    } else {
      setTimeout(() => this.finish(), 80);
    }
  }

  finish() {
    if (this.isFinished) return;
    this.isFinished = true;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);

    if (this.container) {
      this.container.classList.add('splash-hiding');
      setTimeout(() => {
        if (this.container) {
          this.container.style.display = 'none';
        }
        if (typeof this.onComplete === 'function') {
          this.onComplete();
        }
      }, 400);
    } else {
      if (typeof this.onComplete === 'function') {
        this.onComplete();
      }
    }
  }

  replay(onFinish) {
    if (this.container) {
      this.container.style.display = 'flex';
      this.container.classList.remove('splash-hiding');
    }
    this.onComplete = onFinish || (() => {});
    this.show();
  }
}
