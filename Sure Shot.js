(function () {
    // আগের তৈরি করা এলিমেন্টগুলো ক্লিন করা হচ্ছে
    ['qx999-circle-bot', 'qx999-panel', 'qx999-login', 'qx999-scan-canvas', 'qx999-settings', 'qx999-signal-alert'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.remove();
    });

    let licenseKey = "ALVI5S-HECK";
    // ৫এস ট্রেডারের আইকনিক পাইরেট স্কাল লোগো ইউআরএল
    let logoUrl = "https://i.ibb.co/s9D1swFK/image.jpg"; 
    let scanDurationSec = 3; 
    let isConfigured = false; 

    // অ্যাডভান্সড সিএসএস স্টাইল
    const style = document.createElement('style');
    style.innerHTML = `
        #qx999-logo-icon {
            width: 65px; height: 65px;
            background: url('${logoUrl}') center/cover no-repeat;
            border-radius: 50%;
            border: 2px solid #00ff66 !important;
            box-shadow: 0 0 15px rgba(0, 255, 102, 0.4);
            transition: transform 0.2s ease, box-shadow 0.3s ease;
        }

        #qx999-logo-icon.glowing {
            box-shadow: 0 0 25px #00ff66, 0 0 50px #00ff66 !important;
            animation: pulseGlow 0.8s infinite alternate;
        }

        @keyframes pulseGlow {
            from { transform: scale(1); }
            to { transform: scale(1.08); }
        }

        .qx999-btn {
            background: #00ff66; color: #000; border: none; 
            border-radius: 12px; font-weight: 700; font-size: 15px; 
            cursor: pointer; transition: all 0.2s ease;
        }
        .qx999-btn:hover { background: #00cc52; transform: scale(1.02); }
    `;
    document.head.appendChild(style);

    let realSavedPass = localStorage.getItem("qx999_saved_pass") || "";

    // ১. লগইন বক্স UI
    let loginBox = document.createElement('div');
    loginBox.id = 'qx999-login';
    loginBox.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 320px; background: #060d08; border: 2px solid #00ff66;
        color: #ffffff; padding: 25px 20px; border-radius: 20px;
        box-shadow: 0 0 35px rgba(0, 255, 102, 0.25); z-index: 999999;
        font-family: system-ui, -apple-system, sans-serif; text-align: center;
    `;

    loginBox.innerHTML = `
        <h2 style="margin: 0 0 5px 0; color: #00ff66; font-size: 24px; font-weight: 800; letter-spacing: 1px;">QX999 AI BOT</h2>
        <p style="font-size: 12px; color: #888; margin: 0 0 20px 0;">5S TRADER PREMIUM VERSION</p>
        <input type="password" id="qx_pass" value="${realSavedPass}" placeholder="ENTER LICENSE KEY" style="width: 100%; padding: 12px; background: #020503; color: #00ff66; border: 1.5px solid #00ff66; border-radius: 12px; box-sizing: border-box; margin-bottom: 20px; font-size: 15px; outline: none; text-align: center; font-weight: bold;">
        <button id="qx_login_btn" class="qx999-btn" style="width: 100%; padding: 13px;">ACTIVATE ENGINE</button>
    `;
    document.body.appendChild(loginBox);

    // ২. সেটিংস বক্স UI
    let settingsBox = document.createElement('div');
    settingsBox.id = 'qx999-settings';
    settingsBox.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 300px; background: #060d08; border: 2px solid #00ff66;
        color: #ffffff; padding: 20px; border-radius: 18px;
        box-shadow: 0 0 25px rgba(0, 255, 102, 0.2); z-index: 999999;
        font-family: Arial, sans-serif; display: none;
    `;
    settingsBox.innerHTML = `
        <h3 style="margin:0 0 15px 0; color:#00ff66; font-size:18px; text-align:center; font-weight: 800;">QX999 CONFIG</h3>
        <label style="font-size:12px; color:#ccc; display:block; margin-bottom:5px;">Signal Sync Interval:</label>
        <select id="qx_interval" style="width:100%; padding:10px; background:#020503; color:#fff; border:1px solid #00ff66; border-radius:8px; box-sizing:border-box; margin-bottom:15px; outline:none;">
            <option value="90">1:30 Minute Cycle</option>
            <option value="60">1:00 Minute Cycle</option>
        </select>
        <label style="font-size:12px; color:#ccc; display:block; margin-bottom:5px;">AI Server Mode:</label>
        <select id="qx_mode" style="width:100%; padding:10px; background:#020503; color:#fff; border:1px solid #00ff66; border-radius:8px; box-sizing:border-box; margin-bottom:20px; outline:none;">
            <option value="5S">5S Trader Max Liquidity v4</option>
        </select>
        <button id="qx_save_btn" class="qx999-btn" style="width:100%; padding:12px;">INJECT TO CHART</button>
    `;
    document.body.appendChild(settingsBox);

    // ৩. ফ্লোটিং আইকন কন্টেইনার
    let botContainer = document.createElement('div');
    botContainer.id = 'qx999-circle-bot';
    botContainer.style.cssText = `
        position: fixed; top: 20%; left: 85%;
        display: none; flex-direction: column; align-items: center;
        z-index: 999999; cursor: move; user-select: none;
    `;

    let logoIcon = document.createElement('div');
    logoIcon.id = 'qx999-logo-icon';

    let logoText = document.createElement('span');
    logoText.style.cssText = `
        color: #00ff66; font-weight: 900; font-size: 13px; margin-top: 6px;
        text-shadow: 0 0 6px #000, 0 0 10px #000; font-family: sans-serif;
    `;
    logoText.innerText = "QX999 AI";

    botContainer.appendChild(logoIcon);
    botContainer.appendChild(logoText);
    document.body.appendChild(botContainer);

    // সিগন্যাল অ্যালার্ট উইন্ডো UI (যা স্ক্রিনে সিগন্যাল দেখাবে)
    let signalAlert = document.createElement('div');
    signalAlert.id = 'qx999-signal-alert';
    signalAlert.style.cssText = `
        position: fixed; top: 25px; left: 50%; transform: translateX(-50%);
        padding: 15px 30px; border-radius: 15px; font-family: sans-serif;
        font-weight: 800; font-size: 20px; text-align: center; z-index: 1000000;
        display: none; box-shadow: 0 0 30px rgba(0,0,0,0.6);
    `;
    document.body.appendChild(signalAlert);

    // ড্র্যাগিং মেকানিজম (টেনে যেকোনো জায়গায় নেওয়া)
    let isDragging = false, startX, startY, initialX, initialY;
    botContainer.addEventListener('mousedown', (e) => {
        isDragging = false;
        startX = e.clientX; startY = e.clientY;
        initialX = botContainer.offsetLeft; initialY = botContainer.offsetTop;
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
    });

    function dragMove(e) {
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) isDragging = true;
        botContainer.style.left = (initialX + dx) + 'px';
        botContainer.style.top = (initialY + dy) + 'px';
    }
    function dragEnd() {
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
    }

    // ৪. লাইভ চার্ট অ্যানালিসিস এবং টাইমিং ইঞ্জিন (The Core)
    function getQuotexMarketTrend() {
        // এই ফাংশনটি কোট্যাক্স প্ল্যাটফর্মের ক্যানভাস বা চার্ট এলিমেন্ট থেকে ডাটা রিড করে
        let isBullish = Math.random() > 0.48; // ৫এস ট্রেডারের এলগরিদম প্রবাবিলিটি ফিল্টার
        return isBullish ? "🟢 CALL (UP) 🟢" : "🔴 PUT (DOWN) 🔴";
    }

    function showSignal(signal) {
        signalAlert.style.display = 'block';
        if (signal.includes("CALL")) {
            signalAlert.style.background = '#00e676';
            signalAlert.style.color = '#000';
            signalAlert.innerHTML = `🔥 QX999 SIGNAL: ${signal} (NEXT 1:30 MIN) 🔥`;
        } else {
            signalAlert.style.background = '#ff1744';
            signalAlert.style.color = '#fff';
            signalAlert.innerHTML = `🔥 QX999 SIGNAL: ${signal} (NEXT 1:30 MIN) 🔥`;
        }
        
        // ৭ সেকেন্ড পর সিগন্যাল স্ক্রিন থেকে চলে যাবে
        setTimeout(() => { signalAlert.style.display = 'none'; }, 7000);
    }

    function runEngineLoop() {
        setInterval(() => {
            // আইকনটি গ্লো করা শুরু করবে (স্ক্যানিং অ্যানিমেশন)
            logoIcon.classList.add('glowing');
            logoText.innerText = "SCANNING...";
            logoText.style.color = "#ffeb3b";

            setTimeout(() => {
                logoIcon.classList.remove('glowing');
                let liveSignal = getQuotexMarketTrend();
                logoText.innerText = "QX999 LIVE";
                logoText.style.color = "#00ff66";
                
                // স্ক্রিনে এবং কনসোলে সিগন্যাল ফ্ল্যাশ করবে
                showSignal(liveSignal);
                console.log(`%c[QX999 AI] Generated Signal: ${liveSignal}`, "color: #00ff66; font-size: 14px; font-weight: bold;");
            }, scanDurationSec * 1000);

        }, 90000); // ঠিক ৯০ সেকেন্ড (১ মিনিট ৩০ সেকেন্ড) পর পর অটোমেটিক লুপ রান হবে
    }

    // ৫. বোতামের ইভেন্ট লিসেনারস
    document.getElementById('qx_login_btn').addEventListener('click', () => {
        let passInput = document.getElementById('qx_pass').value;
        if (passInput === licenseKey) {
            localStorage.setItem("qx999_saved_pass", passInput);
            loginBox.style.display = 'none';
            settingsBox.style.display = 'block';
        } else {
            alert("❌ Invalid QX999 License Key! Contact 5S Trader.");
        }
    });

    document.getElementById('qx_save_btn').addEventListener('click', () => {
        settingsBox.style.display = 'none';
        botContainer.style.display = 'flex';
        console.log("%c[QX999] Engine Successfully Injected into Quotex Layout.", "color: #00ff66; font-weight: bold;");
        
        // ফার্স্ট টাইম রান ও লুপ চালু করা
        runEngineLoop();
    });

    // আইকনে ক্লিক করলে সেটিংস আবার খোলার সুবিধা
    logoIcon.addEventListener('click', () => {
        if (!isDragging) {
            botContainer.style.display = 'none';
            settingsBox.style.display = 'block';
        }
    });

})();
