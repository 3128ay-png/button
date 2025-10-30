
document.addEventListener("DOMContentLoaded", () => {

  // =============================
  // 横スクロール処理
  // =============================
  const container = document.querySelector(".btn-scroll-contents");
  const list = container ? container.querySelector(".scroll-btn") : null;
  const btnLeft = document.getElementById("scroll-left");
  const btnRight = document.getElementById("scroll-right");

  if (container && list && btnLeft && btnRight) {
    let scrollSpeed = 0.5;
    let isAuto = true;

    // 両端でループさせるため複製
    const clone1 = list.cloneNode(true);
    const clone2 = list.cloneNode(true);
    list.parentElement.appendChild(clone1);
    list.parentElement.appendChild(clone2);

    const totalWidth = list.scrollWidth;

    function loopScroll() {
      if (isAuto) {
        container.scrollLeft += scrollSpeed;
        if (scrollSpeed > 0 && container.scrollLeft >= totalWidth) {
          container.scrollLeft -= totalWidth;
        } else if (scrollSpeed < 0 && container.scrollLeft <= 0) {
          container.scrollLeft += totalWidth;
        }
      }
      requestAnimationFrame(loopScroll);
    }
    requestAnimationFrame(loopScroll);

    btnLeft.addEventListener("click", () => {
      isAuto = false;
      scrollSpeed = -Math.abs(scrollSpeed);
      container.scrollBy({ left: -300, behavior: "smooth" });
      restartAuto();
    });

    btnRight.addEventListener("click", () => {
      isAuto = false;
      scrollSpeed = Math.abs(scrollSpeed);
      container.scrollBy({ left: 300, behavior: "smooth" });
      restartAuto();
    });

    container.addEventListener("mouseenter", () => (isAuto = false));
    container.addEventListener("mouseleave", () => restartAuto());
    container.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        isAuto = false;
        container.scrollLeft += e.deltaY;
        restartAuto();
      },
      { passive: false }
    );

    let restartTimer;
    function restartAuto() {
      clearTimeout(restartTimer);
      restartTimer = setTimeout(() => {
        isAuto = true;
      }, 3000);
    }
  }

  // =============================
  // 🔍 検索フォーム（1本化）
  // =============================
  const searchInput = document.getElementById("search-text");
  const searchBtn = document.getElementById("searchBtn");
  const hitNumBox = document.querySelector(".search-result__hit-num");
  const resultList = document.getElementById("search-result__list");

  function normalize(str) {
    return (str || "").normalize("NFKC").trim().toLowerCase();
  }

  function renderNoData(msg = "NO DATA") {
    resultList.innerHTML = "";
    const span = document.createElement("span");
    span.textContent = msg;
    resultList.appendChild(span);
    hitNumBox.textContent = "";
  }

  function doSearch() {
    const q = normalize(searchInput.value);
    resultList.innerHTML = "";
    hitNumBox.textContent = "";

    if (!q) {
      renderNoData("キーワードを入力してください");
      return;
    }

    let hit = 0;
    document.querySelectorAll(".targeItem").forEach((item) => {
      const text = normalize(item.textContent || "");
      if (text.includes(q)) {
        const clone = item.cloneNode(true);
        clone.style.display = "block";
        resultList.appendChild(clone);
        hit++;
      }
    });

    if (hit === 0) {
      renderNoData();
    } else {
      hitNumBox.textContent = `該当 ${hit} 件`;
    }
  }

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", doSearch);
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        doSearch();
      }
    });
  }

  // =============================
  // モーダル（イベント委譲）
  // =============================
  document.addEventListener("click", (e) => {
    // 開く
    if (e.target.classList.contains("code-link")) {
      e.preventDefault();
      const item = e.target.closest(".btn-item, .btn-item-gradation, .btn-item-adv");
      const modal = item && item.querySelector(".sub_window");
      if (modal) modal.classList.add("show");
    }

    // 閉じる（×ボタン）
    if (e.target.classList.contains("close_sub_window")) {
      const modal = e.target.closest(".sub_window");
      if (modal) modal.classList.remove("show");
    }

    // 背景クリックで閉じる
    if (e.target.classList.contains("sub_window")) {
      e.target.classList.remove("show");
    }

    // ダークモード切替
    if (e.target.classList.contains("dark-button")) {
      const modalContent = e.target.closest(".sub_window_content");
      modalContent.classList.toggle("dark-theme");
      e.target.textContent = modalContent.classList.contains("dark-theme")
        ? "ライトモード"
        : "ダークモード";
    }
  });

// =============================
// ボタンの動作（イベント委譲で1本化）
// =============================
// (18) の色循環用の変数は外に出す
let colorIndex = 0;
const colors = ['#0bd','#f66','#0c6','#f83'];

document.addEventListener("click", (e) => {
  // (02) クリックで背景色
  const clickBtn = e.target.closest(".btn-click");
  if (clickBtn) {
    clickBtn.style.backgroundColor = "#05b";
    setTimeout(() => {
      clickBtn.style.backgroundColor = "#07f";
    }, 400);
    return; // 以降の判定はスキップ
  }

  // (03) ランダム色
  const randomBtn = e.target.closest(".btn-random");
  if (randomBtn) {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    randomBtn.style.backgroundColor = randomColor;
    return;
  }

  // (07) 押し込みトグル
  const likeBtn = e.target.closest(".like-button-js");
  if (likeBtn) {
    likeBtn.classList.toggle("liked");
    likeBtn.innerHTML = likeBtn.classList.contains("liked")
      ? "押された！"
      : "押し込まれた状態に<br>する";
    return;
  }

  // (08) 押し込みテキスト変更
  const pushBtn = e.target.closest(".btn-push");
  if (pushBtn) {
    const liked = pushBtn.classList.toggle("push-liked");
    pushBtn.innerHTML = liked ? "押したよ！" : "押し込み前の<br>状態";
    return;
  }

  // (10) ぐるっと囲む（どの構造でもOKにする）
const advTarget = e.target.closest(".btn-inner-adv, .btn-svg-adv, .btn-rect-adv, .btn-container-adv");
if (advTarget) {
  // 横スクロール/本体どちらでも「囲い」のルートを取得
  const wrap = advTarget.closest(".btn-item-adv, .btn-container-adv");
  const rectAdv = wrap && wrap.querySelector(".btn-rect-adv");
  if (rectAdv) {
    rectAdv.classList.remove("active");
    // reflow後に付け直してアニメ再生
    setTimeout(() => rectAdv.classList.add("active"), 10);
  }
  return;
}
//(11)矢印の形とテキストを切り替える
const btnChange = e.target.closest(".btn-change");
if (btnChange) {
  const isDone = btnChange.classList.toggle("done");
  btnChange.innerHTML = isDone ? "完了！" : "矢印が<br>変わる";
return;
}

  //(16)ぐるぐると回るボタン
  const circleBtn = e.target.closest('.btn-circle');
if (circleBtn) {
  circleBtn.classList.toggle('fast-spin');
  setTimeout(() => {
    circleBtn.classList.remove('fast-spin');
  }, 400);
  return;
}

//(18)色を変えながら跳ねるボタン
const colorbtn = e.target.closest('.btn-click-bounce');
  if (colorbtn) {
    colorbtn.style.transition = 'transform 0.2s ease, background-color 0.2s ease';
    colorbtn.style.translate = '0 -10px';
    colorbtn.style.backgroundColor = colors[colorIndex];
    setTimeout(() => colorbtn.style.translate = '0', 200);
    colorIndex = (colorIndex + 1) % colors.length;
    return;
  }

  //(20)クリックで波紋が出る
  const rippleBtn = e.target.closest('.btn-click-ripple');
if (rippleBtn) {
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');

  const rect = rippleBtn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);

  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

  // ✅ 波紋をボタン内に追加
  rippleBtn.appendChild(ripple);

  // ✅ アニメーション後に削除（メモリリーク防止）
  setTimeout(() => ripple.remove(), 600);

  return;
}
});

// (05) カーソル位置で色変化
document.addEventListener("pointermove", (e) => {
  const btn = e.target.closest(".btn-flow-change");
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  btn.style.backgroundPosition = `${x}% 0`;
});

document.addEventListener("pointerout", (e) => {
  const btn = e.target.closest(".btn-flow-change");
  // ボタンの外に出たときだけリセット
  if (btn && !btn.contains(e.relatedTarget)) {
    btn.style.backgroundPosition = "0% 0";
  }



});

// (14) キラキラと輝くボタン
document.addEventListener("DOMContentLoaded", () => {
  const sparkleButtons = document.querySelectorAll(".btn-sparkle");

  sparkleButtons.forEach(button => {
    // キラキラを定期的に追加
    setInterval(() => {
      const sparkle = document.createElement("span");
      sparkle.classList.add("sparkle");

      // ランダム位置に出現
      const x = Math.random() * button.offsetWidth;
      const y = Math.random() * button.offsetHeight;
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;

      // ボタン内に追加
      button.appendChild(sparkle);

      // 一定時間後に削除
      setTimeout(() => sparkle.remove(), 2000);
    }, 300); // sparkle 出現間隔（0.3秒ごと）
  });
});
// =============================
// ✨ キラキラボタン（btn-sparkle）常時アニメーション
// =============================
const sparkleButtons = document.querySelectorAll(".btn-sparkle");

sparkleButtons.forEach((btn) => {
  const sparkleCount = 12; // きらめく数

  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement("span");
    sparkle.classList.add("sparkle");

    // ランダムな位置と時間
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.animationDelay = `${Math.random() * 2}s`;
    sparkle.style.animationDuration = `${1.5 + Math.random()}s`;

    btn.appendChild(sparkle);
  }
});


});