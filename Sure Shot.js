(function () {
    ['sureshot-bot', 'sureshot-login', 'sureshot-scan-canvas', 'sureshot-done-modal'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.remove();
    });

    let licenseKey = "ALVI-SSHECK;
    let logoUrl = "https://ibb.co.com/tT80gVR0"; 
    
    let isDataHacked = false; 
    let isScanning = false;

    const style = document.createElement('style');
    style.innerHTML = `
        #sureshot-logo-icon {
            width: 70px; 
            height: 70px;
            background: #0d131a url('${logoUrl}') center/cover no-repeat;
            border-radius: 50%;
            border: none !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.75), 0 0 10px rgba(0, 0, 0, 0.5);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        #sureshot-logo-icon.active-scan {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.9), 0 0 15px rgba(255, 255, 255, 0.2);
        }
    `;
    document.head.appendChild(style);

    let isLoggedIn = localStorage.getItem("sureshot_logged_in") === "true";

    let loginBox = document.createElement('div');
    loginBox.id = 'sureshot-login';
    loginBox.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 320px; background: #080f0a; border: 1.5px solid #00ff66;
        color: #ffffff; padding: 30px 24px; border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(0,255,102,0.4); z-index: 999999;
        font-family: Arial, sans-serif; text-align: center;
        display: ${isLoggedIn ? 'none' : 'block'};
    `;
    loginBox.innerHTML = `
        <h3 style="margin:0 0 6px 0; color:#00ff66; font-size:24px;">SURESHOT Access</h3>
        <p style="font-size:13px; color:#aaaaaa; margin:0 0 20px 0;">Enter Password</p>
        <input type="password" id="ss_pass" placeholder="••••••••" style="width:100%; padding:12px; background:#040805; color:#fff; border:1px solid #11331a; border-radius:10px; box-sizing:border-box; margin-bottom:18px; font-size:16px; outline:none; text-align:center;">
        <button id="ss_login_btn" style="width:100%; padding:12px; background:#00ff66; color:#000000; border:none; border-radius:10px; font-weight:bold; font-size:16px; cursor:pointer; box-shadow:0 4px 10px rgba(0,255,102,0.4);">LOGIN</button>
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
        color: #ffffff; font-weight: 800; font-size: 13px; margin-top: 8px;
        text-shadow: 0 2px 5px rgba(0,0,0,0.9); font-family: sans-serif; letter-spacing: 1.5px;
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

    let scanOverlay = document.createElement('div');
    scanOverlay.id = 'sureshot-scan-canvas';
    scanOverlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(3, 8, 5, 0.94); z-index: 999998; display: none;
        flex-direction: column; justify-content: center; align-items: center;
        font-family: monospace; color: #00ff66; box-sizing: border-box; padding: 20px;
    `;
    
    scanOverlay.innerHTML = `
        <div id="ss_matrix_text" style="position:absolute; top:25px; left:20px; font-size:11px; color:rgba(0,255,102,0.7); text-align:left; line-height:1.5; font-family:monospace;"></div>
        <div style="position:relative; width:200px; height:200px; display:flex; justify-content:center; align-items:center;">
            <div style="position:absolute; width:100%; height:100%; border:1px solid rgba(0,255,102,0.3); border-radius:50%;"></div>
            <div style="position:absolute; width:100%; height:100%; border-radius:50%; background: conic-gradient(from 0deg, rgba(0,255,102,0.4), transparent 60%); animation: radarSweep 1.8s linear infinite;"></div>
            <div style="font-size:22px; z-index:2; text-shadow:0 0 10px #00ff66;">🌐</div>
        </div>
        <div id="ss_status_text" style="margin-top:35px; font-size:15px; font-weight:bold; letter-spacing:2px; text-shadow:0 0 8px #00ff66;">ANALYZING MARKET DATA...</div>
        <div style="width:260px; height:8px; background:#08140c; border-radius:4px; margin-top:18px; overflow:hidden; border:1px solid rgba(0,255,102,0.5);">
            <div id="ss_progress_bar" style="width:0%; height:100%; background:#00ff66; box-shadow:0 0 12px #00ff66; transition:width 0.1s linear;"></div>
        </div>
        <style>@keyframes radarSweep { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    `;
    document.body.appendChild(scanOverlay);

    let doneModal = document.createElement('div');
    doneModal.id = 'sureshot-done-modal';
    doneModal.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 280px; background: #080f0a; border: 1.5px solid #00ff66;
        color: #ffffff; padding: 25px 20px; border-radius: 18px;
        box-shadow: 0 0 30px rgba(0,255,102,0.3); z-index: 999999;
        font-family: Arial, sans-serif; text-align: center; display: none;
    `;
    doneModal.innerHTML = `
        <h4 style="margin:0 0 10px 0; color:#00ff66; font-size:18px;">ANALYSIS COMPLETE</h4>
        <p style="font-size:12px; color:#cccccc; margin:0 0 20px 0;">Market indicators loaded.</p>
        <button id="ss_done_btn" style="width:100%; padding:10px; background:#00ff66; color:#000000; border:none; border-radius:8px; font-weight:bold; font-size:15px; cursor:pointer;">START</button>
    `;
    document.body.appendChild(doneModal);

    document.getElementById('ss_done_btn').onclick = function () {
        doneModal.style.display = 'none';
        isDataHacked = true;
    };

    let candleData = { green: 0, red: 0 };
    let liveTracker = null;

    function startMarketAnalysis() {
        candleData = { green: 0, red: 0 };
        liveTracker = setInterval(() => {
            let svgElements = document.querySelectorAll("path, rect, [class*='candle'], [class*='plot'], svg g");
            svgElements.forEach(el => {
                let fill = (el.getAttribute('fill') || el.style.fill || el.getAttribute('stroke') || el.style.stroke || '').toLowerCase();
                let className = (el.getAttribute('class') || '').toLowerCase();
                if (fill.includes('0, 255') || fill.includes('00ff') || fill.includes('26a69a') || className.includes('green') || className.includes('up')) {
                    candleData.green += 1;
                } else if (fill.includes('255, 0') || fill.includes('ff00') || fill.includes('ef5350') || className.includes('red') || className.includes('down')) {
                    candleData.red += 1;
                }
            });
        }, 30);
    }

    function stopMarketAnalysis() {
        if (liveTracker) clearInterval(liveTracker);
    }

    function triggerScan(durationSec, callback) {
        scanOverlay.style.display = 'flex';
        let progressBar = document.getElementById('ss_progress_bar');
        let matrixText = document.getElementById('ss_matrix_text');
        
        let logs = [
            "[SYSTEM] Fetching market stream...",
            "[ANALYSIS] Reading recent candle structures...",
            "[INDICATOR] Evaluating momentum signals...",
            "[EXECUTION] Preparing order placement..."
        ];

        startMarketAnalysis();

        let logIdx = 0;
        let matrixInterval = setInterval(() => {
            if (logIdx < logs.length) {
                matrixText.innerHTML += logs[logIdx] + "<br>";
                logIdx++;
            }
        }, (durationSec * 1000) / logs.length);

        let startTime = Date.now();
        let progressInterval = setInterval(() => {
            let elapsed = (Date.now() - startTime) / 1000;
            let percent = Math.min((elapsed / durationSec) * 100, 100);
            progressBar.style.width = percent + '%';

            if (elapsed >= durationSec) {
                clearInterval(progressInterval);
                clearInterval(matrixInterval);
                stopMarketAnalysis();
                scanOverlay.style.display = 'none';
                progressBar.style.width = '0%';
                matrixText.innerHTML = '';
                logoIcon.classList.remove('active-scan');
                isScanning = false;
                callback();
            }
        }, 50);
    }

    function executeTrade() {
        let direction = candleData.red > candleData.green ? "DOWN" : "UP";

        let selectors = ['button', 'div[role="button"]', 'div[class*="btn"]', 'div[class*="button"]'];
        let allElements = Array.from(document.querySelectorAll(selectors.join(',')));
        
        let targetBtn = allElements.find(el => {
            let text = (el.innerText || el.textContent || "").trim().toLowerCase();
            let cls = (el.className || "").toString().toLowerCase();
            if (direction === "UP") {
                return (text === "up" || text.includes("call") || cls.includes("green") || cls.includes("up")) && el.offsetWidth > 0;
            } else {
                return (text === "down" || text.includes("put") || cls.includes("red") || cls.includes("down")) && el.offsetWidth > 0;
            }
        });

        if (targetBtn) {
            ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(eventType => {
                let rect = targetBtn.getBoundingClientRect();
                let evt = new PointerEvent(eventType, {
                    bubbles: true, cancelable: true, view: window,
                    clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2,
                    pointerId: 1, pointerType: 'touch'
                });
                targetBtn.dispatchEvent(evt);
            });
        }
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

        if (!isDataHacked) {
            triggerScan(3, function () {
                doneModal.style.display = 'block';
            });
        } else {
            triggerScan(3, function () {
                executeTrade();
            });
        }
    });
})();
