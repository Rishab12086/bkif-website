/* ==========================================================================
   BKIF SITE SETTINGS — the only file your team needs to edit day to day.
   Change a value, save, re-upload this file. No other code changes needed.
   ========================================================================== */
window.BKIF = {

  /* ---- Campaign: Sankalp se Shakti, Shakti se Samriddhi ------------------
     Dates are inclusive, in India time. The home page, the top ribbon and the
     campaign page switch automatically between: before launch, phase live,
     between phases, and campaign over. */
  campaign: {
    phases: [
      { name: "Phase 1", start: "2026-10-11", end: "2026-11-15" },
      { name: "Phase 2", start: "2026-12-01", end: "2026-12-31" }
    ],
    // Fill these in to show a progress bar. Leave as null to hide it.
    goalAmount: null,      // e.g. 500000  (₹5 lakh)
    raisedAmount: null,    // update weekly, e.g. 125000
    donorCount: null       // e.g. 140
  },

  /* ---- Donation tiers ---------------------------------------------------- */
  tiers: [
    { amount: 1000, women: 1 },
    { amount: 2500, women: 3 },
    { amount: 5000, women: 6 }
  ],
  defaultTier: 2500,

  /* ---- Payment links -----------------------------------------------------
     Best practice: one Razorpay Payment Page per amount, with the amount fixed
     and PAN, address and an "I am an Indian citizen" checkbox as required
     fields. Until those exist, every button opens the general page. */
  donateLinks: {
    1000: "https://rzp.io/rzp/bkif-sankalp-1000",
    2500: "https://rzp.io/rzp/bkif-sankalp-2500",
    5000: "https://rzp.io/l/bkif-sankalp-5000",
    // Use the long pages.razorpay.com address here: it keeps the amount the
    // donor typed (?donation=3000). The short rzp.io link drops it.
    custom: "https://pages.razorpay.com/bkif-sankalp-custom"
  },
  // Name of the amount field on the "any amount" Razorpay page, in lowercase
  // with underscores. It is "Donation" there now, so "donation".
  customAmountField: "donation",

  /* ---- Tax benefit line --------------------------------------------------
     Set to false if your CA advises not to mention the tax benefit. */
  showTaxBenefit: true,

  /* ---- Legal and registration details ------------------------------------
     Shown in "Verified and accountable" and the footer. Leave a value as ""
     to hide that row on the live site. */
  org: {
    legalName: "BankersKlub India Foundation",
    entityType: "Section 8 company (not-for-profit)",
    cin: "U88900DL2026NPL465655",
    pan: "AAOCB6638A",
    reg12A: "AAOCB6638AE2026101, dated 5 June 2026",
    reg80G: "AAOCB6638AF2026102, approved 5 June 2026, for tax years 2026-27 to 2028-29",
    darpanId: "DL/2026/1065543",
    fcra: "Not registered. We accept donations from Indian citizens only.",
    address: "F-95, Okhla Industrial Area, Phase-III, New Delhi 110020",
    phone: "+91 84481 89564",
    email: "info@bkifoundation.org",
    grievanceName: "Md Raza Ur Rahman",
    grievanceEmail: "info@bkifoundation.org"
  },

  /* ---- Contact form ("Send us a message" on the Contact page) -----------
     endpoint "" (now): the form opens the visitor's own email app with a
     message to info@bkifoundation.org already written. They press Send there.
     To receive messages straight in your inbox instead, create a free form at
     formspree.io (or web3forms.com) for info@bkifoundation.org and paste:
       Formspree:  endpoint: "https://formspree.io/f/your-form-id"
       Web3Forms:  endpoint: "https://api.web3forms.com/submit", accessKey: "your-key" */
  contactForm: { endpoint: "https://formspree.io/f/xvkzrblp", accessKey: "" },

  /* ---- AiLaxmi access link (WhatsApp or app). Leave "" to hide the button. */
  ailaxmiLink: "",

  /* ---- Preview mode ------------------------------------------------------
     true  = empty details above show a yellow "to add" tag (for review).
     false = empty details are hidden. SET TO false BEFORE GOING LIVE. */
  showTodo: false
};
