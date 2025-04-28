const total           = 20;
const stopFrames = Array(20).fill(300);
const loopFlags  = Array(20).fill(true);
const enterThresholds = Array(20).fill(0);
const exitThresholds  = Array(20).fill(1);

// Собираем уникальные пороги для одного Observer-а
const thresholds = Array.from(new Set([...enterThresholds, ...exitThresholds])).sort();

// Состояние каждой анимации
const items = [];

// Общий Observer
const io = new IntersectionObserver(onIntersect, {
  root: null,
  threshold: thresholds
});

// 1. Загружаем анимации и начинаем наблюдать
for (let i = 1; i <= total; i++) {
  const cnt = document.getElementById(`lottie${i}`);
  const anim = lottie.loadAnimation({
    container: cnt,
    renderer: 'svg',
    loop: loopFlags[i-1],
    autoplay: false,
    path: `anim/anim${i}/anim${i}.json`
  });

  items.push({
    anim,
    container: cnt,
    initDone:  false,
    finalDone: false,
    stopFrame: stopFrames[i-1],
    loopFlag:  loopFlags[i-1],
    enterTh:   enterThresholds[i-1],
    exitTh:    exitThresholds[i-1]
  });

  io.observe(cnt);
}

function onIntersect(entries) {
  entries.forEach(entry => {
    const idx = +entry.target.id.replace('lottie','') - 1;
    const itm = items[idx];
    const ratio = entry.intersectionRatio;

    // === ФАЗА 1: Вход в зону (дошли до enterThresholds[idx]) ===
    if (!itm.initDone && ratio >= itm.enterTh) {
      itm.initDone = true;
      itm.anim.play();
      if (!itm.loopFlag) {
        // повесим остановку на stopFrame
        const listener = (e) => {
          if (e.currentTime >= itm.stopFrame) {
            itm.anim.removeEventListener('enterFrame', listener);
            itm.anim.pause();
          }
        };
        itm.anim.addEventListener('enterFrame', listener);
      }
    }

    // === ФАЗА 2: Выход из зоны (упали ниже exitThresholds[idx]) ===
    if (itm.initDone && !itm.loopFlag && !itm.finalDone && ratio < itm.exitTh) {
      itm.finalDone = true;
      itm.anim.play();
    }

    // === Для loop-анимаций: просто play/pause в зависимости от видимости ===
    if (itm.loopFlag) {
      if (ratio >= itm.enterTh) itm.anim.play();
      else                        itm.anim.pause();
    }
  });
}

const pattern = document.querySelector('.pattern');
let isScrolling;

window.addEventListener('scroll', () => {
  pattern.style.animationPlayState = 'running'; // при скролле запускаем анимацию

  clearTimeout(isScrolling);
  isScrolling = setTimeout(() => {
    pattern.style.animationPlayState = 'paused'; // если скролл остановился — ставим на паузу
  }, 100); // задержка 200 мс
});
