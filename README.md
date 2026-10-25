# C.L.O.S. — Contact Lens Ordering System
### Pal Optical • Lexington, KY

A dedicated, full-featured application designed specifically for **Daily Contact Lens Orders** and the **CL Waiting to Pick Up** tracking workflow.

---

## 🌟 Key Features

1. **⚡ 1.5-Second Animated Splash Screen**:
   - Concentric optical rings simulating contact lens curvature & refraction.
   - Aperture dilation & laser light sweep with glowing Pal Optical insignia.
   - Precision 1.5-second initialization progress bar and status progression.
   - Replay anytime using the **✨ Intro** button in the header.

2. **🔐 Secure Login Portal**:
   - Glassmorphic medical station login window.
   - One-click role presets:
     - 👩‍💼 **Front Desk Staff** (`pal` / `pal`)
     - 🩺 **Dr. Robbins** (`doctor` / `pal`)
     - 🔬 **Optician Lab** (`optician` / `pal`)
   - Station "Remember Me" support and top-bar **Sign Out** button.

3. **📋 Contact Lens Daily Orders Pad (16 Rows)**:
   - Matches the physical 16-row landscape office pad.
   - Rapid patient intake toolbar with auto-formatting for phone numbers `(859) 000-0000` and DOB `MM/DD/YYYY`.
   - Pre-fill quantity chips (Qty X, Boxes, Boxes Each, Six Month Supply, Annual Supply).
   - Quick billing presets (Self Pay, Eyemed, VSP, Spectera, Versant, Premier Vision, Other).
   - Doctor memos and insurance allowance calculators.
   - 1-click **Send Batch to Doctor** for Rx processing.

4. **📦 CL Waiting to be Picked Up Sheet (50 Rows)**:
   - Exact 50-row landscape tracking sheet matching office drawer operations.
   - Live tracking of:
     - Patient name & notes
     - Phone numbers
     - Contact lens brand & OD/OS prescriptions
     - Amount due & payment status
     - Date received
     - Assigned drawer location
     - Date called timestamp
     - Pickup completion status
   - Quick filters: *All Waiting*, *Needs Call*, *In Drawer*, *Ready for Pickup*.

5. **🩺 Doctor's Rx Ordering Queue**:
   - Dedicated station for Dr. Robbins to review pending orders.
   - Full OD/OS Rx input modal (Base Curve, Diameter, Power, Cylinder, Axis, Add, Brand, Solution).
   - Automatically marks orders as ordered and routes them directly to the Waiting sheet.

6. **🗄️ Visual Drawer Inventory Rack**:
   - Real-time interactive map of office dispensing drawers (Drawers 1–12 + In-Transit).
   - 1-click **📞 Log Called Today** and **✅ Picked Up** buttons.

7. **🖨️ Precision Landscape Printing**:
   - Pixel-perfect print replicas for both the 16-Row Daily Pad and the 50-Row Waiting Sheet.
   - Options to print both **Completed Sheets** and **100% Blank Pads**.

8. **🔄 Multi-Computer LAN Sync & Data Safety**:
   - Cross-tab `BroadcastChannel` real-time sync.
   - Built-in LocalStorage automatic backup.
   - JSON database backup download & 1-click restore.
   - CSV export for Excel spreadsheets.
   - Node/Express LAN sync server (`server.js`) for front-desk <-> doctor multi-computer LAN sync.

---

## 🚀 How to Run

### Development Mode (Vite)
```bash
npm run dev
```
Opens in your browser at `http://localhost:5174` (or your local network address).

### Production Build & Preview
```bash
npm run build
npm run preview
```

### Multi-Computer LAN Sync Server
```bash
npm run server
```
Runs the Express sync backend on port `3001` so multiple office computers can share and synchronize data in real-time.

---

## 🔑 Default Credentials
- **Username**: `pal`
- **Password**: `pal`
*(Or click any of the 1-click role buttons on the login card)*
