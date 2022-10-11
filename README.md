# Waves Dev Portfolio

Dev portfolio for Daniel Grayvold ca. 2022. Now with calmer seas.

## Tools

-   Vue 3 + Vite
-   Windi CSS
-	ESLint
-   Prettier
-	[CloudFlare Turnstile](https://www.cloudflare.com/products/turnstile/)

## Getting started

1. Rename the two example env files `.env` and `.dev.vars`, removing `.example` on both. Fill out the keys as
listed in the files (all are required).

2. Install packages and run dev server:

	```sh
	pnpm install

	pnpm run dev

	# To test Pages functions with Wrangler:
	wrangler pages dev -- pnpm dev

	# Open 127.0.0.1:8788
	```