# AeroBMSCE_TASK_REPO

A static, responsive website for **AeroBMSCE**, the aerospace and UAV club of BMS College of Engineering. It is a practice site built for the AeroBMSCE web development recruitment task, and it is not the club's official website.

It uses plain HTML, CSS and JavaScript. There are no frameworks, no build step and no dependencies.

## Questions and answers

### 1. Flaws of the original website

The most noticeable problems, roughly in the order I hit them:

- **Not responsive.** There was no viewport meta tag, and the layout was built on fixed pixel widths: the page wrapper and banner were 1480px wide and the tier table 1440px. On a phone the page is either tiny or scrolls sideways.
- **Distorted images.** Fixed width and height values were forced onto images with different shapes. The header logo (1688×454) was squashed into 420×200, the banner (3000×2000) was stretched into a 1480×160 strip, gallery photos were forced to 300×170 (including a portrait photo), and the square partner logos were forced to 140×60.
- **Hard to read.** Body text was 13px Times New Roman in `#707070` on `#141414`, the tier text was 11px, and the footer was 10px `#555`. That is low contrast and very small. Four unrelated fonts (Times, Impact, Trebuchet, Arial) were mixed together.
- **Inconsistent and broken navigation.** The links appeared in a different order on different pages, the current page was just `#`, and the Contact link pointed to a `contact.html` that does not exist. Links had no hover state and the keyboard focus outline was removed, so keyboard users could not see where they were.
- **Outdated layout techniques.** Floats and clearfix hacks did the layout, and the collaboration tiers were a layout `<table>`. Bullet lists were faked with `<br>` and `&bull;`, and the milestones were one long wall of line breaks that was hard to scan.
- **The slideshow.** It swapped photos abruptly every two seconds, and since the photos have different sizes the page jumped around each time. The script was also only meant for one page.
- **Small content slips.** There were typos ("Ecosytem", "show cased", a stray `, )` in the partner outcomes list), and on the journey page the sentence ending in a colon ("…at various prestigious events:") came *after* the list it was meant to introduce.
- **Missing accessibility basics.** Images had no alt text and the semantic structure (header, nav, main, footer) was missing.

### 2. Design route and UI/UX decisions

**Keep the identity, fix the craft.** The brand colours and content were already there, so I kept the dark theme with maroon and gold (`#7b2339`, `#6a1b34`, `#f5b730` on `#141414`) and focused on structure, spacing and readability instead of changing the look.

**Typography carries the personality.** I replaced the four mixed fonts with one family in two widths: *Barlow Condensed* for headings and *Barlow* for body text. The condensed face feels like aviation signage and cockpit labelling, which suits an aerospace club. Body text is 16px with a 1.6 line height, and line length is capped at about 70 characters. Text colours were chosen for strong contrast on the dark background, including a lighter pink for links in place of the dark one that was hard to read.

**Structure that matches the content.**
- *Milestones are a timeline* because they are genuinely chronological. Each season is a row with its year on the left and its results on the right, so the list can be scanned by year or by result.
- *Tiers are cards* in a 4 / 2 / 1 column grid. Each card has a coloured top edge (platinum, gold, silver, technical), so the tier is recognisable at a glance.
- *Partner logos sit on light tiles* in an evenly sized grid with `object-fit: contain`, so logos designed for white backgrounds stay legible on the dark page.

**Images are never stretched.** Every image uses `aspect-ratio` with `object-fit: cover` (or `contain` for logos), so photos are cropped to a consistent shape instead of being squashed.

**Responsive by default.** The layout is fluid, with breakpoints where the content needs them. On narrow screens the nav collapses into a Menu button, the tier grid drops to one column, and timeline rows stack. The header is sticky so navigation is always within reach.

**Accessibility as a baseline.** The nav is identical on every page and marks the current page with `aria-current`. Links and buttons have clear hover and focus styles, the slideshow has labelled dot controls and respects `prefers-reduced-motion`, decorative icons have empty alt text, and the markup uses semantic elements.

**Restraint.** Animation is limited to the slideshow fade, and everything else is static. I removed the dead Contact link instead of inventing a contact page the club had not asked for. The only content changes are the typo fixes above and moving the lead-in sentence above the team list it introduces.

### 3. A problem I ran into: the slideshow

**The problem.** The journey page slideshow could not simply be restyled. The original script used a single `<img id="slide">` and swapped its `src` between four photos every two seconds. Those photos have different sizes, so each swap changed the image's size and pushed the text around it. Adding a fade was also impossible with one `<img>`, because when the `src` changes there is no old image left to fade out. On top of that, the script assumed the `#slide` element existed. I needed the same script file on every page for the mobile menu, so loading it on pages without a slideshow would have thrown an error and stopped the menu code from running.

**How I ran into it.** I found it while reading `script.js` and the journey page markup together. Fixing the image sizes in CSS was easy, but the fade and the shared script file each exposed a design limit in the original approach.

**What I did.**
1. Replaced the single image with **four stacked `<img>` elements** inside a container with a fixed `aspect-ratio` and `overflow: hidden`. All images use `object-fit: cover`, so every photo fills the same frame and the layout never jumps.
2. Made the fade a **CSS opacity transition**. JavaScript only moves an `on` class from one image to the next, so the outgoing image fades out while the incoming one fades in.
3. Added a **guard at the top of the slideshow code** (`if (!slides.length) return;`), so the same `script.js` is safe to load on every page. The mobile menu code runs first and does not depend on the slideshow.
4. Handled the edge cases that animation introduces: it **pauses on hover and keyboard focus**, the timer restarts when someone clicks a dot, and with `prefers-reduced-motion` it **does not auto-advance** at all. Because that would leave visitors unable to see the other photos, I added **dot buttons** so every photo stays reachable manually.
5. Slowed the interval from 2s to 4s, since a fade inside a 2s cycle left almost no time to actually look at each photo.

A related smaller case was the mobile menu: if JavaScript fails, a hidden menu would leave the nav unreachable. So the collapse only applies when a `js` class is set on the page, and without JavaScript the nav simply wraps.

## Pages

| Page | What it covers |
| --- | --- |
| `index.html` | Home: hero, who we are, what we do, why it matters and the club's vision |
| `journey.html` | Journey and impact: team overview, photo slideshow, gallery and a season-by-season milestones timeline |
| `partners.html` | Partners: upcoming competitions, R&D initiatives, collaboration tiers and the partner ecosystem logos |

## Project structure

```
.
├── index.html
├── journey.html
├── partners.html
├── style.css      # all styles; colours and fonts are CSS variables in :root
├── script.js      # mobile menu + journey page slideshow
└── images/        # logos, photos, tier icons and partner logos
```

## Run locally

No setup is needed. Clone the repo and open `index.html` in a browser:

```bash
git clone https://github.com/rajeshbharadwaj44/AeroBMSCE_TASK_REPO.git
cd AeroBMSCE_TASK_REPO
```

To serve it over HTTP instead (optional):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

The fonts (Barlow and Barlow Condensed) load from Google Fonts. Without an internet connection the site falls back to system fonts.

## UI notes

- **Responsive:** works from phone widths (about 360px) up to large desktops, with no horizontal scrolling.
- **Navigation:** the same nav on every page, with the current page marked. On small screens it collapses into a Menu button. Without JavaScript it simply wraps.
- **Layout:** built with flexbox and grid. The collaboration tiers are a card grid (4, 2 or 1 columns depending on screen size), and the milestones are a timeline.
- **Images:** displayed with `object-fit` and fixed aspect ratios, so nothing is stretched.
- **Slideshow:** the journey page photos fade every 4 seconds. They pause on hover or focus, can be switched with the dot buttons, and don't auto-advance if the visitor prefers reduced motion.
- **Accessibility:** semantic HTML, alt text on images, visible keyboard focus and higher-contrast text.
- **Theme:** dark background with the club's maroon and gold. Change the colours in the `:root` block at the top of `style.css`.

## Known gaps

- "lll South India Exhibition" in the 2022 milestones is left as originally written. Confirm the correct name with the club.
- Photo alt text is generic and should be replaced with real descriptions.

## Credits

Content and imagery belong to AeroBMSCE, BMS College of Engineering. Partner names and logos belong to their respective owners.
