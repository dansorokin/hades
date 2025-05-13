document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');
  let currentIndex = 0;
  let isScrolling = false;
  const scrollThreshold = 30;
  
  // Функция: возвращает true, если секция почти полностью видна
  function isSectionMostlyVisible(section) {
    const rect = section.getBoundingClientRect();
    const visibleHeight = Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top);
    return visibleHeight / rect.height >= 0.9; // 90% должно быть видно
  }
  
  function scrollToSection(index) {
    sections[index].scrollIntoView({ behavior: 'smooth' });
  }
  
  window.addEventListener('wheel', (e) => {
    if (
      isScrolling ||
      Math.abs(e.deltaY) < scrollThreshold ||
      !isSectionMostlyVisible(sections[currentIndex])
    ) return;
  
    isScrolling = true;
  
    if (e.deltaY > 0) {
      currentIndex = Math.min(currentIndex + 1, sections.length - 1);
    } else {
      currentIndex = Math.max(currentIndex - 1, 0);
    }
  
    scrollToSection(currentIndex);
  
    setTimeout(() => {
      isScrolling = false;
    }, 800);
  }, { passive: true });
  

  const observer1 = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible1');
        // если нужно однократное появление:
        observer1.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.4, // элемент хотя бы на 10% должен быть виден
  });
  
  // отслеживаем все элементы с классом fade-in
  document.querySelectorAll('.fade-in').forEach(el => observer1.observe(el));


  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5,
  });

  document.querySelectorAll('.fade-in-left, .fade-in-right').forEach(el => observer.observe(el));


window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const setParallax = (selector, ratio) => {
    const el = document.querySelector(selector);
    if (el) {
      el.style.transform = `translateX(${scrollY * ratio}px)`;
    }
  };

  setParallax('.gora1', 0.2);
  setParallax('.gora2', -0.2);
});

const con5 = document.querySelector('.con5');
  const hoverImage1 = document.querySelector('.image-container1');
  const hoverImage2 = document.querySelector('.image-container2');

  let activeRipple = null;

  function createRippleFromElement(element, color) {
    // Удалить предыдущий ripple, если есть
    if (activeRipple) {
      activeRipple.remove();
      activeRipple = null;
    }

    const con5Rect = con5.getBoundingClientRect();
    const elRect = element.getBoundingClientRect();

    const x = elRect.left + elRect.width / 2 - con5Rect.left;
    const y = 0.05*elRect.top + elRect.height / 2 - con5Rect.top;

    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.width = '300%';
    ripple.style.height = '300%';
    ripple.style.borderRadius = '50%';
    ripple.style.background = `radial-gradient(circle, ${color} 0%, ${color} 100%)`;
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '0';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    ripple.style.transition = 'transform 0.6s ease';

    con5.appendChild(ripple);
    window.getComputedStyle(ripple).transform;
    ripple.style.transform = 'translate(-50%, -50%) scale(1)';

    activeRipple = ripple;
  }

  function removeRipple() {
    if (activeRipple) {
      activeRipple.style.transform = 'translate(-50%, -50%) scale(0)';
      activeRipple.addEventListener('transitionend', () => {
        if (activeRipple) {
          activeRipple.remove();
          activeRipple = null;
        }
      }, { once: true });
    }
  }

  hoverImage1.addEventListener('mouseenter', () => {
    createRippleFromElement(hoverImage1, '#27272d');
  });

  hoverImage2.addEventListener('mouseenter', () => {
    createRippleFromElement(hoverImage2, '#d5cbba');
  });

  hoverImage1.addEventListener('mouseleave', removeRipple);
  hoverImage2.addEventListener('mouseleave', removeRipple);



  const ghosts = document.querySelectorAll('.ghost1, .ghost2, .ghost3');

  const observer3 = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('ghost-animate');
        }, 600);
        entry.target.classList.add('ghost-shake')
      }
    });
  }, {
    threshold: 0.8
  });
  
  ghosts.forEach(ghost => observer3.observe(ghost));


  
const total = 23;
// === Только номера особых анимаций ===
const hoverOnlyIndexes = [18, 19, 20]; // Эти запускаются по наведению
const loopIndexes = [3, 4, 5, 10, 11, 12, 13, 14, 15, 23]; // Эти должны зацикливаться
const stopFramesMap = {1: 275, 2: 300, 3: 100, 6: 100, 7: 100, 8: 100, 9: 100}; // номер: стопкадр

// Порог вхождения
const enterThresholdsMap = {
  1: 0.8, 2: 0.3, 3: 0.05, 4: 0.05, 5: 0.3,
  6: 0.05, 7: 0.9, 8: 0.9, 9: 0.9, 10: 0.05,
  11: 0.05, 12: 0.05, 13: 0.05, 14: 0.05, 15: 0.05, 16: 0.05, 17: 0.4
};
const exitThresholdsMap = {
  1: 0.7, 2: 0.4, 7: 0.4, 8: 0.3
};

// Массив состояния
const items = [];

// Собираем все уникальные пороги
const allThresholds = Array.from(new Set([
  ...Object.values(enterThresholdsMap),
  ...Object.values(exitThresholdsMap)
])).sort();

const io = new IntersectionObserver(onIntersect, {
  root: null,
  threshold: allThresholds
});

// === Загрузка анимаций ===
for (let i = 1; i <= total; i++) {
  const cnt = document.getElementById(`lottie${i}`);
  const anim = lottie.loadAnimation({
    container: cnt,
    renderer: 'svg',
    loop: loopIndexes.includes(i),
    autoplay: false,
    path: `anim/anim${i}/anim${i}.json`
  });

  const itm = {
    anim,
    container: cnt,
    initDone: false,
    finalDone: false,
    stopFrame: stopFramesMap[i] ?? null,
    loopFlag: loopIndexes.includes(i),
    hoverOnly: hoverOnlyIndexes.includes(i),
    enterTh: enterThresholdsMap[i] ?? 0.5,
    exitTh: exitThresholdsMap[i] ?? 0.5
  };

  items.push(itm);

  if (itm.hoverOnly) {
    // навешиваем только события мыши
    cnt.addEventListener('mouseenter', () => {
      itm.anim.setDirection(1);
      itm.anim.play();
    });
    cnt.addEventListener('mouseleave', () => {
      itm.anim.setDirection(-1);
      itm.anim.play();
    });
  } else {
    io.observe(cnt);
  }
}

// === Обработка пересечения ===
function onIntersect(entries) {
  entries.forEach(entry => {
    const idx = +entry.target.id.replace('lottie', '') - 1;
    const itm = items[idx];
    const ratio = entry.intersectionRatio;

    if (itm.hoverOnly) return; // для hover-управляемых анимаций пересечение не обрабатываем

    if (!itm.initDone && ratio >= itm.enterTh) {
      itm.initDone = true;
      itm.anim.play();
      if (!itm.loopFlag && itm.stopFrame != null) {
        const listener = (e) => {
          if (e.currentTime >= itm.stopFrame) {
            itm.anim.removeEventListener('enterFrame', listener);
            itm.anim.pause();
          }
        };
        itm.anim.addEventListener('enterFrame', listener);
      }
    }

    if (itm.initDone && !itm.loopFlag && !itm.finalDone && ratio < itm.exitTh) {
      itm.finalDone = true;
      itm.anim.play();
    }

    if (itm.loopFlag) {
      if (ratio >= itm.enterTh) itm.anim.play();
      else itm.anim.pause();
    }
  });
}

  });