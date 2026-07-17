# Duck CEO Website

A responsive Vite + React website for Duck CEO.

## Included

- Home / hero section
- Tokenomics placeholders
- Full roadmap
- Trade button marked **Soon**
- Duck Run browser game
- Duck CEO Billionaire Slots demo using virtual points only
- Mobile responsive design
- Existing Duck CEO logo and hero artwork

## Important safety note

The slot game is intentionally a **free demo**. It does not accept SOL, DUCKCEO or real-money wagers. Do not convert it into a gambling product without obtaining qualified legal advice and all required licences.

## Run locally

Install Node.js 20.19 or newer, then:

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Build

```bash
npm run build
```

The production files are generated in `dist/`.

## Deploy to Vercel

1. Create a GitHub repository.
2. Upload the project files.
3. Import the repository in Vercel.
4. Vercel should detect Vite automatically.
5. Build command: `npm run build`
6. Output directory: `dist`
7. Add your `duckceo.fun` domain in Vercel.
8. Update your domain DNS records using the values shown by Vercel.

## Things to edit before launch

In `src/main.jsx`:

- Replace the `#` links for X and Telegram.
- Replace every `SOON` field when the token is launched.
- Update final supply, liquidity and tax information only after confirming it on-chain.
- Keep CEX wording as “applications” rather than guaranteed listings.

## Trade integration

The Trade button is disabled in this version. Add a wallet + Jupiter swap integration only after the token exists and its mint address is final. Every transaction must be displayed clearly and confirmed inside the user's wallet.
