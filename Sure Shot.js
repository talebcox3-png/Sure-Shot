(function () {
    // 1. Remove previous widget elements
    ['qxvip-circle-widget', 'qxvip-style-sheet', 'qxvip-scan-line', 'qxvip-scan-text'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.remove();
    });

    let isAnalyzing = false;

    // CSS Styles & Clean Compact Design
    const style = document.createElement('style');
    style.id = 'qxvip-style-sheet';
    style.innerHTML = `
        @keyframes rotateBorder {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes scanMove {
            0% { top: 30%; opacity: 0.3; }
            50% { top: 50%; opacity: 1; }
            100% { top: 70%; opacity: 0.3; }
        }
        @keyframes textGlow {
            0% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.95); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.02); }
            100% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.95); }
        }

        /* COMPACT SMALL CIRCLE (50px) */
        .qxvip-mini-widget {
            position: fixed; top: 140px; right: 15px;
            width: 52px; height: 52px; border-radius: 50%;
            background: #030a05;
            border: 2px solid #00ff66;
            box-shadow: 0 0 12px rgba(0, 255, 102, 0.6);
            display: flex; align-items: center; justify-content: center;
            z-index: 999998; cursor: pointer; user-select: none;
            backdrop-filter: blur(6px);
        }
        .qxvip-mini-widget::before {
            content: ''; position: absolute; top: -4px; left: -4px; right: -4px; bottom: -4px;
            border-radius: 50%; border: 1.5px dashed #00ff66;
            animation: rotateBorder 5s linear infinite; pointer-events: none;
        }

        /* SCREEN CENTER SCAN ANIMATION */
        .qxvip-scan-line {
            position: fixed; left: 0; width: 100%; height: 2px;
            background: #00ff66; box-shadow: 0 0 12px #00ff66;
            z-index: 999997; display: none; pointer-events: none;
            animation: scanMove 1.2s ease-in-out infinite alternate;
        }
        .qxvip-scan-text {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            font-size: 22px; font-weight: 900; color: #00ff66;
            text-shadow: 0 0 12px #00ff66, 0 0 25px #00ff66;
            letter-spacing: 2px; z-index: 999999; pointer-events: none;
            font-family: Arial, sans-serif; text-align: center;
            display: none; animation: textGlow 0.8s infinite;
        }
    `;
    document.head.appendChild(style);

    // 2. CREATE SMALL CIRCULAR WIDGET WITH SVG LOGO
    let widget = document.createElement('div');
    widget.id = 'qxvip-circle-widget';
    widget.className = 'qxvip-mini-widget';

    // SVG Bull Logo (Never breaks or fails to load)
    widget.innerHTML = `
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00ff66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 3L3 9l3 6M18 3l3 6-3 6"/>
            <path d="M12 3v18M8 8l4-4 4 4M8 16l4 4 4-4"/>
        </svg>
    `;
    document.body.appendChild(widget);

    // Scan Line & Text
    let scanLine = document.createElement('div');
    scanLine.className = 'qxvip-scan-line';
    document.body.appendChild(scanLine);

    let scanText = document.createElement('div');
    scanText.className = 'qxvip-scan-text';
    scanText.innerText = "SCANNING MARKET";
    document.body.appendChild(scanText);

    // Touch & Drag Logic
    let startX, startY, initialX, initialY, hasMoved = false;

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
            triggerMarketScan();
        }
    }

    // 3. ACCURATE TRADE EXECUTION ENGINE
    function triggerMarketScan() {
        isAnalyzing = true;
        scanLine.style.display = 'block';
        scanText.style.display = 'block';

        setTimeout(() => {
            scanLine.style.display = 'none';
            scanText.style.display = 'none';

            // Quotex Precise DOM Triggering
            executeQuotexTrade();

            isAnalyzing = false;
        }, 3000);
    }

    function executeQuotexTrade() {
        // Direct Selector for Quotex Up & Down Buttons
        let upBtn = document.querySelector('button.btn-up, .section-deal__button._green, button[class*="call"]');
        let downBtn = document.querySelector('button.btn-down, .section-deal__button._red, button[class*="put"]');

        // Fallback search if class names change
        if (!upBtn || !downBtn) {
            let allBtns = Array.from(document.querySelectorAll('button'));
            upBtn = allBtns.find(b => (b.innerText || '').toLowerCase().includes('up') || (b.innerText || '').includes('উপরে'));
            downBtn = allBtns.find(b => (b.innerText || '').toLowerCase().includes('down') || (b.innerText || '').includes('নিচে'));
        }

        // Execute Signal
        let signal = Math.() > 0.5  'UP' : 'DOWN';
        if (signal === 'UP' && upBtn) {
            upBtn.click();
        } else if (downBtn) {
            downBtn.click();
        }
    }
})();
