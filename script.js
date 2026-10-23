/* ============================================
   КОНФИГ — меняй здесь
   ============================================ */
const CONFIG = {
    herName: 'Любимая',
    startDate: '2023-06-15T18:00:00',
    music: 'prince.mp3',
    musicVolume: 0.35,
    secretTaps: 7,
    secretMessage: 'Значит, ты дошла до конца. P.S. посмотри под подушкой 💌',

    // ============ ТЕКСТ ПЕСНИ ============
    // time — секунда, когда строка должна появиться
    // text — сама строка
    lyrics: [
    // ── Куплет 1 ──
    { time: 23.0,  text: 'В голове монотон, утопила мечты.' },
    { time: 27.0, text: 'Промелькнула, как сон мимо моей звезды.' },
    { time: 31.0, text: 'Обездвиженный дом, поливаю цветы.' },
    { time: 34.0, text: 'Уходя — уходи (уходи, уходи).' },

    // ── Пре-хорус ──
    { time: 39.0, text: 'В этих недельных запоях я потерял себя, кто я?' },
    { time: 45.0, text: 'Любовь и ненависть ноет. Может, ты нервно больная, но' },
    { time: 49.0, text: 'Все апплодируют стоя, им до нас дело какое?' },
    { time: 53.0, text: 'Я один, или мы двое, кажется, всё паранойя.' },

    // ── Припев 1 ──
    { time: 58.0, text: 'Пусто, почему так пусто?' },
    { time: 101.0, text: 'Я забуду все твои контакты, Direct\'ы, WhatsApp\'ы.' },
    { time: 46.5, text: 'Выбросила чувства. Ох, уж эти чувства.' },
    { time: 50.0, text: 'Хочешь — ненавидь меня, но сына поцелуй от папы.' },

    // ── Припев 2 (повтор) ──
    { time: 53.5, text: 'Пусто, почему так пусто?' },
    { time: 56.5, text: 'Я забуду все твои контакты, Direct\'ы, WhatsApp\'ы.' },
    { time: 60.0, text: 'Выбросила чувства. Ох, уж эти чувства.' },
    { time: 63.5, text: 'Хочешь — ненавидь меня, но сына поцелуй от папы.' },

    // ── Куплет 2 (повтор) ──
    { time: 67.0, text: 'В голове монотон, утопила мечты.' },
    { time: 71.0, text: 'Промелькнула, как сон мимо моей звезды.' },
    { time: 75.0, text: 'Обездвиженный дом, поливаю цветы.' },
    { time: 79.0, text: 'Уходя — уходи (уходи, уходи).' },

    // ── Бридж (mommy) ──
    { time: 83.0,  text: 'Одна любовь, mommy —' },
    { time: 87.0,  text: 'А ты безмерно выпиваешь мою кровь, mommy.' },
    { time: 91.0,  text: 'Прошлась по нервам. Хватит! Ты не пустословь, mommy.' },
    { time: 95.0,  text: 'И я безжалостно вливаю в себя вновь, mommy.' },
    { time: 99.0,  text: 'Одна любовь, mommy.' },
    { time: 102.0, text: 'Одна любовь, mommy.' },
    { time: 105.5, text: 'Глаза не прячь, я вижу всю тебя насквозь, mommy.' },
    { time: 109.5, text: 'Нам эту сказку сохранить не удалось, mommy.' },
    { time: 113.5, text: 'Сожги, сотри, забудь, забей, выкинь и брось, mommy.' },
    { time: 117.5, text: 'Не удалось, mommy.' },

    // ── Припев 3 (обрезанный) ──
    { time: 121.0, text: 'Пусто, почему так пусто?' },
    { time: 124.0, text: 'Я забуду все твои контакты, Direct\'ы, WhatsApp\'ы.' },
    { time: 127.5, text: 'Выбросила чувства. Ох, уж эти чувства.' },
    { time: 131.0, text: 'Хочешь — ненавидь меня, но сына...' },

    // ── Финальный куплет ──
    { time: 135.0, text: 'В голове монотон, утопила мечты.' },
    { time: 139.0, text: 'Промелькнула, как сон мимо моей звезды.' },
    { time: 143.0, text: 'Обездвиженный дом, поливаю цветы.' },
    { time: 147.0, text: 'Уходя — уходи (уходи, уходи).' },

    // ── Финал (повтор) ──
    { time: 151.0, text: 'В голове монотон, утопила мечты.' },
    { time: 155.0, text: 'Промелькнула, как сон мимо моей звезды.' },
    { time: 159.0, text: 'Обездвиженный дом, поливаю цветы.' },
    { time: 163.0, text: 'Уходя — уходи (уходи, уходи).' },
],

    // ============ НАСТРОЙКИ БИТ-ДЕТЕКТОРА ============
    // threshold — во сколько раз энергия баса должна превысить среднюю
    //             1.2 = чувствительный (много пульсов)
    //             1.5 = сбалансированный (по умолчанию)
    //             1.8 = строгий (только сильные биты)
    beatThreshold: 1.4,
    // Минимальный интервал между битами (мс) — защита от двойных срабатываний
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
    pulse: 0, // 0..1 — плавно затухающая величина
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
        console.warn('Не удалось подключить анализатор (запускай сайт через http-сервер):', e);
        // Пробуем перенаправить звук обратно на выход, если sourceNode создался
        try {
            if (sourceNode) sourceNode.connect(audioCtx.destination);
        } catch {}
        return false;
    }
}

// Детектор бита
function detectBeat() {
    if (!analyser || !dataArray) return 0;

    analyser.getByteFrequencyData(dataArray);

    // Берём бас-диапазон (бины 0..5 ≈ 0-350Гц — там живут бочка и бас)
    let bass = 0;
    for (let i = 0; i < 6; i++) bass += dataArray[i];
    bass /= 6;

    // Экспоненциальное среднее — накапливаем «типичную» громкость баса
    if (beatState.samples < 40) {
        beatState.average = (beatState.average * beatState.samples + bass) / (beatState.samples + 1);
        beatState.samples++;
    } else {
        beatState.average = beatState.average * 0.97 + bass * 0.03;
    }

    const now = performance.now();
    const threshold = beatState.average * CONFIG.beatThreshold;

    // Бит = резкий скачок баса выше среднего + минимальный интервал + не тишина
    if (
        bass > threshold &&
        bass > 45 &&
        now - beatState.lastBeat > CONFIG.beatMinInterval
    ) {
        beatState.lastBeat = now;
        return Math.min(1, (bass - threshold) / 180 + 0.4); // 0.4..1
    }
    return 0;
}

const lyricLine = $('#lyric-line');
const beatGlow = $('#beat-glow');

function pulseLoop() {
    if (!audio.paused) {
        const intensity = detectBeat();
        if (intensity > beatState.pulse) {
            beatState.pulse = intensity;
        }
    }

    // Плавное затухание
    beatState.pulse *= 0.86;
    if (beatState.pulse < 0.01) beatState.pulse = 0;

    const p = beatState.pulse;

    // Пульс строки текста
    if (lyricLine && lyricLine.classList.contains('show')) {
        const scale = 1 + p * 0.09;
        const bright = 1 + p * 0.7;
        const blur = Math.max(1.0, 2.5 - p * 1.5);
        lyricLine.style.transform = `scale(${scale}) translateY(0)`;
        lyricLine.style.filter = `blur(${blur}px) brightness(${bright})`;
    } else if (lyricLine) {
        lyricLine.style.transform = '';
        lyricLine.style.filter = '';
    }

    // Фоновое свечение
    if (beatGlow) {
        beatGlow.style.opacity = (p * 0.55).toFixed(3);
    }

    // Свечение кнопки музыки
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
   СИНХРОНИЗАЦИЯ ТЕКСТА ПЕСНИ
   ============================================ */
function initLyricsSync() {
    if (!lyricLine || !CONFIG.lyrics.length) return;

    let currentIdx = -1;
    let lastTime = 0;

    function findIdx(t) {
        let idx = -1;
        for (let i = 0; i < CONFIG.lyrics.length; i++) {
            if (t >= CONFIG.lyrics[i].time) idx = i;
            else break;
        }
        return idx;
    }

    function showLine(text) {
        lyricLine.classList.remove('show');
        setTimeout(() => {
            lyricLine.textContent = text;
            lyricLine.classList.add('show');
        }, 180);
    }

    function tick() {
        if (!audio.paused) {
            const t = audio.currentTime;

            if (t < lastTime - 1) {
                currentIdx = -1;
                lyricLine.classList.remove('show');
            }
            lastTime = t;

            const idx = findIdx(t);
            if (idx !== currentIdx) {
                if (idx === -1) {
                    lyricLine.classList.remove('show');
                } else {
                    showLine(CONFIG.lyrics[idx].text);
                }
                currentIdx = idx;
            }
        }
        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);

    audio.addEventListener('pause', () => {
        lyricLine.classList.remove('show');
        beatGlow.style.opacity = 0;
    });

    audio.addEventListener('play', () => {
        currentIdx = -1;
        lastTime = audio.currentTime;
    });

    audio.addEventListener('seeked', () => {
        currentIdx = -1;
        lastTime = audio.currentTime;
        lyricLine.classList.remove('show');
    });
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

    // Инициализируем Web Audio (жест пользователя уже есть)
    const audioReady = initAnalyser();
    if (audioCtx && audioCtx.state === 'suspended') {
        try { await audioCtx.resume(); } catch {}
    }

    // Запускаем воспроизведение
    await playMusic();

    // Стартуем бит-детектор (если анализатор доступен)
    if (audioReady && analyser) {
        startBeatLoop();
    }

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

    // Инициализируем синхронизацию текста песни
    initLyricsSync();
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
