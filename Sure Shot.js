(function () {
    ['qx999-circle-bot', 'qx999-panel', 'qx999-login', 'qx999-scan-canvas', 'qx999-settings'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.remove();
    });

    let licenseKey = "Alvi1234";
    let logoUrl = "https://i.ibb.co.com/5hPpvrTB/Firefly-Remove-Background.png";
    let scanDurationSec = 3; 
    let selectedTradeMode = "5s trade"; 
    let isConfigured = false; 

    let isLoggedIn = localStorage.getItem("qx999_logged_in") === "true";
    let greenPower = 0;
    let redPower = 0;
    let analysisTimer = null;
    let tradeExecuted = false;

    const style = document.createElement('style');
    style.innerHTML = `
        #qx999-circle-bot {
            position: fixed; top: 120px; right: 20px;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            z-index: 999999; cursor: move; user-select: none; touch-action: none;
            padding: 4px; border-radius: 50%;
        }
        #qx999-logo-icon {
            width: 65px; height: 65px;
            background-color: rgba(0, 0, 0, 0.7);
            background-image: url('${logoUrl}');
            background-position: 62% 24%;
            background-size: 85%;
            background-repeat: no-repeat;
            border-radius: 50%;
            border: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
            pointer-events: none;
            transition: all 0.3s ease-in-out;
        }
        #qx999-circle-bot.glowing #qx999-logo-icon {
            box-shadow: 0 0 35px 15px rgba(0, 255, 102, 0.9), inset 0 0 20px rgba(0, 255, 102, 0.8) !important;
        }
        #qx999-circle-bot span {
            color: #ffffff !important; font-weight: bold; font-size: 13px;
            margin-top: 5px; text-shadow: 0 1px 3px rgba(0,0,0,0.9); 
            font-family: Arial, sans-serif; pointer-events: none;
            letter-spacing: 2px;
        }
        ::placeholder { color: #777777; }
        
        .qx-mode-btn {
            width: 100%; padding: 12px; background: #070d09; color: #fff;
            border: 1px solid #1a3322; border-radius: 12px; font-weight: 600;
            font-size: 15px; cursor: pointer; margin-bottom: 8px; text-align: center;
            transition: all 0.2s;
        }
        .qx-mode-btn.active {
            background: #00ff66; color: #000; border-color: #00ff66;
            box-shadow: 0 0 15px rgba(0, 255, 102, 0.4);
        }
        #qx_pass:focus {
            border-color: #00ff66 !important;
            box-shadow: 0 0 10px rgba(0, 255, 102, 0.5);
        }
        @keyframes qxFadeIn {
            from { opacity: 0; transform: translate(-50%, -48%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
    `;
    document.head.appendChild(style);

    let loginBox = document.createElement('div');
    loginBox.id = 'qx999-login';
    loginBox.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 330px; background: #0c150e; border: 2px solid #00ff66;
        color: #ffffff; padding: 35px 25px 30px 25px; border-radius: 20px;
        box-shadow: 0 0 35px rgba(0, 255, 102, 0.35); z-index: 999999;
        font-family: Arial, sans-serif; text-align: center; display: ${isLoggedIn ? 'none' : 'block'};
        animation: qxFadeIn 0.3s ease-out;
    `;
    loginBox.innerHTML = `
        <h2 style="margin:0 0 8px 0; color:#ffffff; font-size:26px; font-weight:bold;">Q X 9 9 9 Login</h2>
        <p style="font-size:14px; color:#b0b0b0; margin:0 0 25px 0;">Enter password to continue</p>
        <input type="password" id="qx_pass" placeholder="••••••••" style="width:100%; padding:14px 16px; background:#16241a; color:#fff; border:1.5px solid #233d2a; border-radius:12px; box-sizing:border-box; margin-bottom:22px; font-size:18px; outline:none; text-align:center; letter-spacing:4px;">
        <button id="qx_login_btn" style="width:100%; padding:14px; background:#00ff66; color:#000; border:none; border-radius:12px; font-weight:bold; font-size:17px; cursor:pointer; box-shadow: 0 0 15px rgba(0, 255, 102, 0.4);">Enter</button>
    `;
    document.body.appendChild(loginBox);

    let settingsBox = document.createElement('div');
    settingsBox.id = 'qx999-settings';
    settingsBox.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 330px; background: #0c150e; border: 1.5px solid #00ff66;
        color: #ffffff; padding: 24px; border-radius: 24px;
        box-shadow: 0 0 25px rgba(0, 255, 102, 0.25); z-index: 999999;
        font-family: Arial, sans-serif; display: none; max-height: 90vh; overflow-y: auto;
    `;
    settingsBox.innerHTML = `
        <h3 style="margin:0 0 15px 0; color:#00ff66; font-size:20px; text-align:center; font-weight:bold;">Q X 9 9 9 Settings</h3>
        <label style="font-size:13px; color:#ccc; display:block; margin-bottom:5px;">Scan delay (seconds)</label>
        <input type="number" id="qx_delay" value="3" min="2" style="width:100%; padding:12px; background:#070d09; color:#fff; border:1px solid #1a3322; border-radius:12px; box-sizing:border-box; margin-bottom:15px; outline:none; font-size:16px;">
        <label style="font-size:13px; color:#ccc; display:block; margin-bottom:8px;">Trade duration mode</label>
        <div id="qx_mode_1m" class="qx-mode-btn">1m trade</div>
        <div id="qx_mode_10s" class="qx-mode-btn">10s trade</div>
        <div id="qx_mode_5s" class="qx-mode-btn active">5s trade</div>
        <button id="qx_save_btn" style="width:100%; padding:14px; background:#00ff66; color:#000; border:none; border-radius:12px; font-weight:bold; font-size:16px; cursor:pointer; margin-top:10px; box-shadow: 0 0 15px rgba(0, 255, 102, 0.4);">Save</button>
    `;
    document.body.appendChild(settingsBox);

    let modeBtns = ['1m trade', '10s trade', '5s trade'];
    modeBtns.forEach(m => {
        let btnId = m === '1m trade' ? 'qx_mode_1m' : (m === '10s trade' ? 'qx_mode_10s' : 'qx_mode_5s');
        document.getElementById(btnId).onclick = function () {
            document.querySelectorAll('.qx-mode-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedTradeMode = m;
            if (m === '5s trade') scanDurationSec = 3;
            else if (m === '10s trade') scanDurationSec = 4;
            else scanDurationSec = 5;
            document.getElementById('qx_delay').value = scanDurationSec;
        };
    });

    let botContainer = document.createElement('div');
    botContainer.id = 'qx999-circle-bot';
    botContainer.style.display = isLoggedIn ? 'flex' : 'none';

    let logoIcon = document.createElement('div');
    logoIcon.id = 'qx999-logo-icon';
    let logoText = document.createElement('span');
    logoText.innerText = "Q X 9 9 9";

    botContainer.appendChild(logoIcon);
    botContainer.appendChild(logoText);
    document.body.appendChild(botContainer);

    let isDragging = false, hasMoved = false;
    let startX = 0, startY = 0, initialX = 0, initialY = 0;

    function dragStart(e) {
        hasMoved = false;
        let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        let clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        startX = clientX; startY = clientY;
        let rect = botContainer.getBoundingClientRect();
        initialX = rect.left; initialY = rect.top;
        botContainer.style.right = 'auto';
        botContainer.style.left = initialX + 'px';
        botContainer.style.top = initialY + 'px';

        if (e.type === 'mousedown') {
            document.addEventListener('mousemove', dragMove);
            document.addEventListener('mouseup', dragEnd);
        } else {
            document.addEventListener('touchmove', dragMove, { passive: false });
            document.addEventListener('touchend', dragEnd);
        }
    }

    function dragMove(e) {
        let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        let clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        let dx = clientX - startX, dy = clientY - startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            hasMoved = true; isDragging = true;
            if (e.cancelable) e.preventDefault();
        }
        if (isDragging) {
            botContainer.style.left = (initialX + dx) + 'px';
            botContainer.style.top = (initialY + dy) + 'px';
        }
    }

    function dragEnd() {
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchmove', dragMove);
        document.removeEventListener('touchend', dragEnd);
        setTimeout(() => { isDragging = false; }, 50);
    }

    botContainer.addEventListener('mousedown', dragStart);
    botContainer.addEventListener('touchstart', dragStart, { passive: false });

    let scanCanvas = document.createElement('canvas');
    scanCanvas.id = 'qx999-scan-canvas';
    scanCanvas.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        pointer-events: none; z-index: 999998; display: none;
    `;
    document.body.appendChild(scanCanvas);
    let ctx = scanCanvas.getContext('2d');

    function resizeCanvas() {
        scanCanvas.width = window.innerWidth;
        scanCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let scanAnimationId = null, scanY = -150, isScanning = false, scanStartTime = 0;

    function startScreenshotAnalysis() {
        greenPower = 0;
        redPower = 0;
        analysisTimer = setInterval(() => {
            let svgNodes = document.querySelectorAll("path, rect, [class*='candle'], [class*='plot'], [class*='bar']");
            svgNodes.forEach(el => {
                let fill = (el.getAttribute('fill') || el.style.fill || el.getAttribute('stroke') || el.style.stroke || '').toLowerCase();
                let cls = (el.getAttribute('class') || '').toLowerCase();
                if (fill.includes('0, 255') || fill.includes('00ff') || cls.includes('green') || cls.includes('up')) {
                    greenPower += 1;
                } else if (fill.includes('255, 0') || fill.includes('ff00') || cls.includes('red') || cls.includes('down')) {
                    redPower += 1;
                }
            });
        }, 30);
    }

    function drawSmoothScanLine() {
        let currentTime = Date.now();
        let elapsedSec = (currentTime - scanStartTime) / 1000;

        if (elapsedSec >= scanDurationSec) {
            finishScan();
            return;
        }

        ctx.clearRect(0, 0, scanCanvas.width, scanCanvas.height);
        let trailHeight = 180; 
        let grad = ctx.createLinearGradient(0, scanY - trailHeight, 0, scanY);
        grad.addColorStop(0, 'rgba(0, 255, 102, 0)');
        grad.addColorStop(0.4, 'rgba(0, 255, 102, 0.08)');
        grad.addColorStop(0.8, 'rgba(0, 255, 102, 0.35)');
        grad.addColorStop(1, 'rgba(0, 255, 102, 0.85)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - trailHeight, scanCanvas.width, trailHeight);

        ctx.beginPath();
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#00ff66';
        ctx.shadowBlur = 25;
        ctx.moveTo(0, scanY);
        ctx.lineTo(scanCanvas.width, scanY);
        ctx.stroke();

        scanY += 10;
        if (scanY > scanCanvas.height + 100) {
            scanY = -100;
        }

        if (elapsedSec >= (scanDurationSec - 0.3) && !tradeExecuted) {
            tradeExecuted = true;
            
            let chosenDirection = (greenPower >= redPower) ? "UP" : "DOWN";
            executeTrade(chosenDirection);
        }

        scanAnimationId = requestAnimationFrame(drawSmoothScanLine);
    }

    function finishScan() {
        if (analysisTimer) clearInterval(analysisTimer);
        scanCanvas.style.display = 'none';
        if (scanAnimationId) {
            cancelAnimationFrame(scanAnimationId);
            scanAnimationId = null;
        }
        botContainer.classList.remove('glowing');
        isScanning = false;
    }

    function executeTrade(direction) {
        let buttons = Array.from(document.querySelectorAll('button, div[role="button"], a'));
        let targetBtn = null;

        for (let btn of buttons) {
            let text = (btn.innerText || btn.textContent || "").trim().toLowerCase();
            let cls = (btn.className || "").toString().toLowerCase();
            
            if (direction === "UP") {
                if (text === "up" || text.includes("call") || text.includes("higher") || cls.includes("call") || cls.includes("success") || cls.includes("green")) {
                    targetBtn = btn;
                    break;
                }
            } else {
                if (text === "down" || text.includes("put") || text.includes("lower") || cls.includes("put") || cls.includes("danger") || cls.includes("red")) {
                    targetBtn = btn;
                    break;
                }
            }
        }

        if (!targetBtn) {
            let allBtns = buttons.filter(b => {
                let t = (b.innerText || "").trim().toLowerCase();
                return t === "up" || t === "down" || t.includes("call") || t.includes("put");
            });
            if (allBtns.length >= 2) {
                targetBtn = direction === "UP" ? allBtns[0] : allBtns[1];
            }
        }

        if (targetBtn) {
            targetBtn.click();
        }
    }

    document.getElementById('qx_login_btn').onclick = function () {
        let inputPass = document.getElementById('qx_pass').value;
        if (inputPass === licenseKey) {
            localStorage.setItem("qx999_logged_in", "true");
            loginBox.remove();
            botContainer.style.display = 'flex';
        } else {
            alert("Wrong Access Key!");
        }
    };

    document.getElementById('qx_pass').onkeydown = function (e) {
        if (e.key === 'Enter') {
            document.getElementById('qx_login_btn').click();
        }
    };

    document.getElementById('qx_save_btn').onclick = function () {
        let delayInput = parseFloat(document.getElementById('qx_delay').value);
        if (!isNaN(delayInput) && delayInput >= 2) {
            scanDurationSec = delayInput;
        }
        settingsBox.style.display = 'none';
        isConfigured = true;
    };

    botContainer.addEventListener('click', function (e) {
        if (hasMoved || isDragging) return;
        if (!isConfigured) {
            settingsBox.style.display = 'block';
            return;
        }
        if (isScanning) return;

        isScanning = true;
        tradeExecuted = false;
        botContainer.classList.add('glowing');
        scanCanvas.style.display = 'block';
        scanY = -150;
        scanStartTime = Date.now();
        
        startScreenshotAnalysis();
        drawSmoothScanLine();
    });
})();
