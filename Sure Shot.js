(function () {
    // 1. Remove previous widget & login elements
    ['qxvip-login-box', 'qxvip-circle-widget', 'qxvip-style-sheet', 'qxvip-scan-overlay'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.remove();
    });

    let licenseKey = "ALVI5S-HECK";
    let isAnalyzing = false;
    let savedPassword = localStorage.getItem("qxvip_saved_password") || "";

    // CSS Styles & Animations
    const style = document.createElement('style');
    style.id = 'qxvip-style-sheet';
    style.innerHTML = `
        @keyframes rotateBorder {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
            0% { box-shadow: 0 0 15px rgba(0, 255, 102, 0.4); }
            50% { box-shadow: 0 0 30px rgba(0, 255, 102, 0.9); }
            100% { box-shadow: 0 0 15px rgba(0, 255, 102, 0.4); }
        }
        @keyframes scanTextPulse {
            0% { opacity: 0.3; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 0.3; transform: scale(0.95); }
        }
        .qxvip-circle-btn {
            position: fixed; top: 120px; right: 20px;
            width: 90px; height: 90px; border-radius: 50%;
            background: rgba(5, 12, 8, 0.92);
            border: 2px solid #00ff66;
            box-shadow: 0 0 20px rgba(0, 255, 102, 0.5);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            z-index: 999998; cursor: pointer; user-select: none;
            backdrop-filter: blur(8px); animation: pulseGlow 2s infinite;
        }
        .qxvip-circle-btn::before {
            content: ''; position: absolute; top: -5px; left: -5px; right: -5px; bottom: -5px;
            border-radius: 50%; border: 2px dashed #00ff66;
            animation: rotateBorder 8s linear infinite; pointer-events: none;
        }
        .scan-overlay-text {
            position: fixed; top: 45%; left: 50%; transform: translate(-50%, -50%);
            font-size: 28px; font-weight: 900; color: #00ff66;
            text-shadow: 0 0 20px #00ff66, 0 0 40px #00ff66;
            letter-spacing: 3px; z-index: 999999; pointer-events: none;
            animation: scanTextPulse 0.8s infinite; font-family: sans-serif;
            text-align: center; display: none;
        }
    `;
    document.head.appendChild(style);

    // 2. LOGIN POPUP SCREEN
    function showLoginPopup() {
        let loginBox = document.createElement('div');
        loginBox.id = 'qxvip-login-box';
        loginBox.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 320px; background: rgba(8, 15, 10, 0.96); border: 1.5px solid #00ff66;
            color: #ffffff; padding: 25px 20px; border-radius: 20px;
            box-shadow: 0 0 35px rgba(0, 255, 102, 0.3); z-index: 999999;
            font-family: sans-serif; text-align: center; backdrop-filter: blur(10px);
        `;
        
        loginBox.innerHTML = `
            <div style="font-size:24px; font-weight:bold; color:#00ff66; margin-bottom:4px;">QX VIP Login</div>
            <div style="font-size:12px; color:#aaa; margin-bottom:20px;">Enter password to continue</div>
            <div style="background:#050d07; border:1.5px solid #00ff66; border-radius:12px; padding:2px; margin-bottom:20px;">
                <input type="password" id="qxvip_pass" value="${savedPassword}" placeholder="••••••••" style="width:100%; padding:12px; background:transparent; color:#ffffff; border:none; box-sizing:border-box; font-size:16px; outline:none; text-align:center;">
            </div>
            <button id="qxvip_enter_btn" style="width:100%; padding:14px; background:#00ff66; color:#000000; border:none; border-radius:12px; font-weight:bold; font-size:16px; cursor:pointer;">Enter</button>
        `;
        document.body.appendChild(loginBox);

        document.getElementById('qxvip_enter_btn').onclick = function () {
            let passInput = document.getElementById('qxvip_pass').value;
            if (passInput === licenseKey) {
                localStorage.setItem("qxvip_saved_password", licenseKey);
                loginBox.remove();
                createCircularWidget();
            } else {
                alert("Wrong or expired password!");
            }
        };
    }

    // 3. CIRCULAR WIDGET & ANALYZING ENGINE
    function createCircularWidget() {
        let widget = document.createElement('div');
        widget.id = 'qxvip-circle-widget';
        widget.className = 'qxvip-circle-btn';

        widget.innerHTML = `
            <div style="font-size:13px; font-weight:bold; color:#00ff66; letter-spacing:1px;">QX VIP</div>
            <div style="font-size:9px; color:#ffffff; margin-top:2px; font-weight:bold;">ANALYZE</div>
        `;
        document.body.appendChild(widget);

        // Overlay Text Screen
        let scanText = document.createElement('div');
        scanText.id = 'qxvip-scan-overlay';
        scanText.className = 'scan-overlay-text';
        scanText.innerText = "SCANNING MARKET";
        document.body.appendChild(scanText);

        // Draggable Logic
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

            // Trigger Analysis on Click/Tap (If not dragged)
            if (!hasMoved && !isAnalyzing) {
                run3SecAnalysis();
            }
        }

        // 3-Second Analysis & Auto Trade Trigger
        function run3SecAnalysis() {
            isAnalyzing = true;
            scanText.style.display = 'block';
            widget.style.borderColor = '#ffcc00';

            setTimeout(() => {
                scanText.style.display = 'none';
                widget.style.borderColor = '#00ff66';

                // Automatically click UP or DOWN button on Quotex
                let tradeButtons = Array.from(document.querySelectorAll('button, div')).filter(e => {
                    let txt = (e.innerText || '').toLowerCase().trim();
                    return txt === 'up' || txt === 'down' || txt === 'call' || txt === 'put' || txt.includes('উপরে') || txt.includes('নিচে');
                });

                if (tradeButtons.length > 0) {
                    let randomBtn = tradeButtons[Math.floor(Math.random() * tradeButtons.length)];
                    randomBtn.click();
                }

                isAnalyzing = false;
            }, 3000); // 3 Seconds Delay
        }
    }

    // Initialize Login First
    showLoginPopup();
})();
