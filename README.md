# Gyan Portfolio

Photography portfolio built with React, Vite, Tailwind CSS, Framer Motion, and GSAP.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Add gallery photos

1. Drop images into `public/images/` (JPG, PNG, or WebP recommended).
2. On Mac, HEIC files are auto-converted to JPG when you run:

```bash
npm run images:manifest
```

3. Refresh the site.

## Deploy on Netlify

This repo is ready for [Netlify](https://www.netlify.com/):

1. Push to GitHub: `https://github.com/roopnsingh/gyan_portfolio`
2. In Netlify: **Add new site** → **Import from Git** → select the repo.
3. Build settings are read from `netlify.toml` automatically:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy**.

No environment variables are required for a static deploy.

## Build for production

```bash
npm run build
npm run preview
```
