(function () {
    ['sureshot-bot', 'sureshot-login', 'sureshot-scan-canvas', 'sureshot-done-modal'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.remove();
    });

    let licenseKey = "Alvi1234";
    let logoUrl = "https://i.ibb.co/35vKSFyz/image.jpg";
    
    let isDataHacked = false; 
    let isScanning = false;
    let greenForce = 0;
    let redForce = 0;
    let analysisTimer = null;

    const style = document.createElement('style');
    style.innerHTML = `
        #sureshot-logo-icon {
            width: 65px; height: 65px;
            background: url('${logoUrl}') center/cover no-repeat;
            border-radius: 50%;
            border: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
            transition: transform 0.3s ease;
        }
        #sureshot-logo-icon.active-scan {
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    let isLoggedIn = localStorage.getItem("sureshot_logged_in") === "true";

    let loginBox = document.createElement('div');
    loginBox.id = 'sureshot-login';
    loginBox.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 320px; background: #0c150e; border: 1.5px solid #333333;
        color: #ffffff; padding: 30px 24px; border-radius: 20px;
        box-shadow: 0 0 30px rgba(0,0,0,0.8); z-index: 999999;
        font-family: Arial, sans-serif; text-align: center;
        display: ${isLoggedIn ? 'none' : 'block'};
    `;
    loginBox.innerHTML = `
        <h3 style="margin:0 0 6px 0; color:#ffffff; font-size:22px;">SURESHOT LOGIN</h3>
        <p style="font-size:13px; color:#aaaaaa; margin:0 0 20px 0;">Enter License Key</p>
        <input type="password" id="ss_pass" placeholder="••••••••" style="width:100%; padding:12px; background:#070d09; color:#fff; border:1px solid #222; border-radius:10px; box-sizing:border-box; margin-bottom:18px; font-size:16px; outline:none; text-align:center;">
        <button id="ss_login_btn" style="width:100%; padding:12px; background:#ffffff; color:#000000; border:none; border-radius:10px; font-weight:bold; font-size:16px; cursor:pointer;">ENTER</button>
    `;
    document.body.appendChild(loginBox);

    let botContainer = document.createElement('div');
    botContainer.id = 'sureshot-bot';
    botContainer.style.cssText = `
        position: fixed; top: 120px; right: 20px;
        display: ${isLoggedIn ? 'flex' : 'none'}; flex-direction: column; align-items: center;
        z-index: 999999; cursor: move; user-select: none; touch-action: none;
    `;

    let logoIcon = document.createElement('div');
    logoIcon.id = 'sureshot-logo-icon';

    let logoText = document.createElement('span');
    logoText.style.cssText = `
        color: #ffffff; font-weight: bold; font-size: 13px; margin-top: 6px;
        text-shadow: 0 2px 4px #000000; font-family: Arial, sans-serif; letter-spacing: 1px;
    `;
    logoText.innerText = "SURESHOT";

    botContainer.appendChild(logoIcon);
    botContainer.appendChild(logoText);
    document.body.appendChild(botContainer);

    let isDragging = false, startX, startY, initialX, initialY;
    function dragStart(e) {
        isDragging = false;
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let clientY = e.touches ? e.touches[0].clientY : e.clientY;
        startX = clientX; startY = clientY;
        initialX = botContainer.offsetLeft; initialY = botContainer.offsetTop;
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('touchmove', dragMove);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
    }
    function dragMove(e) {
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let clientY = e.touches ? e.touches[0].clientY : e.clientY;
        let dx = clientX - startX, dy = clientY - startY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) isDragging = true;
        botContainer.style.left = (initialX + dx) + 'px';
        botContainer.style.top = (initialY + dy) + 'px';
        botContainer.style.right = 'auto';
    }
    function dragEnd() {
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('touchmove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchend', dragEnd);
    }
    botContainer.addEventListener('mousedown', dragStart);
    botContainer.addEventListener('touchstart', dragStart);

    let scanCanvas = document.createElement('canvas');
    scanCanvas.id = 'sureshot-scan-canvas';
    scanCanvas.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        pointer-events: none; z-index: 999998; display: none;
    `;
    document.body.appendChild(scanCanvas);
    let ctx = scanCanvas.getContext('2d');
    function resizeCanvas() { scanCanvas.width = window.innerWidth; scanCanvas.height = window.innerHeight; }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let scanAnimationId = null, scanY = 0, scanStartTime = 0, currentDurationSec = 3;

    function startRealTimeAnalysis() {
        greenForce = 0; redForce = 0;
        analysisTimer = setInterval(() => {
            let svgElements = document.querySelectorAll("path, rect, [class*='candle'], [class*='plot']");
            svgElements.forEach(el => {
                let fill = el.getAttribute('fill') || el.style.fill || el.getAttribute('stroke') || el.style.stroke || '';
                let className = (el.getAttribute('class') || '').toLowerCase();
                if (fill.includes('0, 255') || fill.includes('00ff') || fill.includes('26a69a') || className.includes('green') || className.includes('up')) {
                    greenForce += 2;
                } else if (fill.includes('255, 0') || fill.includes('ff00') || fill.includes('ef5350') || className.includes('red') || className.includes('down')) {
                    redForce += 2;
                }
            });
        }, 40);
    }

    function drawSmokeScanLine() {
        let elapsedSec = (Date.now() - scanStartTime) / 1000;
        if (elapsedSec >= currentDurationSec) {
            finishScan();
            return;
        }

        ctx.clearRect(0, 0, scanCanvas.width, scanCanvas.height);
        let trailHeight = 150;
        let grad = ctx.createLinearGradient(0, scanY - trailHeight, 0, scanY);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.25)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, Math.max(0, scanY - trailHeight), scanCanvas.width, trailHeight);

        ctx.beginPath();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.moveTo(0, scanY);
        ctx.lineTo(scanCanvas.width, scanY);
        ctx.stroke();

        scanY += 8;
        if (scanY > scanCanvas.height) scanY = 0;
        scanAnimationId = requestAnimationFrame(drawSmokeScanLine);
    }

    let doneModal = document.createElement('div');
    doneModal.id = 'sureshot-done-modal';
    doneModal.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 280px; background: #0c150e; border: 1.5px solid #ffffff;
        color: #ffffff; padding: 25px 20px; border-radius: 18px;
        box-shadow: 0 0 25px rgba(0,0,0,0.8); z-index: 999999;
        font-family: Arial, sans-serif; text-align: center; display: none;
    `;
    doneModal.innerHTML = `
        <h4 style="margin:0 0 10px 0; color:#ffffff; font-size:18px;">PROCESS COMPLETE</h4>
        <p style="font-size:12px; color:#cccccc; margin:0 0 20px 0;">Market Data Hacked Successfully</p>
        <button id="ss_done_btn" style="width:100%; padding:10px; background:#ffffff; color:#000000; border:none; border-radius:8px; font-weight:bold; font-size:15px; cursor:pointer;">DONE</button>
    `;
    document.body.appendChild(doneModal);

    document.getElementById('ss_done_btn').onclick = function () {
        doneModal.style.display = 'none';
        isDataHacked = true;
    };

    function finishScan() {
        if (analysisTimer) clearInterval(analysisTimer);
        scanCanvas.style.display = 'none';
        if (scanAnimationId) { cancelAnimationFrame(scanAnimationId); scanAnimationId = null; }
        logoIcon.classList.remove('active-scan');
        isScanning = false;

        if (!isDataHacked) {
            doneModal.style.display = 'block';
        } else {
            let selectedSignal = "UP";
            if (redForce > greenForce) {
                selectedSignal = "DOWN";
            } else if (greenForce === redForce) {
                selectedSignal = Math.random() > 0.5 ? "UP" : "DOWN";
            }
            executeTrade(selectedSignal);
        }
    }

    function executeTrade(direction) {
        let allElements = Array.from(document.querySelectorAll('button, div[role="button"], a, input[type="button"], div.button'));
        let targetBtn = null;

        if (direction === "UP") {
            targetBtn = allElements.find(el => {
                let text = (el.innerText || el.textContent || "").trim();
                let cls = (el.className || "").toString().toLowerCase();
                return text.includes("Up") || text.includes("Call") || text.includes("কল") || cls.includes("btn-green") || cls.includes("button-call") || cls.includes("call");
            });
        } else {
            targetBtn = allElements.find(el => {
                let text = (el.innerText || el.textContent || "").trim();
                let cls = (el.className || "").toString().toLowerCase();
                return text.includes("Down") || text.includes("Put") || text.includes("পুট") || cls.includes("btn-red") || cls.includes("button-put") || cls.includes("put");
            });
        }

        if (targetBtn) targetBtn.click();
    }

    document.getElementById('ss_login_btn').onclick = function () {
        let inputPass = document.getElementById('ss_pass').value;
        if (inputPass === licenseKey) {
            localStorage.setItem("sureshot_logged_in", "true");
            loginBox.remove();
            botContainer.style.display = 'flex';
        }
    };

    botContainer.addEventListener('click', function () {
        if (isDragging || isScanning) return;

        isScanning = true;
        logoIcon.classList.add('active-scan');
        scanCanvas.style.display = 'block';
        scanY = 0;
        scanStartTime = Date.now();

        if (!isDataHacked) {
            currentDurationSec = 3;
        } else {
            currentDurationSec = 5;
        }

        startRealTimeAnalysis();
        drawSmokeScanLine();
    });
})();
