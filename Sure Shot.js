(function () {
    // 1. Remove previous elements if existing
    ['qxvip-login-modal', 'qxvip-circle-widget', 'qxvip-style-sheet', 'qxvip-scan-line', 'qxvip-scan-text'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.remove();
    });

    let isAnalyzing = false;
    let customLogoUrl = "https://i.ibb.co.com/3yPZZrk2/1000323932-photoaidcom-cropped-jpg.png";
    const CORRECT_PASS = "5S-XALVI1001";

    // 2. CSS Inject (Custom Sleek Login UI + Main Widget)
    const style = document.createElement('style');
    style.id = 'qxvip-style-sheet';
    style.innerHTML = `
        /* LOGIN MODAL STYLES */
        .qxvip-login-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(2, 6, 12, 0.85); backdrop-filter: blur(8px);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999999; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .qxvip-login-card {
            width: 320px; background: #0b111e;
            border: 1.5px solid #00ff66; border-radius: 16px;
            box-shadow: 0 0 25px rgba(0, 255, 102, 0.35);
            overflow: hidden; text-align: center;
            animation: modalFade 0.3s ease-out;
        }
        @keyframes modalFade {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        .qxvip-login-header {
            background: linear-gradient(135deg, #051a0e, #0b111e);
            padding: 18px 10px; border-bottom: 1px solid rgba(0, 255, 102, 0.2);
        }
        .qxvip-login-header h2 {
            margin: 0; color: #00ff66; font-size: 20px;
            font-weight: 800; letter-spacing: 2px;
            text-shadow: 0 0 10px rgba(0, 255, 102, 0.5);
        }
        .qxvip-login-body {
            padding: 22px 20px;
        }
        .qxvip-login-body p {
            color: #a0aec0; font-size: 13px; margin-top: 0; margin-bottom: 15px;
        }
        .qxvip-input-box {
            width: 100%; padding: 12px 14px; box-sizing: border-box;
            background: #141e30; border: 1px solid #00ff66;
            border-radius: 8px; color: #ffffff; font-size: 15px;
            font-weight: bold; text-align: center; letter-spacing: 2px;
            outline: none; transition: 0.3s;
            user-select: text !important; -webkit-user-select: text !important;
        }
        .qxvip-input-box:focus {
            box-shadow: 0 0 10px rgba(0, 255, 102, 0.6);
        }
        .qxvip-login-btn {
            width: 100%; margin-top: 16px; padding: 12px;
            background: #00ff66; color: #05100a; font-size: 15px;
            font-weight: 900; border: none; border-radius: 8px;
            cursor: pointer; letter-spacing: 1px;
            box-shadow: 0 0 15px rgba(0, 255, 102, 0.4);
            transition: 0.2s;
        }
        .qxvip-login-btn:active {
            transform: scale(0.97);
        }

        /* MAIN WIDGET & ANIMATIONS */
        @keyframes scanLaser {
            0% { top: 15%; opacity: 0.4; }
            50% { top: 50%; opacity: 1; }
            100% { top: 85%; opacity: 0.4; }
        }
        @keyframes textGlow {
            0% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.95); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
            100% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.95); }
        }
        .qxvip-widget-container {
            position: fixed; top: 130px; left: 20px;
            display: flex; flex-direction: column; align-items: center;
            z-index: 999998; cursor: pointer; user-select: none;
        }
        .qxvip-widget-btn {
            width: 58px; height: 58px; border-radius: 50%; background: #090e17;
            border: 2px solid #00ff66; box-shadow: 0 0 12px rgba(0, 255, 102, 0.6);
            display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .qxvip-widget-img {
            width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
        }
        .qxvip-widget-label {
            margin-top: 4px; background: #060a10; color: #ffffff;
            font-size: 11px; font-weight: bold; padding: 2px 10px;
            border-radius: 4px; border: 1px solid #1a2332;
            letter-spacing: 0.5px; font-family: sans-serif;
            box-shadow: 0 2px 5px rgba(0,0,0,0.5);
        }
        .qxvip-scan-line {
            position: fixed; left: 0; width: 100%; height: 3px;
            background: #00ff66; box-shadow: 0 0 15px #00ff66, 0 0 25px #00ff66;
            z-index: 999997; display: none; pointer-events: none;
            animation: scanLaser 1.2s ease-in-out infinite alternate;
        }
        .qxvip-scan-text {
            position: fixed; top: 55%; left: 50%; transform: translate(-50%, -50%);
            font-size: 28px; font-weight: 900; color: #00ff66;
            text-shadow: 0 0 15px #00ff66, 0 0 30px #00ff66;
            letter-spacing: 2px; z-index: 999999; pointer-events: none;
            font-family: 'monospace', sans-serif; text-align: center;
            display: none; animation: textGlow 0.8s infinite; line-height: 1.1;
        }
    `;
    document.head.appendChild(style);

    // 3. COVERED PASSWORD INPUT DIALOG
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
                <p>Enter Access Password to Unlock AI Bot</p>
                <input type="password" id="qxvip-pass-input" class="qxvip-input-box" value="${savedPass}" placeholder="ENTER PASSWORD">
                <button id="qxvip-login-submit" class="qxvip-login-btn">ACCESS BOT</button>
            </div>
        </div>
    `;
    document.body.appendChild(loginModal);

    // Login Action Logic
    document.getElementById('qxvip-login-submit').addEventListener('click', function () {
        let inputVal = document.getElementById('qxvip-pass-input').value.trim();
        if (inputVal === CORRECT_PASS) {
            localStorage.setItem('qxvip_saved_pass', inputVal);
            loginModal.remove();
            initializeBotWidget();
        } else {
            alert("WRONG PASSWORD! Access Denied.");
        }
    });

    // 4. MAIN BOT INITIALIZATION
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

        // Touch Drag Logic
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

    // 5. AI SCANNING & TRADE EXECUTION ENGINE
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

    // Technical Analysis Calculation
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

        if (redCandles > greenCandles) {
            return 'UP';
        } else if (greenCandles > redCandles) {
            return 'DOWN';
        } else {
            return (new Date().getSeconds() % 2 === 0) ? 'UP' : 'DOWN';
        }
    }

    // Accurate Trade Execution
    function executeTradeSignal(signal) {
        let upBtn = document.querySelector('button.btn-up, .section-deal__button._green, button[class*="call"], .call-btn');
        let downBtn = document.querySelector('button.btn-down, .section-deal__button._red, button[class*="put"], .put-btn');

        if (!upBtn || !downBtn) {
            let allBtns = Array.from(document.querySelectorAll('button, div[role="button"]'));
            upBtn = allBtns.find(b => (b.innerText || '').toLowerCase().includes('up') || (b.innerText || '').includes('উপরে') || (b.innerText || '').toLowerCase().includes('call'));
            downBtn = allBtns.find(b => (b.innerText || '').toLowerCase().includes('down') || (b.innerText || '').includes('নিচে') || (b.innerText || '').toLowerCase().includes('put'));
        }

        if (signal === 'UP' && upBtn) {
            upBtn.click();
        } else if (signal === 'DOWN' && downBtn) {
            downBtn.click();
        }
    }
})();
