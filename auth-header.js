/**
 * auth-header.js
 * Injects the global profile dropdown, preferences modal, and Firebase auth
 * into every page that includes this script.
 *
 * Usage: Add <script src="../auth-header.js" type="module"></script>
 * before </body> on pages that have the top-right icon area.
 */

import { auth, onAuthStateChanged, signOut } from './firebase-client.js';

// ─── Inject Preferences Modal ──────────────────────────────────────────────
const modalHTML = `
<div id="authPrefModal" class="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300">
    <div class="bg-[#0c0c1f] border border-[#1f1e33] rounded-3xl shadow-2xl w-full max-w-md p-6 transform scale-95 transition-transform duration-300" id="authPrefModalContent">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-white flex items-center gap-2" style="font-family:'Plus Jakarta Sans',sans-serif">
                <span class="material-symbols-outlined" style="color:#bf81ff">settings</span> User Preferences
            </h2>
            <button id="authClosePrefBtn" class="text-gray-400 hover:text-white transition-colors">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:12px;background:#1c1c3d;border:1px solid rgba(255,255,255,0.05)">
                <div>
                    <p style="font-size:14px;font-weight:700;color:#e5e3ff">Dark Theme</p>
                    <p style="font-size:12px;color:#a8a7d5">Default Interface mode</p>
                </div>
                <div style="width:40px;height:20px;background:#bf81ff;border-radius:999px;position:relative;cursor:not-allowed;opacity:0.8">
                    <div style="position:absolute;right:3px;top:3px;width:14px;height:14px;background:white;border-radius:50%"></div>
                </div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:12px;background:#1c1c3d;border:1px solid rgba(255,255,255,0.05)">
                <div>
                    <p style="font-size:14px;font-weight:700;color:#e5e3ff">Push Notifications</p>
                    <p style="font-size:12px;color:#a8a7d5">Receive performance alerts</p>
                </div>
                <div id="notifToggle" style="width:40px;height:20px;background:#1f1e33;border-radius:999px;position:relative;cursor:pointer;border:1px solid #44446c;transition:all 0.2s">
                    <div id="notifToggleThumb" style="position:absolute;left:3px;top:3px;width:14px;height:14px;background:#72719c;border-radius:50%;transition:all 0.2s"></div>
                </div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:12px;background:#1c1c3d;border:1px solid rgba(255,255,255,0.05)">
                <div>
                    <p style="font-size:14px;font-weight:700;color:#e5e3ff">Audio Coach</p>
                    <p style="font-size:12px;color:#a8a7d5">Spoken feedback summaries</p>
                </div>
                <div id="audioToggle" style="width:40px;height:20px;background:#bf81ff;border-radius:999px;position:relative;cursor:pointer;box-shadow:0 0 8px rgba(191,129,255,0.4);transition:all 0.2s">
                    <div id="audioToggleThumb" style="position:absolute;right:3px;top:3px;width:14px;height:14px;background:white;border-radius:50%;transition:all 0.2s"></div>
                </div>
            </div>
        </div>
        <div style="margin-top:24px">
            <button id="authSavePrefBtn" style="width:100%;padding:12px;border-radius:999px;background:#bf81ff;color:#32005c;font-weight:700;font-size:15px;border:none;cursor:pointer;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 15px rgba(191,129,255,0.5)'" onmouseout="this.style.boxShadow='none'">
                Save Changes
            </button>
        </div>
    </div>
</div>`;

document.body.insertAdjacentHTML('afterbegin', modalHTML);

// ─── Inject Profile Dropdown into top-right icon area ─────────────────────
const profileHTML = `
<div id="authProfileWrap" style="display:none;align-items:center;gap:12px">
    <button style="background:none;border:none;cursor:pointer;color:rgba(165,180,252,0.6)" id="authNotifBtn" title="Notifications">
        <span class="material-symbols-outlined" style="font-size:22px">notifications</span>
    </button>
    <div style="position:relative" id="authProfileDropdownWrap">
        <div id="authProfileBadge" style="width:36px;height:36px;border-radius:50%;background:#1a1936;border:1.5px solid rgba(206,138,251,0.2);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;box-shadow:0 0 10px rgba(206,138,251,0.1)">
            <span id="authUserInitials" style="color:#ce8afb;font-weight:700;font-size:13px;letter-spacing:0.05em">--</span>
        </div>
        <div id="authDropdownMenu" style="position:absolute;right:0;top:calc(100% + 8px);width:220px;background:#0c0c1f;border:1px solid #1f1e33;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.6);opacity:0;transform:translateY(8px);pointer-events:none;transition:all 0.25s;padding:8px 0;z-index:200">
            <div style="padding:12px 16px;border-bottom:1px solid #1f1e33;margin-bottom:4px">
                <span style="font-size:10px;text-transform:uppercase;font-weight:700;color:#bf81ff;letter-spacing:0.12em;display:block;margin-bottom:4px">Account</span>
                <p id="authDropdownEmail" style="font-size:13px;color:#e5e3ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">loading...</p>
            </div>
            <button id="authOpenPrefBtn" style="width:100%;text-align:left;padding:10px 16px;font-size:13px;color:#e5e3ff;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;transition:background 0.15s" onmouseover="this.style.background='#1a1936'" onmouseout="this.style.background='none'">
                <span class="material-symbols-outlined" style="font-size:17px;color:#a8a7d5">settings</span> Preferences
            </button>
            <button id="authLogoutBtn" style="width:100%;text-align:left;padding:10px 16px;font-size:13px;color:#fd6f85;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;transition:background 0.15s" onmouseover="this.style.background='#1a1936'" onmouseout="this.style.background='none'">
                <span class="material-symbols-outlined" style="font-size:17px">logout</span> Log Out
            </button>
        </div>
    </div>
</div>`;

// Find the top-right icon slots and inject there (look for the icon area in top nav)
// We inject into a placeholder div generated on each page or just append to nav
const targetNav = document.querySelector('nav.fixed');
if (targetNav) {
    const navRight = targetNav.querySelector('.flex.items-center.gap-4, .flex.items-center.gap-3');
    if (navRight) {
        navRight.insertAdjacentHTML('beforeend', profileHTML);
    }
}

// ─── Toggle dropdown on click ──────────────────────────────────────────────
const profileBadge = document.getElementById('authProfileBadge');
const dropdownMenu = document.getElementById('authDropdownMenu');

profileBadge.addEventListener('click', () => {
    const isOpen = dropdownMenu.style.opacity === '1';
    dropdownMenu.style.opacity = isOpen ? '0' : '1';
    dropdownMenu.style.transform = isOpen ? 'translateY(8px)' : 'translateY(0)';
    dropdownMenu.style.pointerEvents = isOpen ? 'none' : 'all';
});

// Close when clicking outside
document.addEventListener('click', (e) => {
    if (!document.getElementById('authProfileDropdownWrap').contains(e.target)) {
        dropdownMenu.style.opacity = '0';
        dropdownMenu.style.transform = 'translateY(8px)';
        dropdownMenu.style.pointerEvents = 'none';
    }
});

// ─── Preferences Modal Logic ─────────────────────────────────────────────
const prefModal = document.getElementById('authPrefModal');
const prefContent = document.getElementById('authPrefModalContent');

function openPref() {
    prefModal.style.opacity = '1';
    prefModal.style.pointerEvents = 'all';
    prefContent.style.transform = 'scale(1)';
    // Close dropdown
    dropdownMenu.style.opacity = '0';
    dropdownMenu.style.transform = 'translateY(8px)';
    dropdownMenu.style.pointerEvents = 'none';
}
function closePref() {
    prefModal.style.opacity = '0';
    prefModal.style.pointerEvents = 'none';
    prefContent.style.transform = 'scale(0.95)';
}

document.getElementById('authOpenPrefBtn').addEventListener('click', openPref);
document.getElementById('authClosePrefBtn').addEventListener('click', closePref);
document.getElementById('authSavePrefBtn').addEventListener('click', closePref);
prefModal.addEventListener('click', (e) => { if (e.target === prefModal) closePref(); });

// ─── Toggle switches ──────────────────────────────────────────────────────
let notifOn = false, audioOn = true;
document.getElementById('notifToggle').addEventListener('click', () => {
    notifOn = !notifOn;
    const t = document.getElementById('notifToggle');
    const th = document.getElementById('notifToggleThumb');
    t.style.background = notifOn ? '#bf81ff' : '#1f1e33';
    t.style.boxShadow = notifOn ? '0 0 8px rgba(191,129,255,0.4)' : 'none';
    th.style.left = notifOn ? 'auto' : '3px';
    th.style.right = notifOn ? '3px' : 'auto';
    th.style.background = notifOn ? 'white' : '#72719c';
});
document.getElementById('audioToggle').addEventListener('click', () => {
    audioOn = !audioOn;
    const t = document.getElementById('audioToggle');
    const th = document.getElementById('audioToggleThumb');
    t.style.background = audioOn ? '#bf81ff' : '#1f1e33';
    t.style.boxShadow = audioOn ? '0 0 8px rgba(191,129,255,0.4)' : 'none';
    th.style.left = audioOn ? 'auto' : '3px';
    th.style.right = audioOn ? '3px' : 'auto';
    th.style.background = audioOn ? 'white' : '#72719c';
});

// ─── Firebase Auth State ─────────────────────────────────────────────────
const profileWrap = document.getElementById('authProfileWrap');

onAuthStateChanged(auth, (user) => {
    if (user) {
        profileWrap.style.display = 'flex';
        const nameStr = user.displayName || user.email.split('@')[0];
        document.getElementById('authDropdownEmail').textContent = user.email;
        // Initials
        const parts = nameStr.trim().split(' ');
        let init = parts[0].charAt(0);
        if (parts.length > 1) init += parts[parts.length - 1].charAt(0);
        else init = nameStr.substring(0, 2);
        document.getElementById('authUserInitials').textContent = init.toUpperCase();

        // Also update Performance Hub welcome heading if exists
        const nameEl = document.getElementById('userNameDisplay');
        if (nameEl) nameEl.textContent = nameStr;
    }
    // No redirect here — each page can decide
});

document.getElementById('authLogoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = '../interveux_landing_page/code.html';
    });
});
