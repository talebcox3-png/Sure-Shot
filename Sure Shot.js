(function () {
    ['qxvip-login-modal', 'qxvip-circle-widget', 'qxvip-style-sheet', 'qxvip-scan-line', 'qxvip-scan-text'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.remove();
    });

    let isAnalyzing = false;
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
        }
        .qxvip-login-btn {
            width: 100%; margin-top: 15px; padding: 12px;
            background: #00ff66; color: #03070e; font-size: 14px; font-weight: 900;
            border: none; border-radius: 10px; cursor: pointer; letter-spacing: 1px;
            box-shadow: 0 0 15px rgba(0, 255, 102, 0.35);
        }

        .qxvip-widget-container {
            position: fixed; top: 200px; right: 20px;
            display: flex; flex-direction: column; align-items: center;
            z-index: 999998; touch-action: none; cursor: pointer;
        }
        .qxvip-widget-btn {
            width: 62px; height: 62px; border-radius: 50%;
            background: radial-gradient(circle, #001f3f 0%, #000814 100%);
            border: 2px solid #00d2ff; box-shadow: 0 0 15px rgba(0, 210, 255, 0.8);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            overflow: hidden; pointer-events: none;
        }
        .qxvip-widget-title {
            color: #00ffff; font-size: 11px; font-weight: 900;
            letter-spacing: 0.5px; text-shadow: 0 0 5px #00ffff;
        }
        .qxvip-widget-sub {
            color: #ffffff; font-size: 8px; font-weight: 700;
            margin-top: -2px; letter-spacing: 0.5px;
        }
        .qxvip-widget-label {
            margin-top: 5px; background: rgba(2, 5, 10, 0.85); color: #00ff66;
            font-size: 10px; font-weight: 900; padding: 2px 10px;
            border-radius: 12px; border: 1px solid #00ff66;
            letter-spacing: 1px; font-family: sans-serif; pointer-events: none;
        }

        @keyframes scanTextPulse {
            0% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.95); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
            100% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.95); }
        }
        .qxvip-scan-text {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            font-size: 30px; font-weight: 900; color: #00ff66;
            text-shadow: 0 0 20px rgba(0, 255, 102, 1), 0 0 10px #000;
            letter-spacing: 2px; z-index: 999999; pointer-events: none;
            font-family: 'Arial Black', Impact, sans-serif; text-align: center;
            display: none; animation: scanTextPulse 0.7s infinite alternate; line-height: 1.1;
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
                <span class="qxvip-widget-title">QX VIP</span>
                <span class="qxvip-widget-sub">PRO</span>
            </div>
            <div class="qxvip-widget-label">WITH MKT</div>
        `;
        document.body.appendChild(container);

        let scanText = document.createElement('div');
        scanText.className = 'qxvip-scan-text';
        scanText.innerHTML = "SCANNING<br>MARKET";
        document.body.appendChild(scanText);

        let isDragging = false;
        let startX = 0, startY = 0;
        let initialLeft = container.offsetLeft;
        let initialTop = container.offsetTop;

        function onTouchStart(e) {
            let touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            initialLeft = container.offsetLeft;
            initialTop = container.offsetTop;
            isDragging = false;
        }

        function onTouchMove(e) {
            let touch = e.touches[0];
            let dx = touch.clientX - startX;
            let dy = touch.clientY - startY;

            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                isDragging = true;
                if (e.cancelable) e.preventDefault();
                
                let newLeft = Math.min(Math.max(10, initialLeft + dx), window.innerWidth - 70);
                let newTop = Math.min(Math.max(10, initialTop + dy), window.innerHeight - 70);
                
                container.style.left = newLeft + 'px';
                container.style.top = newTop + 'px';
                container.style.right = 'auto';
            }
        }

        function onTouchEnd(e) {
            if (!isDragging && !isAnalyzing) {
                startAiMarketAnalysis(scanText);
            }
        }

        container.addEventListener('touchstart', onTouchStart, { passive: false });
        container.addEventListener('touchmove', onTouchMove, { passive: false });
        container.addEventListener('touchend', onTouchEnd);

        container.addEventListener('mousedown', function(e) {
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = container.offsetLeft;
            initialTop = container.offsetTop;
            isDragging = false;

            function onMouseMove(me) {
                let dx = me.clientX - startX;
                let dy = me.clientY - startY;
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                    isDragging = true;
                    container.style.left = (initialLeft + dx) + 'px';
                    container.style.top = (initialTop + dy) + 'px';
                    container.style.right = 'auto';
                }
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                if (!isDragging && !isAnalyzing) {
                    startAiMarketAnalysis(scanText);
                }
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    function startAiMarketAnalysis(scanText) {
        isAnalyzing = true;
        scanText.style.display = 'block';

        setTimeout(() => {
            scanText.style.display = 'none';
            let signal = analyzeHighAccuracyPattern();
            executeTradeSignal(signal);
            isAnalyzing = false;
        }, 1600);
    }

    function analyzeHighAccuracyPattern() {
        let greenCount = 0;
        let redCount = 0;

        let elements = Array.from(document.querySelectorAll('svg path, canvas, div[class*="candle"]'));
        elements.slice(-12).forEach((el, i) => {
            let style = window.getComputedStyle(el);
            let colorStr = (style.fill + style.stroke + style.backgroundColor).toLowerCase();

            if (colorStr.includes('0, 255') || colorStr.includes('26a69a') || colorStr.includes('green')) {
                greenCount += (i + 1);
            } else if (colorStr.includes('255, 74') || colorStr.includes('eb4d4b') || colorStr.includes('red')) {
                redCount += (i + 1);
            }
        });

        return (greenCount >= redCount) ? 'UP' : 'DOWN';
    }

    function executeTradeSignal(signal) {
        let upBtn = document.querySelector('.button--call, .btn-call, .section-deal__button._green, button.btn-up, .btn-green');
        let downBtn = document.querySelector('.button--put, .btn-put, .section-deal__button._red, button.btn-down, .btn-red');

        if (!upBtn || !downBtn) {
            let buttons = Array.from(document.querySelectorAll('button'));
            upBtn = buttons.find(b => {
                let txt = (b.innerText || '').toLowerCase();
                let parentNav = b.closest('nav') || b.closest('.footer');
                return !parentNav && (txt.includes('up') || txt.includes('call') || txt.includes('উপরে')) && !txt.includes('help');
            });

            downBtn = buttons.find(b => {
                let txt = (b.innerText || '').toLowerCase();
                let parentNav = b.closest('nav') || b.closest('.footer');
                return !parentNav && (txt.includes('down') || txt.includes('put') || txt.includes('নিচে')) && !txt.includes('help');
            });
        }

        let target = (signal === 'UP') ? upBtn : downBtn;

        if (target) {
            let events = ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'];
            events.forEach(evt => {
                target.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, view: window }));
            });
        }
    }
})();
