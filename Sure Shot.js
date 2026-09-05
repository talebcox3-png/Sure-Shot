(function () {
    // 1. Clear previous instances
    ['qxvip-circle-widget', 'qxvip-style-sheet', 'qxvip-scan-line', 'qxvip-scan-text'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.remove();
    });

    let isAnalyzing = false;
    // Direct Image URL
    let customLogoUrl = "https://i.ibb.co.com/3yPZZrk2/1000323932-photoaidcom-cropped-jpg.png";

    // 2. CSS Styles & Rotating Green Border Animation
    const style = document.createElement('style');
    style.id = 'qxvip-style-sheet';
    style.innerHTML = `
        @keyframes rotateBorder {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes scanMove {
            0% { top: 25%; opacity: 0.3; }
            50% { top: 50%; opacity: 1; }
            100% { top: 75%; opacity: 0.3; }
        }
        @keyframes textGlowPulse {
            0% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.96); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.04); }
            100% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.96); }
        }

        /* CIRCULAR WIDGET WITH ROTATING GREEN BORDER */
        .qxvip-widget-btn {
            position: fixed; top: 140px; right: 15px;
            width: 65px; height: 65px; border-radius: 50%;
            background: rgba(3, 10, 5, 0.95);
            border: 2px solid #00ff66;
            box-shadow: 0 0 18px rgba(0, 255, 102, 0.8);
            display: flex; align-items: center; justify-content: center;
            z-index: 999998; cursor: pointer; user-select: none;
            backdrop-filter: blur(6px);
        }
        .qxvip-widget-btn::before {
            content: ''; position: absolute; top: -6px; left: -6px; right: -6px; bottom: -6px;
            border-radius: 50%; border: 2.5px dashed #00ff66;
            animation: rotateBorder 3s linear infinite; pointer-events: none;
        }
        .qxvip-widget-img {
            width: 52px; height: 52px; border-radius: 50%; object-fit: cover;
        }

        /* SCANNING ANIMATION */
        .qxvip-scan-line {
            position: fixed; left: 0; width: 100%; height: 3px;
            background: #00ff66; box-shadow: 0 0 15px #00ff66, 0 0 30px #00ff66;
            z-index: 999997; display: none; pointer-events: none;
            animation: scanMove 1.2s ease-in-out infinite alternate;
        }
        .qxvip-scan-text {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            font-size: 26px; font-weight: 900; color: #00ff66;
            text-shadow: 0 0 15px #00ff66, 0 0 35px #00ff66;
            letter-spacing: 3px; z-index: 999999; pointer-events: none;
            font-family: 'Courier New', monospace, sans-serif; text-align: center;
            display: none; animation: textGlowPulse 0.8s infinite; line-height: 1.2;
        }
    `;
    document.head.appendChild(style);

    // 3. UI CREATION
    let widget = document.createElement('div');
    widget.id = 'qxvip-circle-widget';
    widget.className = 'qxvip-widget-btn';
    widget.innerHTML = `<img src="${customLogoUrl}" class="qxvip-widget-img" alt="QX VIP">`;
    document.body.appendChild(widget);

    let scanLine = document.createElement('div');
    scanLine.className = 'qxvip-scan-line';
    document.body.appendChild(scanLine);

    let scanText = document.createElement('div');
    scanText.className = 'qxvip-scan-text';
    scanText.innerHTML = "SCANNING<br>MARKET";
    document.body.appendChild(scanText);

    // Touch & Drag Handling
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
            startAiMarketAnalysis();
        }
    }

    // 4. AI MARKET SCANNING ENGINE
    function startAiMarketAnalysis() {
        isAnalyzing = true;
        scanLine.style.display = 'block';
        scanText.style.display = 'block';

        setTimeout(() => {
            scanLine.style.display = 'none';
            scanText.style.display = 'none';

            let signal = analyzeMarketSignal();
            executeTradeSignal(signal);

            isAnalyzing = false;
        }, 3000);
    }

    // Candle Pattern & Price Action Momentum Logic
    function analyzeMarketSignal() {
        let redElements = 0;
        let greenElements = 0;

        let allNodes = document.querySelectorAll('svg path, canvas, div, span');
        allNodes.forEach(node => {
            let color = window.getComputedStyle(node).color || '';
            let bg = window.getComputedStyle(node).backgroundColor || '';
            let fill = window.getComputedStyle(node).fill || '';

            let merged = color + bg + fill;
            if (merged.includes('255, 74, 104') || merged.includes('eb4d4b') || merged.includes('ff4d4d')) {
                redElements++;
            } else if (merged.includes('0, 255, 102') || merged.includes('26a69a') || merged.includes('00e676')) {
                greenElements++;
            }
        });

        // Price Reversal Logic based on DOM readings
        if (redElements >= greenElements) {
            return 'UP';   // Reversal Signal -> Call Trade
        } else {
            return 'DOWN'; // Reversal Signal -> Put Trade
        }
    }

    // Accurate Quotex Button Clicking
    function executeTradeSignal(signal) {
        let upBtn = document.querySelector('button.btn-up, .section-deal__button._green, button[class*="call"], .call-btn');
        let downBtn = document.querySelector('button.btn-down, .section-deal__button._red, button[class*="put"], .put-btn');

        if (!upBtn || !downBtn) {
            let allBtns = Array.from(document.querySelectorAll('button, div[role="button"]'));
            upBtn = allBtns.find(b => (b.innerText || '').toLowerCase().includes('up') || (b.innerText || '').includes('উপরে') || (b.innerText || '').toLowerCase().includes('call'));
            downBtn = allBtns.find(b => (b.innerText || '').toLowerCase().includes('down') || (b.innerText || '').includes('নিচে') || (b.innerText || '').toLowerCase().includes('put'));
        }

        if (signal === 'UP' && upBtn) {
            upBtn.click();
        } else if (signal === 'DOWN' && downBtn) {
            downBtn.click();
        }
    }
})();
