/**
 * auth-header.js
 * Injects a fixed top-right profile badge + dropdown and preferences modal
 * into every page. Works independently of page layout structure.
 *
 * Usage: <script type="module" src="../auth-header.js"></script>
 */

import { auth, onAuthStateChanged, signOut } from './firebase-client.js';

// ─── Inject CSS ──────────────────────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  #auth-widget {
    position: fixed;
    top: 12px;
    right: 20px;
    z-index: 9999;
    display: none;
    align-items: center;
    gap: 10px;
    font-family: 'Manrope', sans-serif;
  }
  #auth-notif-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(165,180,252,0.7);
    display: flex;
    align-items: center;
    transition: color 0.2s;
  }
  #auth-notif-btn:hover { color: #ce8afb; }

  #auth-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #1a1936;
    border: 1.5px solid rgba(206,138,251,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-shadow: 0 0 12px rgba(206,138,251,0.08);
    user-select: none;
  }
  #auth-avatar:hover {
    border-color: #ce8afb;
    box-shadow: 0 0 18px rgba(206,138,251,0.3);
  }
  #auth-initials {
    color: #ce8afb;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.06em;
  }
  #auth-dropdown {
    position: absolute;
    right: 0;
    top: calc(100% + 10px);
    width: 230px;
    background: #0c0c1f;
    border: 1px solid #1f1e33;
    border-radius: 18px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.7);
    padding: 8px 0;
    opacity: 0;
    transform: translateY(10px);
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  #auth-dropdown.open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: all;
  }
  .auth-dd-header {
    padding: 12px 16px;
    border-bottom: 1px solid #1f1e33;
    margin-bottom: 6px;
  }
  .auth-dd-label {
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 700;
    color: #bf81ff;
    letter-spacing: 0.12em;
    display: block;
    margin-bottom: 4px;
  }
  #auth-email {
    font-size: 13px;
    color: #e5e3ff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
  }
  .auth-dd-btn {
    width: 100%;
    text-align: left;
    padding: 10px 16px;
    font-size: 13px;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background 0.15s;
    font-family: 'Manrope', sans-serif;
  }
  .auth-dd-btn:hover { background: #1a1936; }
  .auth-dd-btn.pref { color: #e5e3ff; }
  .auth-dd-btn.logout { color: #fd6f85; }

  /* Preferences Modal */
  #auth-pref-overlay {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.65);
    backdrop-filter: blur(6px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s;
  }
  #auth-pref-overlay.open {
    opacity: 1;
    pointer-events: all;
  }
  #auth-pref-modal {
    background: #0c0c1f;
    border: 1px solid #1f1e33;
    border-radius: 24px;
    padding: 28px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 40px 80px rgba(0,0,0,0.8);
    transform: scale(0.95);
    transition: transform 0.25s;
  }
  #auth-pref-overlay.open #auth-pref-modal { transform: scale(1); }
  .pref-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px;
    border-radius: 13px;
    background: #1c1c3d;
    border: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 10px;
  }
  .pref-row-title { font-size: 14px; font-weight: 700; color: #e5e3ff; margin-bottom: 2px; }
  .pref-row-sub { font-size: 11px; color: #a8a7d5; }
  .toggle-track {
    width: 42px;
    height: 22px;
    border-radius: 999px;
    position: relative;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
    flex-shrink: 0;
  }
  .toggle-track.on { background: #bf81ff; box-shadow: 0 0 10px rgba(191,129,255,0.4); }
  .toggle-track.off { background: #1f1e33; border: 1px solid #44446c; }
  .toggle-thumb {
    position: absolute;
    top: 3px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    transition: left 0.2s, background 0.2s;
  }
  .toggle-track.on .toggle-thumb { left: calc(100% - 19px); background: white; }
  .toggle-track.off .toggle-thumb { left: 3px; background: #72719c; }
`;
document.head.appendChild(style);

// ─── Inject HTML ─────────────────────────────────────────────────────────────
const widgetHTML = `
<div id="auth-widget">
  <button id="auth-notif-btn" title="Notifications">
    <span class="material-symbols-outlined" style="font-size:22px">notifications</span>
  </button>
  <div style="position:relative">
    <div id="auth-avatar">
      <span id="auth-initials">--</span>
    </div>
    <div id="auth-dropdown">
      <div class="auth-dd-header">
        <span class="auth-dd-label">Account</span>
        <span id="auth-email">loading...</span>
      </div>
      <button class="auth-dd-btn pref" id="auth-pref-btn">
        <span class="material-symbols-outlined" style="font-size:17px;color:#a8a7d5">settings</span>
        Preferences
      </button>
      <button class="auth-dd-btn logout" id="auth-logout-btn">
        <span class="material-symbols-outlined" style="font-size:17px">logout</span>
        Log Out
      </button>
    </div>
  </div>
</div>

<div id="auth-pref-overlay">
  <div id="auth-pref-modal">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px">
      <h2 style="font-size:18px;font-weight:700;color:white;display:flex;align-items:center;gap:8px;font-family:'Plus Jakarta Sans',sans-serif">
        <span class="material-symbols-outlined" style="color:#bf81ff">settings</span> User Preferences
      </h2>
      <button id="auth-pref-close" style="background:none;border:none;cursor:pointer;color:#a8a7d5;display:flex">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div class="pref-row">
      <div><div class="pref-row-title">Dark Theme</div><div class="pref-row-sub">Default interface mode</div></div>
      <div class="toggle-track on" style="cursor:not-allowed;opacity:0.75"><div class="toggle-thumb"></div></div>
    </div>
    <div class="pref-row">
      <div><div class="pref-row-title">Push Notifications</div><div class="pref-row-sub">Receive performance alerts</div></div>
      <div class="toggle-track off" id="notif-toggle"><div class="toggle-thumb"></div></div>
    </div>
    <div class="pref-row">
      <div><div class="pref-row-title">Audio Coach</div><div class="pref-row-sub">Spoken feedback summaries</div></div>
      <div class="toggle-track on" id="audio-toggle"><div class="toggle-thumb"></div></div>
    </div>
    <button id="auth-pref-save" style="margin-top:22px;width:100%;padding:13px;border-radius:999px;background:#bf81ff;color:#32005c;font-weight:700;font-size:15px;border:none;cursor:pointer;font-family:'Manrope',sans-serif;transition:box-shadow 0.2s">
      Save Changes
    </button>
  </div>
</div>`;

document.body.insertAdjacentHTML('beforeend', widgetHTML);

// ─── Dropdown Toggle ──────────────────────────────────────────────────────────
const dropdown = document.getElementById('auth-dropdown');
document.getElementById('auth-avatar').addEventListener('click', (e) => {
  e.stopPropagation();
  dropdown.classList.toggle('open');
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('#auth-widget')) dropdown.classList.remove('open');
});

// ─── Preferences Modal ────────────────────────────────────────────────────────
const overlay = document.getElementById('auth-pref-overlay');
document.getElementById('auth-pref-btn').addEventListener('click', () => {
  overlay.classList.add('open');
  dropdown.classList.remove('open');
});
const closePref = () => overlay.classList.remove('open');
document.getElementById('auth-pref-close').addEventListener('click', closePref);
document.getElementById('auth-pref-save').addEventListener('click', closePref);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closePref(); });

// ─── Toggle switches ──────────────────────────────────────────────────────────
['notif-toggle', 'audio-toggle'].forEach(id => {
  document.getElementById(id).addEventListener('click', function() {
    this.classList.toggle('on');
    this.classList.toggle('off');
  });
});

// ─── Firebase Auth ────────────────────────────────────────────────────────────
const widget = document.getElementById('auth-widget');

onAuthStateChanged(auth, (user) => {
  if (user) {
    widget.style.display = 'flex';
    const nameStr = user.displayName || user.email.split('@')[0];
    document.getElementById('auth-email').textContent = user.email;

    // Compute initials
    const parts = nameStr.trim().split(' ').filter(Boolean);
    let init = parts[0].charAt(0);
    if (parts.length > 1) init += parts[parts.length - 1].charAt(0);
    else init = nameStr.substring(0, 2);
    document.getElementById('auth-initials').textContent = init.toUpperCase();

    // Update welcome heading if this page has one
    const nameEl = document.getElementById('userNameDisplay');
    if (nameEl) nameEl.textContent = nameStr;
  }
  // Don't redirect here — let each page's own logic handle it
});

document.getElementById('auth-logout-btn').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = '../interveux_landing_page/code.html';
  });
});
