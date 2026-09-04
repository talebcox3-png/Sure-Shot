(function () {
    // 1. Remove previous widget instances
    ['sureshot-circle-widget', 'sureshot-style'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.remove();
    });

    let isRunning = false;
    let tradeTimer = null;
    let botLogoUrl = "https://ibb.co.com/s9D1swFK";

    // Insert CSS Styles & Animations
    const style = document.createElement('style');
    style.id = 'sureshot-style';
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
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
        }
        .ss-circle-container {
            position: fixed; top: 120px; right: 20px;
            width: 110px; height: 110px; border-radius: 50%;
            background: rgba(5, 12, 8, 0.92);
            border: 2px solid #00ff66;
            box-shadow: 0 0 20px rgba(0, 255, 102, 0.5);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            z-index: 999999; cursor: move; user-select: none;
            backdrop-filter: blur(8px); animation: pulseGlow 2s infinite;
        }
        .ss-circle-container::before {
            content: ''; position: absolute; top: -5px; left: -5px; right: -5px; bottom: -5px;
            border-radius: 50%; border: 2px dashed #00ff66;
            animation: rotateBorder 10s linear infinite; pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    // 2. CIRCULAR WIDGET UI
    let widget = document.createElement('div');
    widget.id = 'sureshot-circle-widget';
    widget.className = 'ss-circle-container';

    widget.innerHTML = `
        <img src="${botLogoUrl}" style="width:32px; height:32px; border-radius:50%; object-fit:cover; border:1px solid #00ff66; margin-bottom:3px;">
        <div style="font-size:11px; font-weight:bold; color:#00ff66; letter-spacing:0.5px;">QX PRO</div>
        <div id="ss_anim_status" style="font-size:8px; font-weight:bold; color:#ffffff; margin-top:2px; animation: scanTextPulse 1s infinite; text-align:center; padding:0 4px;">
            SCANNING MARKET
        </div>
    `;
    document.body.appendChild(widget);

    // Draggable Logic
    let isDragging = false, startX, startY, initialX, initialY;
    widget.addEventListener('mousedown', dragStart);
    widget.addEventListener('touchstart', dragStart);

    function dragStart(e) {
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let clientY = e.touches ? e.touches[0].clientY : e.clientY;
        startX = clientX; startY = clientY;
        initialX = widget.offsetLeft; initialY = widget.offsetTop;
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('touchmove', dragMove);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
    }

    function dragMove(e) {
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let clientY = e.touches ? e.touches[0].clientY : e.clientY;
        widget.style.left = (initialX + (clientX - startX)) + 'px';
        widget.style.top = (initialY + (clientY - startY)) + 'px';
        widget.style.right = 'auto';
    }

    function dragEnd() {
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('touchmove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchend', dragEnd);
    }

    // 3. AUTOMATIC 4-SECOND TRADE EXECUTION ENGINE
    function startAutoTradeEngine() {
        isRunning = true;

        function runTradeCycle() {
            if (!isRunning) return;

            let statusEl = document.getElementById('ss_anim_status');
            if (statusEl) statusEl.innerText = "SCANNING MARKET";

            // Click Up or Down button automatically
            let buttons = Array.from(document.querySelectorAll('button, div')).filter(e => {
                let txt = (e.innerText || '').toLowerCase();
                return txt.includes('up') || txt.includes('call') || txt.includes('down') || txt.includes('put');
            });

            if (buttons.length > 0) {
                // Auto click trade button
                buttons[Math.floor(Math.random() * buttons.length)].click();
            }

            // Repeat every 4 seconds (4000 ms)
            tradeTimer = setTimeout(runTradeCycle, 4000);
        }

        runTradeCycle();
    }

    // Start immediately on script load
    startAutoTradeEngine();
})();
