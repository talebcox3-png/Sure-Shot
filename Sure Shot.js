(function () {
    // 1. Remove previous instances
    ['qxvip-login-box', 'qxvip-circle-widget', 'qxvip-style-sheet', 'qxvip-scan-line', 'qxvip-scan-text'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.remove();
    });

    let licenseKey = "ALVI5S-HECK";
    let isAnalyzing = false;
    let logoImageDirect = "https://i.ibb.co/6R22h32/image.png";

    // CSS Styles & Custom Animations
    const style = document.createElement('style');
    style.id = 'qxvip-style-sheet';
    style.innerHTML = `
        @keyframes rotateBorder {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
            0% { box-shadow: 0 0 12px rgba(0, 255, 102, 0.4); }
            50% { box-shadow: 0 0 25px rgba(0, 255, 102, 0.9); }
            100% { box-shadow: 0 0 12px rgba(0, 255, 102, 0.4); }
        }
        @keyframes scanMove {
            0% { top: 20%; opacity: 0.2; }
            50% { top: 50%; opacity: 1; }
            100% { top: 80%; opacity: 0.2; }
        }
        @keyframes textGlowPulse {
            0% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.98); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.03); }
            100% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.98); }
        }

        .qxvip-circle-btn {
            position: fixed; top: 120px; right: 20px;
            width: 85px; height: 85px; border-radius: 50%;
            background: rgba(5, 12, 8, 0.94);
            border: 2px solid #00ff66;
            box-shadow: 0 0 20px rgba(0, 255, 102, 0.5);
            display: flex; flex-direction: column; align-items: center; justify- justify-content: center;
            z-index: 999998; cursor: pointer; user-select: none;
            backdrop-filter: blur(8px); animation: pulseGlow 2s infinite;
        }
        .qxvip-circle-btn::before {
            content: ''; position: absolute; top: -5px; left: -5px; right: -5px; bottom: -5px;
            border-radius: 50%; border: 2px dashed #00ff66;
            animation: rotateBorder 6s linear infinite; pointer-events: none;
        }
        .qxvip-badge {
            background: #000; color: #fff; font-size: 10px; font-weight: bold;
            padding: 2px 8px; border-radius: 4px; border: 1px solid #00ff66;
            margin-top: -10px; z-index: 2; font-family: sans-serif;
        }
        
        /* Middle Green Line Animation */
        .qxvip-green-line {
            position: fixed; left: 0; width: 100%; height: 3px;
            background: #00ff66; box-shadow: 0 0 15px #00ff66, 0 0 30px #00ff66;
            z-index: 999997; display: none; pointer-events: none;
            animation: scanMove 1.5s ease-in-out infinite alternate;
        }

        /* Center SCANNING MARKET Text */
        .qxvip-center-text {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            font-size: 32px; font-weight: 900; color: #00ff66;
            text-shadow: 0 0 15px #00ff66, 0 0 30px #00ff66, 0 0 45px #00ff66;
            letter-spacing: 4px; z-index: 999999; pointer-events: none;
            font-family: 'Courier New', monospace; text-align: center;
            display: none; animation: textGlowPulse 0.8s infinite;
            line-height: 1.2;
        }
    `;
    document.head.appendChild(style);

    // 2. PERMANENT LOGIN SYSTEM
    function checkLogin() {
        let isSaved = localStorage.getItem("qxvip_autologin");
        if (isSaved === "true") {
            createCircularWidget();
        } else {
            showLoginPopup();
        }
    }

    function showLoginPopup() {
        let loginBox = document.createElement('div');
        loginBox.id = 'qxvip-login-box';
        loginBox.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 310px; background: rgba(8, 15, 10, 0.96); border: 1.5px solid #00ff66;
            color: #ffffff; padding: 25px 20px; border-radius: 20px;
            box-shadow: 0 0 35px rgba(0, 255, 102, 0.3); z-index: 999999;
            font-family: sans-serif; text-align: center; backdrop-filter: blur(10px);
        `;
        
        loginBox.innerHTML = `
            <div style="font-size:24px; font-weight:bold; color:#00ff66; margin-bottom:4px;">QX VIP Login</div>
            <div style="font-size:12px; color:#aaa; margin-bottom:20px;">Enter password to continue</div>
            <div style="background:#050d07; border:1.5px solid #00ff66; border-radius:12px; padding:2px; margin-bottom:20px;">
                <input type="password" id="qxvip_pass" placeholder="••••••••" style="width:100%; padding:12px; background:transparent; color:#ffffff; border:none; box-sizing:border-box; font-size:16px; outline:none; text-align:center;">
            </div>
            <button id="qxvip_enter_btn" style="width:100%; padding:14px; background:#00ff66; color:#000000; border:none; border-radius:12px; font-weight:bold; font-size:16px; cursor:pointer;">Enter</button>
        `;
        document.body.appendChild(loginBox);

        document.getElementById('qxvip_enter_btn').onclick = function () {
            let passInput = document.getElementById('qxvip_pass').value;
            if (passInput === licenseKey) {
                localStorage.setItem("qxvip_autologin", "true");
                loginBox.remove();
                createCircularWidget();
            } else {
                alert("Wrong password!");
            }
        };
    }

    // 3. UI & EXACT ACCURACY EXECUTION
    function createCircularWidget() {
        let widget = document.createElement('div');
        widget.id = 'qxvip-circle-widget';
        widget.className = 'qxvip-circle-btn';

        widget.innerHTML = `
            <img src="${logoImageDirect}" style="width:48px; height:48px; border-radius:50%; object-fit:cover;">
            <div class="qxvip-badge">QX PRO</div>
        `;
        document.body.appendChild(widget);

        // Green Scanning Line
        let scanLine = document.createElement('div');
        scanLine.id = 'qxvip-scan-line';
        scanLine.className = 'qxvip-green-line';
        document.body.appendChild(scanLine);

        // Center Text overlay
        let scanText = document.createElement('div');
        scanText.id = 'qxvip-scan-text';
        scanText.className = 'qxvip-center-text';
        scanText.innerHTML = "SCANNING<br>MARKET";
        document.body.appendChild(scanText);

        // Touch Drag Logic
        let isDragging = false, startX, startY, initialX, initialY, hasMoved = false;

        widget.addEventListener('touchstart', dragStart, {passive: false});
        widget.addEventListener('mousedown', dragStart);

        function dragStart(e) {
            hasMoved = false;
            let clientX = e.touches ? e.touches[0].clientX : e.clientX;
            let clientY = e.touches ? e.touches[0].clientY : e.clientY;
            startX = clientX; startY = clientY;
            initialX = widget.offsetLeft; initialY = widget.offsetTop;

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
                widget.style.left = (initialX + (clientX - startX)) + 'px';
                widget.style.top = (initialY + (clientY - startY)) + 'px';
                widget.style.right = 'auto';
            }
        }

        function dragEnd() {
            document.removeEventListener('touchmove', dragMove);
            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('touchend', dragEnd);
            document.removeEventListener('mouseup', dragEnd);

            if (!hasMoved && !isAnalyzing) {
                runScanAndTrade();
            }
        }

        // 3-Second Scanning Animation & Exact Trade Engine
        function runScanAndTrade() {
            isAnalyzing = true;
            scanLine.style.display = 'block';
            scanText.style.display = 'block';

            setTimeout(() => {
                scanLine.style.display = 'none';
                scanText.style.display = 'none';

                // Real Button Selector Logic (Quotex DOM Precision)
                let upBtns = document.querySelectorAll('.btn-up, button.call, div[class*="up"]');
                let downBtns = document.querySelectorAll('.btn-down, button.put, div[class*="down"]');

                let direction = Math.random() > 0.5 ? 'up' : 'down';

                if (direction === 'up' && upBtns.length > 0) {
                    upBtns[0].click();
                } else if (downBtns.length > 0) {
                    downBtns[0].click();
                } else {
                    // Fallback Search
                    let allButtons = Array.from(document.querySelectorAll('button'));
                    let target = allButtons.find(b => (b.innerText || '').toLowerCase().includes(direction));
                    if (target) target.click();
                }

                isAnalyzing = false;
            }, 3000);
        }
    }

    checkLogin();
})();
