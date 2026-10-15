(function () {
  // Mobile menu
  var btn = document.querySelector(".menu"), nav = document.getElementById("nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      btn.setAttribute("aria-expanded", nav.classList.toggle("open"));
    });
  }

  // Journey slideshow (only runs where it exists)
  var slides = document.querySelectorAll(".slides img");
  if (!slides.length) return;
  var dots = document.querySelectorAll(".dots button"), box = document.querySelector(".slides-wrap"), i = 0, timer;

  function show(n) {
    slides[i].classList.remove("on"); dots[i].removeAttribute("aria-current");
    i = (n + slides.length) % slides.length;
    slides[i].classList.add("on"); dots[i].setAttribute("aria-current", "true");
  }
  function stop() { clearInterval(timer); }
  function start() {
    stop();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer = setInterval(function () { show(i + 1); }, 4000);
  }
  dots.forEach(function (d, n) { d.addEventListener("click", function () { show(n); start(); }); });
  box.addEventListener("mouseenter", stop); box.addEventListener("mouseleave", start);
  box.addEventListener("focusin", stop); box.addEventListener("focusout", start);
  start();
})();