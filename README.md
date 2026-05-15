# Hot Wok Restaurant

Production-ready Next.js App Router site for Hot Wok in Lawton, Oklahoma.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4 via global styles

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm run start
```

## Assets

The homepage is wired to these expected image paths in `/public`:

- `/hero-wok.png`
- `/logo.png`
- `/general-tsos-chicken.png`
- `/orange-chicken.png`
- `/sesame-chicken.png`
- `/lo-mein.png`
- `/fried-rice.png`
- `/crab-rangoon.png`
- `/banner-appetizers.png`
- `/banner-beef.png`
- `/banner-chicken.png`
- `/banner-fried-rice.png`
- `/banner-lo-mein.png`
- `/banner-shrimp.png`
- `/banner-soups.png`
- `/egg-rolls.png`
- `/wonton-soup.png`

## Deployment

This project is ready for Vercel deployment with the default Next.js setup.

If you want canonical metadata in production, set `NEXT_PUBLIC_SITE_URL` in your
deployment environment.
