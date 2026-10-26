/* ==========================================================================
   C.L.O.S. DRAWER RACK & QUICK PICKUP LOCATOR
   ========================================================================== */

export class DrawerRack {
  constructor(closCoreInstance, container) {
    this.core = closCoreInstance;
    this.container = container;
  }

  render() {
    if (!this.container) return;

    const waitingOrders = this.core.getWaitingOrders();

    // Group orders by drawer (Drawers 1 through 19)
    const drawerGroups = {};
    for (let i = 1; i <= 19; i++) {
      drawerGroups[String(i)] = [];
    }
    drawerGroups['Unassigned'] = [];

    waitingOrders.forEach(o => {
      const drawer = (o.drawer || '').trim();
      if (drawer && drawerGroups[drawer]) {
        drawerGroups[drawer].push(o);
      } else if (drawer) {
        if (!drawerGroups[drawer]) drawerGroups[drawer] = [];
        drawerGroups[drawer].push(o);
      } else {
        drawerGroups['Unassigned'].push(o);
      }
    });

    const totalWaiting = waitingOrders.length;
    const inDrawers = waitingOrders.filter(o => (o.drawer || '').trim()).length;

    let drawersHtml = '';
    const keys = Object.keys(drawerGroups);

    keys.forEach(key => {
      const items = drawerGroups[key];
      const hasItems = items.length > 0;

      let itemsHtml = '';
      if (hasItems) {
        itemsHtml = items.map(item => `
          <div class="clos-drawer-item">
            <div class="clos-drawer-patient-name">${item.patient || 'Unnamed Patient'}</div>
            <div class="clos-drawer-item-meta">
              <span>${item.brand || 'Contact Lenses'}</span>
              <span>📞 ${item.phone || 'No Phone'}</span>
            </div>
            <div class="clos-drawer-item-meta" style="margin-top: 2px;">
              <span>Rec'd: ${item.dateReceived || 'Pending'}</span>
              <span>Called: ${item.dateCalled || 'Not yet'}</span>
            </div>
            <div class="clos-drawer-item-meta" style="margin-top: 2px;">
              <span>Paid: <strong>${item.paid || '-'}</strong></span>
              <span>Amt: <strong>${item.amtDue || 'trials'}</strong></span>
            </div>
            <div class="clos-drawer-item-actions">
              <button type="button" class="clos-mini-btn btn-call" data-action="call" data-order-id="${item.id}" title="Log Called Today">
                📞 Log Called
              </button>
              <button type="button" class="clos-mini-btn btn-pickup" data-action="pickup" data-order-id="${item.id}" title="Staff Checkout">
                ✅ Picked Up
              </button>
            </div>
          </div>
        `).join('');
      } else {
        itemsHtml = `<div style="font-size: 0.78rem; color: #94a3b8; text-align: center; padding: 12px 0;">Empty Drawer</div>`;
      }

      drawersHtml += `
        <div class="clos-drawer-card ${hasItems ? 'has-items' : ''}">
          <div class="clos-drawer-top">
            <span class="clos-drawer-num">
              🗄️ ${key === 'Unassigned' ? 'In Transit / No Drawer' : `Drawer ${key}`}
            </span>
            <span class="clos-drawer-badge">${items.length} ${items.length === 1 ? 'Box' : 'Boxes'}</span>
          </div>
          <div class="clos-drawer-items">
            ${itemsHtml}
          </div>
        </div>
      `;
    });

    this.container.innerHTML = `
      <div class="clos-drawer-container">
        <div class="clos-drawer-header">
          <div>
            <h2 class="clos-drawer-title">
              🗄️ Contact Lens Drawer Inventory & Quick Locator (Drawers 1–19)
            </h2>
            <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #64748b;">
              Visual rack layout of Pal Optical dispensing Drawers 1 through 19. Total Waiting: <strong>${totalWaiting}</strong> (${inDrawers} assigned in drawers).
            </p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="clos-icon-btn" id="btn-back-to-sheet" style="background: #0284c7; color: #ffffff; border-color: #0284c7; padding: 8px 14px;">
              📋 View 50-Row Waiting Sheet
            </button>
          </div>
        </div>

        <div class="clos-drawer-grid">
          ${drawersHtml}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    if (!this.container) return;

    // Back to sheet
    const backBtn = this.container.querySelector('#btn-back-to-sheet');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.core.switchTab('pickup');
      });
    }

    // Call button (staff allowed - logs when they were called)
    this.container.querySelectorAll('[data-action="call"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const orderId = btn.getAttribute('data-order-id');
        const order = this.core.state.allOrders.find(o => o.id === orderId);
        if (order) {
          const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
          order.dateCalled = today;
          order.status = 'called';
          order.updatedAt = new Date().toISOString();
          this.core.notifyChange();
          this.render();
        }
      });
    });

    // Picked up button: Front desk can record date picked up & how they paid freely!
    this.container.querySelectorAll('[data-action="pickup"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const orderId = btn.getAttribute('data-order-id');
        this.core.openPickupRecordModal(orderId);
      });
    });
  }
}
