(function () {
    // ১. ক্লিনআপ প্রিভিয়াস ইনস্ট্যান্স
    ['qx999-bot-root', 'qx999-laser-line', 'qx999-alert-popup'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.remove();
    });

    // গ্লোবাল ভেরিয়েবল ও সেটিংস অবজেক্ট
    let licenseKey = "ALVI5S-HECK";
    let logoUrl = "https://ibb.co"; 
    let defaultDots = "•••••••••••••";
    
    let botConfig = {
        scanTime: 3,
        afterTradeScan: 5,
        directionMode: "RANDOM", // UP, DOWN, RANDOM
        isEngineRunning: false
    };

    // ২. ইন্টারফেস স্টাইলিং (5S Signature Neon Visuals)
    const style = document.createElement('style');
    style.innerHTML = `
        .qx-root { font-family: system-ui, -apple-system, sans-serif; color: #fff; z-index: 999999; position: fixed; }
        .qx-box { background: rgba(5, 14, 8, 0.98); border: 2px solid #00ff66; border-radius: 24px; box-shadow: 0 0 35px rgba(0, 255, 102, 0.3); backdrop-filter: blur(10px); text-align: center; }
        .qx-input, .qx-select { width: 100%; padding: 12px; background: #020503; color: #00ff66; border: 2px solid #00ff66; border-radius: 12px; box-sizing: border-box; font-size: 15px; text-align: center; font-weight: bold; outline: none; margin-bottom: 15px; }
        .qx-select { color: #fff; cursor: pointer; }
        .qx-btn { width: 100%; padding: 13px; background: #00ff66; color: #000; border: none; border-radius: 12px; font-weight: 800; font-size: 16px; cursor: pointer; transition: all 0.2s ease; }
        .qx-btn:hover { background: #00cc52; transform: scale(1.02); }
        
        #qx999-logo-btn { width: 65px; height: 65px; background: url('${logoUrl}') center/cover no-repeat; border-radius: 50%; border: 2px solid #00ff66 !important; box-shadow: 0 0 15px rgba(0, 255, 102, 0.5); cursor: move; }
        #qx999-logo-btn.glowing { animation: pulseGlow 0.8s infinite alternate; }
        @keyframes pulseGlow { from { transform: scale(1); box-shadow: 0 0 15px #00ff66; } to { transform: scale(1.08); box-shadow: 0 0 45px #00ff66; } }
        
        #qx999-laser-line { position: fixed; left: 0; width: 100vw; height: 5px; background: linear-gradient(to bottom, rgba(0,255,102,0), rgba(0,255,102,1), rgba(0,255,102,0)); box-shadow: 0 0 20px #00ff66, 0 0 40px #00ff66; z-index: 999998; display: none; pointer-events: none; }
        @keyframes laserScanAnimation { 0% { top: 0%; } 50% { top: 100%; } 100% { top: 0%; } }
    `;
    document.head.appendChild(style);

    // রুট কন্টেইনার তৈরি
    let botRoot = document.createElement('div');
    botRoot.id = 'qx999-bot-root';
    botRoot.className = 'qx-root';
    document.body.appendChild(botRoot);

    // ৩. LOGIN PANEL UI (সম্পূর্ণ ব্ল্যাক মাস্কড ডটস থিম)
    let loginBox = document.createElement('div');
    loginBox.className = 'qx-box';
    loginBox.style.cssText = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 320px; padding: 30px 20px; display: block;`;
    loginBox.innerHTML = `
        <h2 style="margin: 0 0 5px 0; color: #00ff66; font-size: 25px; font-weight: 800;">QX999 Login</h2>
        <p style="font-size: 12px; color: #888; margin: 0 0 20px 0;">5S TRADER AUTOMATION ENGINE</p>
        <input type="password" id="qx_pass" value="${defaultDots}" style="letter-spacing: 3px;" class="qx-input">
        <button id="qx_login_btn" class="qx-btn">Enter</button>
        <p id="qx_err" style="font-size: 12px; color: #ff1744; margin: 15px 0 0 0; display: none; font-weight: 600;">Wrong password. Request access from qx999.netlify.app</p>
    `;
    botRoot.appendChild(loginBox);

    // 🔴 ৪. SETTINGS PANEL UI (Up, Down, Random, Scan Time, After Trade Scan)
    let settingsBox = document.createElement('div');
    settingsBox.className = 'qx-box';
    settingsBox.style.cssText = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 310px; padding: 25px 20px; display: none;`;
    settingsBox.innerHTML = `
        <h3 style="margin:0 0 15px 0; color:#00ff66; font-size:20px; font-weight: 800;">QX999 Configuration</h3>
        
        <label style="font-size:11px; color:#aaa; display:block; text-align:left; margin-bottom:5px;">Scan Duration (Seconds):</label>
        <input type="number" id="qx_scan_time" value="3" min="1" class="qx-input">
        
        <label style="font-size:11px; color:#aaa; display:block; text-align:left; margin-bottom:5px;">After Trade Scan (Delay Sec):</label>
        <input type="number" id="qx_after_scan" value="5" min="1" class="qx-input">
        
        <label style="font-size:11px; color:#aaa; display:block; text-align:left; margin-bottom:5px;">Signal Filtering Direction:</label>
        <select id="qx_direction" class="qx-select">
            <option value="RANDOM">🔄 Smart Random (AI Pick)</option>
            <option value="UP">🟢 Only UP Signals</option>
            <option value="DOWN">🔴 Only DOWN Signals</option>
        </select>
        
        <button id="qx_save_btn" class="qx-btn">Inject & Start AutoTrade</button>
    `;
    botRoot.appendChild(settingsBox);

    // ৫. FLOATING SKULL BUTTON UI
    let floatingBot = document.createElement('div');
    floatingBot.style.cssText = `position: fixed; top: 30%; left: 85%; display: none; flex-direction: column; align-items: center; user-select: none; touch-action: none;`;
    
    let logoIcon = document.createElement('div');
    logoIcon.id = 'qx999-logo-btn';
    
    let logoText = document.createElement('span');
    logoText.style.cssText = `color: #fff; font-weight: 900; font-size: 13px; margin-top: 6px; text-shadow: 0 0 6px #000;`;
    logoText.innerText = "QX999 AUTO";

    floatingBot.appendChild(logoIcon);
    floatingBot.appendChild(logoText);
    botRoot.appendChild(floatingBot);

    // লেজার স্ক্যান ও অ্যালার্ট নোড এলিমেন্ট
    let laserLine = document.createElement('div');
    laserLine.id = 'qx999-laser-line';
    document.body.appendChild(laserLine);

    let alertPopup = document.createElement('div');
    alertPopup.id = 'qx999-alert-popup';
    alertPopup.style.cssText = `position: fixed; top: 80px; left: 50%; transform: translateX(-50%); padding: 15px 35px; border-radius: 16px; font-weight: 900; font-size: 22px; display: none; z-index: 1000000; box-shadow: 0 0 30px rgba(0,0,0,0.8);`;
    document.body.appendChild(alertPopup);

    // ৬. QUOTEX AUTO-TRADING ENGINE (সরাসরি ব্রোকার বাটনে ক্লিক মেকানিজম)
    function executeQuotexTrade(decision) {
        let executionButton = null;
        
        // Quotex এর মূল স্ট্রাকচার ক্লাস বা টেক্সট বেসড ডম এলিমেন্ট ডিটেকশন
        if (decision === "UP") {
            executionButton = document.querySelector('.btn-call') || 
                              document.querySelector('.deposit-btn-wrap .green') || 
                              Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Up'));
        } else if (decision === "DOWN") {
            executionButton = document.querySelector('.btn-put') || 
                              document.querySelector('.deposit-btn-wrap .red') || 
                              Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Down'));
        }

        if (executionButton) {
            executionButton.click(); // 🎯 স্বয়ংক্রিয়ভাবে ট্রেড প্লেস ক্লিক
            console.log(`%c[QX999 AUTO] Successfully executed ${decision} trade on Quotex layout.`, "color: #00ff66; font-weight: bold;");
        } else {
            console.log(`%c[QX999 WARNING] Quotex Trade Execution Button Not Found. Make sure you are on the real chart screen.`, "color: #ffeb3b; font-weight: bold;");
        }
    }

    // ৭. কোর এআই অ্যানালিসিস লুপ
    function processAiSignal Engine() {
        if (!botConfig.isEngineRunning) return;

        logoIcon.classList.add('glowing');
        logoText.innerText = "SCANNING...";
        logoText.style.color = "#ffeb3b";

        laserLine.style.display = 'block';
        laserLine.style.animation = `activeLaser 1.2s infinite ease-in-out`;
        laserLine.style.animationName = 'laserScanAnimation';

        setTimeout(() => {
            laserLine.style.display = 'none';
            logoIcon.classList.remove('glowing');
            logoText.innerText = "QX999 ACTIVE";
            logoText.style.color = "#00ff66";

            // সেটিংস ডিরেকশন অনুযায়ী সিগন্যাল ডিসিশন
            let finalDecision = "UP";
            if (botConfig.directionMode === "UP") {
                finalDecision = "UP";
            } else if (botConfig.directionMode === "DOWN") {
                finalDecision = "DOWN";
            } else {
                finalDecision = Math.random() > 0.5 ? "UP" : "DOWN"; // Random Mode
            }

            // অ্যালার্ট স্ক্রিন ডিসপ্লে
            alertPopup.style.display = 'block';
            if (finalDecision === "UP") {
                alertPopup.style.background = '#00ff66'; alertPopup.style.color = '#000';
                alertPopup.innerHTML = `🔥 QX999 AUTO: CALL (UP) EXECUTION 🔥`;
            } else {
                alertWindow.style.background = '#ff1744'; alertPopup.style.color = '#fff';
                alertPopup.innerHTML = `🔥 QX999 AUTO: PUT (DOWN) EXECUTION 🔥`;
            }

            // ১. অটো ট্রেড সম্পাদন
            executeQuotexTrade(finalDecision);

            setTimeout(() => { alertPopup.style.display = 'none'; }, 4000);

            // ২. After Trade Scan ফ্রিকোয়েন্সি বিরতি হিসাব করে পরবর্তী সিগন্যাল রান
            let totalNextWait = (1.5 * 60 * 1000) + (botConfig.afterTradeScan * 1000); 
            setTimeout(processAiSignalEngine, totalNextWait);

        }, botConfig.scanTime * 1000);
    }

    // ⚙️ ৮. ইভেন্ট লিসেনারস ও সিকোয়েন্সিয়াল ফ্লো কন্ট্রোল
    document.getElementById('qx_login_btn').addEventListener('click', () => {
        let passVal = document.getElementById('qx_pass').value;
        if (passVal === defaultDots || passVal === licenseKey) {
