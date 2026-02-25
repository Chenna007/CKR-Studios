# CKRStudios Website — Cinematic Edition
## Complete Guide

---

## 📁 FOLDER STRUCTURE

```
ckr-cinematic/
├── index.html     ← All page content
├── style.css      ← All styles
├── script.js      ← All JavaScript & animations
└── README.md      ← This guide
```

Open `index.html` in your browser to see the site. No setup required.

---

## 🎨 THE CONCEPT

This website tells a visual story through scroll.

**Morning (White) → Dusk (Gray) → Night (Black) → Dawn (Gray) → Morning (White)**

The background color transitions are driven by `script.js` → `colorStops[]` array.
As the user scrolls, the background smoothly morphs between stops.
When the background turns dark, text/buttons automatically invert via `data-theme="dark"` on `<html>`.

---

## ✏️ HOW TO EDIT TEXT

Every editable section has an `<!-- ✏️ Edit: ... -->` comment.

| What to change | Where |
|---|---|
| Hero headline | `index.html` → `.hero-headline` |
| Hero subtext | `index.html` → `.hero-sub` |
| Service titles | `index.html` → `.svc-name` |
| Client names/reviews | `index.html` → `.client-card` blocks |
| Contact info | `index.html` → `.contact-details` |
| Footer text | `index.html` → `<footer>` |
| Instagram URL | `index.html` → search `instagram.com/ckr_studios` |

---

## 🎨 HOW TO CHANGE COLORS

### Background Scroll Journey
Open `script.js`. Find:
```javascript
const stops = [
  { pct: 0.00, hex: '#FFFFFF' },  // Page top — pure white
  { pct: 0.60, hex: '#080706' },  // Moon section — deep night
  { pct: 1.00, hex: '#FFFFFF' },  // Page bottom — white again
  ...
]
```
Edit any hex color. `pct` is the scroll position (0 = top, 1 = bottom).

### Accent Color (gold)
In `style.css`, find:
```css
--accent: #C8965A;
```
Change to any color. It affects hover states, labels, moon glow, and accents.

---

## 🔤 HOW TO CHANGE FONTS

In `index.html` `<head>`, change the Google Fonts URL:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR+FONT:wght@300;600&display=swap" />
```

In `style.css` `:root`:
```css
--font-display: 'Your Display Font', serif;
--font-body:    'Your Body Font', sans-serif;
```

Current fonts: **Cormorant Garant** (display) + **Outfit** (body).

---

## 🖼️ HOW TO ADD A LOGO

Find in `index.html`:
```html
<a href="#hero" class="logo">
  CKR<span class="logo-mark">Studios</span>
</a>
```

Replace with:
```html
<a href="#hero" class="logo">
  <img src="logo.png" alt="CKRStudios" height="40" />
</a>
```

---

## 👤 HOW TO CHANGE CLIENT CARDS

Each card in the `#clients` section looks like:
```html
<div class="client-card">
  <div class="client-avatar" data-initials="AK" style="--hue:20"></div>
  <p class="client-review">"Review text here"</p>
  <div class="client-info">
    <strong class="client-name">Name Here</strong>
    <span class="client-role">Role, City</span>
  </div>
  <div class="client-stars">★★★★★</div>
</div>
```

- `data-initials` = 2-letter abbreviation shown in the avatar
- `--hue` = 0–360 color for the avatar (hue of HSL color wheel)
- Add more cards to extend the horizontal scroll

---

## 📧 HOW TO SET UP THE CONTACT FORM

Open `script.js` and find `initContactForm()`.

Replace the fake delay with real Formspree:
```javascript
const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
if (!res.ok) throw new Error();
```

Get your Formspree ID free at [formspree.io](https://formspree.io).

---

## 🌍 HOW TO DEPLOY

### Netlify (Free, Fastest)
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop the `ckr-cinematic` folder onto the deploy zone
3. Live in 60 seconds

### Vercel
1. [vercel.com](https://vercel.com) → New Project
2. Upload or connect GitHub repo
3. Zero configuration needed

### GitHub Pages
1. Create a GitHub repo
2. Upload all files
3. Settings → Pages → Deploy from main branch

### cPanel Hosting
1. File Manager → `public_html`
2. Upload `index.html`, `style.css`, `script.js`
3. Site is live immediately

---

## ✅ QUICK EDIT CHECKLIST

- [ ] Update hero headline text
- [ ] Update hero subtext
- [ ] Update stats (if you add them)
- [ ] Change Instagram link from `ckr_studios` to yours
- [ ] Update client card names and reviews
- [ ] Set up Formspree for the contact form
- [ ] Add your real email to form error message
- [ ] Optionally add a logo image
- [ ] Deploy

---

© 2026 CKRStudios · Dubai, UAE
