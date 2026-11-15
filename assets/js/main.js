/* Pawlette Official Site — 共通スクリプト
   外部通信・Cookie・アクセス解析は使用していません。 */
(function () {
  "use strict";

  /* ---------- スマートフォン用メニュー ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("global-nav");

  if (toggle && nav) {
    var closeMenu = function (returnFocus) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.querySelector(".nav-toggle-label").textContent = "MENU";
      nav.classList.remove("is-open");
      if (returnFocus) toggle.focus();
    };

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      if (open) {
        closeMenu(false);
      } else {
        toggle.setAttribute("aria-expanded", "true");
        toggle.querySelector(".nav-toggle-label").textContent = "CLOSE";
        nav.classList.add("is-open");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeMenu(true);
      }
    });

    document.addEventListener("click", function (e) {
      if (
        toggle.getAttribute("aria-expanded") === "true" &&
        !nav.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        closeMenu(false);
      }
    });

    var mq = window.matchMedia("(min-width: 861px)");
    var onChange = function () { if (mq.matches) closeMenu(false); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------- ウィジェット紹介カルーセル ---------- */
  var carousels = document.querySelectorAll("[data-carousel]");
  Array.prototype.forEach.call(carousels, function (root) {
    var track = root.querySelector(".carousel-track");
    var slides = root.querySelectorAll(".carousel-slide");
    var prev = root.querySelector("[data-carousel-prev]");
    var next = root.querySelector("[data-carousel-next]");
    var status = root.querySelector(".carousel-status");
    var dots = root.querySelectorAll(".carousel-dots button");
    if (!track || !slides.length) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var current = 0;

    var update = function (index) {
      current = index;
      if (status) status.textContent = (index + 1) + " / " + slides.length;
      Array.prototype.forEach.call(slides, function (s, i) {
        s.setAttribute("aria-hidden", i === index ? "false" : "true");
        // 画面外のスライド内リンクにフォーカスが移らないようにする
        Array.prototype.forEach.call(s.querySelectorAll("a, button"), function (el) {
          if (i === index) el.removeAttribute("tabindex");
          else el.setAttribute("tabindex", "-1");
        });
      });
      Array.prototype.forEach.call(dots, function (d, i) {
        if (i === index) d.setAttribute("aria-current", "true");
        else d.removeAttribute("aria-current");
      });
    };

    var goTo = function (index) {
      var n = slides.length;
      var i = ((index % n) + n) % n;
      track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: reduce ? "auto" : "smooth" });
      update(i);
    };

    if (prev) prev.addEventListener("click", function () { goTo(current - 1); });
    if (next) next.addEventListener("click", function () { goTo(current + 1); });
    Array.prototype.forEach.call(dots, function (d, i) {
      d.addEventListener("click", function () { goTo(i); });
    });

    // スワイプ・スクロールで移動した場合も表示を同期
    var timer;
    track.addEventListener("scroll", function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var i = Math.round(track.scrollLeft / track.clientWidth);
        if (i !== current && i >= 0 && i < slides.length) update(i);
      }, 80);
    }, { passive: true });

    root.addEventListener("keydown", function (e) {
      if (e.target.closest && e.target.closest(".carousel-dots, .carousel-controls")) {
        if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
        if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
      }
    });

    update(0);
  });
})();
