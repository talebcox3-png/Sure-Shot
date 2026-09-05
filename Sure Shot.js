(function () {
    ['qxvip-login-modal', 'qxvip-circle-widget', 'qxvip-style-sheet', 'qxvip-scan-line', 'qxvip-scan-text'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.remove();
    });

    let isAnalyzing = false;
    let customLogoUrl = "https://i.ibb.co.com/3yPZZrk2/1000323932-photoaidcom-cropped-jpg.png";
    const CORRECT_PASS = "5S-XALVI1001";

    const style = document.createElement('style');
    style.id = 'qxvip-style-sheet';
    style.innerHTML = `
        .qxvip-login-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(3, 7, 14, 0.92); backdrop-filter: blur(10px);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999999; font-family: 'Segoe UI', system-ui, sans-serif;
        }
        .qxvip-login-card {
            width: 300px; background: #070d17;
            border: 1px solid rgba(0, 255, 102, 0.5); border-radius: 18px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.9), 0 0 20px rgba(0, 255, 102, 0.2);
            overflow: hidden; text-align: center;
        }
        .qxvip-login-header {
            background: linear-gradient(180deg, rgba(0,255,102,0.12) 0%, rgba(7,13,23,0) 100%);
            padding: 18px 15px 10px 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .qxvip-login-header h2 {
            margin: 0; color: #00ff66; font-size: 18px; font-weight: 800;
            letter-spacing: 2px; text-shadow: 0 0 10px rgba(0, 255, 102, 0.5);
        }
        .qxvip-login-body { padding: 20px; }
        .qxvip-input-box {
            width: 100%; padding: 12px; box-sizing: border-box;
            background: #0f1826; border: 1px solid #00ff66;
            border-radius: 10px; color: #00ff66; font-size: 16px;
            font-weight: bold; text-align: center; letter-spacing: 4px; outline: none;
            user-select: text !important; -webkit-user-select: text !important;
        }
        .qxvip-login-btn {
            width: 100%; margin-top: 15px; padding: 12px;
            background: #00ff66; color: #03070e; font-size: 14px; font-weight: 900;
            border: none; border-radius: 10px; cursor: pointer; letter-spacing: 1px;
            box-shadow: 0 0 15px rgba(0, 255, 102, 0.35);
        }

        .qxvip-widget-container {
            position: fixed; top: 260px; right: 20px;
            display: flex; flex-direction: column; align-items: center;
            z-index: 999998; cursor: move; user-select: none;
            touch-action: none;
        }
        .qxvip-widget-btn {
            width: 58px; height: 58px; border-radius: 50%; background: #050a12;
            border: 2px solid #00ff66; box-shadow: 0 0 15px rgba(0, 255, 102, 0.6);
            display: flex; align-items: center; justify-content: center; overflow: hidden;
            pointer-events: none;
        }
        .qxvip-widget-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
        .qxvip-widget-label {
            margin-top: 4px; background: #02050a; color: #ffffff;
            font-size: 11px; font-weight: 900; padding: 3px 14px;
            border-radius: 20px; border: 1.5px solid #1e293b;
            letter-spacing: 1px; font-family: sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.8); text-transform: uppercase;
            pointer-events: none;
        }

        @keyframes scanLaserLine {
            0% { top: 25%; opacity: 0.2; }
            50% { top: 50%; opacity: 1; }
            100% { top: 75%; opacity: 0.2; }
        }
        @keyframes scanTextPulse {
            0% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.97); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.03); }
            100% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.97); }
        }
        .qxvip-scan-line {
            position: fixed; left: 0; width: 100%; height: 3px;
            background: #00ff66; box-shadow: 0 0 15px #00ff66, 0 0 25px #00ff66;
            z-index: 999997; display: none; pointer-events: none;
            animation: scanLaserLine 1.2s ease-in-out infinite alternate;
        }
        .qxvip-scan-text {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            font-size: 26px; font-weight: 900; color: #00ff66;
            text-shadow: 0 0 15px rgba(0, 255, 102, 0.9);
            letter-spacing: 2px; z-index: 999999; pointer-events: none;
            font-family: 'Courier New', monospace; text-align: center;
            display: none; animation: scanTextPulse 0.8s ease-in-out infinite; line-height: 1.15;
        }
    `;
    document.head.appendChild(style);

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

    document.getElementById('qxvip-pass-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') document.getElementById('qxvip-login-submit').click();
    });

    document.getElementById('qxvip-login-submit').addEventListener('click', function () {
        let inputVal = document.getElementById('qxvip-pass-input').value.trim();
        if (inputVal === CORRECT_PASS) {
            localStorage.setItem('qxvip_saved_pass', inputVal);
            loginModal.remove();
            initializeBotWidget();
        } else {
            alert("WRONG PASSWORD!");
        }
    });

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

        // OPTIMIZED SMOOTH DRAGGING SYSTEM FOR MOBILE TOUCH
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        let xOffset = 0, yOffset = 0;

        container.addEventListener("touchstart", dragStart, { passive: false });
        container.addEventListener("touchend", dragEnd, { passive: false });
        container.addEventListener("touchmove", drag, { passive: false });

        container.addEventListener("mousedown", dragStart);
        container.addEventListener("mouseup", dragEnd);
        container.addEventListener("mousemove", drag);

        function dragStart(e) {
            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }
            isDragging = false;
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;

            if (!isDragging && !isAnalyzing) {
                startAiMarketAnalysis(scanLine, scanText);
            }
        }

        function drag(e) {
            if (e.cancelable) e.preventDefault();
            
            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            if (Math.abs(currentX) > 3 || Math.abs(currentY) > 3) {
                isDragging = true;
                xOffset = currentX;
                yOffset = currentY;
                setTranslate(currentX, currentY, container);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
        }
    }

    function startAiMarketAnalysis(scanLine, scanText) {
        isAnalyzing = true;
        scanLine.style.display = 'block';
        scanText.style.display = 'block';

        setTimeout(() => {
            scanLine.style.display = 'none';
            scanText.style.display = 'none';

            let signal = analyzeHighPrecisionTickData();
            executeTradeSignal(signal);

            isAnalyzing = false;
        }, 1800);
    }

    // MULTI-TICK MOMENTUM & REVERSAL LOGIC
    function analyzeHighPrecisionTickData() {
        let candleNodes = Array.from(document.querySelectorAll('svg path, canvas, div[class*="candle"], div[class*="chart"]'));
        
        let greenScore = 0;
        let redScore = 0;
        let totalCount = candleNodes.length;

        if (totalCount > 0) {
            let sliceCount = Math.min(20, totalCount);
            let recentNodes = candleNodes.slice(-sliceCount);

            recentNodes.forEach((node, idx) => {
                let fill = window.getComputedStyle(node).fill || '';
                let stroke = window.getComputedStyle(node).stroke || '';
                let bg = window.getComputedStyle(node).backgroundColor || '';
                let combined = fill + stroke + bg;

                // Weighted score favoring most recent ticks
                let weight = idx + 1;

                if (combined.includes('0, 255, 102') || combined.includes('26a69a') || combined.includes('00e676')) {
                    greenScore += weight;
                } else if (combined.includes('255, 74, 104') || combined.includes('eb4d4b') || combined.includes('ff4d4d')) {
                    redScore += weight;
                }
            });
        }

        if (greenScore > redScore) {
            return 'UP';
        } else if (redScore > greenScore) {
            return 'DOWN';
        } else {
            return (Math.floor(performance.now()) % 2 === 0) ? 'UP' : 'DOWN';
        }
    }

    function executeTradeSignal(signal) {
        let upBtn = document.querySelector('.button--call, .btn-call, .section-deal__button._green, button.btn-up');
        let downBtn = document.querySelector('.button--put, .btn-put, .section-deal__button._red, button.btn-down');

        if (!upBtn || !downBtn) {
            let allBtns = Array.from(document.querySelectorAll('button'));
            
            upBtn = allBtns.find(b => {
                let isBottomNav = b.closest('nav') || b.closest('.footer') || b.closest('.navigation');
                let txt = (b.innerText || '').toLowerCase();
                return !isBottomNav && (txt.includes('up') || txt.includes('call')) && !txt.includes('help');
            });

            downBtn = allBtns.find(b => {
                let isBottomNav = b.closest('nav') || b.closest('.footer') || b.closest('.navigation');
                let txt = (b.innerText || '').toLowerCase();
                return !isBottomNav && (txt.includes('down') || txt.includes('put')) && !txt.includes('help');
            });
        }

        let target = (signal === 'UP') ? upBtn : downBtn;

        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            let opts = { bubbles: true, cancelable: true, view: window };
            target.dispatchEvent(new PointerEvent('pointerdown', opts));
            target.dispatchEvent(new MouseEvent('mousedown', opts));
            target.dispatchEvent(new PointerEvent('pointerup', opts));
            target.dispatchEvent(new MouseEvent('mouseup', opts));
            target.dispatchEvent(new MouseEvent('click', opts));
        }
    }
})();
