(function () {
  const CURRENCIES = [
    { code: "GBP", flag: "🇬🇧" },
    { code: "USD", flag: "🇺🇸" },
    { code: "EUR", flag: "🇪🇺" },
    { code: "CAD", flag: "🇨🇦" },
    { code: "NGN", flag: "🇳🇬" }
  ];

  const RATES = {
    "GBP-NGN": 1880, "GBP-USD": 1.27, "GBP-EUR": 1.17, "GBP-CAD": 1.74,
    "USD-NGN": 1480, "USD-GBP": 0.79, "USD-EUR": 0.92, "USD-CAD": 1.37,
    "EUR-NGN": 1605, "EUR-GBP": 0.85, "EUR-USD": 1.09, "EUR-CAD": 1.49,
    "CAD-NGN": 1080, "CAD-GBP": 0.57, "CAD-USD": 0.73, "CAD-EUR": 0.67,
    "NGN-GBP": 0.00053, "NGN-USD": 0.00068, "NGN-EUR": 0.00062, "NGN-CAD": 0.00093
  };

  const fromEl = document.getElementById("nr-from");
  const toEl = document.getElementById("nr-to");
  const fromAmt = document.getElementById("nr-from-amount");
  const toAmt = document.getElementById("nr-to-amount");
  const form = document.getElementById("nr-form");
  const review = document.getElementById("nr-review");
  const done = document.getElementById("nr-done");
  const error = document.getElementById("nr-error");
  const steps = document.getElementById("nr-steps");

  let step = 1;

  function fillSelect(el, selected) {
    el.innerHTML = CURRENCIES.map(
      (c) => `<option value="${c.code}" ${c.code === selected ? "selected" : ""}>${c.code}</option>`
    ).join("");
  }

  function meta(code) {
    return CURRENCIES.find((c) => c.code === code);
  }

  function parseAmount(raw) {
    const n = Number(String(raw).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  }

  function formatMoney(n) {
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function rate(from, to) {
    if (from === to) return 1;
    return RATES[`${from}-${to}`] || 1;
  }

  function setFlags() {
    document.getElementById("nr-from-flag").textContent = meta(fromEl.value).flag;
    document.getElementById("nr-to-flag").textContent = meta(toEl.value).flag;
  }

  function updateTo() {
    const amt = parseAmount(fromAmt.value);
    const value = amt * rate(fromEl.value, toEl.value);
    toAmt.value = amt ? formatMoney(value) : "";
    setFlags();
  }

  function renderSteps() {
    const items = [
      [1, "Request Details"],
      [2, "Review"],
      [3, "Submit"]
    ];
    steps.innerHTML = items.map(([n, label], i) => {
      const on = step >= n;
      const current = step === n;
      const line = i < items.length - 1 ? `<span class="nr-line${step > n ? " is-on" : ""}"></span>` : "";
      return `<div class="nr-step${on ? " is-on" : ""}${current ? " is-current" : ""}"><span>${n}</span><b>${label}</b></div>${line}`;
    }).join("");
  }

  function show(panel) {
    form.hidden = panel !== "form";
    review.hidden = panel !== "review";
    done.hidden = panel !== "done";
  }

  function snapshot() {
    const mode = document.getElementById("nr-mode");
    return {
      from: fromEl.value,
      to: toEl.value,
      fromAmt: formatMoney(parseAmount(fromAmt.value)),
      toAmt: toAmt.value,
      mode: mode.options[mode.selectedIndex].text,
      active: document.getElementById("nr-active").checked,
      expiry: document.getElementById("nr-expiry").checked ? "24 hours" : "Default 24 hours",
      notes: document.getElementById("nr-notes").value.trim() || "None"
    };
  }

  fillSelect(fromEl, "GBP");
  fillSelect(toEl, "NGN");
  updateTo();
  renderSteps();

  fromEl.addEventListener("change", () => {
    if (fromEl.value === toEl.value) {
      toEl.value = CURRENCIES.find((c) => c.code !== fromEl.value).code;
    }
    updateTo();
  });
  toEl.addEventListener("change", () => {
    if (fromEl.value === toEl.value) {
      fromEl.value = CURRENCIES.find((c) => c.code !== toEl.value).code;
    }
    updateTo();
  });
  fromAmt.addEventListener("input", updateTo);
  fromAmt.addEventListener("blur", () => {
    const n = parseAmount(fromAmt.value);
    if (n) fromAmt.value = formatMoney(n);
    updateTo();
  });

  document.getElementById("nr-swap").addEventListener("click", () => {
    const f = fromEl.value;
    fromEl.value = toEl.value;
    toEl.value = f;
    updateTo();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const amt = parseAmount(fromAmt.value);
    const ok = amt > 0 && fromEl.value !== toEl.value && document.getElementById("nr-terms").checked;
    error.hidden = ok;
    if (!ok) return;
    const s = snapshot();
    document.getElementById("nr-summary").innerHTML = [
      ["You sell", `${s.from} ${s.fromAmt}`],
      ["You receive (indicative)", `${s.to} ${s.toAmt}`],
      ["Pair", `${s.from}/${s.to}`],
      ["Trading mode", s.mode],
      ["Active verified bidders", s.active ? "Yes" : "No"],
      ["Auction expiry", s.expiry],
      ["Notes", s.notes]
    ].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    step = 2;
    renderSteps();
    show("review");
  });

  document.getElementById("nr-back").addEventListener("click", () => {
    step = 1;
    renderSteps();
    show("form");
  });

  document.getElementById("nr-confirm").addEventListener("click", () => {
    step = 3;
    renderSteps();
    show("done");
  });
})();
