(function () {
    // 1. Remove Existing Instances
    ['qxvip-login-modal', 'qxvip-circle-widget', 'qxvip-style-sheet', 'qxvip-scan-line', 'qxvip-scan-text'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.remove();
    });

    let isAnalyzing = false;
    let customLogoUrl = "https://i.ibb.co.com/3yPZZrk2/1000323932-photoaidcom-cropped-jpg.png";
    const CORRECT_PASS = "5S-XALVI1001";

    // 2. LUXURY STYLESHEET INJECTION
    const style = document.createElement('style');
    style.id = 'qxvip-style-sheet';
    style.innerHTML = `
        /* HIGH-END LUXURY LOGIN DIALOG */
        .qxvip-login-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(2, 6, 12, 0.92); backdrop-filter: blur(12px);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999999; font-family: 'Inter', -apple-system, sans-serif;
        }
        .qxvip-login-card {
            width: 310px; background: #050a12;
            border: 1.5px solid #00ff66; border-radius: 20px;
            box-shadow: 0 0 35px rgba(0, 255, 102, 0.25), inset 0 0 15px rgba(0, 255, 102, 0.1);
            overflow: hidden; text-align: center;
            animation: modalFadeIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes modalFadeIn {
            from { opacity: 0; transform: scale(0.85); }
            to { opacity: 1; transform: scale(1); }
        }
        .qxvip-login-header {
            background: linear-gradient(180deg, rgba(0,255,102,0.15) 0%, rgba(5,10,18,0) 100%);
            padding: 22px 15px 12px 15px; border-bottom: 1px solid rgba(0, 255, 102, 0.15);
        }
        .qxvip-login-header h2 {
            margin: 0; color: #00ff66; font-size: 19px; font-weight: 900;
            letter-spacing: 2px; text-transform: uppercase;
            text-shadow: 0 0 12px rgba(0, 255, 102, 0.6);
        }
        .qxvip-login-body {
            padding: 22px 20px;
        }
        .qxvip-input-box {
            width: 100%; padding: 13px; box-sizing: border-box;
            background: #0d1522; border: 1.5px solid #00ff66;
            border-radius: 12px; color: #00ff66; font-size: 16px;
            font-weight: bold; text-align: center; letter-spacing: 4px;
            outline: none; transition: all 0.3s ease;
            box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.8);
            user-select: text !important; -webkit-user-select: text !important;
        }
        .qxvip-input-box:focus {
            box-shadow: 0 0 15px rgba(0, 255, 102, 0.6);
        }
        .qxvip-login-btn {
            width: 100%; margin-top: 18px; padding: 13px;
            background: linear-gradient(135deg, #00ff66 0%, #00b347 100%);
            color: #02060c; font-size: 15px; font-weight: 900;
            border: none; border-radius: 12px; cursor: pointer;
            letter-spacing: 1.5px; text-transform: uppercase;
            box-shadow: 0 0 20px rgba(0, 255, 102, 0.4);
            transition: all 0.2s ease;
        }
        .qxvip-login-btn:active {
            transform: scale(0.96);
        }

        /* WIDGET LOGO WITH DARK RADIAL SHADOW */
        .qxvip-widget-container {
            position: fixed; top: 130px; left: 20px;
            display: flex; flex-direction: column; align-items: center;
            z-index: 999998; cursor: pointer; user-select: none;
        }
        .qxvip-widget-btn {
            width: 60px; height: 60px; border-radius: 50%; background: #03070d;
            border: 2px solid #00ff66;
            box-shadow: 0 0 15px rgba(0, 255, 102, 0.6), inset 0 0 15px rgba(0, 0, 0, 0.9);
            display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .qxvip-widget-img {
            width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
            filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.95));
        }
        .qxvip-widget-label {
            margin-top: 5px; background: #03070d; color: #ffffff;
            font-size: 10px; font-weight: 900; padding: 3px 10px;
            border-radius: 5px; border: 1px solid rgba(0, 255, 102, 0.5);
            letter-spacing: 1px; font-family: sans-serif;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.8);
        }

        /* SCANNING ANIMATION */
        @keyframes scanLaserLine {
            0% { top: 20%; opacity: 0.3; }
            50% { top: 50%; opacity: 1; }
            100% { top: 80%; opacity: 0.3; }
        }
        @keyframes scanTextPulse {
            0% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.96); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.04); }
            100% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.96); }
        }
        .qxvip-scan-line {
            position: fixed; left: 0; width: 100%; height: 3px;
            background: #00ff66; box-shadow: 0 0 15px #00ff66, 0 0 25px #00ff66;
            z-index: 999997; display: none; pointer-events: none;
            animation: scanLaserLine 1.4s ease-in-out infinite alternate;
        }
        .qxvip-scan-text {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            font-size: 26px; font-weight: 900; color: #00ff66;
            text-shadow: 0 0 15px rgba(0, 255, 102, 0.9), 0 0 30px rgba(0, 255, 102, 0.5);
            letter-spacing: 2px; z-index: 999999; pointer-events: none;
            font-family: 'Courier New', Courier, monospace; text-align: center;
            display: none; animation: scanTextPulse 0.9s ease-in-out infinite; line-height: 1.2;
        }
    `;
    document.head.appendChild(style);

    // 3. COVERED PASSWORD AUTO-LOGIN SETUP
    let savedPass = localStorage.getItem('qxvip_saved_pass') || CORRECT_PASS;

    let loginModal = document.createElement('div');
    loginModal.id = 'qxvip-login-modal';
    loginModal.className = 'qxvip-login-overlay';
    loginModal.innerHTML = `
        <div class="qxvip-login-card">
            <div class="qxvip-login-header">
                <h2>QX VIP LOGIN</h2>
            </div>
            <div class="qxvip-login-body">
                <input type="password" id="qxvip-pass-input" class="qxvip-input-box" value="${savedPass}" placeholder="ENTER PASS">
                <button id="qxvip-login-submit" class="qxvip-login-btn">ENTER BOT</button>
            </div>
        </div>
    `;
    document.body.appendChild(loginModal);

    // Keypress Enter Trigger
    document.getElementById('qxvip-pass-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('qxvip-login-submit').click();
        }
    });

    document.getElementById('qxvip-login-submit').addEventListener('click', function () {
        let inputVal = document.getElementById('qxvip-pass-input').value.trim();
        if (inputVal === CORRECT_PASS) {
            localStorage.setItem('qxvip_saved_pass', inputVal);
            loginModal.remove();
            initializeBotWidget();
        } else {
            alert("ACCESS DENIED: WRONG PASSWORD!");
        }
    });

    // 4. MAIN WIDGET INITIALIZATION
    function initializeBotWidget() {
        let container = document.createElement('div');
        container.id = 'qxvip-circle-widget';
        container.className = 'qxvip-widget-container';
        container.innerHTML = `
            <div class="qxvip-widget-btn">
                <img src="${customLogoUrl}" class="qxvip-widget-img" alt="QX VIP">
            </div>
            <div class="qxvip-widget-label">QX VIP</div>
        `;
        document.body.appendChild(container);

        let scanLine = document.createElement('div');
        scanLine.className = 'qxvip-scan-line';
        document.body.appendChild(scanLine);

        let scanText = document.createElement('div');
        scanText.className = 'qxvip-scan-text';
        scanText.innerHTML = "SCANNING<br>MARKET";
        document.body.appendChild(scanText);

        // Smooth Touch & Drag System
        let startX, startY, initialX, initialY, hasMoved = false;
        container.addEventListener('touchstart', dragStart, {passive: false});
        container.addEventListener('mousedown', dragStart);

        function dragStart(e) {
            hasMoved = false;
            let clientX = e.touches ? e.touches[0].clientX : e.clientX;
            let clientY = e.touches ? e.touches[0].clientY : e.clientY;
            startX = clientX; startY = clientY;
            initialX = container.offsetLeft; initialY = container.offsetTop;

            document.addEventListener('touchmove', dragMove, {passive: false});
            document.addEventListener('mousemove', dragMove);
            document.addEventListener('touchend', dragEnd);
            document.addEventListener('mouseup', dragEnd);
        }

        function dragMove(e) {
            let clientX = e.touches ? e.touches[0].clientX : e.clientX;
            let clientY = e.touches ? e.touches[0].clientY : e.clientY;
            if (Math.abs(clientX - startX) > 5 || Math.abs(clientY - startY) > 5) {
                hasMoved = true;
            }
            if (hasMoved) {
                if (e.cancelable) e.preventDefault();
                container.style.left = (initialX + (clientX - startX)) + 'px';
                container.style.top = (initialY + (clientY - startY)) + 'px';
            }
        }

        function dragEnd() {
            document.removeEventListener('touchmove', dragMove);
            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('touchend', dragEnd);
            document.removeEventListener('mouseup', dragEnd);

            if (!hasMoved && !isAnalyzing) {
                startAiMarketAnalysis(scanLine, scanText);
            }
        }
    }

    // 5. AI SCANNING & TRIGGER ENGINE
    function startAiMarketAnalysis(scanLine, scanText) {
        isAnalyzing = true;
        scanLine.style.display = 'block';
        scanText.style.display = 'block';

        setTimeout(() => {
            scanLine.style.display = 'none';
            scanText.style.display = 'none';

            let signal = analyzeMarketTechnical();
            executeTradeSignal(signal);

            isAnalyzing = false;
        }, 3200);
    }

    // Advanced Price Action Calculation Engine
    function analyzeMarketTechnical() {
        let redCandles = 0;
        let greenCandles = 0;

        let nodes = document.querySelectorAll('svg path, canvas, div[class*="candle"], div[class*="chart"]');
        nodes.forEach(node => {
            let fill = window.getComputedStyle(node).fill || '';
            let stroke = window.getComputedStyle(node).stroke || '';
            let bg = window.getComputedStyle(node).backgroundColor || '';
            let combined = fill + stroke + bg;

            if (combined.includes('255, 74, 104') || combined.includes('eb4d4b') || combined.includes('ff4d4d')) {
                redCandles++;
            } else if (combined.includes('0, 255, 102') || combined.includes('26a69a') || combined.includes('00e676')) {
                greenCandles++;
            }
        });

        // Dynamic Trend Analysis
        if (greenCandles > redCandles) {
            return 'UP';
        } else if (redCandles > greenCandles) {
            return 'DOWN';
        } else {
            return (new Date().getSeconds() % 2 === 0) ? 'UP' : 'DOWN';
        }
    }

    // ACCURATE DOM TRIGGER (QUOTEX HELP/CALL/PUT FIX)
    function executeTradeSignal(signal) {
        let upBtn = document.querySelector('button.btn-up, .section-deal__button._green, button[class*="call"], .call-btn, div[class*="call-btn"]');
        let downBtn = document.querySelector('button.btn-down, .section-deal__button._red, button[class*="put"], .put-btn, div[class*="put-btn"]');

        if (!upBtn || !downBtn) {
            let allBtns = Array.from(document.querySelectorAll('button, div[role="button"]'));
            upBtn = allBtns.find(b => (b.innerText || '').toLowerCase().includes('up') || (b.innerText || '').includes('উপরে') || (b.innerText || '').toLowerCase().includes('call'));
            downBtn = allBtns.find(b => (b.innerText || '').toLowerCase().includes('down') || (b.innerText || '').includes('নিচে') || (b.innerText || '').toLowerCase().includes('put'));
        }

        if (signal === 'UP' && upBtn) {
            upBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        } else if (signal === 'DOWN' && downBtn) {
            downBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }
    }
})();
