# BankersKlub India Foundation website

A static website: plain HTML, CSS and JavaScript. No server, database or build step is needed to host it.

## Pages

| File | Page |
|---|---|
| index.html | Home (switches automatically with the campaign dates) |
| sankalp-se-shakti.html | Campaign and donation page: Sankalp se Shakti, Shakti se Samriddhi (the link for social posts) |
| thank-you.html | Thank-you page (set this as the Razorpay redirect after payment) |
| about.html | About, founders, journey, registration |
| our-work.html | What we do, the Haryana pilot, results and testimonials |
| ailaxmi.html | AiLaxmi |
| news.html | Newsletter (PDF in assets/docs) and press clippings |
| contact.html | Contact, ways to help, grievances |
| privacy.html, terms.html, refunds.html | Policies (needed for Razorpay) |
| shakti-sankalp.html, impact.html | Old addresses; they forward to the new pages |

## Going live

1. **Host the folder.** Any static host works:
   - Netlify: drag this folder onto app.netlify.com/drop.
   - Vercel: import the folder as a new project.
   - AWS: upload to an S3 bucket behind CloudFront.
2. **Point the domain.** In your domain registrar, change bkifoundation.org's DNS from Framer to the new host, following the host's instructions.
3. **Turn off preview mode.** In `assets/js/config.js`, set `showTodo: false`.

## Editing content day to day: `assets/js/config.js`

- **Campaign dates:** Phase 1 runs 11 Oct to 15 Nov and Phase 2 runs 1 to 31 Dec. The home page, top ribbon and campaign page switch automatically between: before launch, live (with days left), between phases, and ended.
- **Progress bar:** fill in `goalAmount` and `raisedAmount` to show a progress bar. Update `raisedAmount` weekly.
- **Payment links:** one Razorpay link per amount in `donateLinks`. Keep the "any amount" link in its long `pages.razorpay.com/...` form and its amount field named "Donation" (`customAmountField`), so the amount a donor types carries through.
- **Registration details:** fill in CIN, PAN, 12A, 80G, Darpan ID and the grievance officer.
- **Tax line:** `showTaxBenefit` turns the 80G tax line on or off.
- **AiLaxmi:** `ailaxmiLink` adds a "Try AiLaxmi" button, once you have a public WhatsApp or app link.
- **Contact form:** messages go to Formspree (`contactForm.endpoint`), which emails them to the address the Formspree form is set up with. With `contactForm.endpoint` empty, "Send message" opens the visitor's email app addressed to info@bkifoundation.org. Paste a Formspree or Web3Forms endpoint to receive messages straight in your inbox.

## Videos

Save testimonial videos as MP4 in `assets/video/` with these names, then rebuild: `madhu.mp4`, `rama.mp4`, `saba.mp4`, `maajid.mp4`, `shabnam.mp4`. Each one replaces its placeholder photo.

To check a date state before it happens, add `?today=2026-10-20` (or any date) to the end of a page address.

## Photos still needed

Save square headshots (about 440 × 440 px, JPG) in `assets/img/founders/` with these exact names:
`rajat.jpg`, `barnali.jpg`, `manideep.jpg`, `dilip.jpg`, `raza.jpg`.
Until a photo is added, that spot shows the person's initials.

## Razorpay setup (recommended)

Create one Payment Page per amount: ₹1,000, ₹2,000, ₹5,000, and one with an open amount. On each page:

- Required fields: full name, email, mobile, PAN, full address with PIN, and a checkbox reading "I am an Indian citizen (including NRIs with an Indian passport)".
- Turn on the 80G receipt with the approval number and the signatory's signature.
- Keep international payments switched off. BKIF has no FCRA registration.
- After payment, redirect to `https://bkifoundation.org/thank-you.html`.
- Paste the four page links into `donateLinks` in `assets/js/config.js`.

## Folder layout

- `assets/css/site.css`: all styles
- `assets/js/site.js`: behaviour (campaign states, donation slip, menus)
- `assets/js/config.js`: the settings above
- `assets/img/`: logo, favicon, field photos, press clippings, social share images
