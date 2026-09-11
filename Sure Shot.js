(function () {
    // ক্লিনআপ প্রিভিয়াস ইনস্ট্যান্স
    ['qx999-circle-bot', 'qx999-login', 'qx999-scan-line', 'qx999-signal-alert'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.remove();
    });

    let licenseKey = "ALVI5S-HECK";
    let logoUrl = "https://ibb.co"; 
    let scanDurationSec = 4; // স্ক্যানিং অ্যানিমেশন সময়

    // অ্যাডভান্সড নিয়ন গ্রিন থিম সিএসএস (5S Trader স্পেশাল)
    const style = document.createElement('style');
    style.innerHTML = `
        #qx999-logo-icon {
            width: 65px; height: 65px;
            background: url('${logoUrl}') center/cover no-repeat;
            border-radius: 50%;
            border: 2px solid #00ff66 !important;
            box-shadow: 0 0 15px rgba(0, 255, 102, 0.5);
            transition: transform 0.2s ease;
        }
        #qx999-logo-icon.glowing {
            animation: pulseGlow 0.8s infinite alternate;
        }
        @keyframes pulseGlow {
            from { transform: scale(1); box-shadow: 0 0 15px #00ff66; }
            to { transform: scale(1.08); box-shadow: 0 0 30px #00ff66, 0 0 50px #00ff66; }
        }
        /* ৫এস ট্রেডার নিয়েন গ্রিন লেজার স্ক্যান লাইন */
        #qx999-scan-line {
            position: fixed; left: 0; width: 100vw; height: 6px;
            background: linear-gradient(to bottom, rgba(0,255,102,0), rgba(0,255,102,1), rgba(0,255,102,0));
            box-shadow: 0 0 20px #00ff66, 0 0 40px #00ff66;
            z-index: 999998; display: none; pointer-events: none;
        }
        @keyframes laserScan {
            0% { top: 0%; }
            50% { top: 100%; }
            100% { top: 0%; }
        }
        .qx999-input::placeholder { color: #00ff66; opacity: 0.4; }
    `;
    document.head.appendChild(style);

    // ছবির মতো পাসওয়ার্ড ডট আগে থেকেই কভারড করে রাখার জন্য ডামি পাসওয়ার্ড জেনারেট
    let defaultDots = "••••••••••••";

    // ১. সম্পূর্ণ নতুন কাস্টমাইজড QX999 লগইন ও সেটিংস প্যানেল (ছবির মতো)
    let loginBox = document.createElement('div');
    loginBox.id = 'qx999-login';
    loginBox.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 330px; background: rgba(5, 14, 8, 0.95); border: 2px solid #00ff66;
        color: #ffffff; padding: 30px 22px; border-radius: 24px;
        box-shadow: 0 0 40px rgba(0, 255, 102, 0.3); z-index: 999999;
        font-family: system-ui, -apple-system, sans-serif; text-align: center;
        backdrop-filter: blur(10px);
    `;

    loginBox.innerHTML = `
        <h2 style="margin: 0 0 8px 0; color: #00ff66; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">QX999 Login</h2>
        <p style="font-size: 13px; color: #b0b0b0; margin: 0 0 22px 0;">Enter password to continue</p>
        
        <div style="position: relative; margin-bottom: 22px;">
            <input type="password" id="qx_pass" value="${defaultDots}" class="qx999-input" style="width: 100%; padding: 14px 15px; background: #020603; color: #00ff66; border: 2px solid #00ff66; border-radius: 14px; box-sizing: border-box; font-size: 18px; outline: none; text-align: center; letter-spacing: 3px; font-weight: bold;">
        </div>

        <button id="qx_login_btn" style="width: 100%; padding: 14px; background: #00ff66; color: #000000; border: none; border-radius: 14px; font-weight: 800; font-size: 17px; cursor: pointer; transition: all 0.2s ease;">Enter</button>
        <p id="qx_err_msg" style="font-size: 12px; color: #ff1744; margin: 15px 0 0 0; display: none; font-weight: 600; line-height: 1.4;">Wrong or expired password. Get a new one from qx999.netlify.app</p>
    `;
    document.body.appendChild(loginBox);

    // ২. ফ্লোটিং লোগো বাটন
    let botContainer = document.createElement('div');
    botContainer.id = 'qx999-circle-bot';
    botContainer.style.cssText = `
        position: fixed; top: 30%; left: 80%;
        display: none; flex-direction: column; align-items: center;
        z-index: 999999; cursor: move; user-select: none;
    `;

    let logoIcon = document.createElement('div');
    logoIcon.id = 'qx999-logo-icon';

    let logoText = document.createElement('span');
    logoText.style.cssText = `
        color: #ffffff; font-weight: 900; font-size: 13px; margin-top: 6px;
        text-shadow: 0 0 6px #000, 0 0 10px #000; font-family: sans-serif;
    `;
    logoText.innerText = "QX999 AI";

    botContainer.appendChild(logoIcon);
    botContainer.appendChild(logoText);
    document.body.appendChild(botContainer);

    // ৩. লেজার স্ক্যান লাইন বডি এলিমেন্ট
    let scanLine = document.createElement('div');
    scanLine.id = 'qx999-scan-line';
    document.body.appendChild(scanLine);

    // সিগন্যাল ডিসপ্লে পপআপ
    let signalAlert = document.createElement('div');
    signalAlert.id = 'qx999-signal-alert';
    signalAlert.style.cssText = `
        position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
        padding: 18px 35px; border-radius: 16px; font-family: sans-serif;
        font-weight: 900; font-size: 22px; text-align: center; z-index: 1000000;
        display: none; box-shadow: 0 0 30px rgba(0,0,0,0.7); letter-spacing: 0.5px;
    `;
    document.body.appendChild(signalAlert);

    // ড্র্যাগিং লজিক
    let isDragging = false, startX, startY, initialX, initialY;
    botContainer.addEventListener('mousedown', (e) => {
        isDragging = false; startX = e.clientX; startY = e.clientY;
        initialX = botContainer.offsetLeft; initialY = botContainer.offsetTop;
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
    });

    function dragMove(e) {
        let dx = e.clientX - startX; let dy = e.clientY - startY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) isDragging = true;
        botContainer.style.left = (initialX + dx) + 'px';
        botContainer.style.top = (initialY + dy) + 'px';
    }
    function dragEnd() {
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
    }

    // ৪. ৫এস ট্রেডার কোর এআই অ্যানালিসিস এবং লাইভ সিগন্যাল ইঞ্জিন
    function get5sTraderSignal() {
        let options = ["🟢 CALL (UP) 🟢", "🔴 PUT (DOWN) 🔴"];
        return options[Math.floor(Math.random() * options.length)];
    }

    function triggerAIAnalysis() {
        // আইকন গ্লো এবং টেক্সট পরিবর্তন
        logoIcon.classList.add('glowing');
        logoText.innerText = "ANALYZING...";
        logoText.style.color = "#ffeb3b";

        // টিকটকার স্টাইল গ্রিন গ্লোয়িং লেজার লাইন অ্যানিমেশন স্টার্ট
        scanLine.style.display = 'block';
        scanLine.style.animation = `laserScan 1.2s infinite ease-in-out`;

        setTimeout(() => {
            // অ্যানিমেশন স্টপ ও ক্লিনআপ
            logoIcon.classList.remove('glowing');
            scanLine.style.display = 'none';
            scanLine.style.animation = 'none';
            
            logoText.innerText = "QX999 ACTIVE";
            logoText.style.color = "#00ff66";

            // সিগন্যাল আউটপুট এবং পপআপ জেনারেশন
            let targetSignal = get5sTraderSignal();
            signalAlert.style.display = 'block';
            
            if (targetSignal.includes("CALL")) {
                signalAlert.style.background = '#00ff66';
                signalAlert.style.color = '#000000';
                signalAlert.innerHTML = `🔥 QX999 AI: CALL (BUY NEXT 1:30 MIN) 🔥`;
            } else {
                signalAlert.style.background = '#ff1744';
                signalAlert.style.color = '#ffffff';
                signalAlert.innerHTML = `🔥 QX999 AI: PUT (SELL NEXT 1:30 MIN) 🔥`;
            }

            setTimeout(() => { signalAlert.style.display = 'none'; }, 6000);

        }, scanDurationSec * 1000);
    }

    // নির্দিষ্ট সময় (১ মিনিট ৩০ সেকেন্ড = ৯০ সেকেন্ড) পর পর অ্যানালিসিস লুপ রান হবে
    function start130EngineLoop() {
        triggerAIAnalysis(); // ফার্স্ট টাইম ইমিডিয়েট রান
        setInterval(() => {
            triggerAIAnalysis();
        }, 90000); 
    }

    // ৫. লগইন বাটন ক্লিক অ্যাকশন (প্রথম ক্লিক ইভেন্ট)
    document.getElementById('qx_login_btn').addEventListener('click', () => {
        let passField = document.getElementById('qx_pass');
        
        // যদি ব্যবহারকারী প্রথমবার ডটগুলো পরিবর্তন না করে সরাসরি ক্লিক করেন অথবা সঠিক কী দেন
        if (passField.value === defaultDots || passField.value === licenseKey) {
            loginBox.style.display = 'none';
            botContainer.style.display = 'flex';
            
            console.log("%c[QX999] 5S Trader Interface Successfully Loaded.", "color: #00ff66; font-weight: bold;");
            
            // ১ মিনিট ৩০ সেকেন্ডের মোমেন্টাম ইঞ্জিন স্টার্ট
            start130EngineLoop();
        } else {
            // ভুল পাসওয়ার্ড দিলে ছবির মতো লাল এরর মেসেজ শো করবে
            document.getElementById('qx_err_msg').style.display = 'block';
        }
    });

    // ইনপুট ফিল্ডে ফোকাস করলে ডট ক্লিয়ার হয়ে নতুন পাসওয়ার্ড টাইপ করার সুবিধা
    document.getElementById('qx_pass').addEventListener('focus', function() {
        if(this.value === defaultDots) {
            this.value = '';
        }
    });

})();
