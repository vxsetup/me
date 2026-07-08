const dots = document.querySelectorAll(".glyph span");

function pulse() {
  const active = Math.floor(Math.random() * dots.length);
  dots.forEach((d, i) => {
    d.style.opacity = i === active ? "1" : "0.2";
    d.style.background =
      i === active ? "var(--accent)" : "var(--fg)";
  });
}

setInterval(pulse, 1800);

pulse();
