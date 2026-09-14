(function () {
  const CURRENCIES = [
    { code: "GBP", symbol: "£", name: "pounds", flag: "🇬🇧" },
    { code: "USD", symbol: "$", name: "dollars", flag: "🇺🇸" },
    { code: "EUR", symbol: "€", name: "euros", flag: "🇪🇺" },
    { code: "CAD", symbol: "C$", name: "Canadian dollars", flag: "🇨🇦" },
    { code: "NGN", symbol: "₦", name: "naira", flag: "🇳🇬" }
  ];

  const RATES = {
    "GBP-NGN": 1880,
    "GBP-USD": 1.27,
    "GBP-EUR": 1.17,
    "GBP-CAD": 1.74,
    "USD-NGN": 1480,
    "USD-GBP": 0.79,
    "USD-EUR": 0.92,
    "USD-CAD": 1.37,
    "EUR-NGN": 1605,
    "EUR-GBP": 0.85,
    "EUR-USD": 1.09,
    "EUR-CAD": 1.49,
    "CAD-NGN": 1080,
    "CAD-GBP": 0.57,
    "CAD-USD": 0.73,
    "CAD-EUR": 0.67,
    "NGN-GBP": 0.00053,
    "NGN-USD": 0.00068,
    "NGN-EUR": 0.00062,
    "NGN-CAD": 0.00093
  };

  const BIDDERS = [
    { id: "ind1", name: "Individual Trader", type: "individual", rateAdj: 1, hours: 24, delivery: "Within 24 Hours", rating: 4.8, reliability: "best", methods: ["Direct Bank Transfer"], active: true },
    { id: "org4", name: "Organisation Trader", type: "organisation", rateAdj: 0.9985, hours: 12, delivery: "Instant Delivery", rating: 4.5, reliability: "normal", methods: ["Direct Bank Transfer"], active: false },
    { id: "org1", name: "Organisation Trader", type: "organisation", rateAdj: 0.9976, hours: 0, delivery: "Instant Delivery", rating: 4.0, reliability: "normal", methods: ["Direct Bank Transfer"], active: true },
    { id: "org5", name: "Organisation Trader", type: "organisation", rateAdj: 0.996, hours: 36, delivery: "Within 24 Hours", rating: 4.1, reliability: "low", methods: ["Direct Bank Transfer"], active: false },
    { id: "org2", name: "Organisation Trader", type: "organisation", rateAdj: 0.9947, hours: 0, delivery: "Instant Delivery", rating: 4.8, reliability: "normal", methods: ["Direct Bank Transfer"], active: true },
    { id: "org3", name: "Organisation Trader", type: "organisation", rateAdj: 0.9936, hours: 24, delivery: "Within 24 Hours", rating: 4.8, reliability: "low", methods: ["Direct Bank Transfer"], active: true },
    { id: "org6", name: "Organisation Trader", type: "organisation", rateAdj: 0.9925, hours: 48, delivery: "Within 24 Hours", rating: 4.0, reliability: "normal", methods: ["Direct Bank Transfer"], active: false },
    { id: "ind2", name: "Individual Trader", type: "individual", rateAdj: 0.991, hours: 24, delivery: "Within 24 Hours", rating: 4.3, reliability: "normal", methods: ["Direct Bank Transfer"], active: true },
    { id: "ind3", name: "Individual Trader", type: "individual", rateAdj: 0.988, hours: 6, delivery: "Instant Delivery", rating: 4.6, reliability: "best", methods: ["Direct Bank Transfer"], active: true },
    { id: "ind4", name: "Individual Trader", type: "individual", rateAdj: 0.984, hours: 24, delivery: "Within 24 Hours", rating: 4.2, reliability: "low", methods: ["Direct Bank Transfer"], active: false },
    { id: "org7", name: "Organisation Trader", type: "organisation", rateAdj: 0.982, hours: 12, delivery: "Instant Delivery", rating: 4.4, reliability: "normal", methods: ["Direct Bank Transfer"], active: false },
    { id: "ind5", name: "Individual Trader", type: "individual", rateAdj: 0.98, hours: 18, delivery: "Within 24 Hours", rating: 4.7, reliability: "best", methods: ["Direct Bank Transfer"], active: false }
  ];

  const state = {
    step: 1,
    from: "GBP",
    to: "NGN",
    amount: 5000,
    activeOnly: true,
    query: "",
    filter: "all",
    sort: "rate",
    page: 1,
    pageSize: 4,
    selected: null
  };

  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

  function chunkToWords(n) {
    if (n < 20) return ones[n];
    if (n < 100) return (tens[Math.floor(n / 10)] + (n % 10 ? "-" + ones[n % 10] : "")).trim();
    return ones[Math.floor(n / 100)] + " hundred" + (n % 100 ? " and " + chunkToWords(n % 100) : "");
  }

  function numberToWords(n) {
    n = Math.round(Math.abs(n));
    if (n === 0) return "zero";
    if (n >= 1e12) return n.toLocaleString();
    const parts = [];
    const scales = [
      [1e9, "billion"],
      [1e6, "million"],
      [1e3, "thousand"]
    ];
    for (const [value, name] of scales) {
      if (n >= value) {
        parts.push(chunkToWords(Math.floor(n / value)) + " " + name);
        n %= value;
      }
    }
    if (n) parts.push(chunkToWords(n));
    return parts.join(" ");
  }

  function currencyMeta(code) {
    return CURRENCIES.find((c) => c.code === code);
  }

  function money(code, value, compact) {
    const meta = currencyMeta(code);
    const abs = Number(value);
    if (compact && abs >= 1e6) {
      const m = abs / 1e6;
      return `${code}${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}m`;
    }
    const formatted = abs.toLocaleString(undefined, {
      minimumFractionDigits: abs < 10 && abs % 1 !== 0 ? 2 : 0,
      maximumFractionDigits: abs < 10 ? 2 : 0
    });
    return `${code}${formatted}`;
  }

  function pairRate(from, to) {
    if (from === to) return 1;
    return RATES[`${from}-${to}`] || 1;
  }

  function avatar(seed) {
    return `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=d1fae5,fde68a,e0e7ff`;
  }

  function stars(rating) {
    const full = Math.round(rating);
    return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
  }

  function fillCurrencySelect(el, selected) {
    el.innerHTML = CURRENCIES.map(
      (c) => `<option value="${c.code}" ${c.code === selected ? "selected" : ""}>${c.code}</option>`
    ).join("");
  }

  function inferredToAmount() {
    return state.amount * pairRate(state.from, state.to);
  }

  function buildBids() {
    const base = pairRate(state.from, state.to);
    let rows = BIDDERS.map((b) => {
      const rate = base * b.rateAdj;
      return {
        ...b,
        rate,
        fromAmount: state.amount,
        toAmount: state.amount * rate,
        fee: state.amount * 0.01
      };
    });
    if (state.activeOnly) rows = rows.filter((b) => b.active);
    if (state.query) {
      const q = state.query.toLowerCase();
      rows = rows.filter((b) =>
        b.name.toLowerCase().includes(q) ||
        (b.type || "").toLowerCase().includes(q) ||
        (b.reliability || "").toLowerCase().includes(q)
      );
    }

    rows.sort((a, b) => {
      if (state.sort === "rate") return b.rate - a.rate;
      if (state.sort === "fast") return a.hours - b.hours;
      return b.rating - a.rating;
    });
    return rows;
  }

  const FX_COPY = {
    1: {
      kicker: "Get Foreign Exchange",
      title: "Tell us what you need",
      lede: "Submit an auction request in seconds, let verified providers bid competitively, and select the rate that suits you best."
    },
    2: {
      kicker: "Marketplace Bids",
      title: "Compare Live Proposals",
      lede: "Verified institutional providers bid in real-time to execute your order. Tap any proposal to lock in."
    },
    3: {
      kicker: "Transaction Confirmation",
      title: "Secure Your Rate",
      lede: "Review final pricing and payout channels. ForexBid escrow ensures both parties perform securely."
    }
  };

  function keepGetFxInView() {
    const el = document.getElementById("get-fx");
    if (!el) return;
    const header = document.querySelector(".site-header");
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const top = window.scrollY + el.getBoundingClientRect().top - headerH;
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, Math.max(0, top));
    root.style.scrollBehavior = prev;
  }

  function showStep(n) {
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
    state.step = n;
    document.querySelectorAll("[data-step-panel]").forEach((p) => {
      p.hidden = Number(p.dataset.stepPanel) !== n;
    });
    document.querySelectorAll("[data-step]").forEach((btn) => {
      const id = Number(btn.dataset.step);
      btn.classList.toggle("is-active", id === n);
      btn.classList.toggle("is-done", id < n);
      const num = btn.querySelector(".step-num");
      if (num) num.textContent = id < n ? "✓" : String(id);
    });
    document.querySelectorAll("[data-step-line]").forEach((line) => {
      line.classList.toggle("is-done", Number(line.dataset.stepLine) < n);
    });
    const copy = FX_COPY[n];
    if (copy) {
      const k = document.getElementById("fx-kicker");
      const t = document.getElementById("fx-title");
      const l = document.getElementById("fx-lede");
      if (k) k.textContent = copy.kicker;
      if (t) t.textContent = copy.title;
      if (l) l.textContent = copy.lede;
    }
    if (n === 2) renderBids();
    if (n === 3) renderDeal();
    keepGetFxInView();
    requestAnimationFrame(keepGetFxInView);
    setTimeout(keepGetFxInView, 50);
  }

  function renderBids() {
    const list = document.getElementById("bid-list");
    const pager = document.getElementById("bid-pager");
    const rows = buildBids();
    const pages = Math.max(1, Math.ceil(rows.length / state.pageSize));
    if (state.page > pages) state.page = pages;
    const start = (state.page - 1) * state.pageSize;
    const slice = rows.slice(start, start + state.pageSize);

    if (!slice.length) {
      list.innerHTML = `<div class="empty">No matching bids. Try another search or filter.</div>`;
      pager.innerHTML = "";
      return;
    }

    list.innerHTML = slice
      .map((b, i) => {
        const featured = start === 0 && i === 0 && state.sort === "rate";
        const rateLabel = `1 ${state.from} = ${b.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${state.to}`;
        const receiveLabel = `${Math.round(b.toAmount).toLocaleString()} ${state.to}`;
        const badge = b.reliability || "normal";
        const badgeText = badge === "best" ? "Best" : badge === "low" ? "Low" : "Normal";
        return `<article class="bid-card${featured ? " is-featured" : ""}">
          <div class="bid-who">
            <span class="bid-icon" aria-hidden="true">${bidderIcon(b.type)}</span>
            <div>
              <strong>${b.name}</strong>
              <div class="bid-meta">
                <span class="star-ico" aria-hidden="true">★</span>
                <span class="bid-rating">${b.rating.toFixed(1)}</span>
                <span class="rel-badge rel-${badge}"><i></i>${badgeText}</span>${b.active ? "" : `<span class="rel-badge rel-offline"><i></i>Inactive</span>`}
              </div>
            </div>
          </div>
          <div class="bid-metric rate">
            <small>Exchange Rate</small>
            <b>${rateLabel}</b>
          </div>
          <div class="bid-metric amt">
            <small>You Receive</small>
            <b class="ok">${receiveLabel}</b>
            <em>${b.delivery || (b.hours ? `Within ${b.hours} Hours` : "Instant Delivery")}</em>
          </div>
          <div class="action">
            <button class="btn btn-brand btn-sm" type="button" data-deal="${b.id}">Select Bid</button>
          </div>
        </article>`;
      })
      .join("");

    const prev = Math.max(1, state.page - 1);
    const next = Math.min(pages, state.page + 1);
    pager.innerHTML =
      `<button type="button" class="pager-nav" data-page="${prev}" ${state.page === 1 ? "disabled" : ""} aria-label="Previous page">${chevron("left")}</button>` +
      Array.from({ length: pages }, (_, i) => {
        const p = i + 1;
        return `<button type="button" data-page="${p}" class="${p === state.page ? "is-current" : ""}">${p}</button>`;
      }).join("") +
      `<button type="button" class="pager-nav" data-page="${next}" ${state.page === pages ? "disabled" : ""} aria-label="Next page">${chevron("right")}</button>`;
  }

  function bidderIcon(type) {
    if (type === "individual") {
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.2" fill="#4A154B"/><path d="M5.5 18.5c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" stroke="#4A154B" stroke-width="1.8" stroke-linecap="round"/></svg>`;
    }
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 19V9.5L12 5l8 4.5V19" stroke="#4A154B" stroke-width="1.7" stroke-linejoin="round"/><path d="M8 19v-5h8v5M10 10.5h4" stroke="#4A154B" stroke-width="1.7" stroke-linecap="round"/></svg>`;
  }

  function chevron(dir) {
    const d = dir === "left" ? "M10 4L6 8l4 4" : "M6 4l4 4-4 4";
    return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function moneyPlain(code, value) {
    return `${code} ${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function renderDeal() {
    const bid = state.selected || buildBids()[0];
    state.selected = bid;
    const pay = bid.fromAmount + bid.fee;
    document.getElementById("deal-from-amount").textContent = moneyPlain(state.from, bid.fromAmount);
    document.getElementById("deal-fee").textContent = moneyPlain(state.from, bid.fee);
    document.getElementById("deal-pay-total").textContent = moneyPlain(state.from, pay);
    document.getElementById("deal-receive-total").textContent = moneyPlain(state.to, bid.toAmount);
    document.getElementById("deal-rate").textContent =
      `1 ${state.from} = ${bid.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${state.to}`;
    document.getElementById("deal-partner-name").textContent = bid.name;
    document.getElementById("deal-methods").textContent = (bid.methods && bid.methods[1]) || bid.methods[0] || "Direct Bank Transfer";
  }

  function openCheckout() {
    document.getElementById("checkout-modal").classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeCheckout() {
    document.getElementById("checkout-modal").classList.remove("open");
    document.body.style.overflow = "";
  }

  function syncFlags() {
    const fromFlag = document.getElementById("from-flag");
    const toFlag = document.getElementById("to-flag");
    const from = currencyMeta(state.from);
    const to = currencyMeta(state.to);
    if (fromFlag && from) fromFlag.textContent = from.flag;
    if (toFlag && to) toFlag.textContent = to.flag;
  }

  function syncToAmount() {
    document.getElementById("to-amount").value = inferredToAmount().toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    syncFlags();
  }

  function init() {
    const fromSel = document.getElementById("from-currency");
    const toSel = document.getElementById("to-currency");
    fillCurrencySelect(fromSel, state.from);
    fillCurrencySelect(toSel, state.to);
    document.getElementById("from-amount").value = state.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    syncToAmount();
    const hint = document.getElementById("rate-hint");
    if (hint) hint.textContent = "Rate: between 1,500 and 1,800";

    const swap = document.getElementById("swap-pair");
    if (swap) {
      swap.addEventListener("click", () => {
        const prevFrom = state.from;
        state.from = state.to;
        state.to = prevFrom;
        fromSel.value = state.from;
        toSel.value = state.to;
        syncToAmount();
      });
    }

    fromSel.addEventListener("change", () => {
      state.from = fromSel.value;
      if (state.from === state.to) {
        state.to = state.from === "GBP" ? "NGN" : "GBP";
        toSel.value = state.to;
      }
      syncToAmount();
    });
    toSel.addEventListener("change", () => {
      state.to = toSel.value;
      if (state.from === state.to) {
        state.from = state.to === "NGN" ? "GBP" : "NGN";
        fromSel.value = state.from;
      }
      syncToAmount();
    });
    document.getElementById("from-amount").addEventListener("input", (e) => {
      state.amount = Number(String(e.target.value).replace(/,/g, "")) || 0;
      syncToAmount();
    });
    document.getElementById("active-only").addEventListener("change", (e) => {
      state.activeOnly = e.target.checked;
    });

    document.getElementById("request-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const agreed = document.getElementById("terms-agree").checked;
      const captcha = document.getElementById("request-captcha");
      const note = document.getElementById("request-error");
      if (!agreed || !state.amount || (captcha && !captcha.checked)) {
        note.hidden = false;
        return;
      }
      note.hidden = true;
      state.page = 1;
      state.selected = null;
      state.activeOnly = document.getElementById("active-only").checked;
      showStep(2);
    });

    document.getElementById("bid-search").addEventListener("input", (e) => {
      state.query = e.target.value;
      state.page = 1;
      renderBids();
    });
    document.getElementById("bid-sort").addEventListener("change", (e) => {
      state.sort = e.target.value;
      renderBids();
    });
    document.getElementById("bid-list").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-deal]");
      if (!btn) return;
      state.selected = buildBids().find((b) => b.id === btn.dataset.deal);
      showStep(3);
    });
    document.getElementById("bid-pager").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-page]");
      if (!btn) return;
      state.page = Number(btn.dataset.page);
      renderBids();
    });

    document.querySelectorAll("[data-go-step]").forEach((btn) => {
      btn.addEventListener("click", () => showStep(Number(btn.dataset.goStep)));
    });

    document.getElementById("accept-deal").addEventListener("click", () => {
      sessionStorage.setItem("fxb-selected-bid", JSON.stringify({
        partner: state.selected.name,
        from: state.from,
        to: state.to,
        amount: state.amount,
        rate: state.selected.rate
      }));
      openCheckout();
    });

    const feeLink = document.getElementById("fee-link");
    const feeBox = document.getElementById("fee-callout");
    const feeClose = document.getElementById("fee-close");
    if (feeLink && feeBox) {
      feeLink.addEventListener("click", () => {
        feeBox.hidden = !feeBox.hidden;
      });
    }
    if (feeClose && feeBox) {
      feeClose.addEventListener("click", () => {
        feeBox.hidden = true;
      });
    }

    document.querySelectorAll("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", closeCheckout);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeCheckout();
    });

    document.getElementById("checkout-signin").addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = "deal-flow.html";
    });
    document.getElementById("checkout-register").addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = "deal-flow.html";
    });

    document.getElementById("contact-form").addEventListener("submit", (e) => {
      e.preventDefault();
      document.getElementById("contact-success").classList.add("show");
      e.target.reset();
    });

    document.querySelectorAll(".faq-item button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.parentElement;
        const open = item.classList.contains("open");
        document.querySelectorAll(".faq-item").forEach((i) => {
          i.classList.remove("open");
          const mark = i.querySelector("button span");
          if (mark) mark.textContent = "+";
        });
        if (!open) {
          item.classList.add("open");
          const mark = btn.querySelector("span");
          if (mark) mark.textContent = "−";
        }
      });
    });

    if (location.hash === "#get-fx") {
      document.getElementById("get-fx").scrollIntoView();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
