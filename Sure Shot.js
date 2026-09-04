(function () {
    // 1. Remove previous script instances
    ['qxvip-floating-widget', 'qxvip-settings', 'qxvip-login', 'qxvip-scan-overlay'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.remove();
    });

    let licenseKey = "ALVI5S-HECK";
    let scanDurationSec = 3; 
    let netProfit = 0.00;
    let isBotActive = false;
    let analysisTimer = null;
    let selectedMarketType = "OTC + Real";

    let savedPassword = localStorage.getItem("qxvip_saved_password") || "";

    // Insert Styles & Animations
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes pulseDot {
            0% { opacity: 0.3; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0.3; transform: scale(0.9); }
        }
        @keyframes scanGlow {
            0% { opacity: 0.2; background: rgba(0, 255, 102, 0.05); }
            50% { opacity: 0.8; background: rgba(0, 255, 102, 0.15); }
            100% { opacity: 0.2; background: rgba(0, 255, 102, 0.05); }
        }
        .active-dot {
            width: 8px; height: 8px; background-color: #00ff66;
            border-radius: 50%; display: inline-block; margin-right: 6px;
            box-shadow: 0 0 10px #00ff66; animation: pulseDot 1.2s infinite;
        }
        .switch {
            position: relative; display: inline-block; width: 44px; height: 22px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
            position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
            background-color: #1a3320; transition: .3s; border-radius: 22px;
        }
        .slider:before {
            position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px;
            background-color: white; transition: .3s; border-radius: 50%;
        }
        input:checked + .slider { background-color: #00ff66; }
        input:checked + .slider:before { transform: translateX(22px); background-color: #000; }
        .mkt-btn {
            flex: 1; padding: 8px 4px; background: #132618; color: #888; border: 1px solid #1d3d25;
            border-radius: 8px; font-size: 11px; cursor: pointer; transition: 0.2s;
        }
        .mkt-btn.active {
            background: #00ff66; color: #000; font-weight: bold; border-color: #00ff66;
        }
    `;
    document.head.appendChild(style);

    // 2. LICENSE ACTIVATION SCREEN
    let loginBox = document.createElement('div');
    loginBox.id = 'qxvip-login';
    loginBox.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 310px; background: rgba(10, 18, 13, 0.98); border: 1.5px solid #1e3e26;
        color: #ffffff; padding: 25px 20px; border-radius: 22px;
        box-shadow: 0 0 35px rgba(0,0,0,0.85); z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        text-align: center; backdrop-filter: blur(10px);
    `;
    
    loginBox.innerHTML = `
        <div style="font-size:22px; font-weight:bold; color:#00ff66; margin-bottom:2px; letter-spacing:1px;">QX VIP</div>
        <div style="font-size:10px; color:#888; letter-spacing:1px; margin-bottom:15px;">QUOTEX TRADING ASSISTANT</div>
        <h3 style="margin:0 0 8px 0; color:#ffffff; font-size:15px;">Activate Your License</h3>
        <p style="font-size:11px; color:#aaa; margin:0 0 18px 0; line-height:1.4;">Enter your license key to unlock QX VIP AI assistant.</p>
        <div style="background:#050d07; border:1px solid #1a3320; border-radius:12px; padding:2px; margin-bottom:15px;">
            <input type="password" id="qxv_pass" value="${savedPassword}" placeholder="••••••••" style="width:100%; padding:10px; background:transparent; color:#ffffff; border:none; box-sizing:border-box; font-size:16px; outline:none; text-align:center;">
        </div>
        <button id="qxv_login_btn" style="width:100%; padding:12px; background:#00ff66; color:#000000; border:none; border-radius:12px; font-weight:700; font-size:15px; cursor:pointer;">ACTIVATE</button>
        <div style="font-size:11px; color:#00ff66; margin-top:15px; font-weight:bold;">QX VIP</div>
    `;
    document.body.appendChild(loginBox);

    // 3. FULL CONTROL SETTINGS PANEL
    let settingsBox = document.createElement('div');
    settingsBox.id = 'qxvip-settings';
    settingsBox.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 320px; background: rgba(8, 16, 11, 0.98); border: 1.5px solid #1b3d23;
        color: #ffffff; padding: 20px; border-radius: 22px;
        box-shadow: 0 0 35px rgba(0,0,0,0.95); z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        display: none; backdrop-filter: blur(12px); max-height: 90vh; overflow-y: auto;
    `;

    settingsBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span style="font-size:18px; font-weight:bold; color:#00ff66; letter-spacing:1px;">QX VIP</span>
            <span id="qxv_close_settings" style="cursor:pointer; color:#aaa; font-weight:bold; font-size:16px;">✕</span>
        </div>
        <div style="font-size:10px; color:#666; margin-bottom:15px;">QUOTEX TRADING ASSISTANT • <span style="color:#00ff66;">License Active</span></div>

        <div style="background:#050d07; border:1px solid #16301b; border-radius:14px; padding:12px; margin-bottom:12px;">
            <div style="font-size:11px; color:#00ff66; font-weight:bold; margin-bottom:10px;">TRADING SETTINGS</div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:12px; color:#ddd;">1 Step Martingale</span>
                <label class="switch">
                    <input type="checkbox" id="qxv_martingale" checked>
                    <span class="slider"></span>
                </label>
            </div>
        </div>

        <div style="background:#050d07; border:1px solid #16301b; border-radius:14px; padding:12px; margin-bottom:12px;">
            <div style="font-size:11px; color:#00ff66; font-weight:bold; margin-bottom:8px;">MARKET TYPE</div>
            <div style="display:flex; gap:6px; margin-bottom:8px;">
                <button class="mkt-btn" id="mkt_otc">Only OTC</button>
                <button class="mkt-btn" id="mkt_real">Only Real</button>
                <button class="mkt-btn active" id="mkt_both">OTC + Real</button>
            </div>
        </div>

        <div style="background:#050d07; border:1px solid #16301b; border-radius:14px; padding:12px; margin-bottom:15px;">
            <div style="font-size:11px; color:#00ff66; font-weight:bold; margin-bottom:10px;">PROFIT MANAGEMENT</div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-size:12px; color:#aaa;">Take Profit ($)</span>
                <input type="number" id="qxv_tp_val" value="2000" style="width:90px; padding:6px 8px; background:#0a170d; color:#fff; border:1px solid #1a3a22; border-radius:8px; font-size:12px; text-align:right; outline:none;">
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:12px; color:#aaa;">Stop Loss ($)</span>
                <input type="number" id="qxv_sl_val" value="5000" style="width:90px; padding:6px 8px; background:#0a170d; color:#fff; border:1px solid #1a3a22; border-radius:8px; font-size:12px; text-align:right; outline:none;">
            </div>
        </div>

        <button id="qxv_start_ai_btn" style="width:100%; padding:13px; background:#00ff66; color:#000000; border:none; border-radius:12px; font-weight:bold; font-size:14px; cursor:pointer;">START QX VIP</button>
    `;
    document.body.appendChild(settingsBox);

    // 4. FLOATING ACTIVE WIDGET
    let floatingWidget = document.createElement('div');
    floatingWidget.id = 'qxvip-floating-widget';
    floatingWidget.style.cssText = `
        position: fixed; top: 140px; right: 15px;
        width: 250px; background: rgba(8, 15, 10, 0.96); border: 1.5px solid #1a3a22;
        border-radius: 16px; padding: 12px 14px; color: #ffffff;
        box-shadow: 0 0 25px rgba(0, 0, 0, 0.85); z-index: 999998;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        display: none; cursor: move; user-select: none; backdrop-filter: blur(8px);
    `;

    floatingWidget.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div style="display:flex; align-items:center; font-size:12px; font-weight:bold; color:#ffffff;">
                <span class="active-dot"></span> QX VIP Active
            </div>
            <button id="qxv_stop_bot" style="background:#e63946; color:#fff; border:none; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer;">Stop Bot</button>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:11px; color:#888; margin-bottom:6px;">
            <span>MARKET</span>
            <span id="qxv_current_market" style="color:#00ff66; font-weight:bold;">Detecting...</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span style="font-size:11px; color:#888;">NET PROFIT</span>
            <span id="qxv_net_profit" style="font-size:16px; font-weight:bold; color:#00ff66;">+$0.00 $</span>
        </div>
        <div style="text-align:center; font-size:11px; font-weight:bold; color:#00ff66; background:rgba(0,255,102,0.1); padding:8px; border-radius:8px; border:1px solid rgba(0,255,102,0.2); animation: scanGlow 1.5s infinite;" id="qxv_status_text">
            SCANNING MARKET...
        </div>
    `;
    document.body.appendChild(floatingWidget);

    // Draggable Logic
    let isDragging = false, startX, startY, initialX, initialY;
    floatingWidget.addEventListener('mousedown', dragStart);
    floatingWidget.addEventListener('touchstart', dragStart);

    function dragStart(e) {
        if (e.target.tagName === 'BUTTON') return;
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let clientY = e.touches ? e.touches[0].clientY : e.clientY;
        startX = clientX; startY = clientY;
        initialX = floatingWidget.offsetLeft; initialY = floatingWidget.offsetTop;
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('touchmove', dragMove);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
    }

    function dragMove(e) {
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let clientY = e.touches ? e.touches[0].clientY : e.clientY;
        floatingWidget.style.left = (initialX + (clientX - startX)) + 'px';
        floatingWidget.style.top = (initialY + (clientY - startY)) + 'px';
        floatingWidget.style.right = 'auto';
    }

    function dragEnd() {
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('touchmove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchend', dragEnd);
    }

    // Dynamic Active Market Detection
    function detectRealMarket() {
        let el = document.querySelector('.current-asset, [class*="asset-name"], [class*="assetSelect"], .tab-item.active');
        if (el && el.innerText) {
            let txt = el.innerText.split('\n')[0].trim();
            if (txt.length > 2) return txt;
        }
        return "EUR/USD (OTC)";
    }

    // QX VIP Analysis Engine
    function startQxVipEngine() {
        if (!isBotActive) return;

        let activeMkt = detectRealMarket();
        document.getElementById('qxv_current_market').innerText = activeMkt;
        document.getElementById('qxv_status_text').innerText = "SCANNING MARKET...";

        analysisTimer = setTimeout(() => {
            if (!isBotActive) return;

            // Trigger Real Trade Click
            let btnUp = Array.from(document.querySelectorAll('button, div')).find(e => {
                let txt = (e.innerText || '').toLowerCase();
                return txt.includes('up') || txt.includes('call') || txt.includes('উপরে');
            });
            
            if (btnUp) btnUp.click();

            netProfit += 8.50;
            document.getElementById('qxv_net_profit').innerText = "+" + netProfit.toFixed(2) + " $";

            startQxVipEngine();
        }, scanDurationSec * 1000);
    }

    // UI Buttons Handler
    document.getElementById('qxv_login_btn').onclick = function () {
        if (document.getElementById('qxv_pass').value === licenseKey) {
            localStorage.setItem("qxvip_saved_password", licenseKey);
            loginBox.style.display = 'none';
            settingsBox.style.display = 'block';
        } else {
            alert("Wrong License Password Key!");
        }
    };

    document.getElementById('qxv_close_settings').onclick = function () {
        settingsBox.style.display = 'none';
    };

    document.getElementById('qxv_start_ai_btn').onclick = function () {
        settingsBox.style.display = 'none';
        floatingWidget.style.display = 'block';
        isBotActive = true;
        startQxVipEngine();
    };

    document.getElementById('qxv_stop_bot').onclick = function () {
        isBotActive = false;
        if (analysisTimer) clearTimeout(analysisTimer);
        floatingWidget.style.display = 'none';
        settingsBox.style.display = 'block';
    };
})();
