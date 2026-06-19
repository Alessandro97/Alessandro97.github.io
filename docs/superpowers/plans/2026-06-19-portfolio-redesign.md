# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `index.html` as a modern, animated single-page academic portfolio with a live satellite-communications hero, updating the owner's role to Post-Doctoral Researcher and refreshing all content.

**Architecture:** A self-contained static page. New `index.html` (semantic sections), `assets/css/site.css` (all styling), `assets/js/hero.js` (canvas animation + UI behaviors). The legacy HTML5 UP template (jQuery, scrollex, `assets/js/main.js`, `assets/css/main.css`) is no longer referenced. FontAwesome stays for icons. Deploys directly to GitHub Pages, no build step.

**Tech Stack:** HTML5, vanilla CSS (custom properties, fl/grid), vanilla JS + Canvas 2D, FontAwesome (vendored), Formspree (existing endpoint).

**Reference artifact:** The APPROVED hero is `.superpowers/brainstorm/591912-1781847354/content/sat-comms-hero-v2.html`. Its `<canvas>` animation and hero CSS are the source of truth — port from it, don't reinvent. The full spec is `docs/superpowers/specs/2026-06-19-portfolio-redesign-design.md`.

**How to verify (all tasks):** Serve locally and open in a browser. Start once: `python3 -m http.server 8000` from the repo root, then visit `http://localhost:8000`. After each task, hard-refresh and check the described result plus the DevTools console (must show **no errors**).

---

### Task 1: Page skeleton, CSS base, drop legacy template

**Files:**
- Modify (overwrite): `index.html`
- Create: `assets/css/site.css`

- [ ] **Step 1: Create `assets/css/site.css` with reset, design tokens, and base typography**

```css
:root{
  --bg:#04040a; --maroon:#8b0000; --maroon-dark:#290406;
  --crimson:#ff3b3f; --crimson-light:#ff6b6b; --violet:#a78bfa;
  --text:#ffffff; --muted:rgba(255,255,255,.66);
  --glass:rgba(255,255,255,.05); --glass-brd:rgba(255,255,255,.12);
  --maxw:1100px; --pad:6vw;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);
  font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  line-height:1.6;overflow-x:hidden}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.section{position:relative;z-index:5;max-width:var(--maxw);margin:0 auto;padding:90px var(--pad)}
.section-label{font-size:13px;letter-spacing:3px;text-transform:uppercase;
  color:var(--crimson-light);font-weight:700;margin-bottom:14px}
.section h2.section-title{font-size:clamp(28px,5vw,44px);font-weight:800;
  letter-spacing:-1px;margin-bottom:28px}
/* scroll-reveal */
.reveal{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease}
.reveal.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .reveal{opacity:1;transform:none;transition:none}
}
```

- [ ] **Step 2: Overwrite `index.html` with the document skeleton** (sections filled in later tasks; placeholders are empty section shells, not TODOs)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Alessandro Traspadini — Post-Doctoral Researcher, University of Padova</title>
  <link rel="stylesheet" href="assets/css/fontawesome-all.min.css"/>
  <link rel="stylesheet" href="assets/css/site.css"/>
</head>
<body>
  <canvas id="hero-bg"></canvas>
  <div class="bg-glow"></div>
  <div class="bg-veil"></div>

  <!-- nav: Task 3 -->
  <header id="hero"><!-- Task 2 --></header>
  <main>
    <section id="research" class="section"><!-- Task 4 --></section>
    <section id="publications" class="section"><!-- Task 5 --></section>
    <section id="education" class="section"><!-- Task 6 --></section>
    <section id="contact" class="section"><!-- Task 7 --></section>
  </main>
  <footer id="site-footer"><!-- Task 7 --></footer>

  <script src="assets/js/hero.js"></script>
</body>
</html>
```

- [ ] **Step 3: Verify**

Run: `python3 -m http.server 8000` then open `http://localhost:8000`.
Expected: blank dark page, **no console errors**, no 404s for `site.css` or fontawesome (hero.js 404 is expected until Task 2 — create an empty `assets/js/hero.js` now to avoid it: `touch assets/js/hero.js`).

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/site.css assets/js/hero.js
git commit -m "Rebuild page skeleton, add design tokens, drop legacy template"
```

---

### Task 2: Animated satellite-comms hero (canvas + markup + perf/a11y guards)

**Files:**
- Modify: `index.html` (`<header id="hero">`, plus `.bg-glow`/`.bg-veil` styling)
- Modify: `assets/css/site.css` (append hero styles)
- Modify: `assets/js/hero.js`

- [ ] **Step 1: Port the canvas animation into `assets/js/hero.js`**

Open the reference artifact `.superpowers/brainstorm/591912-1781847354/content/sat-comms-hero-v2.html`. Copy the **entire `<script>` block** (the `const c=document.getElementById('bg')...` canvas animation AND the rotating-keywords `setInterval`) into `assets/js/hero.js`, with these REQUIRED edits:

1. Change the canvas lookup from `getElementById('bg')` to `getElementById('hero-bg')`.
2. Wrap the whole animation so it respects reduced motion and pauses when hidden. At the very top of the file:

```js
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = matchMedia('(max-width: 768px)').matches;
```

3. In the canvas resize function, cap DPR: replace every `devicePixelRatio` with `DPR` where `const DPR = Math.min(devicePixelRatio || 1, 2);` (define once near the top).
4. Reduce counts on small screens: `stars` length `isMobile?70:150`; in the `sats` array keep only the first 3 entries when `isMobile`.
5. Guard the animation loop so it doesn't run under reduced motion and pauses on hidden tab. Replace the bare `requestAnimationFrame(frame)` kickoff with:

```js
let running = true;
document.addEventListener('visibilitychange', ()=>{ running = !document.hidden; if(running) requestAnimationFrame(frame); });
function start(){ if(prefersReduced){ frame(); return; } requestAnimationFrame(frame); } // frame() draws one static frame under reduced motion
start();
```
and at the end of `frame()` change the recursive call to `if(running && !prefersReduced) requestAnimationFrame(frame);`

- [ ] **Step 2: Add the hero markup** — replace `<header id="hero">` in `index.html`:

```html
<header id="hero" class="hero">
  <span class="pill"><span class="ping"></span> Non-Terrestrial Networks · 6G · Edge Computing</span>
  <h1>Alessandro<br><span class="grad">Traspadini</span></h1>
  <p class="role">Post-Doctoral Researcher · <span class="rot" id="rot">Non-Terrestrial Networks</span></p>
  <div class="cta">
    <a class="btn primary" href="#research">Explore my research →</a>
    <a class="btn ghost" href="PDF/CV-Traspadini.pdf"><i class="fa-solid fa-download"></i> Download CV</a>
  </div>
</header>
```

- [ ] **Step 3: Append hero + background-layer CSS to `assets/css/site.css`**

Copy these rules from the reference artifact's `<style>` and adapt the selectors: `#bg`→`#hero-bg`, `.glow`→`.bg-glow`, `.veil`→`.bg-veil`. Then add hero element rules:

```css
#hero-bg{position:fixed;inset:0;z-index:0}
.bg-glow{position:fixed;inset:0;z-index:1;pointer-events:none;
  background:radial-gradient(760px 300px at 25% 8%,rgba(170,10,10,.42),transparent),
             radial-gradient(680px 340px at 100% 90%,rgba(124,58,237,.34),transparent)}
.bg-veil{position:fixed;inset:0;z-index:2;pointer-events:none;
  background:linear-gradient(90deg,rgba(4,4,10,.66) 0%,rgba(4,4,10,.32) 48%,rgba(4,4,10,.05) 100%)}
.hero{position:relative;z-index:5;min-height:90vh;display:flex;flex-direction:column;
  justify-content:center;max-width:var(--maxw);margin:0 auto;padding:0 var(--pad)}
.pill{display:inline-flex;align-items:center;gap:8px;align-self:flex-start;background:var(--glass);
  border:1px solid rgba(255,255,255,.18);border-radius:30px;padding:7px 16px;font-size:13px;
  margin-bottom:26px;backdrop-filter:blur(8px)}
.ping{width:8px;height:8px;border-radius:50%;background:#27c93f;animation:ping 1.8s infinite}
@keyframes ping{0%{box-shadow:0 0 0 0 rgba(39,201,63,.6)}70%{box-shadow:0 0 0 10px rgba(39,201,63,0)}100%{box-shadow:0 0 0 0 rgba(39,201,63,0)}}
.hero h1{font-size:clamp(44px,8vw,92px);line-height:.98;font-weight:900;letter-spacing:-2px}
.hero h1 .grad{background:linear-gradient(110deg,#fff 20%,var(--crimson-light) 45%,var(--violet) 70%,#fff 90%);
  -webkit-background-clip:text;background-clip:text;color:transparent;background-size:200% auto;animation:shine 6s linear infinite}
@keyframes shine{to{background-position:200% center}}
.role{font-size:clamp(18px,2.6vw,24px);margin-top:20px;color:var(--text);opacity:.9}
.role .rot{color:#ff8a8a;font-weight:700;transition:opacity .25s}
.cta{display:flex;gap:14px;margin-top:36px;flex-wrap:wrap}
.btn{padding:14px 26px;border-radius:12px;font-weight:700;font-size:15px;transition:.25s}
.btn.primary{background:linear-gradient(135deg,var(--maroon),var(--crimson));box-shadow:0 10px 30px rgba(139,0,0,.5)}
.btn.primary:hover{transform:translateY(-3px)}
.btn.ghost{border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.03)}
.btn.ghost:hover{background:rgba(255,255,255,.1)}
@media (prefers-reduced-motion:reduce){.hero h1 .grad{animation:none}.ping{animation:none}}
```

- [ ] **Step 4: Verify**

Hard-refresh `http://localhost:8000`. Expected: full-screen animated globe + orbiting satellites + wide glowing downlink beams + inter-satellite links + starfield; hero name shimmer; rotating keyword cycles under the role line; CTA buttons lift on hover. **No console errors.** Toggle OS "reduce motion" → reload → animation is a single static frame, page still readable.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/site.css assets/js/hero.js
git commit -m "Add animated satellite-comms hero with reduced-motion and mobile guards"
```

---

### Task 3: Sticky glass nav (smooth scroll, active highlight, mobile toggle)

**Files:**
- Modify: `index.html` (insert `<nav>` before `<header id="hero">`)
- Modify: `assets/css/site.css` (append nav styles)
- Modify: `assets/js/hero.js` (append nav behavior)

- [ ] **Step 1: Add nav markup** (insert immediately after `<body>`'s background layers, before `<header id="hero">`):

```html
<nav id="nav">
  <a class="logo" href="#hero">AT<span>.</span></a>
  <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>
  <ul class="nav-links">
    <li><a href="#hero">Home</a></li>
    <li><a href="#research">Research</a></li>
    <li><a href="#publications">Publications</a></li>
    <li><a href="#education">Education</a></li>
    <li><a href="#contact">Contact</a></li>
    <li class="nav-social">
      <a href="https://github.com/Alessandro97" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
      <a href="https://www.linkedin.com/in/alessandro-traspadini" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
      <a href="https://scholar.google.com/citations?user=XNSaRhIAAAAJ" aria-label="Google Scholar"><i class="fa-solid fa-graduation-cap"></i></a>
      <a href="mailto:traspadini@dei.unipd.it" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
    </li>
  </ul>
</nav>
```

- [ ] **Step 2: Append nav CSS**

```css
#nav{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;align-items:center;
  justify-content:space-between;padding:14px var(--pad);
  background:rgba(4,4,10,.45);backdrop-filter:blur(12px);border-bottom:1px solid var(--glass-brd)}
#nav .logo{font-weight:800;font-size:20px}#nav .logo span{color:var(--crimson-light)}
.nav-links{display:flex;gap:26px;list-style:none;align-items:center}
.nav-links a{font-size:14px;color:var(--muted);transition:.2s}
.nav-links a:hover,.nav-links a.active{color:var(--text)}
.nav-social{display:flex;gap:14px;font-size:16px}
.nav-toggle{display:none;background:none;border:none;color:#fff;font-size:20px;cursor:pointer}
@media (max-width:768px){
  .nav-toggle{display:block}
  .nav-links{position:fixed;inset:60px 0 auto 0;flex-direction:column;gap:18px;padding:24px var(--pad);
    background:rgba(4,4,10,.96);backdrop-filter:blur(12px);transform:translateY(-120%);transition:transform .3s;border-bottom:1px solid var(--glass-brd)}
  .nav-links.open{transform:none}
  .nav-social{margin-top:6px}
}
```

- [ ] **Step 3: Append nav behavior to `assets/js/hero.js`**

```js
// mobile menu toggle
const navToggle=document.querySelector('.nav-toggle'),navLinks=document.querySelector('.nav-links');
navToggle.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');navToggle.setAttribute('aria-expanded',open);});
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navLinks.classList.remove('open');navToggle.setAttribute('aria-expanded',false);}));
// active section highlight
const navMap=[...document.querySelectorAll('.nav-links a[href^="#"]')];
const obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){const id=e.target.id;
  navMap.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id));}});},{rootMargin:'-45% 0px -50% 0px'});
['hero','research','publications','education','contact'].forEach(id=>{const el=document.getElementById(id);if(el)obs.observe(el);});
```

- [ ] **Step 4: Verify**

Reload. Expected: glass nav fixed on top; clicking links smooth-scrolls to sections; active link highlights as you scroll; at ≤768px width the hamburger appears, opens/closes the menu, and tapping a link closes it. No console errors.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/site.css assets/js/hero.js
git commit -m "Add sticky glass nav with smooth scroll, active highlight, mobile toggle"
```

---

### Task 4: About & Research section

**Files:**
- Modify: `index.html` (`#research`)
- Modify: `assets/css/site.css` (append card styles)

- [ ] **Step 1: Fill `#research`**

```html
<section id="research" class="section">
  <div class="section-label reveal">About</div>
  <h2 class="section-title reveal">Research</h2>
  <p class="bio reveal">I am a Post-Doctoral Researcher in Information Engineering at the University of Padova, where I recently completed my Ph.D. in 2026. My academic background includes a B.Sc. in Information Engineering and an M.Sc. in Telecommunications Engineering from the University of Padova, as well as a Double Degree M.Sc. in Communication Engineering from National Taiwan University.</p>
  <p class="bio reveal">My research focuses on non-terrestrial networks (NTNs) and 5G/6G wireless systems, with emphasis on integrated satellite–terrestrial architectures, mobility-aware resource allocation, and network optimization for next-generation communication systems.</p>
  <div class="cards reveal">
    <div class="glass-card"><div class="card-ic">🛰️</div><h3>Non-Terrestrial Networks</h3><p>Integrated satellite–terrestrial architectures for resilient global connectivity.</p></div>
    <div class="glass-card"><div class="card-ic">📡</div><h3>Mobility-Aware Resource Allocation</h3><p>Scheduling and resource management that adapt to fast-moving space and aerial nodes.</p></div>
    <div class="glass-card"><div class="card-ic">⚡</div><h3>5G/6G Network Optimization</h3><p>Optimizing next-generation wireless systems, from edge computing to full-stack protocol design.</p></div>
  </div>
</section>
```

- [ ] **Step 2: Append CSS**

```css
.bio{max-width:780px;color:var(--muted);font-size:17px;margin-bottom:18px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;margin-top:30px}
.glass-card{background:var(--glass);border:1px solid var(--glass-brd);border-radius:18px;padding:24px;
  backdrop-filter:blur(10px);transition:.3s}
.glass-card:hover{transform:translateY(-6px);border-color:rgba(255,107,107,.5);box-shadow:0 20px 50px rgba(0,0,0,.5)}
.glass-card .card-ic{font-size:30px;margin-bottom:12px}
.glass-card h3{font-size:18px;margin-bottom:8px}
.glass-card p{font-size:14px;color:var(--muted)}
```

- [ ] **Step 3: Append scroll-reveal observer to `assets/js/hero.js`**

```js
const revObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');revObs.unobserve(e.target);}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));
```

- [ ] **Step 4: Verify**

Reload, scroll to Research. Expected: bio paragraphs + 3 glass cards that fade/slide in on scroll and lift on hover. No console errors.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/site.css assets/js/hero.js
git commit -m "Add About & Research section with reveal-on-scroll cards"
```

---

### Task 5: Publications section (12 peer-reviewed papers, tagged)

**Files:**
- Modify: `index.html` (`#publications`)
- Modify: `assets/css/site.css` (append publication styles)

- [ ] **Step 1: Fill `#publications`** — use the exact list from the spec. Each `<li>` has a tag span (`journal`/`conf`), the citation text, and a link where known. Author lists use "M. Zorzi" (never "Zorski").

```html
<section id="publications" class="section">
  <div class="section-label reveal">Selected work</div>
  <h2 class="section-title reveal">Publications</h2>
  <ul class="pub-list">
    <li class="pub reveal"><span class="tag journal">Journal</span><div class="pub-body"><p>M. Figaro, F. Rossato, M. Giordani, <b>A. Traspadini</b>, T. Shimizu, C. Mahabal, et al. "5G NR non-terrestrial networks: from early results to the road ahead." <i>npj Wireless Technology</i>, 2026.</p></div></li>
    <li class="pub reveal"><span class="tag journal">Journal</span><div class="pub-body"><p><b>A. Traspadini</b>, M. Pagin, R. Ihamouine, R. Lucas, A. Noren, M. Zorzi, et al. "End-to-End Simulation of 5G NR Integrated Access and Backhaul Networks for Remote Maritime Connectivity." <i>IEEE Transactions on Communications</i>, 2026.</p></div></li>
    <li class="pub reveal"><span class="tag conf">Conference</span><div class="pub-body"><p><b>A. Traspadini</b>, M. Zorzi, M. Giordani. "Performance Evaluation of LoRa for IoT Applications in Non-Terrestrial Networks via ns-3." <i>IEEE GLOBECOM</i>, 2025.</p></div></li>
    <li class="pub reveal"><span class="tag conf">Conference</span><div class="pub-body"><p><b>A. Traspadini</b>, A. A. Deshpande, M. Giordani, C. Mahabal, T. Shimizu, M. Zorzi. "Sensing-Based Beamformed Resource Allocation in Standalone Millimeter-Wave Vehicular Networks." <i>IEEE ICC</i>, 2025.</p></div></li>
    <li class="pub reveal"><span class="tag conf">Conference</span><div class="pub-body"><p>A. Bonora, <b>A. Traspadini</b>, M. Giordani, M. Zorzi. "Performance Evaluation of Satellite-Based Data Offloading on Starlink Constellations." <i>IEEE WCNC</i>, 2025.</p></div></li>
    <li class="pub reveal"><span class="tag conf">Conference</span><div class="pub-body"><p><b>A. Traspadini</b>, M. Giordani, M. Zorzi. "Enhanced Time Division Duplexing Slot Allocation and Scheduling in Non-Terrestrial Networks." <i>58th Asilomar Conference on Signals, Systems, and Computers</i>, 2024.</p></div></li>
    <li class="pub reveal"><span class="tag conf">Conference</span><div class="pub-body"><p>S. Baldoni, F. Battisti, F. Chiariotti, F. Mistrorigo, A. B. Shofi, P. Testolina, <b>A. Traspadini</b>, A. Zanella, M. Zorzi. "QuestSet: A VR Dataset for Network and Quality of Experience Studies." <i>ACM MMSys</i>, 2024.</p><a class="pub-link" href="https://dl.acm.org/doi/abs/10.1145/3625468.3652187">View →</a></div></li>
    <li class="pub reveal"><span class="tag conf">Conference</span><div class="pub-body"><p><b>A. Traspadini</b>, M. Giordani, G. Giambene, T. De Cola, M. Zorzi. "On the Energy Consumption of UAV Edge Computing in Non-Terrestrial Networks." <i>57th Asilomar Conference on Signals, Systems, and Computers</i>, 2023.</p><a class="pub-link" href="https://ieeexplore.ieee.org/abstract/document/10476934">View →</a></div></li>
    <li class="pub reveal"><span class="tag journal">Journal</span><div class="pub-body"><p><b>A. Traspadini</b>, M. Giordani, G. Giambene, M. Zorzi. "Real-Time HAP-Assisted Vehicular Edge Computing for Rural Areas." <i>IEEE Wireless Communications Letters</i>, 12(4):674-678, 2023.</p><a class="pub-link" href="https://ieeexplore.ieee.org/abstract/document/10024371">View →</a></div></li>
    <li class="pub reveal"><span class="tag conf">Conference</span><div class="pub-body"><p>D. Wang, <b>A. Traspadini</b>, M. Giordani, M.-S. Alouini, M. Zorzi. "On the Performance of Non-Terrestrial Networks to Support the Internet of Things." <i>56th Asilomar Conference on Signals, Systems, and Computers</i>, 2022.</p><a class="pub-link" href="https://ieeexplore.ieee.org/abstract/document/10052102">View →</a></div></li>
    <li class="pub reveal"><span class="tag conf">Conference</span><div class="pub-body"><p><b>A. Traspadini</b>, M. Giordani, M. Zorzi. "UAV/HAP-Assisted Vehicular Edge Computing in 6G: Where and What to Offload?" <i>EuCNC/6G Summit</i>, 2022.</p><a class="pub-link" href="https://ieeexplore.ieee.org/document/9815734">View →</a></div></li>
    <li class="pub reveal"><span class="tag conf">Conference</span><div class="pub-body"><p>P. Testolina, M. Lecci, <b>A. Traspadini</b>, M. Zorzi. "An Open Framework to Model Diffraction by Dynamic Blockers in Millimeter Wave Simulations." <i>MedComNet</i>, 2022.</p></div></li>
  </ul>
  <a class="scholar-link reveal" href="https://scholar.google.com/citations?user=XNSaRhIAAAAJ"><i class="fa-solid fa-graduation-cap"></i> Full list on Google Scholar →</a>
</section>
```

- [ ] **Step 2: Append CSS**

```css
.pub-list{list-style:none;display:flex;flex-direction:column;gap:14px}
.pub{display:flex;gap:16px;align-items:flex-start;background:var(--glass);border:1px solid var(--glass-brd);
  border-radius:14px;padding:18px 20px;transition:.25s}
.pub:hover{border-color:rgba(255,107,107,.45);transform:translateX(4px)}
.tag{flex:none;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;
  padding:4px 10px;border-radius:20px;margin-top:2px}
.tag.journal{background:rgba(167,139,250,.16);color:var(--violet)}
.tag.conf{background:rgba(255,107,107,.16);color:var(--crimson-light)}
.pub-body p{font-size:15px;color:var(--text)}.pub-body i{color:var(--muted)}
.pub-link{display:inline-block;margin-top:6px;font-size:13px;font-weight:600;color:var(--crimson-light)}
.scholar-link{display:inline-block;margin-top:26px;font-weight:600;color:var(--crimson-light)}
@media (max-width:560px){.pub{flex-direction:column;gap:8px}}
```

- [ ] **Step 3: Verify**

Reload, scroll to Publications. Expected: 12 entries visible by default, each with a Journal/Conference tag, reveal-on-scroll, hover nudge; "View →" links open the right pages; "Full list on Google Scholar" link present. Confirm no "Zorski" anywhere (`grep -i zorski index.html` returns nothing). No console errors.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/site.css
git commit -m "Add publications section with 12 peer-reviewed papers, tagged"
```

---

### Task 6: Education section

**Files:**
- Modify: `index.html` (`#education`)
- Modify: `assets/css/site.css` (append timeline styles)

- [ ] **Step 1: Fill `#education`**

```html
<section id="education" class="section">
  <div class="section-label reveal">Background</div>
  <h2 class="section-title reveal">Education</h2>
  <div class="timeline">
    <div class="edu reveal"><div class="edu-year">2026</div><div class="edu-body"><h3>Ph.D. in Information Engineering</h3><p class="edu-org">University of Padova</p><p>Dissertation: “Analysis, Design and Optimization of Non-Terrestrial Networks for 6G.” Advisor: Prof. Michele Zorzi.</p></div></div>
    <div class="edu reveal"><div class="edu-year">2021</div><div class="edu-body"><h3>M.Sc. in ICT for Internet and Multimedia — Telecommunications</h3><p class="edu-org">University of Padova</p><p>Thesis: “Scheduling for MU-MIMO using hybrid analog and digital beamforming based on DPC.” Supervisors: Prof. Michele Zorzi, Prof. Hsuan-Jung Su.</p></div></div>
    <div class="edu reveal"><div class="edu-year">2021</div><div class="edu-body"><h3>Double Degree M.Sc. in Communication Engineering</h3><p class="edu-org">National Taiwan University</p><p>Graduate Institute of Communication Engineering — joint program with the University of Padova.</p></div></div>
    <div class="edu reveal"><div class="edu-year">2019</div><div class="edu-body"><h3>B.Sc. in Information Engineering</h3><p class="edu-org">University of Padova</p><p>Thesis: “Control of a self-balancing robot.” Supervisor: Prof. Mauro Bisiacco.</p></div></div>
  </div>
</section>
```

- [ ] **Step 2: Append CSS**

```css
.timeline{display:flex;flex-direction:column;gap:18px;border-left:2px solid rgba(255,107,107,.3);padding-left:26px}
.edu{position:relative}
.edu::before{content:"";position:absolute;left:-33px;top:6px;width:12px;height:12px;border-radius:50%;
  background:var(--crimson);box-shadow:0 0 0 4px rgba(255,59,63,.2)}
.edu-year{font-size:13px;font-weight:700;color:var(--crimson-light);letter-spacing:1px}
.edu-body h3{font-size:18px;margin:2px 0 2px}
.edu-org{color:var(--violet);font-size:14px;margin-bottom:6px}
.edu-body p{color:var(--muted);font-size:15px;max-width:760px}
```

- [ ] **Step 3: Verify**

Reload, scroll to Education. Expected: vertical timeline with 4 dotted entries, years in accent color, reveal-on-scroll. No console errors.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/site.css
git commit -m "Add education timeline section"
```

---

### Task 7: Contact section, restyled form, footer

**Files:**
- Modify: `index.html` (`#contact`, `#site-footer`)
- Modify: `assets/css/site.css` (append form + footer styles)

- [ ] **Step 1: Fill `#contact` and footer**

```html
<section id="contact" class="section">
  <div class="section-label reveal">Get in touch</div>
  <h2 class="section-title reveal">Contact</h2>
  <p class="bio reveal">Open to collaborations and research discussions. Reach me at
    <a class="inline-link" href="mailto:traspadini@dei.unipd.it">traspadini@dei.unipd.it</a> or use the form below.</p>
  <form class="contact-form reveal" method="post" action="https://formspree.io/f/xzbobndq">
    <div class="form-row">
      <input type="text" name="name" placeholder="Name" required/>
      <input type="email" name="email" placeholder="Email" required/>
    </div>
    <textarea name="message" rows="5" placeholder="Message" required></textarea>
    <button type="submit" class="btn primary"><i class="fa-solid fa-paper-plane"></i> Send message</button>
  </form>
  <div class="contact-social reveal">
    <a href="https://github.com/Alessandro97" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
    <a href="https://www.linkedin.com/in/alessandro-traspadini" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
    <a href="https://scholar.google.com/citations?user=XNSaRhIAAAAJ" aria-label="Google Scholar"><i class="fa-solid fa-graduation-cap"></i></a>
    <a href="mailto:traspadini@dei.unipd.it" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
  </div>
</section>
<footer id="site-footer">
  <p>© <span id="year"></span> Alessandro Traspadini · University of Padova</p>
</footer>
```

- [ ] **Step 2: Append CSS**

```css
.inline-link{color:var(--crimson-light);font-weight:600}
.contact-form{max-width:640px;display:flex;flex-direction:column;gap:14px;margin-top:10px}
.form-row{display:flex;gap:14px}.form-row input{flex:1}
.contact-form input,.contact-form textarea{width:100%;background:var(--glass);border:1px solid var(--glass-brd);
  border-radius:12px;padding:14px 16px;color:#fff;font-size:15px;font-family:inherit;resize:vertical}
.contact-form input::placeholder,.contact-form textarea::placeholder{color:rgba(255,255,255,.4)}
.contact-form input:focus,.contact-form textarea:focus{outline:none;border-color:var(--crimson-light)}
.contact-form .btn{align-self:flex-start;border:none;cursor:pointer}
.contact-social{display:flex;gap:20px;font-size:22px;margin-top:26px}
.contact-social a{color:var(--muted);transition:.2s}.contact-social a:hover{color:var(--crimson-light)}
#site-footer{position:relative;z-index:5;text-align:center;padding:30px var(--pad);
  color:var(--muted);font-size:14px;border-top:1px solid var(--glass-brd)}
@media (max-width:560px){.form-row{flex-direction:column}}
```

- [ ] **Step 3: Set footer year — append to `assets/js/hero.js`**

```js
document.getElementById('year').textContent=new Date().getFullYear();
```

- [ ] **Step 4: Verify**

Reload, scroll to Contact. Expected: dark-themed form with focus states, social icons, footer with current year. Submitting posts to Formspree (will show Formspree confirmation/redirect). No console errors.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/site.css assets/js/hero.js
git commit -m "Add contact section with restyled form, socials, and footer"
```

---

### Task 8: SEO/social meta, favicon, final responsive + cleanup pass

**Files:**
- Modify: `index.html` (`<head>`)
- Create: `assets/favicon.svg`

- [ ] **Step 1: Add meta + favicon link inside `<head>`** (after the `<title>`)

```html
<meta name="description" content="Alessandro Traspadini — Post-Doctoral Researcher in Information Engineering at the University of Padova. Research on non-terrestrial networks (NTN) and 5G/6G wireless systems."/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="Alessandro Traspadini — Post-Doctoral Researcher, University of Padova"/>
<meta property="og:description" content="Research on non-terrestrial networks (NTN) and 5G/6G wireless systems."/>
<meta property="og:image" content="https://alessandro97.github.io/images/myself.jpeg"/>
<meta property="og:url" content="https://alessandro97.github.io/"/>
<meta name="twitter:card" content="summary"/>
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg"/>
```

- [ ] **Step 2: Create `assets/favicon.svg`** (a small maroon "A" satellite mark)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#8b0000"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui,sans-serif" font-size="38" font-weight="800" fill="#fff">A</text></svg>
```

- [ ] **Step 3: Responsive + cleanup verification**

- Open `http://localhost:8000` and use DevTools device toolbar at 375px, 768px, 1280px. Expected: nav collapses to hamburger ≤768px; hero text readable; cards/pubs/form stack cleanly; no horizontal scroll.
- Confirm legacy files are no longer referenced: `grep -nE "jquery|scrolly|scrollex|main\.js|css/main\.css|browser\.min|breakpoints|util\.js" index.html` returns nothing.
- Confirm no leftover OCR error: `grep -i zorski index.html` returns nothing.
- Confirm tab title and favicon show in the browser tab.
- Console clean on load and through a full scroll.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/favicon.svg
git commit -m "Add SEO/OG meta and favicon; final responsive pass"
```

---

## Notes / deferred (non-blocking)

- `images/myself.jpeg` is 1.7 MB. Optional: compress/resize to ~150–200 KB for faster load. The current design does not place the photo in the hero; if you want it shown (e.g. an "About" portrait), add an `<img>` to `#research` and a `.bio-photo` rule — out of scope for this plan unless requested.
- Old template files under `assets/js/` and `assets/css/main.css` / `assets/sass/` are left on disk but unreferenced. Deleting them is safe later; left in place to avoid breaking anything unforeseen.
