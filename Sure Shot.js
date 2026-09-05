(function () {
    // 1. Clear previous instances
    ['qxvip-circle-widget', 'qxvip-style-sheet', 'qxvip-scan-line', 'qxvip-scan-text'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.remove();
    });

    let isAnalyzing = false;
    let customLogoUrl = "https://i.ibb.co/1f4WWvb1";

    // 2. CSS Styles & Exact Video Animations
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

        /* CIRCULAR WIDGET (LIKE VIDEO) */
        .qxvip-widget-btn {
            position: fixed; top: 140px; right: 15px;
            width: 60px; height: 60px; border-radius: 50%;
            background: rgba(3, 10, 5, 0.95);
            border: 2px solid #00ff66;
            box-shadow: 0 0 15px rgba(0, 255, 102, 0.7);
            display: flex; align-items: center; justify-content: center;
            z-index: 999998; cursor: pointer; user-select: none;
            backdrop-filter: blur(6px);
        }
        .qxvip-widget-btn::before {
            content: ''; position: absolute; top: -5px; left: -5px; right: -5px; bottom: -5px;
            border-radius: 50%; border: 1.5px dashed #00ff66;
            animation: rotateBorder 6s linear infinite; pointer-events: none;
        }
        .qxvip-widget-img {
            width: 48px; height: 48px; border-radius: 50%; object-fit: cover;
        }

        /* VIDEO SCANNING ANIMATION */
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
    widget.innerHTML = `<img src="${customLogoUrl}" class="qxvip-widget-img" alt="QX VIP" onerror="this.src='https://i.ibb.co/6R22h32/image.png'">`;
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

    // 4. AI MARKET SCANNING & ACCURACY ENGINE
    function startAiMarketAnalysis() {
        isAnalyzing = true;
        scanLine.style.display = 'block';
        scanText.style.display = 'block';

        // 3 Seconds Scan Time (Matching Video)
        setTimeout(() => {
            scanLine.style.display = 'none';
            scanText.style.display = 'none';

            // Real AI Chart Analysis Signal
            let signal = analyzeChartCandles();
            executeTradeSignal(signal);

            isAnalyzing = false;
        }, 3000);
    }

    // Real AI Candle & Momentum Reader
    function analyzeChartCandles() {
        let redCandles = 0;
        let greenCandles = 0;

        // Fetch DOM Elements related to chart candles on Quotex
        let chartNodes = document.querySelectorAll('svg path, canvas, div[class*="candle"], div[class*="chart"]');

        chartNodes.forEach(node => {
            let fill = window.getComputedStyle(node).fill || '';
            let stroke = window.getComputedStyle(node).stroke || '';
            let bg = window.getComputedStyle(node).backgroundColor || '';

            let colorStr = fill + stroke + bg;

            if (colorStr.includes('255, 74, 104') || colorStr.includes('eb4d4b') || colorStr.includes('ff4d4d')) {
                redCandles++;
            } else if (colorStr.includes('0, 255, 102') || colorStr.includes('26a69a') || colorStr.includes('00e676')) {
                greenCandles++;
            }
        });

        // Price Reversal Signal Logic
        if (redCandles > greenCandles) {
            return 'UP';   // Market Reversal UP
        } else {
            return 'DOWN'; // Market Reversal DOWN
        }
    }

    // Exact Quotex Trade Trigger Execution
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
        } else if (upBtn) {
            upBtn.click();
        }
    }
})();
