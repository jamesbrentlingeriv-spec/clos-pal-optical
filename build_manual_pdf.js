import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoBase64 = fs.readFileSync(path.join(__dirname, 'public', 'clos-logo.png')).toString('base64');
const logoSrc = `data:image/png;base64,${logoBase64}`;

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>C.L.O.S. Operations Manual - Pal Optical</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

    @page {
      size: letter portrait;
      margin: 0.6in 0.5in 0.6in 0.5in;
      @bottom-right {
        content: counter(page);
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
      line-height: 1.55;
      font-size: 9.5pt;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }

    h1, h2, h3, h4, h5 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #0f172a;
      font-weight: 800;
      line-height: 1.25;
      margin-top: 1.2em;
      margin-bottom: 0.4em;
    }

    h1 { font-size: 20pt; }
    h2 { 
      font-size: 14pt; 
      border-bottom: 2px solid #0284c7; 
      padding-bottom: 4px;
      margin-top: 1.5em;
      color: #0284c7;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    h3 { font-size: 11.5pt; color: #0f172a; margin-top: 1em; }
    h4 { font-size: 10pt; color: #334155; margin-top: 0.8em; }

    p {
      margin-top: 0;
      margin-bottom: 0.8em;
    }

    .page-break {
      page-break-before: always;
    }

    .avoid-break {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    /* COVER PAGE */
    .cover-page {
      height: 9.5in;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      padding: 40px 20px 20px 20px;
    }

    .cover-top {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .cover-logo {
      width: 170px;
      height: 170px;
      border-radius: 36px;
      box-shadow: 0 15px 35px rgba(2, 132, 199, 0.35);
      margin-bottom: 24px;
      border: 3px solid #38bdf8;
    }

    .cover-title {
      font-size: 32pt;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: #0284c7;
      margin: 0;
      text-shadow: 0 2px 10px rgba(2, 132, 199, 0.2);
    }

    .cover-subtitle {
      font-size: 15pt;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin: 6px 0 0 0;
    }

    .cover-tagline {
      font-size: 11pt;
      color: #64748b;
      margin-top: 8px;
      font-weight: 500;
    }

    .cover-badge-row {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-top: 25px;
    }

    .cover-badge {
      display: inline-block;
      padding: 6px 16px;
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      color: #0369a1;
      font-weight: 700;
      border-radius: 9999px;
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .cover-details-card {
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 16px;
      padding: 20px 30px;
      margin: 25px auto;
      max-width: 520px;
      text-align: left;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    }

    .cover-details-card table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5pt;
    }

    .cover-details-card td {
      padding: 6px 8px;
    }

    .cover-details-card td.lbl {
      color: #64748b;
      font-weight: 600;
      width: 38%;
    }

    .cover-details-card td.val {
      color: #0f172a;
      font-weight: 700;
    }

    .cover-footer {
      border-top: 2px solid #e2e8f0;
      padding-top: 15px;
      font-size: 8.5pt;
      color: #64748b;
      line-height: 1.4;
    }

    /* CALLOUT BOXES */
    .callout {
      border-radius: 10px;
      padding: 12px 16px;
      margin: 12px 0;
      font-size: 9pt;
      display: flex;
      gap: 12px;
      align-items: flex-start;
      page-break-inside: avoid;
    }

    .callout-icon {
      font-size: 15pt;
      line-height: 1;
      flex-shrink: 0;
    }

    .callout-content {
      flex: 1;
    }

    .callout-content strong {
      display: block;
      margin-bottom: 3px;
      font-size: 9.5pt;
    }

    .callout-blue {
      background: #f0f9ff;
      border-left: 4px solid #0284c7;
      color: #0c4a6e;
    }

    .callout-green {
      background: #f0fdf4;
      border-left: 4px solid #16a34a;
      color: #14532d;
    }

    .callout-amber {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      color: #78350f;
    }

    .callout-red {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
      color: #7f1d1d;
    }

    .callout-purple {
      background: #faf5ff;
      border-left: 4px solid #9333ea;
      color: #581c87;
    }

    /* BADGES & PILLS */
    .pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 8pt;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }

    .pill-blue { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    .pill-green { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .pill-amber { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
    .pill-red { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }
    .pill-dark { background: #0f172a; color: #ffffff; }

    /* TABLES */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 8.8pt;
      page-break-inside: avoid;
    }

    table.data-table th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      text-align: left;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      font-size: 8.5pt;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    table.data-table td {
      padding: 7px 10px;
      border: 1px solid #e2e8f0;
      vertical-align: top;
      color: #334155;
    }

    table.data-table tr:nth-child(even) td {
      background: #f8fafc;
    }

    /* STEP BOXES */
    .step-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 18px;
      margin: 12px 0;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
      page-break-inside: avoid;
    }

    .step-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .step-num {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #0284c7;
      color: #ffffff;
      font-weight: 800;
      font-size: 9.5pt;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .step-title {
      font-size: 10.5pt;
      font-weight: 800;
      color: #0f172a;
    }

    .step-desc {
      font-size: 9pt;
      color: #475569;
      line-height: 1.5;
      margin: 0;
    }

    /* UI MOCKUP WIREFRAME */
    .ui-mockup {
      background: #0f172a;
      color: #f8fafc;
      border-radius: 10px;
      padding: 12px 16px;
      margin: 14px 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      line-height: 1.4;
      border: 1px solid #334155;
      page-break-inside: avoid;
    }

    .ui-mockup-header {
      border-bottom: 1px solid #334155;
      padding-bottom: 6px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      color: #38bdf8;
      font-weight: 700;
    }

    /* TOC */
    .toc-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }

    .toc-table td {
      padding: 7px 4px;
      border-bottom: 1px dashed #cbd5e1;
    }

    .toc-table td.toc-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 9.5pt;
    }

    .toc-table td.toc-title span {
      color: #64748b;
      font-weight: 500;
      font-size: 8.5pt;
      display: block;
    }

    .toc-table td.toc-page {
      text-align: right;
      font-weight: 700;
      color: #0284c7;
      font-family: 'JetBrains Mono', monospace;
      width: 60px;
    }

    .cheat-sheet-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin: 12px 0;
      page-break-inside: avoid;
    }

    .cheat-box {
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      padding: 12px 14px;
      background: #f8fafc;
    }

    .cheat-box h4 {
      margin-top: 0;
      margin-bottom: 6px;
      color: #0284c7;
      font-size: 10pt;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }

    .cheat-box ul {
      margin: 0;
      padding-left: 18px;
      font-size: 8.5pt;
      color: #334155;
    }

    .cheat-box li {
      margin-bottom: 4px;
    }
  </style>
</head>
<body>

  <!-- ==================================================================== -->
  <!-- COVER PAGE                                                           -->
  <!-- ==================================================================== -->
  <div class="cover-page">
    <div class="cover-top">
      <img src="${logoSrc}" class="cover-logo" alt="C.L.O.S. Logo">
      <h1 class="cover-title">C.L.O.S.</h1>
      <div class="cover-subtitle">Contact Lens Ordering System</div>
      <div class="cover-tagline">Standard Operating Procedures & Complete Staff Training Manual</div>
      
      <div class="cover-badge-row">
        <span class="cover-badge">Pal Optical • Lexington, KY</span>
        <span class="cover-badge">Version 1.0 (2026)</span>
        <span class="cover-badge">Layman & Staff Edition</span>
      </div>

      <div class="cover-details-card">
        <table>
          <tr>
            <td class="lbl">Software System:</td>
            <td class="val">Contact Lens Ordering System (C.L.O.S.)</td>
          </tr>
          <tr>
            <td class="lbl">Organization:</td>
            <td class="val">Pal Optical Co.</td>
          </tr>
          <tr>
            <td class="lbl">Principal Author:</td>
            <td class="val">James Brentlinger, A.B.O.C., N.C.L.E.C.</td>
          </tr>
          <tr>
            <td class="lbl">Clinical Oversight:</td>
            <td class="val">Dr. Robbins, Optometrist</td>
          </tr>
          <tr>
            <td class="lbl">Target Audience:</td>
            <td class="val">Front Desk Reception, Opticians, Doctor Station</td>
          </tr>
          <tr>
            <td class="lbl">Access URL:</td>
            <td class="val">https://clordersystem.vercel.app/</td>
          </tr>
        </table>
      </div>
    </div>

    <div class="cover-footer">
      <strong>Pal Optical Proprietary Internal Documentation</strong><br>
      This manual provides clear, illustrated, step-by-step guidance for managing daily contact lens intake, doctor prescription entry, 50-row waiting tracking, drawer dispensing, and staff security authorization.
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================================================================== -->
  <!-- TABLE OF CONTENTS & QUICK START                                      -->
  <!-- ==================================================================== -->
  <h2>📑 Table of Contents</h2>

  <table class="toc-table">
    <tr>
      <td class="toc-title">
        1. Welcome to C.L.O.S. & System Overview
        <span>Purpose, core philosophy, and high-speed workflow benefits.</span>
      </td>
      <td class="toc-page">Ch. 1</td>
    </tr>
    <tr>
      <td class="toc-title">
        2. Starting the Program & Login Portal
        <span>1-click desktop launch, role presets, and the 1.5-second animated splash screen.</span>
      </td>
      <td class="toc-page">Ch. 2</td>
    </tr>
    <tr>
      <td class="toc-title">
        3. Daily Orders Pad (16-Row Landscape Form)
        <span>Rapid patient intake, quantity chips, billing tags, allowance calculator & sending batches.</span>
      </td>
      <td class="toc-page">Ch. 3</td>
    </tr>
    <tr>
      <td class="toc-title">
        4. Doctor's Ordering Station & Rx Queue
        <span>Dr. Robbins' Rx station, OD/OS inputs, brand presets, and routing to Waiting sheet.</span>
      </td>
      <td class="toc-page">Ch. 4</td>
    </tr>
    <tr>
      <td class="toc-title">
        5. The 50-Row Waiting to be Picked Up Sheet & Security Rules
        <span>What front desk staff can edit freely vs. when the Doctor Password is required.</span>
      </td>
      <td class="toc-page">Ch. 5</td>
    </tr>
    <tr>
      <td class="toc-title">
        6. Patient Pickup & Checkout Workflow
        <span>Step-by-step patient handoff: recording pickup date and payment method.</span>
      </td>
      <td class="toc-page">Ch. 6</td>
    </tr>
    <tr>
      <td class="toc-title">
        7. Visual Dispensing Drawer Rack (Drawers 1–12)
        <span>Locating contacts in office drawers instantly and 1-click checkout.</span>
      </td>
      <td class="toc-page">Ch. 7</td>
    </tr>
    <tr>
      <td class="toc-title">
        8. Search Past Order History
        <span>Finding past patients, looking up old prescriptions, and status filters.</span>
      </td>
      <td class="toc-page">Ch. 8</td>
    </tr>
    <tr>
      <td class="toc-title">
        9. Precision Printing (Daily Pad & Waiting Sheet)
        <span>Printing completed sheets and 100% blank office pad replicas.</span>
      </td>
      <td class="toc-page">Ch. 9</td>
    </tr>
    <tr>
      <td class="toc-title">
        10. Multi-Computer Sync, Backups & Troubleshooting
        <span>Office LAN sync, downloading JSON backups, Excel CSV export, and FAQ.</span>
      </td>
      <td class="toc-page">Ch. 10</td>
    </tr>
    <tr>
      <td class="toc-title">
        ⭐ Appendix: Front Desk "Laminated Cheat Sheet"
        <span>Single-page desk summary for instant daily reference.</span>
      </td>
      <td class="toc-page">App.</td>
    </tr>
  </table>

  <div class="callout callout-blue">
    <div class="callout-icon">💡</div>
    <div class="callout-content">
      <strong>The 30-Second Rule for Reception Staff</strong>
      Taking a patient's contact lens order takes only 3 clicks: type their name, click their box quantity, click their insurance, and click <strong>+ Add to Pad</strong>. The system automatically formats their phone number and birthdate.
    </div>
  </div>

  <div class="callout callout-green">
    <div class="callout-icon">🔒</div>
    <div class="callout-content">
      <strong>Role Permissions & Security Summary</strong>
      Front desk staff can ALWAYS freely update: <strong>(1) Date received from distributor (📅)</strong>, <strong>(2) Drawer number (1–12)</strong>, <strong>(3) Date called / voicemail (📞/LVM)</strong>, <strong>(4) Date picked up (✓ Done)</strong>, and <strong>(5) How they paid (Pd?)</strong> without needing any password! Only modifying clinical prescriptions, patient names, box quantities, or deleting orders strictly requires the Doctor's Password (<span class="pill pill-dark">eye_doctor</span>). Front desk login password is <span class="pill pill-dark">berry</span>.
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================================================================== -->
  <!-- CHAPTER 1: WELCOME & SYSTEM OVERVIEW                                 -->
  <!-- ==================================================================== -->
  <h2>Chapter 1: Welcome to C.L.O.S. & System Overview</h2>

  <p>The <strong>Contact Lens Ordering System (C.L.O.S.)</strong> was engineered specifically for <strong>Pal Optical</strong> to replace messy physical paper tracking with a lightning-fast, multi-computer digital system that exactly mirrors our real-world office paperwork.</p>

  <h3>Why C.L.O.S. Exists</h3>
  <p>In our optical practice, contact lens orders move through three distinct phases across multiple staff members:</p>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">1</div>
      <div class="step-title">Phase 1: Front Desk Intake (The 16-Row Daily Pad)</div>
    </div>
    <p class="step-desc">
      When patients call or visit to order contacts, the front desk collects their name, birthdate, phone number, box quantities, and insurance allowance notes. These accumulate throughout the day on the 16-row pad.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">2</div>
      <div class="step-title">Phase 2: Doctor Prescription & Ordering (The Doctor Queue)</div>
    </div>
    <p class="step-desc">
      Dr. Robbins reviews the orders on her computer, enters the verified contact lens prescription (OD/OS power, cylinder, axis, base curve, diameter, and brand), places the order with the supplier, and sends the order forward.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">3</div>
      <div class="step-title">Phase 3: Package Arrival & Patient Pickup (The 50-Row Waiting Sheet)</div>
    </div>
    <p class="step-desc">
      When boxes arrive from distributors, they are checked in, placed in numbered drawers (1–12), and patients are called. When the patient arrives, the front desk checks them out, records how they paid, and logs the pickup date.
    </p>
  </div>

  <h3>Key Benefits Over Old Paper Sheets</h3>
  <ul>
    <li><strong>Zero Lost Orders:</strong> Everything is stored safely in the database and saved automatically every second.</li>
    <li><strong>Multi-Computer Synchronization:</strong> Front desk computers and Dr. Robbins' station communicate seamlessly across the office local network in real-time.</li>
    <li><strong>Exact Paper Replicas:</strong> If you ever need physical paper, the Print button creates an exact 1-to-1 landscape replica of our original 16-row order pad and 50-row tracking sheet.</li>
    <li><strong>Instant Search:</strong> Find any patient by name, phone number, brand, or drawer number in under 1 second.</li>
  </ul>

  <div class="page-break"></div>

  <!-- ==================================================================== -->
  <!-- CHAPTER 2: STARTING & LOGIN PORTAL                                   -->
  <!-- ==================================================================== -->
  <h2>Chapter 2: Starting the Program & Login Portal</h2>

  <h3>How to Launch C.L.O.S.</h3>
  <p>Starting C.L.O.S. in the morning takes just one double-click:</p>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">⚡</div>
      <div class="step-title">Option A: The 1-Click Desktop Launcher</div>
    </div>
    <p class="step-desc">
      Double-click the file named <strong>Start C.L.O.S..bat</strong> on your computer. It starts the local server and automatically pops open the software in your web browser.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">🌐</div>
      <div class="step-title">Option B: Official Cloud Web Access</div>
    </div>
    <p class="step-desc">
      Open Chrome, Edge, Safari, or Firefox and go to the official application address:<br>
      <strong style="color: #0284c7; font-size: 1.05rem;"><a href="https://clordersystem.vercel.app/" style="color: #0284c7; text-decoration: underline;">https://clordersystem.vercel.app/</a></strong><br>
      This is the exclusive, secure cloud URL configured for Pal Optical. Any computer, iPad, or tablet with internet access can use C.L.O.S. through this link.
    </p>
  </div>

  <h3>The 1.5-Second Animated Splash Screen</h3>
  <p>Whenever C.L.O.S. starts up, an eye-catching 1.5-second animation plays on the screen:</p>
  <ul>
    <li>Features the custom <strong>C.L.O.S.</strong> optical logo with pupil aperture rotation and cyan laser sweeps.</li>
    <li>Displays James Brentlinger's credentials (A.B.O.C., N.C.L.E.C.) and Pal Optical branding.</li>
    <li>Smoothly counts from 0% to 100% in exactly 1.5 seconds while connecting to the database.</li>
    <li><strong>Skip Button:</strong> You can click "Skip ⚡" at the bottom right to jump straight to the app immediately.</li>
    <li><strong>Intro Replay:</strong> You can replay this animation anytime by clicking the <strong>✨ Intro</strong> button in the top header.</li>
  </ul>

  <h3>Signing In with Station Role Presets</h3>
  <p>The login window offers convenient 1-click role buttons designed for busy staff:</p>

  <table class="data-table">
    <thead>
      <tr>
        <th>Role Preset</th>
        <th>Username</th>
        <th>Password</th>
        <th>Intended Station & Permissions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>👩‍💼 Front Desk</strong></td>
        <td><code>pal</code> (or <code>frontdesk</code>)</td>
        <td><strong style="color: #047857;"><code>berry</code></strong></td>
        <td>Front reception desk. Can enter daily orders, log packages received, assign drawers, log phone calls, complete patient pickups, and update payment status freely.</td>
      </tr>
      <tr>
        <td><strong>🩺 Dr. Robbins</strong></td>
        <td><code>doctor</code></td>
        <td><strong style="color: #b91c1c;"><code>eye_doctor</code></strong></td>
        <td>Dr. Robbins' examination room. Full clinical authority to write prescriptions, edit patient & Rx parameters, and delete records.</td>
      </tr>
      <tr>
        <td><strong>🔬 Optician Lab</strong></td>
        <td><code>optician</code></td>
        <td><strong style="color: #047857;"><code>berry</code></strong></td>
        <td>Optical lab and dispensing area. Access to order history, drawer management, and patient checkout.</td>
      </tr>
    </tbody>
  </table>

  <div class="callout callout-blue">
    <div class="callout-icon">💡</div>
    <div class="callout-content">
      <strong>"Keep Station Signed In" Checkbox:</strong>
      Leave this box checked so your computer stays signed in throughout the business day, even if you close and reopen the browser.
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================================================================== -->
  <!-- CHAPTER 3: DAILY ORDERS PAD                                          -->
  <!-- ==================================================================== -->
  <h2>Chapter 3: Daily Contact Lens Orders Pad (16 Rows)</h2>

  <p>The <strong>Daily Orders Pad</strong> tab (📋) is where front desk staff record incoming contact lens orders throughout the day. It matches the physical 16-row paper pad used at Pal Optical.</p>

  <h3>How to Add a Patient in 15 Seconds (Quick-Add Bar)</h3>
  <p>Instead of manually typing into small table cells, use the <strong>Quick Add Patient Order</strong> dock at the top of the screen:</p>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">1</div>
      <div class="step-title">Enter Patient Information</div>
    </div>
    <p class="step-desc">
      Type the patient's name into <strong>Patient Name</strong>. Enter their birthdate into <strong>DOB</strong> (the system automatically formats slashes like <code>04/15/1985</code>). Type their phone number into <strong>Phone</strong> (automatically formats as <code>(859) 555-0199</code>).
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">2</div>
      <div class="step-title">Click Quantity Pre-Fill Chips</div>
    </div>
    <p class="step-desc">
      Click one of the pre-set box chips to instantly fill the quantity field:
      <span class="pill pill-blue">1 Box</span>
      <span class="pill pill-blue">1 Box Each</span>
      <span class="pill pill-blue">Six Month Supply</span>
      <span class="pill pill-blue">Annual Supply</span>.
      You can also change the number spinner (e.g. <code>2</code>) and click "2 Boxes Each".
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">3</div>
      <div class="step-title">Select Billing / Insurance Type</div>
    </div>
    <p class="step-desc">
      Click the patient's insurance or billing method:
      <span class="pill pill-dark">Self Pay</span>
      <span class="pill pill-dark">Eyemed</span>
      <span class="pill pill-dark">VSP</span>
      <span class="pill pill-dark">Spectera</span>
      <span class="pill pill-dark">Versant</span>
      <span class="pill pill-dark">Premier Vision</span>.
      It immediately appends the billing label to the instructions column.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">4</div>
      <div class="step-title">Special Instructions & Insurance Allowance Calculator</div>
    </div>
    <p class="step-desc">
      Check the box <strong>"Add Special Instructions / Allowance Details for Doctor"</strong> to open quick allowance presets:
      <em>"Only $50 allowance left from original $250"</em> or <em>"Dr. Robbins trial fit only"</em>. You can also type custom dollar amounts.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">5</div>
      <div class="step-title">Click "+ Add to Pad"</div>
    </div>
    <p class="step-desc">
      Click the blue <strong>+ Add to Pad</strong> button. The patient is instantly placed into the next empty row on the 16-row pad, and your inputs clear ready for the next patient.
    </p>
  </div>

  <h3>Individual Row Actions</h3>
  <p>Each row on the daily pad has helpful action buttons in the rightmost column (omitted during printing):</p>
  <ul>
    <li><strong>🗑️ Clear Row:</strong> Erases that specific row with one click. If the row was already sent to the Doctor's Queue, C.L.O.S. will ask if you also want to remove it from the doctor's station.</li>
    <li><strong>✏️ Edit Order:</strong> If the row has been processed, clicking the pencil lets you view and edit full order details.</li>
    <li><strong>Direct Cell Typing:</strong> You can also click directly into any cell on the 16 rows and type directly, just like on paper.</li>
  </ul>

  <h3>Sending Orders to Dr. Robbins</h3>
  <p>When you have entered orders and are ready for Dr. Robbins to write the prescription and place the order with distributors, click the green button:</p>
  <div style="text-align: center; margin: 10px 0;">
    <span class="pill pill-green" style="font-size: 10pt; padding: 6px 16px;">🩺 Send Batch to Doctor (X Orders)</span>
  </div>
  <p>All filled rows are instantly transmitted across the office network to Dr. Robbins' screen.</p>

  <div class="page-break"></div>

  <!-- ==================================================================== -->
  <!-- CHAPTER 4: DOCTOR'S ORDERING QUEUE                                   -->
  <!-- ==================================================================== -->
  <h2>Chapter 4: Doctor's Ordering Station & Rx Queue</h2>

  <p>The <strong>Doctor's Ordering Queue</strong> tab (🩺) is Dr. Robbins' command center. When the front desk enters orders, they appear here organized as individual cards awaiting clinical review and supplier ordering.</p>

  <h3>Step-by-Step: How Dr. Robbins Orders Contacts</h3>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">1</div>
      <div class="step-title">Review the Order Card</div>
    </div>
    <p class="step-desc">
      Each card displays the patient's name, birthdate, phone number, box quantities requested, and any front-desk insurance allowance notes (e.g. <em>"VSP: Only $130 allowance left"</em>).
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">2</div>
      <div class="step-title">Click "Order Contacts & Enter Rx"</div>
    </div>
    <p class="step-desc">
      Clicking the blue button opens the <strong>Doctor Prescription & Order Entry Modal</strong>.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">3</div>
      <div class="step-title">Select or Type the Contact Lens Brand</div>
    </div>
    <p class="step-desc">
      Click any quick-brand chip to fill the brand instantly:
      <span class="pill pill-blue">Biofinity Multifocals (trials)</span>
      <span class="pill pill-blue">Air Optix Astig</span>
      <span class="pill pill-blue">Oasys Multi</span>
      <span class="pill pill-blue">Ultra Astig</span>
      <span class="pill pill-blue">Acuvue 2</span>
      <span class="pill pill-blue">Dailies Total 1</span>, or type any custom brand name.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">4</div>
      <div class="step-title">Enter Right (OD) & Left (OS) Prescriptions</div>
    </div>
    <p class="step-desc">
      Type the Sphere, Cylinder, Axis, Add, or Base Curve into the <strong>Rx (Right)</strong> and <strong>Rx (Left)</strong> fields.
      <br><strong>Time-Saver Tip:</strong> If both eyes share the same prescription, click the <strong>⇄ Copy Right Eye to Left Eye</strong> button to duplicate the parameters in one click.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">5</div>
      <div class="step-title">Add Dispensing / Fitting Notes</div>
    </div>
    <p class="step-desc">
      Select quick doctor notes that print directly under the patient's name on office sheets:
      <span class="pill pill-dark">"CAN TAKE AND TRY"</span>
      <span class="pill pill-dark">*NEEDS FITTING. WILL OWE $50*</span>
      <span class="pill pill-dark">DONT CALL</span>
      <span class="pill pill-dark">*FIT SCHEDULED*</span>.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">6</div>
      <div class="step-title">Set Amount Due & Paid Status</div>
    </div>
    <p class="step-desc">
      Click <span class="pill pill-amber">trials</span> (for complimentary diagnostic pairs) or click pre-set amounts like <span class="pill pill-blue">$130.00</span> or <span class="pill pill-blue">$220.00</span>.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">7</div>
      <div class="step-title">Click "✅ Mark as Ordered & Send to Waiting Sheet"</div>
    </div>
    <p class="step-desc">
      Clicking the green button submits the order. The system marks it as ordered with today's timestamp, removes it from the doctor's pending queue, and <strong>automatically adds the patient to the 50-row Waiting to be Picked Up Sheet</strong>.
    </p>
  </div>

  <div class="page-break"></div>

  <!-- ==================================================================== -->
  <!-- CHAPTER 5: WAITING SHEET & SECURITY RULES                            -->
  <!-- ==================================================================== -->
  <h2>Chapter 5: The 50-Row Waiting Sheet & Security Rules</h2>

  <p>The <strong>Waiting to be Picked Up</strong> tab (📦) displays the master 50-row landscape tracking sheet matching the physical clipboard and drawer tracking system at Pal Optical.</p>

  <h3>Columns on the 50-Row Sheet</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th>Col #</th>
        <th>Column Name</th>
        <th>Purpose & Description</th>
        <th>Security Permission</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td><strong>Date Ordered</strong></td>
        <td>Date Dr. Robbins ordered the lenses with supplier.</td>
        <td><span class="pill pill-red">🔒 Doctor Only</span></td>
      </tr>
      <tr>
        <td>2</td>
        <td><strong>Patient Name & Notes</strong></td>
        <td>Full patient name and doctor dispensing notes.</td>
        <td><span class="pill pill-red">🔒 Doctor Only</span></td>
      </tr>
      <tr>
        <td>3</td>
        <td><strong>Phone Number</strong></td>
        <td>Primary contact phone for arrival notification.</td>
        <td><span class="pill pill-red">🔒 Doctor Only</span></td>
      </tr>
      <tr>
        <td>4</td>
        <td><strong>CL Brand</strong></td>
        <td>Brand, lens type, and trial status.</td>
        <td><span class="pill pill-red">🔒 Doctor Only</span></td>
      </tr>
      <tr>
        <td>5–8</td>
        <td><strong>Rx OD / OS & Qty</strong></td>
        <td>Prescription parameters for Right and Left eyes.</td>
        <td><span class="pill pill-red">🔒 Doctor Only</span></td>
      </tr>
      <tr>
        <td>9</td>
        <td><strong>Amt Due</strong></td>
        <td>Amount patient owes at pickup (e.g. $130, trials).</td>
        <td><span class="pill pill-red">🔒 Doctor Only</span></td>
      </tr>
      <tr>
        <td>10</td>
        <td><strong>Pd? (How Paid)</strong></td>
        <td>Payment status or method (Paid, Cash, Card, VSP).</td>
        <td><span class="pill pill-green">🟢 Staff Unlocked</span></td>
      </tr>
      <tr>
        <td>11</td>
        <td><strong>Date Received</strong></td>
        <td>Date distributor delivered package to office (type date or click 📅).</td>
        <td><span class="pill pill-green">🟢 Staff Unlocked</span></td>
      </tr>
      <tr>
        <td>12</td>
        <td><strong>Drawer #</strong></td>
        <td>Dispensing drawer number (Drawers 1–12; type drawer number anytime).</td>
        <td><span class="pill pill-green">🟢 Staff Unlocked</span></td>
      </tr>
      <tr>
        <td>13</td>
        <td><strong>Date Called</strong></td>
        <td>Date staff called patient or left voicemail (type date or click 📞/LVM).</td>
        <td><span class="pill pill-green">🟢 Staff Unlocked</span></td>
      </tr>
      <tr>
        <td>14</td>
        <td><strong>Actions / Pickup</strong></td>
        <td>Checkout button (<code>✓ Done</code>), Edit (<code>✏️</code>), Delete (<code>🗑️</code>).</td>
        <td><span class="pill pill-green">🟢 Pickup Unlocked</span></td>
      </tr>
    </tbody>
  </table>

  <h3>The Doctor Security Rule</h3>
  <p>To protect clinical accuracy and medical prescriptions, C.L.O.S. enforces a strict separation of permissions:</p>

  <div class="callout callout-green">
    <div class="callout-icon">🟢</div>
    <div class="callout-content">
      <strong>1. WHAT FRONT DESK STAFF CAN DO FREELY (STAFF UNLOCKED — NO PASSWORD):</strong>
      <br>• <strong>Date Received:</strong> Type package delivery date into the <strong>Date Received</strong> cell or click <strong>📅</strong> to stamp today's date when shipments arrive.
      <br>• <strong>Drawer Number:</strong> Type or update the dispensing drawer number in the <strong>Drawer #</strong> column anytime to organize physical lenses.
      <br>• <strong>Date Called:</strong> Click <strong>📞 Call</strong> (sets today's date), click <strong>LVM</strong> (sets left voicemail), or type directly into <strong>Date Called</strong>.
      <br>• <strong>Date Picked Up:</strong> Click <strong>✓ Done</strong> on the sheet or <strong>✅ Picked Up</strong> in the drawer rack to complete patient checkout and record pickup date.
      <br>• <strong>How They Paid:</strong> Type directly into the <strong>Pd?</strong> column or select payment method during checkout (e.g. Paid, Cash, Card, Check, VSP).
    </div>
  </div>

  <div class="callout callout-red">
    <div class="callout-icon">🔒</div>
    <div class="callout-content">
      <strong>2. WHAT REQUIRES THE DOCTOR'S PASSWORD (<code>eye_doctor</code>):</strong>
      <br>• <strong>Clinical Prescriptions & Patient Information:</strong> Clicking <strong>✏️ Edit Order</strong> to modify patient name, phone, DOB, contact lens brand, Right (OD) Rx, Left (OS) Rx, box quantities, or amount due.
      <br>• <strong>Order Deletion:</strong> Clicking <strong>🗑️ Delete Order</strong> to permanently remove an order from the database.
      <br>• <strong>Clear Waiting Sheet:</strong> Clicking <strong>Clear All Orders</strong> to empty the 50-row sheet.
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================================================================== -->
  <!-- CHAPTER 6: PATIENT PICKUP WORKFLOW                                   -->
  <!-- ==================================================================== -->
  <h2>Chapter 6: Patient Pickup & Checkout Workflow</h2>

  <p>When a patient walks into Pal Optical to pick up their contact lenses, any front desk staff member can complete their checkout in under 10 seconds without needing any password.</p>

  <h3>Step-by-Step Checkout Guide for Front Desk</h3>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">1</div>
      <div class="step-title">Find the Patient on the 50-Row Sheet or Drawer Rack</div>
    </div>
    <p class="step-desc">
      Scan down the <strong>Waiting to be Picked Up</strong> sheet or open the <strong>🗄️ Drawer Rack</strong>. Check the <strong>Drawer #</strong> column to know which drawer their lenses are sitting in.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">2</div>
      <div class="step-title">Click the "✓ Done" Button</div>
    </div>
    <p class="step-desc">
      Click the green <strong>✓ Done</strong> button on their row (or click <strong>✅ Picked Up</strong> inside the Drawer Rack). The <strong>Patient Contact Pickup Modal</strong> will instantly appear on your screen.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">3</div>
      <div class="step-title">Confirm Date Picked Up</div>
    </div>
    <p class="step-desc">
      The <strong>Date Patient Picked Up</strong> field automatically fills with today's date (e.g. <code>10/25/2026</code>). If the patient picked up yesterday, you can change this date.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">4</div>
      <div class="step-title">Confirm How They Paid</div>
    </div>
    <p class="step-desc">
      The modal shows the patient's payment status. Click one of the quick payment chips:
      <span class="pill pill-blue">Paid</span>
      <span class="pill pill-blue">Cash</span>
      <span class="pill pill-blue">Card</span>
      <span class="pill pill-blue">Check</span>
      <span class="pill pill-blue">VSP</span>
      <span class="pill pill-blue">Eyemed</span>
      <span class="pill pill-blue">Self Pay</span>.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">5</div>
      <div class="step-title">Click "✅ Confirm Pickup & Archive"</div>
    </div>
    <p class="step-desc">
      Clicking the green confirmation button completes the checkout:
      <br>• The patient is removed from the active 50-row Waiting Sheet.
      <br>• Their drawer is marked empty and ready for the next patient.
      <br>• The order is permanently archived in <strong>Search Past Order History</strong> for future reference.
    </p>
  </div>

  <h3>Practical Office Scenarios</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th>Scenario</th>
        <th>What Staff Does</th>
        <th>Password Required?</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Patient pays $130 cash at front desk</strong></td>
        <td>Click <code>✓ Done</code>, click <code>Cash</code>, and click <code>Confirm Pickup</code>.</td>
        <td><span class="pill pill-green">NO (Unlocked)</span></td>
      </tr>
      <tr>
        <td><strong>Patient wants to know if their order arrived</strong></td>
        <td>Check the <code>Date Received</code> and <code>Drawer #</code> columns on the 50-row sheet.</td>
        <td><span class="pill pill-green">NO (View Only)</span></td>
      </tr>
      <tr>
        <td><strong>Patient claims phone number is wrong</strong></td>
        <td>Click <code>✏️ Edit</code>, enter Doctor's Password (<code>eye_doctor</code>), and update phone.</td>
        <td><span class="pill pill-red">YES (Doctor Pass)</span></td>
      </tr>
      <tr>
        <td><strong>Doctor cancelled order; need to delete</strong></td>
        <td>Click <code>🗑️ Delete</code>, enter Doctor's Password (<code>eye_doctor</code>), and confirm deletion.</td>
        <td><span class="pill pill-red">YES (Doctor Pass)</span></td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- ==================================================================== -->
  <!-- CHAPTER 7: VISUAL DRAWER RACK                                        -->
  <!-- ==================================================================== -->
  <h2>Chapter 7: Visual Dispensing Drawer Rack (Drawers 1–12)</h2>

  <p>The <strong>🗄️ Drawer Rack</strong> provides a live visual map of Pal Optical's physical contact lens storage drawers. To open it, click the <strong>🗄️ Drawer Rack</strong> button on the top executive header.</p>

  <h3>How the Drawer Rack Works</h3>
  <ul>
    <li><strong>12 Numbered Drawer Cards:</strong> Corresponds to physical Drawers 1 through 12 in the dispensary.</li>
    <li><strong>In Transit / No Drawer Card:</strong> Shows packages that Dr. Robbins ordered but have not yet been assigned to a physical drawer.</li>
    <li><strong>Patient Cards Inside Drawers:</strong> Each drawer card displays the patient's name, brand, phone number, arrival date, and call status.</li>
    <li><strong>Live Badge Count:</strong> Displays how many boxes or patient packages are currently inside each drawer (e.g. <code>2 Boxes</code>). Drawers with packages light up in sky blue.</li>
  </ul>

  <h3>1-Click Drawer Actions</h3>
  <div class="step-card">
    <div class="step-header">
      <div class="step-num">✓</div>
      <div class="step-title">1-Click "✅ Picked Up" Checkout</div>
    </div>
    <p class="step-desc">
      When a patient arrives, you don't even need to switch back to the table. Click the green <strong>✅ Picked Up</strong> button directly inside their drawer card to open the checkout modal and dispense their lenses immediately.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">📞</div>
      <div class="step-title">"📞 Log Called" (Staff Allowed)</div>
    </div>
    <p class="step-desc">
      Clicking <strong>📞 Log Called</strong> records today's date in the phone call log instantly without needing a password.
    </p>
  </div>

  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

  <!-- ==================================================================== -->
  <!-- CHAPTER 8: SEARCH PAST ORDER HISTORY                                 -->
  <!-- ==================================================================== -->
  <h2>Chapter 8: Search Past Order History</h2>

  <p>The <strong>Search Past Order History</strong> tab (🔍) allows you to search across every contact lens order ever entered into C.L.O.S., including active and completed pickups.</p>

  <h3>How to Search for Past Orders</h3>
  <div class="step-card">
    <div class="step-header">
      <div class="step-num">🔍</div>
      <div class="step-title">Type in the Multi-Field Search Bar</div>
    </div>
    <p class="step-desc">
      Type any part of a patient's name, phone number, date of birth, contact lens brand, or drawer number into the search box. Results filter in real-time as you type.
    </p>
  </div>

  <h3>Quick Filter Buttons</h3>
  <p>Click any filter pill to narrow down your search results:</p>
  <ul>
    <li><span class="pill pill-dark">All Orders</span>: Shows every order in the database.</li>
    <li><span class="pill pill-amber">Awaiting Doctor</span>: Shows orders still waiting for Dr. Robbins to enter the Rx.</li>
    <li><span class="pill pill-blue">Ordered / In Transit</span>: Lenses ordered with distributor, waiting for delivery.</li>
    <li><span class="pill pill-green">Waiting for Pickup</span>: Contacts currently sitting in office drawers.</li>
    <li><span class="pill pill-dark">Completed Pickups</span>: Lenses that have already been picked up by patients.</li>
  </ul>

  <div class="page-break"></div>

  <!-- ==================================================================== -->
  <!-- CHAPTER 9: PRECISION PRINTING                                        -->
  <!-- ==================================================================== -->
  <h2>Chapter 9: Precision Printing (Daily Pad & Waiting Sheet)</h2>

  <p>C.L.O.S. includes professional landscape print styles engineered to produce exact 1-to-1 physical replicas of Pal Optical's original paper forms on standard 8.5" x 11" Letter paper.</p>

  <h3>Printing the 16-Row Daily Orders Pad</h3>
  <div class="step-card">
    <div class="step-header">
      <div class="step-num">🖨️</div>
      <div class="step-title">Print Completed Daily Sheet</div>
    </div>
    <p class="step-desc">
      On the <strong>Daily Orders Pad</strong> tab, click the blue button <strong>Print Completed Sheet</strong>. It formats all filled patient rows into a crisp landscape pad ready for filing.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">📄</div>
      <div class="step-title">Print 100% Blank Pad Template</div>
    </div>
    <p class="step-desc">
      Click <strong>Print Blank Pad</strong> to generate a clean, completely empty 16-row pad template for handwriting if computers or power are ever offline.
    </p>
  </div>

  <h3>Printing the 50-Row Waiting to be Picked Up Sheet</h3>
  <div class="step-card">
    <div class="step-header">
      <div class="step-num">📋</div>
      <div class="step-title">Print Waiting Tracking Sheet</div>
    </div>
    <p class="step-desc">
      On the <strong>Waiting to be Picked Up</strong> tab, click <strong>Print Waiting Sheet</strong>. It prints all 50 numbered rows with patient names, doctor notes, prescriptions, drawer numbers, and call logs.
    </p>
  </div>

  <div class="callout callout-blue">
    <div class="callout-icon">💡</div>
    <div class="callout-content">
      <strong>Zero Digital Clutter on Paper:</strong>
      All on-screen buttons (<code>✏️ Edit</code>, <code>🗑️ Delete</code>, <code>✓ Done</code>, <code>Clear</code>, and top navigation bars) are automatically stripped out when printing. Your paper sheets look 100% clean and professional.
    </div>
  </div>

  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

  <!-- ==================================================================== -->
  <!-- CHAPTER 10: MULTI-COMPUTER SYNC & DATA PROTECTION                    -->
  <!-- ==================================================================== -->
  <h2>Chapter 10: Multi-Computer Sync, Backups & FAQ</h2>

  <h3>How Office Synchronization Works</h3>
  <p>C.L.O.S. uses a hybrid synchronization engine designed for doctor offices:</p>
  <ul>
    <li><strong>Instant Cross-Tab Sync:</strong> If two browser tabs or windows are open on the same computer, changes sync across them in milliseconds.</li>
    <li><strong>Multi-Computer LAN Sync:</strong> When the background server is active, computers in Dr. Robbins' room and the front desk automatically sync over the local network every 10 seconds.</li>
    <li><strong>Sync Status Dot:</strong> The green pulse dot in the navigation bar indicates when your screen is synchronized with the office network.</li>
  </ul>

  <h3>Data Backups & Excel Export</h3>
  <p>At the top right of the executive header, three powerful data tools are available:</p>
  <table class="data-table">
    <thead>
      <tr>
        <th>Button</th>
        <th>What It Does</th>
        <th>When to Use It</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>💾 Backup</strong></td>
        <td>Downloads a complete JSON backup file (<code>pal-clos-backup-[date].json</code>).</td>
        <td>Recommended once a week or before major office holidays.</td>
      </tr>
      <tr>
        <td><strong>📊 CSV</strong></td>
        <td>Exports all orders as an Excel-compatible spreadsheet (<code>.csv</code>).</td>
        <td>Use for office inventory auditing or year-end financial reporting.</td>
      </tr>
      <tr>
        <td><strong>📥 Restore</strong></td>
        <td>Lets you select a previously downloaded backup file to restore all orders.</td>
        <td>Use if a computer was replaced or data was accidentally erased.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- ==================================================================== -->
  <!-- CHAPTER 10 CONTINUED: FREQUENTLY ASKED QUESTIONS                     -->
  <!-- ==================================================================== -->
  <h2>Frequently Asked Questions & Troubleshooting</h2>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">Q1</div>
      <div class="step-title">"I made a typo in a patient's name on the Waiting Sheet. How do I fix it?"</div>
    </div>
    <p class="step-desc">
      Click the <strong>✏️ Edit</strong> button on their row. The system will prompt for the Doctor's Password (<span class="pill pill-dark">eye_doctor</span>). Type <code>eye_doctor</code>, click Authorize, and the full Order Modal will open where you can fix the name, phone number, prescription, or any other field. Click <strong>💾 Save Order Changes</strong> when done.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">Q2</div>
      <div class="step-title">"A patient picked up their contacts. Do I need the doctor's password to check them out?"</div>
    </div>
    <p class="step-desc">
      <strong>No!</strong> Front desk staff can check out patients without any password. Simply click the green <strong>✓ Done</strong> button on their row (or <strong>✅ Picked Up</strong> in the Drawer Rack), verify the date, choose how they paid (e.g. <em>Paid, Cash, VSP</em>), and click Confirm.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">Q3</div>
      <div class="step-title">"How do I scroll down the 50-row Waiting Sheet on a laptop?"</div>
    </div>
    <p class="step-desc">
      Use your mouse scroll wheel or trackpad swipe. As you scroll down through rows 1 to 50, the column headers stick permanently to the top of the screen so you always know which column is Date, Patient, Phone, Brand, Rx, Drawer, or Called.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">Q4</div>
      <div class="step-title">"What happens if our computer loses internet connection?"</div>
    </div>
    <p class="step-desc">
      C.L.O.S. runs locally on our office computer network and is configured as a Progressive Web App (PWA). It functions completely offline and saves all data directly to your local computer drive without needing external internet access.
    </p>
  </div>

  <div class="step-card">
    <div class="step-header">
      <div class="step-num">Q5</div>
      <div class="step-title">"What is the Doctor's Password if the doctor is not at the desk?"</div>
    </div>
    <p class="step-desc">
      The Doctor's Security Password is <code>eye_doctor</code> (all lowercase, with an underscore). Front desk staff password is <code>berry</code>.
    </p>
  </div>

  <div class="page-break"></div>

  <!-- ==================================================================== -->
  <!-- APPENDIX: FRONT DESK CHEAT SHEET                                     -->
  <!-- ==================================================================== -->
  <h2>⭐ Appendix: Front Desk "Laminated Cheat Sheet"</h2>
  <p style="color: #64748b; margin-top: -4px;">Keep this single page printed and taped near the reception workstation for instant daily reference.</p>

  <div class="cheat-sheet-grid">
    <div class="cheat-box" style="border-left: 4px solid #0284c7;">
      <h4>📋 Taking a New Order (16-Row Pad)</h4>
      <ul>
        <li>1. Type <strong>Patient Name</strong> in Quick Add bar.</li>
        <li>2. Type <strong>DOB</strong> (slashes add automatically).</li>
        <li>3. Type <strong>Phone</strong> (area code formats automatically).</li>
        <li>4. Click Box Quantity chip (e.g. <code>1 Box Each</code>).</li>
        <li>5. Click Billing chip (e.g. <code>VSP</code> or <code>Self Pay</code>).</li>
        <li>6. Click blue <strong>+ Add to Pad</strong> button.</li>
        <li>7. At end of shift, click <strong>🩺 Send Batch to Doctor</strong>.</li>
      </ul>
    </div>

    <div class="cheat-box" style="border-left: 4px solid #10b981;">
      <h4>📦 Checking Out a Patient (Pickup)</h4>
      <ul>
        <li>1. Find patient on <strong>50-Row Waiting Sheet</strong> or <strong>Drawer Rack</strong>.</li>
        <li>2. Note their <strong>Drawer #</strong> to retrieve physical package.</li>
        <li>3. Click green <strong>✓ Done</strong> (or <strong>✅ Picked Up</strong>).</li>
        <li>4. Check <strong>Date Picked Up</strong> (defaults to today).</li>
        <li>5. Click payment chip (<code>Paid</code>, <code>Cash</code>, <code>Card</code>, <code>VSP</code>).</li>
        <li>6. Click <strong>✅ Confirm Pickup & Archive</strong>.</li>
        <li><em>⭐ NO DOCTOR PASSWORD NEEDED!</em></li>
      </ul>
    </div>

    <div class="cheat-box" style="border-left: 4px solid #f59e0b;">
      <h4>🔒 Passwords & Security Rules</h4>
      <ul>
        <li>• <strong>Staff Unlocked (NO password):</strong> Date Received (📅), Drawer #, When Called (📞/LVM), Date Picked Up (✓ Done), How Paid.</li>
        <li>• <strong>Doctor Password Required:</strong> Name/Rx/Brand/Qty edit (✏️), Delete Order (🗑️), Clear Waiting Sheet.</li>
        <li>• <strong>Doctor Password:</strong> <code style="font-size: 10pt; font-weight: bold; background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px;">eye_doctor</code></li>
        <li>• <strong>Front Desk Password:</strong> <code style="font-size: 10pt; font-weight: bold; background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px;">berry</code></li>
        <li>• <strong>Official URL:</strong> <code style="font-size: 9pt;">https://clordersystem.vercel.app/</code></li>
      </ul>
    </div>

    <div class="cheat-box" style="border-left: 4px solid #8b5cf6;">
      <h4>🖨️ Daily Printing Rules</h4>
      <ul>
        <li>• <strong>Print Daily Orders:</strong> Click <code>Print Completed Sheet</code> on daily tab.</li>
        <li>• <strong>Print Blank Pad:</strong> Click <code>Print Blank Pad</code> for paper backup.</li>
        <li>• <strong>Print Waiting Sheet:</strong> Click <code>Print Waiting Sheet</code> on waiting tab.</li>
        <li>• <strong>Paper Size:</strong> Always set printer to <strong>Letter Landscape</strong>.</li>
        <li>• Action buttons (✏️, 🗑️) are hidden on paper automatically.</li>
      </ul>
    </div>
  </div>

  <div class="callout callout-purple" style="margin-top: 15px;">
    <div class="callout-icon">📞</div>
    <div class="callout-content">
      <strong>Office Contacts & Support</strong>
      <br><strong>Lead Optician & Developer:</strong> James Brentlinger, A.B.O.C., N.C.L.E.C.
      <br><strong>Optometrist & Clinical Director:</strong> Dr. Robbins
      <br><strong>Office:</strong> Pal Optical Co. • Lexington, Kentucky
    </div>
  </div>

</body>
</html>
`;

const htmlPath = path.join(__dirname, 'manual.html');
const pdfPath = path.join(__dirname, 'C.L.O.S. Operations Manual.pdf');

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('manual.html written successfully.');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

console.log('Generating PDF via headless Microsoft Edge...');
const cmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" --no-pdf-header-footer "${htmlPath}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(pdfPath)) {
    const stats = fs.statSync(pdfPath);
    console.log(`SUCCESS! PDF generated: "${pdfPath}" (${stats.size} bytes)`);
  } else {
    console.error('PDF file was not found after execution.');
  }
} catch (err) {
  console.error('Error generating PDF:', err);
}
