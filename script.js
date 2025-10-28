document.addEventListener("DOMContentLoaded", () => {
  const glassyCircle = document.querySelector(".glassy-circle");
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  // ✅ 마우스 따라다니는 블러 원
  window.addEventListener("mousemove", (e) => {
    glassyCircle.style.transform = `translate(${e.clientX - 100}px, ${e.clientY - 100}px)`;
  });

  // ✅ 캔버스 기본 설정
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // ✅ 마우스 따라다니는 네온 초록색 트레일 효과
  let mouseMoved = false;
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const params = {
    pointsNumber: 50,
    widthFactor: 20,
    spring: 0.2,
    friction: 0.5,
  };
  const trail = new Array(params.pointsNumber).fill().map(() => ({
    x: pointer.x,
    y: pointer.y,
    dx: 0,
    dy: 0,
  }));

  window.addEventListener("mousemove", (e) => {
    mouseMoved = true;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });

  function update(t) {
    if (!mouseMoved) {
      pointer.x =
        (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) * window.innerWidth;
      pointer.y =
        (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.sin(0.01 * t)) * window.innerHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    trail.forEach((p, i) => {
      const prev = i === 0 ? pointer : trail[i - 1];
      const spring = i === 0 ? 0.4 * params.spring : params.spring;
      p.dx += (prev.x - p.x) * spring;
      p.dy += (prev.y - p.y) * spring;
      p.dx *= params.friction;
      p.dy *= params.friction;
      p.x += p.dx;
      p.y += p.dy;
    });

    // ✅ 초록색 네온 효과 (빛 번짐)
    ctx.shadowColor = "#00ff66";
    ctx.shadowBlur = 60;
    ctx.strokeStyle = "#00ff66";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);

    for (let i = 1; i < trail.length - 1; i++) {
      const xc = 0.5 * (trail[i].x + trail[i + 1].x);
      const yc = 0.5 * (trail[i].y + trail[i + 1].y);
      ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
      ctx.lineWidth = params.widthFactor * (params.pointsNumber - i) * 0.02;
      ctx.stroke();
    }

    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
    ctx.stroke();

    requestAnimationFrame(update);
  }

  update(0);
});

document.addEventListener("DOMContentLoaded", () => {
  const section2 = document.querySelector(".section2");
  const circle = document.querySelector(".circle");
  const textStep1 = document.querySelector(".text-step-1");
  const textStep2 = document.querySelector(".text-step-2");
  const highlightH1 = document.querySelector(".highlight-word.h1");
  const highlightH2 = document.querySelector(".highlight-word.h2");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const sectionTop = section2.offsetTop;
    const sectionHeight = section2.offsetHeight;
    let progress = (scrollTop - sectionTop) / sectionHeight;
    progress = Math.max(0, Math.min(progress, 1));

    // 1️⃣ 2섹션 진입 시 Step1 보이기
    if (progress > 0 && progress < 0.2) {
      textStep1.style.opacity = 1;
      circle.style.opacity = 1;
      textStep2.style.opacity = 0;
    }

    // 2️⃣ 원 확대 + Step1 사라짐
    if (progress >= 0.2 && progress < 0.45) {
      textStep1.style.opacity = 0;
      circle.style.opacity = 1;
      const initialSize = 90;
      const screenDiagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
      const maxScale = screenDiagonal / initialSize;
      const scale = 1 + (progress - 0.2) / 0.25 * (maxScale - 1);
      circle.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    // 3️⃣ 배경 전환
    if (progress < 0.45) {
      section2.style.background = "#fff";
    } else if (progress >= 0.45 && progress < 0.6) {
      section2.style.background = "#00ff66";
    } else {
      section2.style.background = "#000";
    }

    // 4️⃣ 검정 배경에서 Step2 등장
    if (progress >= 0.6 && progress < 0.8) {
      textStep2.style.opacity = 1;
      highlightH1.style.color = "#fff";
      highlightH2.style.color = "#fff";
      circle.style.opacity = 0;
    } else if (progress < 0.6) {
      textStep2.style.opacity = 0;
    }

    // 5️⃣ 마지막 포인트 단어 강조
    if (progress >= 0.8) {
      highlightH1.style.color = "#00ff66";
      highlightH2.style.color = "#00ff66";
    }
  });
});



