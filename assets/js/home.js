/* Pawlette Official Site — HOME：ウィジェット紹介（カルーセル風）
   外部通信・Cookie・アクセス解析は使用していません。 */
(function () {
  "use strict";

  /* 機能紹介：上下に流れる表示の一時停止ボタン */
  var flow = document.querySelector("[data-flow]");
  var flowBtn = flow && flow.querySelector("[data-flow-toggle]");
  if (flow && flowBtn) {
    flowBtn.addEventListener("click", function () {
      var paused = flow.classList.toggle("is-paused");
      flowBtn.setAttribute("aria-pressed", paused ? "true" : "false");
      flowBtn.textContent = paused ? "動きを再開する" : "動きを止める";
    });
  }
})();

(function () {
  "use strict";
  var root = document.querySelector("[data-showcase]");
  if (!root) return;

  var slides = root.querySelectorAll(".h-show-slide");
  var thumbs = {
    prev: root.querySelector(".h-show-thumb--prev img"),
    cur: root.querySelector(".h-show-thumb--cur img"),
    next: root.querySelector(".h-show-thumb--next img")
  };
  var status = root.querySelector(".h-show-status");
  var prevBtn = root.querySelector("[data-showcase-prev]");
  var nextBtn = root.querySelector("[data-showcase-next]");
  var n = slides.length;
  var current = 0;
  if (!n) return;

  function setThumb(img, slide) {
    if (!img || !slide) return;
    img.src = slide.getAttribute("data-img");
    img.width = +slide.getAttribute("data-w");
    img.height = +slide.getAttribute("data-h");
  }

  function show(index, announce) {
    current = ((index % n) + n) % n;
    Array.prototype.forEach.call(slides, function (s, i) {
      if (i === current) s.removeAttribute("hidden");
      else s.setAttribute("hidden", "");
    });
    setThumb(thumbs.prev, slides[(current - 1 + n) % n]);
    setThumb(thumbs.cur, slides[current]);
    setThumb(thumbs.next, slides[(current + 1) % n]);
    if (status && announce) status.textContent = slides[current].getAttribute("aria-label");
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { show(current - 1, true); });
  if (nextBtn) nextBtn.addEventListener("click", function () { show(current + 1, true); });

  root.addEventListener("keydown", function (e) {
    if (e.target === prevBtn || e.target === nextBtn) {
      if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1, true); prevBtn.focus(); }
      if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1, true); nextBtn.focus(); }
    }
  });

  show(0, false);
})();
