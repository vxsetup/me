const bio = document.querySelector(".bio");

const text = 
`devops engineer
infrastructure · ci/cd · containers

stack: k8s · docker · terraform
based in krasnoyarsk · busy by work`;

bio.textContent = "";

let i = 0;
const speed = 25;

function type() {
  if (i < text.length) {
    bio.textContent += text[i];
    i++;
    setTimeout(type, speed);
  }
}

setTimeout(type, 400);
