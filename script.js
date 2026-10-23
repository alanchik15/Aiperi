/* ============================================
   КОНФИГ
   ============================================ */
const CONFIG = {
    herName: 'Любимая',
    startDate: '2023-06-15T18:00:00',
    music: 'prince.mp3',
    musicVolume: 0.35,
    secretTaps: 7,
    secretMessage: 'Значит, ты дошла до конца. P.S. посмотри под подушкой 💌',

    // Бит-детектор
    beatThreshold: 1.4,
    beatMinInterval: 200,
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const vibrate = (ms = 8) => navigator.vibrate?.(ms);

/* ============================================
   ПЫЛИНКИ
   ============================================ */
(function initDust() {
    const canvas = document.getElementById('dust');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.width = window.innerWidth * dpr;
        h = canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function create() {
        particles = [];
        const count = 18;
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                r: Math.random() * 1.4 + 0.4,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.1 - 0.02,
                a: Math.random() * 0.5 + 0.1,
                phase: Math.random() * Math.PI * 2,
            });
        }
    }

    function draw(t) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < -10) p.x = window.innerWidth + 10;
            if (p.x > window.innerWidth + 10) p.x = -10;
            if (p.y < -10) p.y = window.innerHeight + 10;
            if (p.y > window.innerHeight + 10) p.y = -10;
            const flicker = 0.6 + 0.4 * Math.sin(t * 0.001 + p.phase);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(240, 200, 180, ${p.a * flicker})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    resize();
    create();
    requestAnimationFrame(draw);
    window.addEventListener('resize', () => { resize(); create(); });
})();

/* ============================================
   МУЗЫКА
   ============================================ */
const audio = $('#music');
const musicBtn = $('#music-btn');
audio.src = CONFIG.music;
audio.volume = CONFIG.musicVolume;
audio.loop = true;

async function playMusic() {
    try {
        await audio.play();
        musicBtn.classList.add('playing');
        musicBtn.classList.remove('muted');
    } catch (e) {
        console.warn('Музыка не запустилась:', e);
    }
}

musicBtn.addEventListener('click', () => {
    vibrate();
    if (audio.paused) playMusic();
    else {
        audio.pause();
        musicBtn.classList.remove('playing');
        musicBtn.classList.add('muted');
    }
});

/* ============================================
   WEB AUDIO — БИТ-ДЕТЕКТОР
   ============================================ */
let audioCtx = null;
let analyser = null;
let dataArray = null;
let sourceNode = null;
let beatLoopRunning = false;

const beatState = {
    average: 0,
    samples: 0,
    lastBeat: 0,
    pulse: 0,
};

function initAnalyser() {
    if (audioCtx) return true;
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) throw new Error('Web Audio API не поддерживается');
        audioCtx = new Ctx();
        sourceNode = audioCtx.createMediaElementSource(audio);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.6;
        sourceNode.connect(analyser);
        analyser.connect(audioCtx.destination);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        return true;
    } catch (e) {
        console.warn('Анализатор не подключился:', e);
        try { if (sourceNode) sourceNode.connect(audioCtx.destination); } catch {}
        return false;
    }
}

function detectBeat() {
    if (!analyser || !dataArray) return 0;
    analyser.getByteFrequencyData(dataArray);

    let bass = 0;
    for (let i = 0; i < 6; i++) bass += dataArray[i];
    bass /= 6;

    if (beatState.samples < 40) {
        beatState.average = (beatState.average * beatState.samples + bass) / (beatState.samples + 1);
        beatState.samples++;
    } else {
        beatState.average = beatState.average * 0.97 + bass * 0.03;
    }

    const now = performance.now();
    const threshold = beatState.average * CONFIG.beatThreshold;

    if (bass > threshold && bass > 45 && now - beatState.lastBeat > CONFIG.beatMinInterval) {
        beatState.lastBeat = now;
        return Math.min(1, (bass - threshold) / 180 + 0.4);
    }
    return 0;
}

const beatGlow = $('#beat-glow');

function pulseLoop() {
    if (!audio.paused) {
        const intensity = detectBeat();
        if (intensity > beatState.pulse) beatState.pulse = intensity;
    }

    beatState.pulse *= 0.86;
    if (beatState.pulse < 0.01) beatState.pulse = 0;

    const p = beatState.pulse;

    if (beatGlow) beatGlow.style.opacity = (p * 0.55).toFixed(3);

    if (musicBtn && !audio.paused) {
        musicBtn.style.boxShadow = `0 0 ${8 + p * 24}px rgba(216,149,152,${0.3 + p * 0.5})`;
    } else if (musicBtn) {
        musicBtn.style.boxShadow = '';
    }

    requestAnimationFrame(pulseLoop);
}

function startBeatLoop() {
    if (beatLoopRunning) return;
    beatLoopRunning = true;
    requestAnimationFrame(pulseLoop);
}

/* ============================================
   КОНВЕРТ
   ============================================ */
const envelopeScreen = $('#envelope-screen');
const envelope = $('#envelope');
const letter = $('#letter');
const progressLine = $('.progress-line');
const body = document.body;

async function openEnvelope() {
    if (envelope.classList.contains('opened')) return;
    vibrate(20);
    envelope.classList.add('opened');

    const audioReady = initAnalyser();
    if (audioCtx && audioCtx.state === 'suspended') {
        try { await audioCtx.resume(); } catch {}
    }

    await playMusic();

    if (audioReady && analyser) startBeatLoop();

    setTimeout(() => {
        envelopeScreen.classList.add('gone');
        body.classList.remove('locked');

        requestAnimationFrame(() => {
            letter.classList.add('visible');
            musicBtn.classList.add('visible');
            progressLine.classList.add('active');
            setTimeout(startReveals, 200);
        });
    }, 2000);
}

envelope.addEventListener('click', openEnvelope);
envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
    }
});

/* ============================================
   ТАЙПИНГ ПРИВЕТСТВИЯ
   ============================================ */
function typeGreeting() {
    const el = $('#greeting');
    if (!el) return;
    const text = el.textContent;
    el.textContent = '';
    let i = 0;
    const tick = () => {
        if (i < text.length) {
            el.textContent += text[i++];
            setTimeout(tick, 70);
        } else el.classList.add('done');
    };
    tick();
}

$('#her-name').textContent = CONFIG.herName;

/* ============================================
   СЧЁТЧИК
   ============================================ */
function updateCounter() {
    const start = new Date(CONFIG.startDate);
    const now = new Date();
    const diff = Math.max(0, now - start);
    const pad = (n) => String(n).padStart(2, '0');

    $('#c-days').textContent = Math.floor(diff / 86400000);
    $('#c-hours').textContent = pad(Math.floor((diff / 3600000) % 24));
    $('#c-minutes').textContent = pad(Math.floor((diff / 60000) % 60));
    $('#c-seconds').textContent = pad(Math.floor((diff / 1000) % 60));
}

updateCounter();
setInterval(updateCounter, 1000);

/* ============================================
   REVEAL
   ============================================ */
function startReveals() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    $$('.chapter').forEach((chapter) => {
        chapter.querySelectorAll('.reveal').forEach((el, i) => {
            el.style.setProperty('--d', `${i * 0.1}s`);
            observer.observe(el);
        });
    });

    setTimeout(typeGreeting, 500);
}

/* ============================================
   ПРОГРЕСС
   ============================================ */
const progressFill = $('#progress-fill');
window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressFill.style.height = Math.min(100, Math.max(0, percent)) + '%';
}, { passive: true });

/* ============================================
   ЛАЙТБОКС
   ============================================ */
const lightbox = $('#lightbox');
const lbImg = $('#lb-img');
const lbCaption = $('#lb-caption');

$$('.photo-item').forEach((item) => {
    item.addEventListener('click', () => {
        vibrate();
        lbImg.src = item.dataset.src;
        lbCaption.textContent = item.dataset.caption || '';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    });
});

function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 400);
}

$('#lb-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

let lbStartY = 0;
lightbox.addEventListener('touchstart', (e) => {
    lbStartY = e.changedTouches[0].screenY;
}, { passive: true });
lightbox.addEventListener('touchend', (e) => {
    if (e.changedTouches[0].screenY - lbStartY > 80) closeLightbox();
}, { passive: true });

/* ============================================
   СЕКРЕТНОЕ СЕРДЦЕ
   ============================================ */
const secretHeart = $('#secret-heart');
const secretHint = $('#secret-hint');
let heartTaps = 0;
let tapResetTimer = null;
let secretRevealed = false;

secretHeart.addEventListener('click', () => {
    if (secretRevealed) return;
    heartTaps++;
    vibrate(15);

    const char = secretHeart.querySelector('.heart-char');
    char.style.transform = 'scale(1.3)';
    setTimeout(() => { char.style.transform = ''; }, 150);

    clearTimeout(tapResetTimer);
    tapResetTimer = setTimeout(() => {
        if (!secretRevealed) heartTaps = 0;
    }, 4000);

    if (heartTaps >= CONFIG.secretTaps) {
        secretRevealed = true;
        secretHeart.classList.add('revealed');
        secretHint.textContent = CONFIG.secretMessage;
        secretHint.classList.add('revealed');
        vibrate([30, 80, 30, 80, 50]);
    } else {
        secretHint.textContent = `${CONFIG.secretTaps - heartTaps}...`;
    }
});

/* ============================================
   ВИБРАЦИЯ
   ============================================ */
$$('.music-btn, .photo-item, .promise, .chapter-title').forEach((el) => {
    el.addEventListener('touchstart', () => vibrate(5), { passive: true });
});
