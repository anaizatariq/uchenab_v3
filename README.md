# University of Chenab — V3 Homepage

Standalone frontend project. No build step required.

## Run locally
Open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000

then visit http://localhost:8000/

## Stack
- Semantic HTML5
- Custom CSS3 design system (`assets/css/v3.css`) on top of Bootstrap 5 (CDN grid/reset)
- Vanilla JavaScript (`assets/js/v3.js`) — no jQuery, no frameworks
- Google Fonts: Cinzel (display), Roboto (body), Inter (UI)

## Structure
    index.html
    assets/css/v3.css
    assets/js/v3.js
    assets/img/            campus, program, research and faculty imagery + logos

## Notes
- Colours, typography and all institutional content are taken from the verified V2 source.
- Internal links use `../` paths matching the existing site structure (about/, academics/,
  admissions/, research/, campus-life/, qec/, offices/, news/, career/, alumni/, contact/).
- Motion respects `prefers-reduced-motion`.
