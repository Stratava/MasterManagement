# Master Management

Marketing website for Master Management, Stratava's AI-native platform for Managing Agents of sectional title schemes.

The site is a single static page with no build step. It uses the Master Management design system: colour, type, spacing and radius tokens, the component styles, Phosphor icons and the logo marks.

## Run it locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Structure

| Path | What it holds |
| --- | --- |
| `index.html` | The homepage |
| `assets/css/components.css` | Design-system component styles (buttons, tags, cards, steps, FAQ, status pills). Loads Plus Jakarta Sans and Phosphor icons. |
| `assets/css/site.css` | Design tokens as CSS variables, page layout, nav, login menu and demo modal |
| `assets/js/main.js` | Login menu, Book a demo modal, FAQ accordion and contact form |
| `assets/img/` | Logo marks and favicon |

## Deploy

Any static host works: GitHub Pages (Settings → Pages → deploy from `main`, root folder), Netlify or Vercel.

## Before going live

- **Lead capture:** the Book a demo modal and the contact form open the visitor's email app, addressed to hello@mastermanagement.africa. To receive leads without that step, point both forms at a form service (Formspree, HubSpot) or your own endpoint in `assets/js/main.js`.
- **Login links:** Owner, Tenant, Property Manager and Service Provider Login open the demo sign-in at `https://app.mastermanagement.africa/sign-in?as=owner` (`tenant`, `agent`, `provider`).
- **Placeholders:** the CSOS statistics need a source line, and the Privacy and Terms links need pages.
- **Font:** the design system names Gordita first. The site falls back to Plus Jakarta Sans unless Gordita is licensed and added.
