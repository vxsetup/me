const bio = document.querySelector(".bio");

const lines = [
  "devops engineer",
  "infrastructure · ci/cd · containers",
  "",
  "stack: k8s · docker · terraform",
  "based in krasnoyarsk · busy by work",
];

const text = lines.join("\n");
bio.textContent = "";

let i = 0;
const speed = 28;

function type() {
  if (i < text.length) {
    bio.textContent += text[i];
    i++;
    setTimeout(type, speed);
  }
}

setTimeout(type, 400);
