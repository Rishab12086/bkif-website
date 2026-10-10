/* BankersKlub India Foundation — site behaviour. Settings live in config.js. */
(function () {
  "use strict";
  var C = window.BKIF || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- dates (India time) ---------------- */
  function todayIST() {
    var q = null;
    try { q = new URLSearchParams(location.search).get("today"); } catch (e) {}
    if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) return q;
    var now = new Date(Date.now() + 330 * 60000); // UTC+5:30
    return now.toISOString().slice(0, 10);
  }
  function d(s) { var p = s.split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function fmt(s, withYear) { var p = s.split("-"); return (+p[2]) + " " + MONTHS[+p[1] - 1] + (withYear ? " " + p[0] : ""); }
  function inr(n) { return "₹" + Number(n).toLocaleString("en-IN"); }

  function campaignState() {
    var phases = (C.campaign && C.campaign.phases) || [];
    var t = d(todayIST());
    var out = { state: "ended", phases: phases, current: null, next: null, index: -1 };
    for (var i = 0; i < phases.length; i++) {
      var s = d(phases[i].start), e = d(phases[i].end);
      if (t < s) { out.next = phases[i]; out.index = i; out.state = i === 0 ? "pre" : "between"; break; }
      if (t >= s && t <= e) { out.current = phases[i]; out.index = i; out.state = "live"; out.daysLeft = Math.round((e - t) / 86400000) + 1; out.next = phases[i + 1] || null; break; }
    }
    if (out.state === "pre" || out.state === "between") out.daysTo = Math.round((d(out.next.start) - t) / 86400000);
    return out;
  }

  function applyCampaign() {
    var st = campaignState();
    document.documentElement.setAttribute("data-campaign", st.state);
    $$("[data-show]").forEach(function (el) {
      el.hidden = el.getAttribute("data-show").split(/\s+/).indexOf(st.state) === -1;
    });
    var p1 = st.phases[0], pl = st.phases[st.phases.length - 1];
    var vals = {
      phaseName: st.current ? st.current.name : (st.next ? st.next.name : ""),
      phaseDates: st.current ? fmt(st.current.start) + " – " + fmt(st.current.end) : (st.next ? fmt(st.next.start) + " – " + fmt(st.next.end) : ""),
      phaseEnd: st.current ? fmt(st.current.end) : "",
      daysLeft: st.daysLeft ? (st.daysLeft === 1 ? "last day" : st.daysLeft + " days left") : "",
      nextName: st.next ? st.next.name : "",
      nextStart: st.next ? fmt(st.next.start) : "",
      daysTo: st.daysTo != null ? (st.daysTo === 1 ? "tomorrow" : "in " + st.daysTo + " days") : "",
      launchDate: p1 ? fmt(p1.start) : "",
      finalEnd: pl ? fmt(pl.end, true) : ""
    };
    $$("[data-c]").forEach(function (el) { var k = el.getAttribute("data-c"); if (k in vals) el.textContent = vals[k]; });
    $$("[data-phase]").forEach(function (el) {
      var i = +el.getAttribute("data-phase"), ph = st.phases[i];
      if (!ph) { el.hidden = true; return; }
      var t = d(todayIST());
      el.classList.toggle("is-live", st.state === "live" && st.index === i);
      el.classList.toggle("is-done", t > d(ph.end));
      var b = $("b", el); if (b) b.textContent = fmt(ph.start) + " – " + fmt(ph.end, true);
      var sm = $("small", el); if (sm) sm.textContent = ph.name + (st.state === "live" && st.index === i ? " · live now" : (t > d(ph.end) ? " · closed" : ""));
    });
  }

  /* ---------------- progress bar ---------------- */
  function applyProgress() {
    var c = C.campaign || {};
    $$("[data-progress]").forEach(function (el) {
      if (!c.goalAmount || c.raisedAmount == null) { el.hidden = true; return; }
      el.hidden = false;
      var pct = Math.min(100, Math.round(c.raisedAmount / c.goalAmount * 100));
      var f = $(".progress-fill", el); if (f) f.style.setProperty("--w", pct + "%");
      var r = $("[data-raised]", el); if (r) r.textContent = inr(c.raisedAmount);
      var g = $("[data-goal]", el); if (g) g.textContent = inr(c.goalAmount);
      var dn = $("[data-donors]", el); if (dn) dn.textContent = c.donorCount ? c.donorCount.toLocaleString("en-IN") + " donors" : "";
      el.setAttribute("aria-label", pct + "% of goal raised");
    });
  }

  /* ---------------- org details ---------------- */
  var ORG_LABELS = { cin: "CIN", pan: "NGO PAN", reg12A: "12A/12AB number", reg80G: "80G number", darpanId: "NGO Darpan ID", grievanceName: "Grievance officer" };
  function applyOrg() {
    var o = C.org || {};
    $$("[data-org]").forEach(function (el) {
      var k = el.getAttribute("data-org"), v = o[k];
      var row = el.closest("[data-org-row]");
      if (v) { el.textContent = v; if (row) row.hidden = false; return; }
      if (C.showTodo) { el.innerHTML = '<span class="todo">To add: ' + (ORG_LABELS[k] || k) + "</span>"; }
      else if (row) { row.hidden = true; }
      else { el.textContent = ""; }
    });
    $$("[data-tax]").forEach(function (el) { el.hidden = !C.showTaxBenefit; });
    $$("[data-todo-only]").forEach(function (el) { el.hidden = !C.showTodo; });
    $$("[data-ailaxmi-link]").forEach(function (el) {
      if (C.ailaxmiLink) { el.href = C.ailaxmiLink; el.hidden = false; } else { el.hidden = true; }
    });
    $$("[data-ailaxmi-nolink]").forEach(function (el) { el.hidden = !!C.ailaxmiLink; });
    $$("[data-year]").forEach(function (el) { el.textContent = todayIST().slice(0, 4); });
  }

  /* ---------------- donation links on simple buttons ---------------- */
  function applyLinks() {
    var L = C.donateLinks || {};
    $$("[data-donate]").forEach(function (a) {
      var k = a.getAttribute("data-donate");
      if (L[k]) { a.href = L[k]; a.target = "_blank"; a.rel = "noopener"; }
    });
  }

  /* ---------------- rupees in words (Indian system) ---------------- */
  var ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  var TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  function two(n) { return n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : ""); }
  function three(n) { var h = Math.floor(n / 100), r = n % 100; return (h ? ONES[h] + " Hundred" + (r ? " " : "") : "") + (r ? two(r) : ""); }
  function words(n) {
    n = Math.floor(n);
    if (!n) return "";
    var parts = [], cr = Math.floor(n / 1e7); n %= 1e7;
    var lk = Math.floor(n / 1e5); n %= 1e5;
    var th = Math.floor(n / 1e3); n %= 1e3;
    if (cr) parts.push(three(cr) + " Crore");
    if (lk) parts.push(two(lk) + " Lakh");
    if (th) parts.push(two(th) + " Thousand");
    if (n) parts.push(three(n));
    return "Rupees " + parts.join(" ") + " Only";
  }
  window.BKIF_words = words;

  /* ---------------- donation slip ---------------- */
  function initSlip() {
    var slip = $("#slip"); if (!slip) return;
    slip.addEventListener("submit", function (e) { e.preventDefault(); });
    var tiers = C.tiers || [];
    var L = C.donateLinks || {};
    var btns = $$("[data-tier]", slip);
    var input = $("#amount", slip);
    var cb = $("#citizen", slip);
    var radios = $$("input[name=donor]", slip);
    var fcra = $("#fcraMsg", slip);
    var go = $("#donateBtn", slip);
    var hint = $("#slipHint", slip);
    var amount = C.defaultTier || 2000, isCustom = false;
    var set = function (sel, txt) { var el = $(sel); if (el) el.textContent = txt; };

    function eligible() {
      if (radios.length) { var r = $("input[name=donor]:checked", slip); return !!r && r.value === "in"; }
      return cb ? cb.checked : true;
    }
    function tierFor(a) { for (var i = 0; i < tiers.length; i++) if (tiers[i].amount === a) return tiers[i]; return null; }
    function womenText(a) {
      var t = tierFor(a);
      if (t) return "Trains " + t.women + (t.women === 1 ? " woman" : " women");
      if (a >= 1000) return "Helps train about " + Math.floor(a / 1000) + (Math.floor(a / 1000) === 1 ? " woman" : " women");
      return "Goes towards a woman's training";
    }
    function render() {
      var ok = amount >= 100, el = eligible();
      set("#stubAmount", ok ? inr(amount) : "₹—");
      set("#stubWomen", ok ? womenText(amount) : "Enter an amount");
      set("#words", ok ? words(amount) : "—");
      set("#purpose", ok ? "Sankalp se Shakti · " + womenText(amount).toLowerCase() : "Sankalp se Shakti");
      set("#btnLabel", ok ? "Proceed to Donate " + inr(amount) : "Proceed to Donate");
      if (fcra) fcra.hidden = el;
      var link = L[amount] && !isCustom ? L[amount] : L.custom;
      if (link && link === L.custom && ok && C.customAmountField) link += (link.indexOf("?") === -1 ? "?" : "&") + C.customAmountField + "=" + amount;
      go.href = link || "#";
      var ready = ok && el;
      go.classList.toggle("is-off", !ready);
      go.setAttribute("aria-disabled", ready ? "false" : "true");
      btns.forEach(function (b) { b.setAttribute("aria-pressed", String(!isCustom && +b.getAttribute("data-tier") === amount)); });
      set("#mbarLabel", ok ? inr(amount) + " · " + womenText(amount) : "Choose an amount");
      if (ready) hint.textContent = "";
    }
    btns.forEach(function (b) {
      b.addEventListener("click", function () { amount = +b.getAttribute("data-tier"); isCustom = false; if (input) input.value = ""; render(); });
    });
    if (input) input.addEventListener("input", function () {
      var v = parseInt(input.value.replace(/[^\d]/g, ""), 10);
      if (input.value !== "" && String(v || "") !== input.value) input.value = v ? String(v) : "";
      if (v) { amount = v; isCustom = !tierFor(v); } else { amount = C.defaultTier || 2000; isCustom = false; }
      hint.textContent = v && v < 100 ? "The minimum online donation is ₹100." : "";
      render();
    });
    if (cb) cb.addEventListener("change", render);
    radios.forEach(function (r) { r.addEventListener("change", render); });
    go.addEventListener("click", function (e) {
      if (go.getAttribute("aria-disabled") === "true") {
        e.preventDefault();
        if (amount < 100) { hint.textContent = "Enter an amount of ₹100 or more."; if (input) input.focus(); }
        else if (radios.length) { hint.textContent = "We can only accept donations from Indian citizens."; }
        else { hint.textContent = "Please confirm you are an Indian citizen to continue."; if (cb) cb.focus(); }
      }
    });
    // preselect from #t5000 or ?amount=5000; in-page links to #t1000 etc. also select
    function fromHash() {
      var m = (location.hash || "").match(/^#t(\d+)$/);
      if (m && tierFor(+m[1])) { amount = +m[1]; isCustom = false; if (input) input.value = ""; render(); var t = $("#give"); if (t) setTimeout(function () { t.scrollIntoView({ block: "start" }); }, 40); return true; }
      return false;
    }
    try { var qa = new URLSearchParams(location.search).get("amount"); if (qa && tierFor(+qa)) amount = +qa; } catch (e) {}
    render();
    fromHash();
    window.addEventListener("hashchange", fromHash);
  }

  /* ---------------- mobile donate bar ---------------- */
  function initMbar() {
    var bar = $(".mbar"); if (!bar) return;
    var hero = $("[data-hero]"), give = $("#slip") || $("#give");
    function upd() {
      var past = hero ? hero.getBoundingClientRect().bottom < 0 : window.scrollY > 500;
      var inGive = false;
      if (give) { var r = give.getBoundingClientRect(); inGive = r.top < window.innerHeight && r.bottom > 0; }
      bar.classList.toggle("show", past && !inGive);
    }
    window.addEventListener("scroll", upd, { passive: true }); upd();
  }

  /* ---------------- menu ---------------- */
  function initMenu() {
    var btn = $(".menu-btn"), dr = $("#drawer"); if (!btn || !dr) return;
    var path = btn.querySelector("path");
    function set(open) {
      dr.hidden = !open; btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (path) path.setAttribute("d", open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16");
    }
    btn.addEventListener("click", function () { set(dr.hidden); });
    dr.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("a")) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !dr.hidden) { set(false); btn.focus(); } });
  }

  /* ---------------- press lightbox ---------------- */
  function initLightbox() {
    var dlg = $("#lightbox"); if (!dlg) return;
    var img = $("img", dlg), ttl = $("[data-lb-title]", dlg);
    $$("[data-lightbox]").forEach(function (b) {
      b.addEventListener("click", function () {
        img.src = b.getAttribute("data-lightbox"); img.alt = b.getAttribute("data-alt") || "";
        ttl.textContent = b.getAttribute("data-title") || "";
        if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
      });
    });
    $$("[data-lb-close]", dlg).forEach(function (c) { c.addEventListener("click", function () { dlg.close ? dlg.close() : dlg.removeAttribute("open"); }); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  }

  /* ---------------- avatars: fall back to initials ---------------- */
  function initAvatars() {
    $$(".avatar img").forEach(function (im) {
      function fail() { im.remove(); }
      if (im.complete && im.naturalWidth === 0) fail(); else im.addEventListener("error", fail);
    });
  }

  /* ---------------- contact form → email ---------------- */
  function initContact() {
    var f = $("#contactForm"); if (!f) return;
    var cfg = C.contactForm || {}, out = $("#cf-out", f), btn = $("button[type=submit]", f);
    if (cfg.endpoint && out) out.textContent = "We reply within two working days.";
    var g = function (id) { var el = $("#" + id, f); return el ? el.value.trim() : ""; };
    var mailto = function () {
      var subject = "[" + (g("cf-topic") || "Enquiry") + "] from " + (g("cf-name") || "website visitor");
      var body = g("cf-message") + "\n\n— " + g("cf-name") + "\n" + g("cf-email") + (g("cf-phone") ? "\n" + g("cf-phone") : "");
      var to = (C.org && C.org.email) || "info@bkifoundation.org";
      if (out) out.textContent = "Opening your email app with this message. If nothing opens, write to " + to + ".";
      location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    };
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      if (!cfg.endpoint || !window.fetch) { mailto(); return; }
      var data = new FormData(f);
      var subj = "[" + (g("cf-topic") || "Enquiry") + "] Website message from " + g("cf-name");
      data.append(/formspree/.test(cfg.endpoint) ? "_subject" : "subject", subj);
      if (cfg.accessKey) data.append("access_key", cfg.accessKey);
      if (btn) btn.disabled = true;
      if (out) out.textContent = "Sending…";
      fetch(cfg.endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); f.reset(); if (out) out.textContent = "Thank you. Your message has reached our team and we will reply within two working days."; })
        .catch(function () { mailto(); })
        .then(function () { if (btn) btn.disabled = false; });
    });
  }

  /* ---------------- copy buttons ---------------- */
  function initCopy() {
    $$("[data-copy]").forEach(function (b) {
      b.addEventListener("click", function () {
        var t = b.getAttribute("data-copy"), lbl = b.textContent;
        var done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = lbl; }, 1600); };
        if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, function () {});
      });
    });
  }

  function boot() {
    applyCampaign(); applyProgress(); applyOrg(); applyLinks();
    initSlip(); initMbar(); initMenu(); initLightbox(); initAvatars(); initContact(); initCopy();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
