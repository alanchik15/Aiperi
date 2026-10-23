/* ============================================
   КОНФИГ — меняй здесь
   ============================================ */
const CONFIG = {
    herName: 'Любимая',
    startDate: '2026-07-18T18:00:00',
    music: 'prince.mp3',
    musicVolume: 0.35,

    starsName: Aqgthb,       // null → берётся herName
    starsHoldTime: 2500,   // мс держать имя после сборки

    secretLetter:
        `Слушай, я только сейчас по настоящему понял, как сильно затупил.\n\n` +
        `Мне правда очень жаль за мой холод и за все эти глупые обиды..\n\n` +
        `Ты вообще этого не заслуживаешь. ` +
        `Ты для меня очень дорога. ` +
        `Я правда всё пересмотрел и изменился, ` +
        `Хочу дарить тебе только тепло и заботу.\n\n` +
        `спасибо за твоё терпение. Я готов на всё: ` +
        `чтобы ты всегда чуствовала, как сильно я тобой дорожу.`,

    qrImage: 'qr.jpeg',
    qrLabel: 'наведи камеру 📷',

    dailyReasons: [
        'за то, как ты улыбаешься, когда думаешь, что я не вижу',
        'за твой смех — самый красивый звук в моей жизни',
        'за то, как ты умеешь слушать — по-настоящему',
        'за твои глаза, в которых я теряюсь каждый раз',
        'за то, что ты рядом, даже когда я невыносим',
        'за твоё тепло, которое чувствую даже на расстоянии',
        'за то, как ты морщишь нос, когда злишься',
        'за твою доброту ко всем вокруг',
        'за то, что ты веришь в меня больше, чем я сам',
        'за твои объятия, в которых весь мир замирает',
        'за то, как ты говоришь моё имя',
        'за твою силу, о которой ты даже не догадываешься',
        'за то, что с тобой я дома — где бы мы ни были',
        'за твои сонные глаза по утрам',
        'за то, как ты заботишься о мелочах',
        'за твою искренность — редкий дар',
        'за то, что ты делаешь меня лучше каждый день',
        'за твоё «я скучаю», которое греет сильнее солнца',
        'за то, как ты держишь мою руку — крепко-крепко',
        'за то, что ты — это ты. И этого достаточно',
        'за твоё терпение, когда я говорю ерунду',
        'за твою улыбку в самое неподходящее время — она спасает',
        'за то, что ты не боишься быть настоящей со мной',
        'за наши глупые шутки, которые понятны только нам',
        'за то, что я хочу быть лучше — ради тебя',
        'за твою нежность, которая обезоруживает',
        'за то, как ты подпеваешь песням в машине',
        'за твоё «доброе утро», которое становится моим любимым',
        'за то, что рядом с тобой время летит незаметно',
        'за все наши «завтра», которые мы ещё проживём вместе',
    ],

    secretTaps: 3,
    secretMessage: 'Значит, ты дошла до конца. P.S. посмотри под подушкой 💌',

    beatThreshold: 1.4,
    beatMinInterval: 200,
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const vibrate = (ms = 8) => navigator.vibrate?.(ms);

/* ============================================
   🌟 ИМЯ ИЗ ЗВЁЗД — bulletproof
   ============================================ */
(async function initStarsName() {
    const starsScreen = $('#stars-name-screen');
    const canvas = $('#stars-name-canvas');
    const skipBtn = $('#stars-skip');

    if (!starsScreen || !canvas) {
        console.error('[stars] Не найдены DOM-элементы, пропускаю');
        return;
    }

    const displayName = CONFIG.starsName || CONFIG.herName || 'Ты';
    let dismissed = false;
    let rafId = null;

    // Принудительный таймер (страховка)
    const forceTimer = setTimeout(() => {
        console.warn('[stars] Force finish по таймауту');
        dismiss();
    }, 15000);

    function dismiss() {
        if (dismissed) return;
        dismissed = true;
        clearTimeout(forceTimer);
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        starsScreen.classList.add('gone');
        setTimeout(() => { starsScreen.style.display = 'none'; }, 2000);
    }

    // Skip — работает ВСЕГДА, прикрепляется первым делом
    if (skipBtn) {
        skipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('[stars] Пропущено пользователем');
            dismiss();
        });
        skipBtn.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
    }

    // --- Ждём шрифт, потом стартуем ---
    try {
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }
        console.log('[stars] Шрифт готов, старт анимации');
        startAnimation();
    } catch (err) {
        console.error('[stars] Ошибка инициализации:', err);
        dismiss();
    }

    function startAnimation() {
        try {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const W = window.innerWidth;
            const H = window.innerHeight;

            canvas.width = W * dpr;
            canvas.height = H * dpr;
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('[stars] Canvas 2D не поддерживается');
                dismiss();
                return;
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            // === Маленький off-canvas для сэмплинга ===
            const SAMPLE = 500;
            const sampleCanvas = document.createElement('canvas');
            sampleCanvas.width = SAMPLE;
            sampleCanvas.height = SAMPLE;
            const sctx = sampleCanvas.getContext('2d', { willReadFrequently: true });

            let size = 160;
            sctx.font = `600 ${size}px 'Cormorant Garamond', Georgia, serif`;
            const maxW = SAMPLE * 0.92;
            while (sctx.measureText(displayName).width > maxW && size > 24) {
                size -= 2;
                sctx.font = `600 ${size}px 'Cormorant Garamond', Georgia, serif`;
            }

            sctx.fillStyle = '#fff';
            sctx.textAlign = 'center';
            sctx.textBaseline = 'middle';
            sctx.fillText(displayName, SAMPLE / 2, SAMPLE / 2);

            // === Сэмплируем точки ===
            let targetPoints = [];
            try {
                const img = sctx.getImageData(0, 0, SAMPLE, SAMPLE);
                const data = img.data;
                const gap = 4;
                for (let y = 0; y < SAMPLE; y += gap) {
                    for (let x = 0; x < SAMPLE; x += gap) {
                        if (data[(y * SAMPLE + x) * 4 + 3] > 128) {
                            targetPoints.push({
                                x: (x / SAMPLE) * W,
                                y: (y / SAMPLE) * H,
                            });
                        }
                    }
                }
            } catch (err) {
                console.error('[stars] Ошибка сэмплинга:', err);
            }

            // Кап на количество частиц
            const MAX = 2500;
            if (targetPoints.length > MAX) {
                const step = Math.ceil(targetPoints.length / MAX);
                targetPoints = targetPoints.filter((_, i) => i % step === 0);
            }

            console.log('[stars] Точек собрано:', targetPoints.length);

            // === FALLBACK: если точек нет — рисуем текст напрямую ===
            if (targetPoints.length < 10) {
                console.warn('[stars] Мало точек — использую текстовый fallback');
                textFallback(ctx, W, H, size, displayName);
                return;
            }

            // === Частицы ===
            const particles = targetPoints.map((pt) => {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.max(W, H) * 0.7;
                const sx = W / 2 + Math.cos(angle) * radius * Math.random();
                const sy = H / 2 + Math.sin(angle) * radius * Math.random();
                return {
                    x: sx, y: sy,
                    sx, sy,
                    tx: pt.x, ty: pt.y,
                    r: Math.random() * 1.4 + 0.6,
                    phase: Math.random() * Math.PI * 2,
                };
            });

            const PHASE = { CHAOS: 0, GATHER: 1, HOLD: 2, EXPLODE: 3, DONE: 4 };
            let phase = PHASE.CHAOS;
            let phaseStart = performance.now();
            let exploded = false;
            let holdEnd = null;

            const CHAOS_DUR = 1400;
            const GATHER_DUR = 1800;
            const HOLD_DUR = CONFIG.starsHoldTime;
            const EXPLODE_DUR = 1500;

            const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

            function render(now) {
                if (dismissed) return;
                const elapsed = now - phaseStart;

                if (phase === PHASE.CHAOS && elapsed >= CHAOS_DUR) {
                    phase = PHASE.GATHER;
                    phaseStart = now;
                } else if (phase === PHASE.GATHER && elapsed >= GATHER_DUR) {
                    phase = PHASE.HOLD;
                    phaseStart = now;
                    holdEnd = now + HOLD_DUR;
                } else if (phase === PHASE.HOLD && now >= holdEnd && !exploded) {
                    phase = PHASE.EXPLODE;
                    phaseStart = now;
                    exploded = true;
                    particles.forEach((p) => {
                        const angle = Math.atan2(p.y - H / 2, p.x - W / 2) + (Math.random() - 0.5) * 0.8;
                        const speed = Math.random() * 600 + 400;
                        p.sx = p.tx;
                        p.sy = p.ty;
                        p.tx = p.tx + Math.cos(angle) * speed;
                        p.ty = p.ty + Math.sin(angle) * speed;
                    });
                } else if (phase === PHASE.EXPLODE && elapsed >= EXPLODE_DUR) {
                    phase = PHASE.DONE;
                }

                ctx.clearRect(0, 0, W, H);

                const t = now * 0.001;
                for (const p of particles) {
                    let progress = 0;

                    if (phase === PHASE.CHAOS) {
                        p.x += Math.cos(t + p.phase) * 0.4;
                        p.y += Math.sin(t + p.phase * 1.3) * 0.4;
                    } else if (phase === PHASE.GATHER) {
                        progress = Math.min(1, elapsed / GATHER_DUR);
                        const eased = easeOutQuart(progress);
                        p.x = p.sx + (p.tx - p.sx) * eased;
                        p.y = p.sy + (p.ty - p.sy) * eased;
                    } else if (phase === PHASE.HOLD) {
                        p.x = p.tx;
                        p.y = p.ty;
                    } else if (phase === PHASE.EXPLODE) {
                        progress = Math.min(1, elapsed / EXPLODE_DUR);
                        const eased = easeOutQuart(progress);
                        p.x = p.sx + (p.tx - p.sx) * eased;
                        p.y = p.sy + (p.ty - p.sy) * eased;
                    }

                    const twinkle = 0.5 + 0.5 * Math.sin(t * 2 + p.phase);
                    let alpha = 0.4 + 0.6 * twinkle;
                    if (phase === PHASE.EXPLODE) alpha *= (1 - Math.min(1, elapsed / EXPLODE_DUR));

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r + 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(216, 149, 152, ${alpha * 0.15})`;
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 230, 220, ${alpha})`;
                    ctx.fill();
                }

                if (phase === PHASE.DONE) {
                    dismiss();
                    return;
                }

                rafId = requestAnimationFrame(render);
            }

            rafId = requestAnimationFrame(render);
        } catch (err) {
            console.error('[stars] Ошибка анимации:', err);
            dismiss();
        }
    }

    function textFallback(ctx, W, H, size, text) {
        let startTime = null;
        const total = 5000;

        function frame(now) {
            if (dismissed) return;
            if (!startTime) startTime = now;
            const elapsed = now - startTime;

            ctx.clearRect(0, 0, W, H);

            let alpha = 0;
            if (elapsed < 1000) alpha = elapsed / 1000;
            else if (elapsed < 4000) alpha = 1;
            else if (elapsed < total) alpha = 1 - (elapsed - 4000) / 1000;
            else { dismiss(); return; }

            // Свечение
            ctx.font = `600 ${size}px 'Cormorant Garamond', Georgia, serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.shadowColor = `rgba(216, 149, 152, ${alpha * 0.6})`;
            ctx.shadowBlur = 30;
            ctx.fillStyle = `rgba(255, 230, 220, ${alpha})`;
            ctx.fillText(text, W / 2, H / 2);

            ctx.shadowBlur = 0;

            rafId = requestAnimationFrame(frame);
        }

        rafId = requestAnimationFrame(frame);
    }
})();

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
   💌 ТАЙНОЕ ПИСЬМО
   ============================================ */
(function initSecretLetter() {
    const seal = $('#letter-seal');
    const sealWrap = $('#letter-seal-wrap');
    const paper = $('#letter-paper');
    const typedEl = $('#typed-text');
    const cursor = $('#typed-cursor');
    if (!seal || !paper || !typedEl) return;

    let started = false;

    function delayFor(char, prevChar, nextChar) {
        let d = 30 + Math.random() * 35;
        if (char === '.') {
            if (prevChar === '.' || nextChar === '.') d = 180;
            else d = 750;
        } else if (char === ',') d = 320;
        else if (char === '!' || char === '?') d = 600;
        else if (char === '—' || char === '–' || char === '-') d = 220;
        else if (char === '\n') d = 550;
        else if (char === ' ') d = 25 + Math.random() * 20;
        return d;
    }

    function typeLetter(text) {
        let i = 0;
        function tick() {
            if (i >= text.length) {
                setTimeout(() => {
                    if (cursor) cursor.style.display = 'none';
                }, 2000);
                return;
            }
            const char = text[i];
            const prev = i > 0 ? text[i - 1] : '';
            const next = i + 1 < text.length ? text[i + 1] : '';
            typedEl.textContent += char;
            i++;
            if (char === '.' && prev === '.' && next !== '.') {
                setTimeout(tick, 900);
                return;
            }
            setTimeout(tick, delayFor(char, prev, next));
        }
        setTimeout(tick, 500);
    }

    seal.addEventListener('click', () => {
        if (started) return;
        started = true;
        vibrate([25, 60, 25]);
        seal.classList.add('cracking');

        setTimeout(() => {
            sealWrap.classList.add('gone');
            setTimeout(() => {
                sealWrap.style.display = 'none';
                paper.hidden = false;
                typeLetter(CONFIG.secretLetter);
            }, 500);
        }, 750);
    });
})();

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
        revealQR();
    } else {
        secretHint.textContent = `${CONFIG.secretTaps - heartTaps}...`;
    }
});

/* ============================================
   QR-КОД
   ============================================ */
function revealQR() {
    const wrapper = $('#qr-wrapper');
    const img = $('#qr-code');
    const label = $('#qr-label');
    if (!wrapper || !img) return;

    if (!CONFIG.qrImage) {
        console.warn('CONFIG.qrImage не задан — QR не покажется');
        if (label) label.textContent = 'QR пока не настроен';
        return;
    }

    img.src = CONFIG.qrImage;
    img.alt = 'QR-код';
    img.onerror = () => {
        console.warn('QR-картинка не нашлась:', CONFIG.qrImage);
        if (label) label.textContent = 'QR не найден';
    };

    if (label) label.textContent = CONFIG.qrLabel;

    setTimeout(() => {
        wrapper.classList.add('visible');
        wrapper.setAttribute('aria-hidden', 'false');
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 700);
}

/* ============================================
   ПРИЧИНА ДНЯ
   ============================================ */
function setDailyReason() {
    const el = $('#daily-reason');
    if (!el || !CONFIG.dailyReasons?.length) return;

    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - start) / 86400000);
    const idx = dayOfYear % CONFIG.dailyReasons.length;
    const newText = CONFIG.dailyReasons[idx];

    if (el.textContent && el.textContent !== newText) {
        el.classList.add('fade');
        setTimeout(() => {
            el.textContent = newText;
            el.classList.remove('fade');
        }, 400);
    } else {
        el.textContent = newText;
    }
}

setDailyReason();
setInterval(setDailyReason, 60000);

/* ============================================
   ЗАГОЛОВОК ВКЛАДКИ
   ============================================ */
const originalTitle = document.title;
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = 'не уходи 💔';
    } else {
        document.title = 'ты вернулась ❤️';
        setTimeout(() => { document.title = originalTitle; }, 2500);
    }
});

/* ============================================
   ВИБРАЦИЯ
   ============================================ */
$$('.music-btn, .photo-item, .promise, .chapter-title, .letter-seal, .secret-heart').forEach((el) => {
    el.addEventListener('touchstart', () => vibrate(5), { passive: true });
});
