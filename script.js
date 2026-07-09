document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("output");
  const input = document.getElementById("input");
  const terminal = document.getElementById("terminal");

  if (!input) {
    console.error("input not found!");
    return;
  }

  const history = [];
  let historyIndex = -1;

  const commands = {
    help: () => `
<div class="line accent">available commands:</div>
<div class="cmd-list">
  <span class="cmd">about</span>     <span>who am i</span>
  <span class="cmd">whoami</span>    <span>short info</span>
  <span class="cmd">stack</span>     <span>tech i use</span>
  <span class="cmd">projects</span>  <span>my work</span>
  <span class="cmd">contact</span>   <span>get in touch</span>
  <span class="cmd">now</span>       <span>what i'm doing</span>
  <span class="cmd">uses</span>      <span>my setup</span>
  <span class="cmd">date</span>      <span>current time</span>
  <span class="cmd">echo</span>      <span>print text</span>
  <span class="cmd">banner</span>    <span>show ascii logo</span>
  <span class="cmd">clear</span>     <span>clear screen</span>
</div>
<div class="line muted">tip: ↑ ↓ history · tab autocomplete · ctrl+l clear</div>`,

    about: () => `
<div class="line">daniil vasilenko · aka <span style="color:var(--accent)">vxsetup</span> / vxs / dvnk</div>
<div class="line">devops engineer · based in krasnoyarsk</div>
<div class="line muted">infrastructure, automation and everything that runs 24/7.</div>`,

    whoami: () => `<div class="line">vxsetup</div>`,

    stack: () => `
<div class="line accent">infrastructure & devops</div>
<div class="line">docker · docker-compose · kubernetes · terraform · ansible</div>
<div class="line">nginx · apache · samba · traefik</div>
<div class="line">prometheus · grafana · loki · elk</div>
<div class="line">gitlab ci · github actions · jenkins</div>
<br>
<div class="line accent">languages</div>
<div class="line">python (aiogram) · javascript · bash · go (learning)</div>
<br>
<div class="line accent">network & sysadmin</div>
<div class="line">domains (windows/linux) · dhcp · openvpn · wireguard</div>
<br>
<div class="line accent">tools</div>
<div class="line">git · linux · vim · tmux</div>`,

    projects: () => `
<div class="line">
  <a href="https://github.com/vxsetup/nothing-os-desktop" target="_blank">nothing-os-desktop</a>
  — nothing os inspired desktop
</div>
<div class="line">
  <a href="https://github.com/vxsetup/typeflow" target="_blank">typeflow</a>
  — типизированный флоу
</div>
<div class="line">
  <a href="https://github.com/vxsetup/vxsetup.github.io" target="_blank">vxsetup.github.io</a>
  — this site
</div>`,

    contact: () => `
<div class="line">telegram · <a href="https://t.me/thirdtimeusername" target="_blank">@thirdtimeusername</a></div>
<div class="line">github   · <a href="https://github.com/vxsetup" target="_blank">@vxsetup</a></div>`,

    now: () => `
<div class="line">📍 krasnoyarsk, russia</div>
<div class="line">💼 busy by work</div>
<div class="line">🔧 automating home lab</div>`,

    uses: () => `
<div class="line accent">setup</div>
<div class="line">os      · linux</div>
<div class="line">editor  · vim / vscode</div>
<div class="line">shell   · zsh + tmux</div>
<div class="line">font    · jetbrains mono</div>`,

    date: () => `<div class="line">${new Date().toString()}</div>`,

    echo: (args) => `<div class="line">${escapeHtml(args.join(" "))}</div>`,

    banner: () => `<pre class="ascii">
██╗   ██╗██╗  ██╗███████╗
██║   ██║╚██╗██╔╝██╔════╝
██║   ██║ ╚███╔╝ ███████╗
╚██╗ ██╔╝ ██╔██╗ ╚════██║
 ╚████╔╝ ██╔╝ ██╗███████║
  ╚═══╝  ╚═╝  ╚═╝╚══════╝
</pre>`,

    clear: () => {
      output.innerHTML = "";
      return null;
    },

    ls: () => `<div class="line">about  stack  projects  contact  now  uses</div>`,
    sudo: () => `<div class="line error">visitor is not in the sudoers file.</div>`,
    rm: () => `<div class="line error">nice try 😏</div>`,
  };

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function printLine(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    output.appendChild(div);
  }

  function printPrompt(cmd) {
    printLine(`<div class="line command"><span style="color:var(--green)">visitor@vxsetup:~$</span> ${escapeHtml(cmd)}</div>`);
  }

  function scrollBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  function execute(raw) {
    const trimmed = raw.trim();
    if (!trimmed) {
      printPrompt("");
      return;
    }

    history.unshift(trimmed);
    historyIndex = -1;

    const [cmd, ...args] = trimmed.split(/\s+/);
    printPrompt(trimmed);

    const fn = commands[cmd.toLowerCase()];
    if (fn) {
      const result = fn(args);
      if (result !== null) printLine(result);
    } else {
      printLine(`<div class="line error">command not found: ${escapeHtml(cmd)}</div>`);
      printLine(`<div class="line muted">type 'help' for available commands</div>`);
    }

    scrollBottom();
  }

  function autocomplete(value) {
    const matches = Object.keys(commands).filter(c => c.startsWith(value));
    if (matches.length === 1) {
      input.value = matches[0];
    } else if (matches.length > 1) {
      printPrompt(value);
      printLine(`<div class="line muted">${matches.join("  ")}</div>`);
      scrollBottom();
    }
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      execute(input.value);
      input.value = "";
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      }
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      } else {
        historyIndex = -1;
        input.value = "";
      }
    }
    if (e.key === "Tab") {
      e.preventDefault();
      autocomplete(input.value.trim());
    }
    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      commands.clear();
    }
  });

  // клик где угодно → фокус на input
  document.addEventListener("click", (e) => {
    // не сбивать выделение ссылок
    if (e.target.tagName === "A") return;
    input.focus();
  });

  // === boot (синхронный, без async — надёжнее) ===
  printLine(`<div class="line muted">booting vxsetup terminal v1.0.0...</div>`);
  printLine(`<div class="line success">loading modules... [ok]</div>`);
  printLine(`<div class="line success">session started</div>`);
  printLine("<br>");
  printLine(commands.banner());
  printLine(commands.about());
  printLine(`<div class="line muted">type <span style="color:var(--yellow)">'help'</span> for available commands</div>`);
  printLine("<br>");

  scrollBottom();
  input.focus();
});
