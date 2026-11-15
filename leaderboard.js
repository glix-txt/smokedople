// smokedople leaderboards (backend: leaderboard/worker.js on Cloudflare)
//  · today:     how everyone did on today's 4 daily puzzles ("23% solved it in one!")
//  · unlimited: who has played the most rounds — separate boards for easy and hard
// Loaded BEFORE game.js so it hears the first "sd:done" event.
(() => {
  "use strict";
  const LOCAL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);   // local testing: `npx wrangler dev` in leaderboard/
  const API = LOCAL ? "http://127.0.0.1:8787" : "https://smokedople-leaderboard.smokedople.workers.dev";
  const P = "smokedople:";
  const KINDS = ["cover", "cover-hard", "song", "song-hard"];
  const WORDS = ["one", "two", "three", "four", "five", "six"];
  const $ = (id) => document.getElementById(id);
  const ls = {
    get(k, d) { try { const v = localStorage.getItem(P + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(P + k, JSON.stringify(v)); } catch {} },
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const tierOf = (kind) => (kind.endsWith("-hard") ? "hard" : "easy");

  // private player id — identifies this browser to the leaderboard, never shown to anyone
  let pid = ls.get("pid", null);
  if (!pid || !/^[a-z0-9]{24,64}$/.test(pid)) {
    const a = new Uint8Array(16); crypto.getRandomValues(a);
    pid = [...a].map((b) => b.toString(36).padStart(2, "0")).join("").slice(0, 32).padEnd(24, "0");
    ls.set("pid", pid);
  }

  async function api(path, body) {
    const r = await fetch(API + path, body
      ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
      : undefined);
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || "leaderboard unavailable");
    return j;
  }

  // ---------- daily: send result once, show the crowd line ----------
  const sentKey = (day, kind) => `lb:sent:${kind}:${day}`;
  async function sendDaily(day, kind, won, guesses) {
    if (ls.get(sentKey(day, kind), false)) return null;
    const s = await api("/daily", { pid, day, kind, guesses: won ? guesses : 0 });
    ls.set(sentKey(day, kind), true);
    return s;
  }
  function crowdLine(s, mine) {
    if (!s || !s.total) return "";
    if (s.total === 1) return "you're the first to finish today's puzzle!";
    const pct = (n) => Math.round((n / s.total) * 100);
    const parts = [];
    if (s.counts[0]) parts.push(`${pct(s.counts[0])}% solved it in one!`);
    else parts.push("nobody's got it in one yet");
    if (s.counts[1]) parts.push(`${pct(s.counts[1])}% in two`);
    if (mine && mine > 2 && s.counts[mine - 1]) parts.push(`${pct(s.counts[mine - 1])}% in ${WORDS[mine - 1]} like you`);
    return `${parts.join(" · ")} — ${s.total} players today`;
  }
  let shown = "";   // which round the crowd line belongs to, so a late reply can't land on the wrong round
  async function showCrowd(d, fresh) {
    const el = $("crowd"), id = `${d.kind}:${d.day}`;
    if (!fresh && shown === id) { el.hidden = !el.textContent; return; }   // re-render of the same round
    shown = id; el.hidden = true; el.textContent = ""; el.classList.remove("pop");
    try {
      let s = await sendDaily(d.day, d.kind, d.won, d.guesses);
      if (!s) s = (await todayAll(d.day))[d.kind];
      if (shown !== id) return;
      const line = crowdLine(s, d.won ? d.guesses : 0);
      if (line) { el.textContent = line; el.hidden = false; if (fresh) el.classList.add("pop"); }
    } catch {}
  }
  let todayCache = null;   // {day, t, data}
  async function todayAll(day) {
    if (todayCache && todayCache.day === day && Date.now() - todayCache.t < 30000) return todayCache.data;
    const data = await api(`/daily?day=${day}`);
    todayCache = { day, t: Date.now(), data };
    return data;
  }

  // ---------- unlimited: +1 round ----------
  function sendPlay(kind) {
    api("/play", { pid, tier: tierOf(kind) }).catch(() => {});
  }

  document.addEventListener("sd:finish", (e) => {
    const d = e.detail;
    if (d.play === "daily") { todayCache = null; showCrowd(d, true); }
    else sendPlay(d.kind);
  });
  document.addEventListener("sd:done", (e) => {
    const d = e.detail;
    if (d.play === "daily") showCrowd(d, false);
    else { $("crowd").hidden = true; shown = ""; }
  });

  // dailies finished before the leaderboard existed (or while offline) get sent on the next visit
  window.addEventListener("load", () => {
    const day = window.SD?.day; if (day == null) return;
    for (const k of KINDS) {
      const r = ls.get(`day:${k}:${day}`, null);
      if (r && r.done && !ls.get(sentKey(day, k), false)) sendDaily(day, k, r.won, r.guesses.length).catch(() => {});
    }
  });

  // ---------- name ----------
  const myName = () => ls.get("lb:name", "");
  function askName(why) {
    $("nameWhy").textContent = why || "so you show up on the unlimited leaderboards. no password, no email.";
    $("nameInput").value = myName();
    $("nameErr").hidden = true;
    $("nameDlg").showModal();
    setTimeout(() => $("nameInput").focus(), 50);
  }
  $("nameForm").onsubmit = async (e) => {
    e.preventDefault();
    const name = $("nameInput").value.trim();
    const btn = $("nameSave"); btn.disabled = true;
    try {
      const r = await api("/name", { pid, name });
      ls.set("lb:name", r.name); ls.set("lb:askedName", true);
      $("nameDlg").close();
      if ($("lbDlg").open) renderLb();
    } catch (err) {
      $("nameErr").textContent = err.message; $("nameErr").hidden = false;
    } finally { btn.disabled = false; }
  };
  $("nameSkip").onclick = () => $("nameDlg").close();
  $("nameDlg").addEventListener("close", () => ls.set("lb:askedName", true));
  // ask once when you arrive (after the how-to-play box for brand new players)
  function maybeAsk() {
    if (myName() || ls.get("lb:askedName", false)) return;
    const help = $("helpDlg");
    if (help.open) help.addEventListener("close", () => setTimeout(maybeAsk, 200), { once: true });
    else askName("pick a name for the smokedople leaderboards — or skip, you can add one later from the 🏆 button.");
  }
  window.addEventListener("load", () => setTimeout(maybeAsk, 400));

  // ---------- leaderboard dialog ----------
  let view = "today";
  function setSeg() { [...$("lbSeg").children].forEach((b) => b.classList.toggle("on", b.dataset.view === view)); }
  async function renderLb() {
    setSeg();
    const box = $("lbBody");
    const name = myName();
    $("lbName").innerHTML = name ? `playing as <b>${esc(name)}</b>` : "no name yet";
    $("lbNameBtn").textContent = name ? "change name" : "add name";
    box.innerHTML = `<p class="lb-dim">loading…</p>`;
    const v = view;
    try {
      if (v === "today") {
        const day = window.SD.day, data = await todayAll(day);
        if (v !== view) return;
        box.innerHTML = `<p class="lb-dim">how everyone did on daily #${day + 1}</p>` + KINDS.map((k) => {
          const s = data[k], t = s.total;
          const mine = ls.get(`day:${k}:${day}`, null);
          const myRow = mine && mine.done ? (mine.won ? mine.guesses.length - 1 : 6) : -1;
          const pct = (n) => (t ? Math.round((n / t) * 100) : 0);
          const rows = [...s.counts, s.lost].map((n, i) =>
            `<div>${i < 6 ? i + 1 : "X"}<i class="${i === myRow ? "hl" : ""}" style="width:${Math.max(10, pct(n))}%">${pct(n)}%</i></div>`).join("");
          const head = t ? (s.counts[0] ? `${pct(s.counts[0])}% solved it in one!` : "nobody in one yet") : "nobody's finished it yet";
          return `<section class="lb-day${k === window.SD.kind ? " cur" : ""}"><h3>${window.SD.label(k)} <small>${t} player${t === 1 ? "" : "s"}</small></h3>
            <p class="lb-head">${head}</p>${t ? `<div class="dist">${rows}</div>` : ""}</section>`;
        }).join("");
      } else {
        const { top, me } = await api(`/top?tier=${v}&pid=${pid}`);
        if (v !== view) return;
        const rows = top.map((r, i) => `<li class="${me && me.name && r.name === me.name ? "me" : ""}"><span>${i + 1}</span><b>${esc(r.name)}</b><em>${r.count}</em></li>`).join("");
        let foot = "";
        if (!me || !me.count) foot = `finish an unlimited ${v} round to get on the board`;
        else if (!me.name) foot = `you've played ${me.count} — add a name to show up`;
        else foot = `you: #${me.rank} · ${me.count} round${me.count === 1 ? "" : "s"}`;
        box.innerHTML = `<p class="lb-dim">most unlimited ${v} rounds played (cover + song)</p>` +
          (rows ? `<ol class="lb-list">${rows}</ol>` : `<p class="lb-dim">no one yet — be first</p>`) + `<p class="lb-me">${foot}</p>`;
      }
    } catch {
      if (v === view) box.innerHTML = `<p class="lb-dim">leaderboard unavailable right now — try again in a bit</p>`;
    }
  }
  $("lbBtn").onclick = () => {
    view = "today"; todayCache = null; renderLb(); $("lbDlg").showModal();
  };
  $("lbSeg").onclick = (e) => { const v = e.target.dataset.view; if (v && v !== view) { view = v; renderLb(); } };
  $("lbNameBtn").onclick = () => askName();
})();
