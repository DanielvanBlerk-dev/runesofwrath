# Runes of Wrath — website

Single-page static site (HTML/CSS/JS, no build step). Open `index.html` or serve the folder; works on GitHub Pages as-is.

## Layout
- `index.html` — page, synopsis text, social links
- `css/style.css`, `js/main.js` — styling, roster data, pop-up logic
- `assets/img/` — `logo.png`, character art
- `assets/logos/` — white software logos (**placeholders: replace with the official white PNGs, same filenames**)

## To do before launch
- Replace the placeholder synopsis in `index.html`
- Set social URLs in the footer
- Set `MAILING_LIST_ENDPOINT` in `js/main.js` (e.g. Formspree) — otherwise signups are stored only in the visitor's browser
- Reveal further fighters by editing `ROSTER` in `js/main.js`

## Publish
```
git init && git add . && git commit -m "Initial site"
git remote add origin <repo-url> && git push -u origin main
```
Then enable GitHub Pages (Settings → Pages → deploy from `main`).
