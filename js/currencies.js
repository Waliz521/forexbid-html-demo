(function () {
  const CODES = ["GBP", "USD", "EUR", "CAD", "NGN"];
  const pairs = [
    { id: "gbp-usd", pair: "GBP/USD", status: "Active", buy: "1.2800 - 1.3200", sell: "1.2500 - 1.2900", buyLim: "USD 1K - USD 100K", sellLim: "GBP 500 - GBP 50K", expiry: "15 Sep 2026, 10:00 PM", bids: 12 },
    { id: "gbp-eur", pair: "GBP/EUR", status: "Active", buy: "1.1600 - 1.1900", sell: "1.1400 - 1.1700", buyLim: "EUR 2K - EUR 50K", sellLim: "GBP 1K - GBP 40K", expiry: "20 Sep 2026, 04:00 PM", bids: 8 },
    { id: "usd-ngn", pair: "USD/NGN", status: "Paused", buy: "1,600.00 - 1,680.00", sell: "1,580.00 - 1,640.00", buyLim: "NGN 1M - NGN 50M", sellLim: "USD 5K - USD 500K", expiry: "10 Oct 2026, 12:00 AM", bids: 0 },
    { id: "eur-ngn", pair: "EUR/NGN", status: "Expired", buy: "1,750.00 - 1,820.00", sell: "1,700.00 - 1,780.00", buyLim: "NGN 5M - NGN 100M", sellLim: "EUR 10K - EUR 1M", expiry: "01 Aug 2026, 11:59 PM", bids: 3 }
  ];

  const grid = document.getElementById("tc-grid");
  const modal = document.getElementById("tc-modal");
  const form = document.getElementById("tc-form");
  const title = document.getElementById("tc-modal-title");
  let editing = null;

  function fillCodes() {
    const opts = CODES.map((c) => `<option value="${c}">${c}</option>`).join("");
    document.getElementById("tc-from").innerHTML = opts;
    document.getElementById("tc-to").innerHTML = opts;
  }

  function badge(status) {
    if (status === "Paused") return "status-new";
    if (status === "Expired") return "status-cancelled";
    return "status-progress";
  }

  function dot(status) {
    if (status === "Paused") return "dot-gold";
    if (status === "Expired") return "dot-bad";
    return "dot-ok";
  }

  function clock() {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.2"/><path d="M12 8v5l3 2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`;
  }

  function render() {
    if (!pairs.length) {
      grid.innerHTML = `<p class="lede">No trading pairs yet. Add one to start matching bids.</p>`;
      return;
    }
    grid.innerHTML = pairs.map((p) => `
      <article class="tc-card">
        <div class="tc-head">
          <div class="tc-pair">
            <span class="tc-dot ${dot(p.status)}"></span>
            <h3>${p.pair}</h3>
          </div>
          <span class="status-badge ${badge(p.status)}">${p.status}</span>
        </div>
        <div class="tc-stats">
          <div class="tc-stat-row">
            <div><small>Buy Rate Range</small><b>${p.buy}</b></div>
            <div class="is-end"><small>Sell Rate Range</small><b>${p.sell}</b></div>
          </div>
          <div class="tc-stat-row">
            <div><small>Buy Amount Limit</small><b>${p.buyLim}</b></div>
            <div class="is-end"><small>Sell Amount Limit</small><b>${p.sellLim}</b></div>
          </div>
        </div>
        <hr>
        <div class="tc-meta">
          <span>${clock()} Expires: ${p.expiry}</span>
          <em>${p.bids} Active Bids</em>
        </div>
        <div class="tc-actions">
          <button class="btn-edit" type="button" data-edit="${p.id}">Edit</button>
          <button class="btn-del" type="button" data-del="${p.id}">Delete</button>
        </div>
      </article>`).join("");
  }

  function openModal() {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    editing = null;
  }

  function splitPair(code) {
    const [from, to] = String(code).split("/");
    return { from: from || "GBP", to: to || "USD" };
  }

  function splitRange(value) {
    const parts = String(value || "").split(/\s+-\s+/);
    return { min: (parts[0] || "").trim(), max: (parts[1] || parts[0] || "").trim() };
  }

  function joinRange(min, max) {
    return `${min.trim()} - ${max.trim()}`;
  }

  function val(id) {
    return document.getElementById(id).value.trim();
  }

  function setVal(id, value) {
    document.getElementById(id).value = value;
  }

  function startAdd() {
    editing = null;
    title.textContent = "Add Trading Currency Pair";
    document.getElementById("tc-save").textContent = "Add Currency Pair";
    setVal("tc-from", "GBP");
    setVal("tc-to", "NGN");
    setVal("tc-buy-min", "1,850.00");
    setVal("tc-buy-max", "1,910.00");
    setVal("tc-sell-min", "600.00");
    setVal("tc-sell-max", "650.00");
    setVal("tc-buy-min-amt", "NGN 1,000,000");
    setVal("tc-buy-max-amt", "NGN 2,000,000");
    setVal("tc-expiry", "15 Sep 2026, 10:00 PM");
    document.getElementById("tc-active").checked = true;
    openModal();
  }

  function startEdit(item) {
    editing = item.id;
    title.textContent = "Edit Trading Currency Pair";
    document.getElementById("tc-save").textContent = "Save changes";
    const parts = splitPair(item.pair);
    const buy = splitRange(item.buy);
    const sell = splitRange(item.sell);
    const buyAmt = splitRange(item.buyLim);
    setVal("tc-from", parts.from);
    setVal("tc-to", parts.to);
    setVal("tc-buy-min", buy.min);
    setVal("tc-buy-max", buy.max);
    setVal("tc-sell-min", sell.min);
    setVal("tc-sell-max", sell.max);
    setVal("tc-buy-min-amt", buyAmt.min);
    setVal("tc-buy-max-amt", buyAmt.max);
    setVal("tc-expiry", item.expiry);
    document.getElementById("tc-active").checked = item.status === "Active";
    openModal();
  }

  fillCodes();
  render();

  document.getElementById("tc-add").addEventListener("click", startAdd);
  document.querySelectorAll("[data-close-tc]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  grid.addEventListener("click", (e) => {
    const edit = e.target.closest("[data-edit]");
    const del = e.target.closest("[data-del]");
    if (edit) {
      const item = pairs.find((p) => p.id === edit.dataset.edit);
      if (item) startEdit(item);
      return;
    }
    if (del) {
      const i = pairs.findIndex((p) => p.id === del.dataset.del);
      if (i >= 0) {
        pairs.splice(i, 1);
        render();
      }
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const from = val("tc-from");
    const to = val("tc-to");
    if (from === to) return;
    const active = document.getElementById("tc-active").checked;
    const existing = editing ? pairs.find((p) => p.id === editing) : null;
    let status = active ? "Active" : "Paused";
    if (existing && existing.status === "Expired" && !active) status = "Expired";
    const next = {
      id: editing || `${from}-${to}-${Date.now()}`.toLowerCase(),
      pair: `${from}/${to}`,
      status,
      buy: joinRange(val("tc-buy-min"), val("tc-buy-max")),
      sell: joinRange(val("tc-sell-min"), val("tc-sell-max")),
      buyLim: joinRange(val("tc-buy-min-amt"), val("tc-buy-max-amt")),
      sellLim: existing ? existing.sellLim : `${from} 500 - ${from} 50K`,
      expiry: val("tc-expiry"),
      bids: 0
    };
    if (editing) {
      const i = pairs.findIndex((p) => p.id === editing);
      if (i < 0) return;
      next.bids = pairs[i].bids;
      pairs[i] = next;
    } else {
      pairs.unshift(next);
    }
    closeModal();
    render();
  });

  if (location.hash === "#add") startAdd();
})();
