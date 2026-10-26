/* ==========================================================================
   C.L.O.S. REAL-TIME CLOUD SYNCHRONIZATION ENGINE
   Pal Optical - Contact Lens Ordering System
   Multi-Computer Real-Time Sync between Front Desk & Doctor's Station
   ========================================================================== */

export class CloudSyncManager {
  constructor(options = {}) {
    this.core = options.core || null;
    this.storageKey = 'pal-clos-cloud-config';
    
    // Default cloud database endpoint (Firebase Realtime Database REST/SSE)
    this.defaultEndpoint = 'https://pal-clos-orders-default-rtdb.firebaseio.com/clos.json';
    this.cloudEndpoint = this.loadEndpoint();

    this.status = 'idle'; // 'connected' | 'syncing' | 'offline' | 'idle'
    this.lastSyncedAt = null;
    this.eventSource = null;
    this.reconnectTimer = null;
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    this.init();
  }

  loadEndpoint() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.endpoint) return parsed.endpoint.trim();
      }
    } catch (e) {}
    return this.defaultEndpoint;
  }

  saveEndpoint(url) {
    this.cloudEndpoint = (url || '').trim() || this.defaultEndpoint;
    localStorage.setItem(this.storageKey, JSON.stringify({
      endpoint: this.cloudEndpoint,
      updatedAt: new Date().toISOString()
    }));
    this.reconnect();
  }

  init() {
    // Listen for browser online / offline state
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.setStatus('syncing', 'Back online. Syncing cloud...');
        this.syncBothWays();
        this.startRealtimeStream();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.setStatus('offline', 'Offline (Local Cache Active)');
        this.stopRealtimeStream();
      });

      // Start real-time connection
      this.startRealtimeStream();

      // Fallback periodic poll every 15s to guarantee fresh state
      setInterval(() => {
        if (this.isOnline) {
          this.pullCloudData(true);
        }
      }, 15000);
    }
  }

  setStatus(status, label) {
    this.status = status;
    if (label) this.statusLabel = label;
    if (this.core && typeof this.core.updateSyncUI === 'function') {
      this.core.updateSyncUI(this.status, this.lastSyncedAt);
    }
  }

  // Real-time Push via Server-Sent Events (SSE)
  startRealtimeStream() {
    this.stopRealtimeStream();

    if (!this.cloudEndpoint || !this.isOnline) {
      this.setStatus('offline', 'Offline');
      return;
    }

    try {
      // Connect to Firebase Realtime Database stream
      this.eventSource = new EventSource(this.cloudEndpoint);

      this.eventSource.addEventListener('open', () => {
        this.setStatus('connected', 'Cloud Connected (Live)');
      });

      // Handle full initial state or complete overwrite from another station
      this.eventSource.addEventListener('put', (e) => {
        try {
          const res = JSON.parse(e.data);
          if (res && res.data) {
            this.handleIncomingCloudData(res.data);
          }
        } catch (err) {
          console.warn('Cloud SSE parse notice:', err);
        }
      });

      // Handle patch updates
      this.eventSource.addEventListener('patch', (e) => {
        try {
          const res = JSON.parse(e.data);
          if (res && res.data) {
            this.handleIncomingCloudData(res.data);
          }
        } catch (err) {
          console.warn('Cloud SSE patch parse notice:', err);
        }
      });

      this.eventSource.addEventListener('error', () => {
        // Fallback to polling if SSE is blocked or offline
        this.stopRealtimeStream();
        if (this.isOnline) {
          this.setStatus('idle', 'Cloud Standby');
          // Retry stream in 30 seconds
          this.reconnectTimer = setTimeout(() => this.startRealtimeStream(), 30000);
        } else {
          this.setStatus('offline', 'Offline (Local Cache Active)');
        }
      });
    } catch (e) {
      this.setStatus('idle', 'Cloud Standby');
    }
  }

  stopRealtimeStream() {
    if (this.eventSource) {
      try {
        this.eventSource.close();
      } catch (e) {}
      this.eventSource = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  reconnect() {
    this.stopRealtimeStream();
    this.startRealtimeStream();
    this.pullCloudData();
  }

  // Pull latest cloud state
  async pullCloudData(silent = false) {
    if (!this.isOnline || !this.cloudEndpoint) return;

    try {
      const res = await fetch(this.cloudEndpoint);
      if (res.ok) {
        const data = await res.json();
        if (data && (data.allOrders || data.rows)) {
          this.handleIncomingCloudData(data);
          this.lastSyncedAt = new Date().toLocaleTimeString();
          this.setStatus('connected', `Synced ${this.lastSyncedAt}`);
        }
      }
    } catch (e) {
      if (!silent) console.warn('Cloud fetch notice:', e);
    }
  }

  // Push local updates to Cloud
  async pushCloudData(payload) {
    if (!payload) return;

    // First save to local backup
    this.saveLocalBackup(payload);

    if (!this.isOnline || !this.cloudEndpoint) {
      this.setStatus('offline', 'Offline (Saved Locally)');
      return;
    }

    try {
      this.setStatus('syncing', 'Syncing to Cloud...');

      const bodyData = {
        batchDate: payload.batchDate || '',
        rows: payload.rows || [],
        allOrders: payload.allOrders || [],
        updatedAt: new Date().toISOString(),
        senderStation: window.closApp?.currentUser?.username || 'station'
      };

      // 1. Push to Cloud Database (Firebase / REST)
      const res = await fetch(this.cloudEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      // 2. Also push to local server backend if running on office LAN
      try {
        fetch('/api/contact-lens-orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData)
        }).catch(() => {});
      } catch (e) {}

      if (res.ok) {
        this.lastSyncedAt = new Date().toLocaleTimeString();
        this.setStatus('connected', `Synced ${this.lastSyncedAt}`);
      } else {
        this.setStatus('idle', 'Cloud Standby');
      }
    } catch (e) {
      this.setStatus('offline', 'Offline (Saved Locally)');
    }
  }

  handleIncomingCloudData(remoteData) {
    if (!remoteData || !this.core) return;
    this.core.handleRemoteSync(remoteData);
  }

  saveLocalBackup(payload) {
    try {
      if (payload.rows) {
        localStorage.setItem('pal-cl-daily-orders', JSON.stringify({
          batchDate: payload.batchDate,
          rows: payload.rows,
          updatedAt: new Date().toISOString()
        }));
      }
      if (payload.allOrders) {
        localStorage.setItem('pal-cl-master-database', JSON.stringify({
          orders: payload.allOrders,
          updatedAt: new Date().toISOString()
        }));
      }
    } catch (e) {}
  }

  async syncBothWays() {
    await this.pullCloudData();
    if (this.core) {
      this.core.notifyChange();
    }
  }

  // Test custom cloud URL
  async testConnection(url) {
    const target = (url || '').trim();
    if (!target) return { ok: false, error: 'URL cannot be empty' };

    try {
      const res = await fetch(target, { method: 'GET' });
      if (res.ok || res.status === 404) {
        return { ok: true, status: res.status };
      }
      return { ok: false, error: `Server returned HTTP ${res.status}` };
    } catch (err) {
      return { ok: false, error: err.message || 'Network connection failed' };
    }
  }
}
