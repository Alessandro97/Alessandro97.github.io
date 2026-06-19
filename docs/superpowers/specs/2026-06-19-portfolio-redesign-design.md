# Personal Portfolio Redesign — Design Spec

**Date:** 2026-06-19
**Owner:** Alessandro Traspadini
**Repo:** Alessandro97.github.io (GitHub Pages, static)

## Goal

Completely redesign the personal academic homepage into a modern, animated, "wow on entry" single page that reflects the owner's field (non-terrestrial networks / satellite communications), and update the role to **Post-Doctoral Researcher in Information Engineering, University of Padova**.

## Approach

Rebuild `index.html` from scratch as a self-contained modern static page. Remove the legacy HTML5 UP "Prologue" template (jQuery, scrollex, `is-preload`, template `main.css`/`main.js`). Keep:

- `PDF/` (CV + theses)
- `images/myself.jpeg`
- FontAwesome (`assets/css/fontawesome-all.min.css` + `assets/webfonts/`) for icons

New assets:
- `assets/css/site.css` — all page styling
- `assets/js/hero.js` — satellite-comms canvas animation + small UI behaviors (smooth scroll, rotating keywords, scroll reveal)

No build step; deploys directly via GitHub Pages.

## Visual direction (LOCKED)

Dark "Aurora" theme with a live **satellite-communications** canvas background. Brand color maroon (`#8b0000` / `#290406`) with crimson (`#ff3b3f`/`#ff6b6b`) and violet (`#a78bfa`) accents.

Hero background canvas (per approved `sat-comms-hero-v2`):
- Bright, detailed wireframe **globe** (lat/long grid, warm continent blobs, glowing city lights, atmospheric limb) curving across the bottom.
- **Slower, bigger satellites** (solar panels, body light, dish) orbiting on layered elliptical arcs.
- **Inter-satellite links** (violet) with traveling data packets.
- **Wide, bright downlink beams** (cone + glowing core) from satellites to ground stations, with 3 data packets streaming per beam.
- **Signal ripples** at ground stations; twinkling **starfield**.
- Radial maroon/violet glow layer + left-side veil gradient for hero text legibility.

Hero foreground: glass nav, status pill ("Non-Terrestrial Networks · 6G · Edge Computing"), large shimmering gradient name, role line with **rotating research keywords**, two CTA buttons (Explore research / Download CV).

**No citation/metrics stat row** (explicitly excluded by owner).

## Page structure

1. **Sticky glass nav** — Home · Research · Publications · Education · Contact, plus social icons (GitHub, LinkedIn, Google Scholar, email). Smooth-scroll to sections; active-section highlight.
2. **Hero** — as above.
3. **About & Research** — bio paragraph (owner-provided text below), then 3 research-focus glass cards:
   - Non-Terrestrial Networks & integrated satellite–terrestrial architectures
   - Mobility-aware resource allocation
   - 5G/6G wireless systems & network optimization
4. **Publications** — **peer-reviewed journal & conference papers only**, visible by default, reverse-chronological, each with a tag: **Journal** or **Conference**. Links to DOI/IEEE/ACM. Preprints, the dataset entry, and the dissertation are NOT listed here (dissertation appears under Education). All "M Zorski" OCR errors corrected to **M. Zorzi**.
5. **Education** — Ph.D. (Padova, 2026) → M.Sc. Telecommunications (Padova, 2021) → Double-Degree M.Sc. Communication Engineering (NTU, 2021) → B.Sc. Information Engineering (Padova, 2019), with thesis titles and supervisors.
6. **Contact** — existing Formspree form (`https://formspree.io/f/xzbobndq`) restyled to dark theme + email button (`traspadini@dei.unipd.it`) + social icons.
7. **Footer** — copyright + design credit.

## Bio text (owner-provided, verbatim)

> I am a Post-Doctoral Researcher in Information Engineering at the University of Padova, where I recently completed my Ph.D. in 2026. My academic background includes a B.Sc. in Information Engineering and an M.Sc. in Telecommunications Engineering from the University of Padova, as well as a Double Degree M.Sc. in Communication Engineering from National Taiwan University.
>
> My research focuses on non-terrestrial networks (NTNs) and 5G/6G wireless systems, with emphasis on integrated satellite–terrestrial architectures, mobility-aware resource allocation, and network optimization for next-generation communication systems.

## Publications (from Google Scholar, 2026-06-19)

**Peer-reviewed only** (Journal/Conference), reverse-chronological. Preprints, dataset, and dissertation are excluded from this section.

1. *5G NR non-terrestrial networks: from early results to the road ahead* — M. Figaro, F. Rossato, M. Giordani, A. Traspadini, T. Shimizu, C. Mahabal, et al. — **npj Wireless Technology**, 2026. [Journal]
2. *End-to-End Simulation of 5G NR Integrated Access and Backhaul Networks for Remote Maritime Connectivity* — A. Traspadini, M. Pagin, R. Ihamouine, R. Lucas, A. Noren, M. Zorzi, et al. — **IEEE Transactions on Communications**, 2026. [Journal]
3. *Performance Evaluation of LoRa for IoT Applications in Non-Terrestrial Networks via ns-3* — A. Traspadini, M. Zorzi, M. Giordani — **IEEE GLOBECOM 2025** (on IEEE Xplore). [Conference]
4. *Sensing-Based Beamformed Resource Allocation in Standalone Millimeter-Wave Vehicular Networks* — A. Traspadini, A.A. Deshpande, M. Giordani, C. Mahabal, T. Shimizu, M. Zorzi — **ICC 2025 (IEEE International Conference on Communications)**. [Conference]
5. *Performance Evaluation of Satellite-Based Data Offloading on Starlink Constellations* — A. Bonora, A. Traspadini, M. Giordani, M. Zorzi — **IEEE WCNC 2025**. [Conference]
6. *Enhanced Time Division Duplexing Slot Allocation and Scheduling in Non-Terrestrial Networks* — A. Traspadini, M. Giordani, M. Zorzi — **58th Asilomar 2024**. [Conference]
7. *QuestSet: A VR dataset for network and quality of experience studies* — S. Baldoni, F. Battisti, F. Chiariotti, F. Mistrorigo, A.B. Shofi, P. Testolina, A. Traspadini, A. Zanella, M. Zorzi — **ACM MMSys 2024**. [Conference] — DOI 10.1145/3625468.3652187
8. *On the energy consumption of UAV edge computing in non-terrestrial networks* — A. Traspadini, M. Giordani, G. Giambene, T. De Cola, M. Zorzi — **57th Asilomar 2023**. [Conference]
9. *Real-time HAP-assisted vehicular edge computing for rural areas* — A. Traspadini, M. Giordani, G. Giambene, M. Zorzi — **IEEE Wireless Communications Letters** 12(4):674-678, 2023. [Journal]
10. *On the performance of non-terrestrial networks to support the internet of things* — D. Wang, A. Traspadini, M. Giordani, M.-S. Alouini, M. Zorzi — **56th Asilomar 2022**. [Conference]
11. *UAV/HAP-Assisted Vehicular Edge Computing in 6G: Where and What to Offload?* — A. Traspadini, M. Giordani, M. Zorzi — **EuCNC/6G Summit 2022**. [Conference] — DOI 10.1109/EuCNC/6GSummit54941.2022.9815734
12. *An Open Framework to Model Diffraction by Dynamic Blockers in Millimeter Wave Simulations* — P. Testolina, M. Lecci, A. Traspadini, M. Zorzi — **MedComNet 2022**. [Conference]

Excluded from the Publications section (per owner): the arXiv preprint *5G NR NTN: Open Challenges for Full-Stack Protocol Design* (2026, confirmed still a preprint), the standalone *QuestSet* dataset entry, and the Ph.D. dissertation (the dissertation is shown under Education instead). No additional peer-reviewed papers are missing from Scholar. **Final count: 12 peer-reviewed papers.**

> Note: exact DOIs/links for the newer papers (1–5, 7) are not all in hand; carry over the links present on the current site and add a Scholar link. Missing links can be filled later without blocking the build.

## Education

- **Ph.D. in Information Engineering** — University of Padova, 2026. Dissertation: *Analysis, Design and Optimization of Non-Terrestrial Networks for 6G*. Advisor: Prof. Michele Zorzi.
- **M.Sc. in ICT for Internet and Multimedia (Telecommunications)** — University of Padova, 2021. Thesis: *Scheduling for MU-MIMO using hybrid analog and digital beamforming based on DPC*. Supervisors: Prof. Michele Zorzi, Prof. Hsuan-Jung Su.
- **Double-Degree M.Sc., Graduate Institute of Communication Engineering** — National Taiwan University, 2021. (Same thesis as above.)
- **B.Sc. in Information Engineering** — University of Padova, 2019. Thesis: *Control of a self-balancing robot*. Supervisor: Prof. Mauro Bisiacco.

## Technical / non-functional requirements

- **Responsive** — mobile, tablet, desktop. Nav collapses on mobile.
- **Accessibility:** honor `prefers-reduced-motion` (replace canvas animation with a static gradient + still globe). Sufficient contrast for hero text over the canvas (left veil). Semantic landmarks, `aria` on nav toggle, alt text on photo.
- **Performance:** cap `devicePixelRatio` (e.g. ≤2) for the canvas; reduce satellite/particle/star counts on small screens; pause/throttle animation when tab hidden (`visibilitychange`) and when off-screen. Avoid layout thrash.
- **SEO/social:** `<title>`, `<meta name="description">`, Open Graph + Twitter card tags, favicon.
- **No external runtime deps** beyond FontAwesome (already vendored locally). No jQuery.
- `images/myself.jpeg` (1.7 MB) flagged for optional compression — not a blocker.

## Out of scope

- News/updates section (excluded by owner).
- Live citation metrics / counters (excluded by owner).
- Preprints, dataset, and dissertation in the Publications list (excluded by owner; dissertation appears under Education).
- CMS / static-site generator.
- Backend beyond the existing Formspree endpoint.

## Success criteria

- Page loads as a single static `index.html` with no console errors.
- Animated satellite-comms hero renders and runs smoothly on desktop and mobile; static fallback under reduced-motion.
- All sections present, content accurate (role updated, Zorzi spelling fixed, the 12 peer-reviewed publications listed and tagged Journal/Conference).
- Existing CV/thesis PDFs and the contact form work.
