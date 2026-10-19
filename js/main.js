/* ---------- Config ---------- */
// Mailing list: each signup is emailed to the address in this URL via FormSubmit (formsubmit.co).
// After activating, you can swap the address for the random alias FormSubmit emails you, to keep your address out of the page source.
// Set to "" to only save signups in the visitor's own browser (testing).
const MAILING_LIST_ENDPOINT = "https://formsubmit.co/ajax/17efce8fade08764289975df4046c576";

// Roster: edit freely. A card with no `img` shows a silhouette. To reveal a fighter, replace its entry, e.g. the first one with:
//   { name: "Ripple", img: "assets/img/ripple.jpg", bio: "A shark-girl from the tide-torn coast, Ripple fights with the fury of the open sea. Fast, relentless and never far from the water's edge, she bends waves into weapons — and she's here to win." }
const ROSTER = Array.from({ length: 8 }, () => ({ name: "???", img: null, bio: "Coming soon" }));

const SILHOUETTE = `<svg viewBox="0 0 100 133" aria-hidden="true"><ellipse cx="50" cy="24" rx="10" ry="12"/><path d="M38 38h24l10 6 12 24-8 4-8-14-2 18 4 14-6 18 4 12h-12l-4-22-4 22H36l4-12-6-18 4-14-2-18-8 14-8-4 12-24z"/></svg>`;

/* ---------- Roster cards ---------- */
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const cards = document.getElementById("cards");
ROSTER.forEach((c, i) => {
  const last = i === ROSTER.length - 1;
  const el = document.createElement("article");
  el.className = "card" + (c.img ? "" : " soon") + (last ? " center" : i % 2 ? " flip" : "");
  const pic = c.img
    ? `<div class="pic"><img src="${esc(c.img)}" alt="${esc(c.name)}" loading="lazy"></div>`
    : `<div class="pic sil" role="img" aria-label="Unrevealed fighter">${SILHOUETTE}</div>`;
  el.innerHTML = `${pic}<div class="bio"><h3>${esc(c.name)}</h3><p>${esc(c.bio)}</p></div>`;
  cards.appendChild(el);
});

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.2 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ---------- Welcome pop-up ---------- */
const KEY = "row_welcome_seen";
const modal = document.getElementById("modal");
const form = document.getElementById("signup");
const msg = document.getElementById("msg");
const seen = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const remember = (v) => { try { localStorage.setItem(KEY, v); } catch {} };

function openModal() { modal.hidden = false; requestAnimationFrame(() => modal.classList.add("show")); form.name.focus(); }
function closeModal() { modal.classList.remove("show"); setTimeout(() => (modal.hidden = true), 600); }

if (!seen()) setTimeout(openModal, 1800);

document.getElementById("decline").addEventListener("click", () => { remember("declined"); closeModal(); });
document.getElementById("modal-close").addEventListener("click", () => { remember("declined"); closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) { remember("declined"); closeModal(); } });

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = form.name.value.trim().slice(0, 80), email = form.email.value.trim().slice(0, 120);
  msg.className = "msg";
  if (form.website.value) { remember("joined"); closeModal(); return; } // honeypot: bots fill the hidden field
  const last = Number(sessionStorage.getItem("row_last") || 0);
  if (Date.now() - last < 30000) { msg.textContent = "Please wait a moment before trying again."; return; }
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { msg.textContent = "Please enter your name and a valid email."; return; }
  try {
    if (MAILING_LIST_ENDPOINT) {
      const r = await fetch(MAILING_LIST_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ name, email, _subject: "New Runes of Wrath signup", _template: "table", _captcha: "false" }) });
      if (!r.ok) throw new Error();
    } else {
      const list = JSON.parse(localStorage.getItem("row_signups") || "[]"); list.push({ name, email }); localStorage.setItem("row_signups", JSON.stringify(list));
    }
    try { sessionStorage.setItem("row_last", Date.now()); } catch {}
    remember("joined");
    msg.className = "msg ok"; msg.textContent = "Welcome to the fold. Watch your inbox.";
    setTimeout(closeModal, 1800);
  } catch { msg.textContent = "Something went wrong — please try again."; }
});
