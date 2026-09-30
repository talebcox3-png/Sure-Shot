(function () {
    ['qx999-circle-bot', 'qx999-panel', 'qx999-login', 'qx999-scan-canvas', 'qx999-settings'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.remove();
    });

    let licenseKey = "ALVI5S-KINGQX";
    let logoUrl = "https://i.ibb.co.com/5hPpvrTB/Firefly-Remove-Background.png";
    let scanDurationSec = 5; 
    let selectedTradeMode = localStorage.getItem("qx999_mode") || "RANDOM"; 

    let isLoggedIn = localStorage.getItem("qx999_logged_in") === "true";
    let savedPass = localStorage.getItem("qx999_saved_pass") || "";
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
            background-color: rgba(0, 0, 0, 0.35);
            background-image: url('${logoUrl}');
            background-position: 58% center;
            background-size: 85%;
            background-repeat: no-repeat;
            border-radius: 50%;
            border: none;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            pointer-events: none;
            transition: all 0.3s ease-in-out;
        }
        #qx999-circle-bot.glowing #qx999-logo-icon {
            box-shadow: 0 0 50px 18px rgba(0, 255, 102, 0.85), 0 20px 60px rgba(0, 255, 102, 0.6) !important;
            transform: none !important;
        }
        #qx999-circle-bot span {
            color: #ffffff !important; font-weight: bold; font-size: 13px;
            margin-top: 5px; text-shadow: 0 1px 3px rgba(0,0,0,0.9); font-family: Arial, sans-serif; pointer-events: none;
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
    `;
    document.head.appendChild(style);

    // Login Box (Shield blueish style input as requested)
    let loginBox = document.createElement('div');
    loginBox.id = 'qx999-login';
    loginBox.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 330px; background: #0c150e; border: 1.5px solid #00ff66;
        color: #ffffff; padding: 35px 24px 30px 24px; border-radius: 24px;
        box-shadow: 0 0 25px rgba(0, 255, 102, 0.25); z-index: 999999;
        font-family: sans-serif; text-align: center; display: none;
    `;
    loginBox.innerHTML = `
        <h3 style="margin:0 0 6px 0; color:#00ff66; font-size:24px; font-weight:500;">QX999 Login</h3>
        <p style="font-size:14px; color:#cccccc; margin:0 0 25px 0;">Enter password to continue</p>
        <input type="password" id="qx_pass" value="${savedPass}" placeholder="••••••••" style="width:100%; padding:14px 16px; background:#0a192f; color:#fff; border:1px solid #00ff66; border-radius:12px; box-sizing:border-box; margin-bottom:20px; font-size:18px; outline:none; letter-spacing:3px; box-shadow: inset 0 0 10px rgba(0, 140, 255, 0.3);">
        <button id="qx_login_btn" style="width:100%; padding:14px; background:#00ff66; color:#000; border:none; border-radius:12px; font-weight:600; font-size:17px; cursor:pointer; box-shadow: 0 0 15px rgba(0, 255, 102, 0.4);">Enter</button>
    `;
    document.body.appendChild(loginBox);

    // Settings Box with BUY, SELL, RANDOM modes
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
        <h3 style="margin:0 0 15px 0; color:#00ff66; font-size:20px; text-align:center; font-weight:bold;">QX999 Settings</h3>
        
        <label style="font-size:13px; color:#ccc; display:block; margin-bottom:8px;">Select Trade Mode</label>
        <div id="qx_mode_buy" class="qx-mode-btn ${selectedTradeMode === 'BUY' ? 'active' : ''}">BUY</div>
        <div id="qx_mode_sell" class="qx-mode-btn ${selectedTradeMode === 'SELL' ? 'active' : ''}">SELL</div>
        <div id="qx_mode_random" class="qx-mode-btn ${selectedTradeMode === 'RANDOM' ? 'active' : ''}">RANDOM (Auto 5s)</div>
        
        <button id="qx_save_btn" style="width:100%; padding:14px; background:#00ff66; color:#000; border:none; border-radius:12px; font-weight:bold; font-size:16px; cursor:pointer; margin-top:15px; box-shadow: 0 0 15px rgba(0, 255, 102, 0.4);">Save & Run</button>
    `;
    document.body.appendChild(settingsBox);

    // Mode selection handlers
    ['BUY', 'SELL', 'RANDOM'].forEach(m => {
        let btnId = m === 'BUY' ? 'qx_mode_buy' : (m === 'SELL' ? 'qx_mode_sell' : 'qx_mode_random');
        document.getElementById(btnId).onclick = function () {
            document.querySelectorAll('.qx-mode-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedTradeMode = m;
            localStorage.setItem("qx999_mode", m);
        };
    });

    // Circular Bot Container
    let botContainer = document.createElement('div');
    botContainer.id = 'qx999-circle-bot';
    botContainer.style.display = 'flex'; // Always visible on search/inject

    let logoIcon = document.createElement('div');
    logoIcon.id = 'qx999-logo-icon';
    let logoText = document.createElement('span');
    logoText.innerText = "QX999";

    botContainer.appendChild(logoIcon);
    botContainer.appendChild(logoText);
    document.body.appendChild(botContainer);

    // Dragging Logic
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

    // Scan Canvas Animation
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
    let priceHistory = [];

    function startMarketAnalysis() {
        greenPower = 0;
        redPower = 0;
        priceHistory = [];

        analysisTimer = setInterval(() => {
            let svgNodes = document.querySelectorAll("path, rect, [class*='candle'], [class*='plot'], [class*='bar']");
            svgNodes.forEach(el => {
                let fill = (el.getAttribute('fill') || el.style.fill || el.getAttribute('stroke') || el.style.stroke || '').toLowerCase();
                let cls = (el.getAttribute('class') || '').toLowerCase();
                
                if (fill.includes('0, 255') || fill.includes('00ff') || fill.includes('26a69a') || cls.includes('green') || cls.includes('up') || cls.includes('bull')) {
                    greenPower += 20;
                } else if (fill.includes('255, 0') || fill.includes('ff00') || fill.includes('ef5350') || cls.includes('red') || cls.includes('down') || cls.includes('bear')) {
                    redPower += 20;
                }
            });

            let prices = Array.from(document.querySelectorAll('span, div, [class*="price"]'))
                .map(e => e.innerText ? e.innerText.trim() : '')
                .filter(t => /^\d+\.\d+$/.test(t));

            if (prices.length > 0) {
                let currentVal = parseFloat(prices[prices.length - 1]);
                priceHistory.push(currentVal);
                if (priceHistory.length > 8) priceHistory.shift();

                if (priceHistory.length >= 3) {
                    let recentDiff = priceHistory[priceHistory.length - 1] - priceHistory[priceHistory.length - 3];
                    if (recentDiff > 0) greenPower += 50; 
                    else if (recentDiff < 0) redPower += 50;  
                }
            }
        }, 15);
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

        scanY += 8;
        if (scanY > scanCanvas.height + 100) scanY = -100;

        if (elapsedSec >= (scanDurationSec - 0.4) && !tradeExecuted) {
            tradeExecuted = true;
            
            let finalDirection = "UP";
            if (selectedTradeMode === "BUY") {
                finalDirection = "UP";
            } else if (selectedTradeMode === "SELL") {
                finalDirection = "DOWN";
            } else {
                // RANDOM Mode Analysis
                if (greenPower > redPower) finalDirection = "UP";
                else if (redPower > greenPower) finalDirection = "DOWN";
                else finalDirection = priceHistory.length >= 2 && priceHistory[priceHistory.length - 1] >= priceHistory[0] ? "UP" : "DOWN";
            }

            executeTrade(finalDirection);
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
        let allElements = Array.from(document.querySelectorAll('button, div[role="button"], a, input[type="button"], div.button'));
        let targetBtn = null;

        if (direction === "UP") {
            targetBtn = allElements.find(el => {
                let text = (el.innerText || el.textContent || "").trim();
                let cls = (el.className || "").toString().toLowerCase();
                return text.includes("Up") || text.includes("Call") || text.includes("Higher") || text.includes("Buy") || text.includes("কল") || cls.includes("green") || cls.includes("call");
            });
        } else {
            targetBtn = allElements.find(el => {
                let text = (el.innerText || el.textContent || "").trim();
                let cls = (el.className || "").toString().toLowerCase();
                return text.includes("Down") || text.includes("Put") || text.includes("Lower") || text.includes("Sell") || text.includes("পুট") || cls.includes("red") || cls.includes("put");
            });
        }

        if (targetBtn) targetBtn.click();
    }

    // Login Action
    document.getElementById('qx_login_btn').onclick = function () {
        let inputPass = document.getElementById('qx_pass').value;
        if (inputPass === licenseKey) {
            localStorage.setItem("qx999_logged_in", "true");
            localStorage.setItem("qx999_saved_pass", inputPass);
            loginBox.style.display = 'none';
            settingsBox.style.display = 'block';
        } else {
            alert("Wrong Access Key!");
        }
    };

    document.getElementById('qx_pass').onkeydown = function (e) {
        if (e.key === 'Enter') document.getElementById('qx_login_btn').click();
    };

    // Settings Save Action
    document.getElementById('qx_save_btn').onclick = function () {
        settingsBox.style.display = 'none';
    };

    // Bot Click Behavior
    botContainer.addEventListener('click', function (e) {
        if (hasMoved || isDragging) return;

        let checkLogin = localStorage.getItem("qx999_logged_in") === "true";
        if (!checkLogin) {
            loginBox.style.display = 'block';
            return;
        }

        // If logged in, clicking the bot opens settings
        if (settingsBox.style.display === 'block') {
            settingsBox.style.display = 'none';
            return;
        } else {
            settingsBox.style.display = 'block';
        }
    });
})();
