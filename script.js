AOS.init();

$(document).ready(function () {
  const $glassyCircle = $(".glassy-circle");
  const $canvas = $("canvas");
  const ctx = $canvas[0].getContext("2d");

  // ✅ 마우스 따라다니는 블러 원
  $(window).on("mousemove", function (e) {
    $glassyCircle.css(
      "transform",
      `translate(${e.clientX - 100}px, ${e.clientY - 100}px)`
    );
  });

  // ✅ 캔버스 기본 설정
  function resizeCanvas() {
    $canvas[0].width = window.innerWidth;
    $canvas[0].height = window.innerHeight;
  }
  resizeCanvas();
  $(window).on("resize", resizeCanvas);

  // ✅ 마우스 따라다니는 네온 초록색 트레일 효과
  let mouseMoved = false;
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const params = {
    pointsNumber: 15,
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

  $(window).on("mousemove", function (e) {
    mouseMoved = true;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });

  function update(t) {
    if (!mouseMoved) {
      pointer.x =
        (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) *
        window.innerWidth;
      pointer.y =
        (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.sin(0.01 * t)) *
        window.innerHeight;
    }

    ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height);

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
    ctx.shadowBlur = 30;
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

  // ✅ 섹션 애니메이션 관련
  const $section2 = $(".section2");
  const $section3 = $(".section3");
  const $circle = $(".circle");
  const $textStep1 = $(".text-step-1");
  const $textStep2Hw = $(".highlight-word");

  $(window).on("scroll", function () {
    const scrollTop = $(window).scrollTop();
    const sectionTop = $section2.offset().top;
    const sectionHeight = $section2.outerHeight();
    let progress = (scrollTop - sectionTop) / sectionHeight;
    progress = Math.max(0, Math.min(progress, 1));

    const sectionTop3 = $section3.offset().top;
    const sectionHeight3 = $section3.outerHeight();
    let progress3 = (scrollTop - sectionTop3) / sectionHeight3;
    progress3 = Math.max(0, Math.min(progress3, 1));

    // ✅ 화면의 절반 정도 스크롤 시 색상 변경
    // if (progress3 >= 0.15) {
    //   $textStep2Hw.css("color", "#00ff66");
    // } else {
    //   $textStep2Hw.css("color", "#fff");
    // }

    // 1️⃣ 2섹션 진입 시 Step1 보이기
    if (progress > 0 && progress < 0.2) {
      $textStep1.css("opacity", 1);
      $circle.css("opacity", 1);
    } else if (progress < 0.2) {
      $textStep1.css("opacity", 0);
      $circle.css("opacity", 0);
    }

    // 2️⃣ 원 확대 + Step1 사라짐
    if (progress >= 0.2 && progress < 0.45) {
      $textStep1.css("opacity", 0);
      $circle.css("opacity", 1);
      const initialSize = 90;
      const screenDiagonal = Math.sqrt(
        window.innerWidth ** 2 + window.innerHeight ** 2
      );
      const maxScale = screenDiagonal / initialSize;
      const scale = 1 + ((progress - 0.2) / 0.25) * (maxScale - 1);
      $circle.css("transform", `translate(-50%, -50%) scale(${scale})`);
    }

    // 3️⃣ 배경 전환
    if (progress < 0.45) {
      $section2.css("background", "#fff");
    } else if (progress >= 0.45 && progress < 0.5) {
      $section2.css("background", "#00ff66");
    } else {
      $section2.css("background", "#000");
    }

    // 4️⃣ 검정 배경에서 Step2 등장
    if (progress >= 0.5 && progress < 0.6) {
      $circle.css("opacity", 0);
    }
  });
});
