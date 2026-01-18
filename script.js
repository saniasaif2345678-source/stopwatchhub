document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation Logic ---
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.tool-section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            navBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active to clicked
            btn.classList.add('active');
            const target = btn.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });

    // --- Helper: Format Time ---
    const formatTime = (ms) => {
        const date = new Date(ms);
        const m = date.getUTCMinutes().toString().padStart(2, '0');
        const s = date.getUTCSeconds().toString().padStart(2, '0');
        const cs = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
        return `${m}:${s}.${cs}`;
    };

    const formatTimeHMS = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    // --- Stopwatch ---
    let swInterval;
    let swStartTime;
    let swElapsedTime = 0;
    let swRunning = false;

    const swDisplay = document.getElementById('sw-display');
    const swStartBtn = document.getElementById('sw-start');
    const swStopBtn = document.getElementById('sw-stop');
    const swLapBtn = document.getElementById('sw-lap');
    const swResetBtn = document.getElementById('sw-reset');
    const swLaps = document.getElementById('sw-laps');

    function updateStopwatch() {
        const now = Date.now();
        const diff = now - swStartTime + swElapsedTime;
        swDisplay.textContent = formatTime(diff);
    }

    swStartBtn.addEventListener('click', () => {
        if (!swRunning) {
            swRunning = true;
            swStartTime = Date.now();
            swInterval = setInterval(updateStopwatch, 10);
            swStartBtn.disabled = true;
            swStopBtn.disabled = false;
            swLapBtn.disabled = false;
        }
    });

    swStopBtn.addEventListener('click', () => {
        if (swRunning) {
            swRunning = false;
            clearInterval(swInterval);
            swElapsedTime += Date.now() - swStartTime;
            swStartBtn.disabled = false;
            swStopBtn.disabled = true;
        }
    });

    swLapBtn.addEventListener('click', () => {
        if (swRunning) {
            const now = Date.now();
            const diff = now - swStartTime + swElapsedTime;
            const lapTime = formatTime(diff);
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            lapItem.innerHTML = `<span>Lap ${swLaps.children.length + 1}</span><span>${lapTime}</span>`;
            swLaps.prepend(lapItem);
        }
    });

    swResetBtn.addEventListener('click', () => {
        swRunning = false;
        clearInterval(swInterval);
        swElapsedTime = 0;
        swDisplay.textContent = "00:00.00";
        swLaps.innerHTML = '';
        swStartBtn.disabled = false;
        swStopBtn.disabled = true;
        swLapBtn.disabled = true;
    });

    // --- Countdown Timer ---
    let timerInterval;
    let timerTotalSeconds = 0;

    const timerInputs = document.getElementById('timer-inputs');
    const timerDisplay = document.getElementById('timer-display');
    const timerStartBtn = document.getElementById('timer-start');
    const timerPauseBtn = document.getElementById('timer-pause');
    const timerResetBtn = document.getElementById('timer-reset');

    const inputH = document.getElementById('timer-h');
    const inputM = document.getElementById('timer-m');
    const inputS = document.getElementById('timer-s');

    timerStartBtn.addEventListener('click', () => {
        if (timerTotalSeconds === 0) {
            // Read inputs
            const h = parseInt(inputH.value) || 0;
            const m = parseInt(inputM.value) || 0;
            const s = parseInt(inputS.value) || 0;
            timerTotalSeconds = (h * 3600) + (m * 60) + s;
        }

        if (timerTotalSeconds > 0) {
            // UI Switch
            timerInputs.classList.add('hidden');
            timerDisplay.classList.remove('hidden');
            timerStartBtn.classList.add('hidden');
            timerPauseBtn.classList.remove('hidden');

            updateTimerDisplay(); // Show immediate

            timerInterval = setInterval(() => {
                if (timerTotalSeconds > 0) {
                    timerTotalSeconds--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timerInterval);
                    alert("Timer Finished!");
                    resetTimer();
                }
            }, 1000);
        }
    });

    timerPauseBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerPauseBtn.classList.add('hidden');
        timerStartBtn.classList.remove('hidden');
        timerStartBtn.textContent = 'Resume';
    });

    timerResetBtn.addEventListener('click', resetTimer);

    function updateTimerDisplay() {
        timerDisplay.textContent = formatTimeHMS(timerTotalSeconds);
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timerTotalSeconds = 0;
        timerStartBtn.textContent = 'Start';

        timerDisplay.classList.add('hidden');
        timerInputs.classList.remove('hidden');

        timerPauseBtn.classList.add('hidden');
        timerStartBtn.classList.remove('hidden');

        inputH.value = '';
        inputM.value = '';
        inputS.value = '';
    }

    // --- Digital Clock ---
    const clockDisplay = document.getElementById('clock-display');
    const clockDate = document.getElementById('clock-date');

    function updateClock() {
        const now = new Date();
        clockDisplay.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        clockDate.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- World Clock ---
    const cities = [
        { name: 'New York', zone: 'America/New_York' },
        { name: 'London', zone: 'Europe/London' },
        { name: 'Tokyo', zone: 'Asia/Tokyo' },
        { name: 'Dubai', zone: 'Asia/Dubai' },
        { name: 'Sydney', zone: 'Australia/Sydney' },
        { name: 'Paris', zone: 'Europe/Paris' }
    ];

    const worldGrid = document.getElementById('world-clock-grid');

    function updateWorldClock() {
        worldGrid.innerHTML = '';
        cities.forEach(city => {
            const time = new Date().toLocaleTimeString('en-US', { timeZone: city.zone, hour: '2-digit', minute: '2-digit' });
            const div = document.createElement('div');
            div.className = 'city-card';
            div.innerHTML = `<div class="city-name">${city.name}</div><div class="city-time">${time}</div>`;
            worldGrid.appendChild(div);
        });
    }
    setInterval(updateWorldClock, 1000); // Update every minute is usually enough, but sec for precision
    updateWorldClock();

    // --- Alarm ---
    const alarmTimeInput = document.getElementById('alarm-time');
    const alarmSetBtn = document.getElementById('alarm-set');
    const alarmClearBtn = document.getElementById('alarm-clear');
    const alarmStatus = document.getElementById('alarm-status');
    let alarmInterval;
    let alarmTarget = null;

    alarmSetBtn.addEventListener('click', () => {
        if (alarmTimeInput.value) {
            alarmTarget = alarmTimeInput.value;
            alarmStatus.textContent = `Alarm set for ${alarmTarget}`;
            alarmSetBtn.disabled = true;
            alarmClearBtn.disabled = false;

            alarmInterval = setInterval(() => {
                const now = new Date();
                const current = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

                if (current === alarmTarget && now.getSeconds() === 0) {
                    alert('ALARM WAKE UP!');
                    clearAlarm();
                }
            }, 1000);
        }
    });

    alarmClearBtn.addEventListener('click', clearAlarm);

    function clearAlarm() {
        clearInterval(alarmInterval);
        alarmTarget = null;
        alarmStatus.textContent = "No alarm set";
        alarmSetBtn.disabled = false;
        alarmClearBtn.disabled = true;
        alarmTimeInput.value = '';
    }

    // --- Pomodoro ---
    let pomoInterval;
    let pomoSeconds = 25 * 60;
    let pomoRunning = false;
    let pomoMode = 'work'; // work or break

    const pomoDisplay = document.getElementById('pomo-display');
    const pomoStartBtn = document.getElementById('pomo-start');
    const pomoResetBtn = document.getElementById('pomo-reset');
    const pomoModeBtns = document.querySelectorAll('.mode-btn');

    function updatePomoDisplay() {
        const m = Math.floor(pomoSeconds / 60).toString().padStart(2, '0');
        const s = (pomoSeconds % 60).toString().padStart(2, '0');
        pomoDisplay.textContent = `${m}:${s}`;
    }

    pomoModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            pomoModeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            pomoMode = btn.getAttribute('data-mode');

            resetPomo();
        });
    });

    pomoStartBtn.addEventListener('click', () => {
        if (!pomoRunning) {
            pomoRunning = true;
            pomoStartBtn.textContent = 'Pause';
            pomoInterval = setInterval(() => {
                if (pomoSeconds > 0) {
                    pomoSeconds--;
                    updatePomoDisplay();
                } else {
                    clearInterval(pomoInterval);
                    pomoRunning = false;
                    pomoStartBtn.textContent = 'Start';
                    alert(pomoMode === 'work' ? 'Work session done! Take a break.' : 'Break over! Back to work.');
                }
            }, 1000);
        } else {
            pomoRunning = false;
            clearInterval(pomoInterval);
            pomoStartBtn.textContent = 'Start';
        }
    });

    pomoResetBtn.addEventListener('click', resetPomo);

    function resetPomo() {
        clearInterval(pomoInterval);
        pomoRunning = false;
        pomoStartBtn.textContent = 'Start';
        if (pomoMode === 'work') {
            pomoSeconds = 25 * 60;
        } else {
            pomoSeconds = 5 * 60;
        }
        updatePomoDisplay();
    }
});
