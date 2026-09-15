(function () {
  const PAGE = 6;
  const seed = [
    { id: "DL-9082", pair: "GBP/USD", party: "Organisation Trader", type: "org", pay: "GBP 5,050.00", recv: "USD 6,450.00", rate: "1.2900", funded: 75, status: "Active" },
    { id: "DL-9014", pair: "USD/NGN", party: "Individual Trader", type: "person", pay: "USD 10,000.00", recv: "NGN 16,500,000.00", rate: "1,650.00", funded: 10, status: "Active" },
    { id: "DL-8994", pair: "GBP/NGN", party: "Organisation Trader", type: "org", pay: "GBP 12,050.00", recv: "NGN 22,560,000.00", rate: "1,880.00", funded: 50, status: "Overdue" },
    { id: "DL-8961", pair: "EUR/USD", party: "Organisation Trader", type: "org", pay: "EUR 15,000.00", recv: "USD 16,200.00", rate: "1.0800", funded: 100, status: "Completed" },
    { id: "DL-8902", pair: "USD/NGN", party: "Organisation Trader", type: "org", pay: "USD 25,000.00", recv: "NGN 41,250,000.00", rate: "1,650.00", funded: 0, status: "Cancelled" },
    { id: "DL-8888", pair: "GBP/EUR", party: "Individual Trader", type: "person", pay: "GBP 3,550.00", recv: "EUR 4,130.00", rate: "1.1800", funded: 60, status: "Active" }
  ];

  const extra = [
    ["DL-8871", "GBP/USD", "Organisation Trader", "org", "GBP 8,080.00", "USD 10,320.00", "1.2900", 100, "Completed"],
    ["DL-8854", "USD/NGN", "Individual Trader", "person", "USD 4,000.00", "NGN 6,600,000.00", "1,650.00", 100, "Completed"],
    ["DL-8840", "GBP/NGN", "Organisation Trader", "org", "GBP 2,010.00", "NGN 3,760,000.00", "1,880.00", 100, "Completed"],
    ["DL-8822", "EUR/USD", "Organisation Trader", "org", "EUR 9,000.00", "USD 9,720.00", "1.0800", 100, "Completed"],
    ["DL-8809", "GBP/USD", "Individual Trader", "person", "GBP 1,210.00", "USD 1,548.00", "1.2900", 0, "Cancelled"],
    ["DL-8795", "USD/NGN", "Organisation Trader", "org", "USD 15,000.00", "NGN 24,750,000.00", "1,650.00", 100, "Completed"],
    ["DL-8781", "GBP/EUR", "Organisation Trader", "org", "GBP 6,060.00", "EUR 7,080.00", "1.1700", 100, "Completed"],
    ["DL-8766", "GBP/NGN", "Individual Trader", "person", "GBP 5,025.00", "NGN 9,400,000.00", "1,880.00", 100, "Completed"],
    ["DL-8750", "EUR/USD", "Organisation Trader", "org", "EUR 11,000.00", "USD 11,880.00", "1.0800", 100, "Completed"],
    ["DL-8733", "GBP/USD", "Organisation Trader", "org", "GBP 20,100.00", "USD 25,800.00", "1.2900", 100, "Completed"],
    ["DL-8718", "USD/NGN", "Individual Trader", "person", "USD 7,500.00", "NGN 12,375,000.00", "1,650.00", 100, "Completed"],
    ["DL-8701", "GBP/EUR", "Organisation Trader", "org", "GBP 750.00", "EUR 885.00", "1.1800", 100, "Completed"]
  ].map((r) => ({ id: r[0], pair: r[1], party: r[2], type: r[3], pay: r[4], recv: r[5], rate: r[6], funded: r[7], status: r[8] }));

  const ALL = seed.concat(extra);
  let tab = "all";
  let page = 1;

  function personIco() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3" fill="currentColor"/><path d="M5 19c1-3.5 3.5-5 7-5s6 1.5 7 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  }

  function orgIco() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 19V9.5L12 5l8 4.5V19" stroke="currentColor" stroke-width="1.7"/><path d="M9 19v-5h6v5" stroke="currentColor" stroke-width="1.7"/></svg>`;
  }

  function badgeClass(s) {
    if (s === "Overdue") return "status-expired";
    if (s === "Cancelled") return "status-cancelled";
    if (s === "Completed") return "status-complete";
    return "status-progress";
  }

  function barClass(n) {
    if (n >= 100) return "bar-ok";
    return "bar-mid";
  }

  function count(status) {
    return ALL.filter((d) => d.status === status).length;
  }

  function filtered() {
    if (tab === "all") return ALL;
    return ALL.filter((d) => d.status === tab);
  }

  function renderTabs() {
    const items = [
      ["all", "All Deals"],
      ["Active", `Active (${count("Active")})`],
      ["Completed", `Completed (${count("Completed")})`],
      ["Overdue", `Overdue (${count("Overdue")})`],
      ["Cancelled", `Cancelled (${count("Cancelled")})`]
    ];
    document.getElementById("deal-tabs").innerHTML = items.map(([id, label]) =>
      `<button type="button" class="${tab === id ? "is-on" : ""}" data-tab="${id}">${label}</button>`
    ).join("");
  }

  function render() {
    const rows = filtered();
    const pages = Math.max(1, Math.ceil(rows.length / PAGE));
    if (page > pages) page = pages;
    const start = (page - 1) * PAGE;
    const slice = rows.slice(start, start + PAGE);
    document.getElementById("deal-body").innerHTML = slice.map((d) => `
      <tr>
        <td class="req-id">${d.id}</td>
        <td>${d.pair}</td>
        <td><span class="provider-cell"><span class="ico-wrap">${d.type === "org" ? orgIco() : personIco()}</span>${d.party}</span></td>
        <td>${d.pay}</td>
        <td class="recv-amt">${d.recv}</td>
        <td>${d.rate}</td>
        <td>
          <div class="fund-cell">
            <span>${d.funded}% funded</span>
            <div class="bar-track bar-tiny"><div class="bar-fill ${barClass(d.funded)}" style="width:${d.funded}%"></div></div>
          </div>
        </td>
        <td><span class="status-badge ${badgeClass(d.status)}">${d.status}</span></td>
        <td><a class="enter-cta" href="deal-flow.html">Enter Room</a></td>
      </tr>`).join("");
    document.getElementById("deal-cards").innerHTML = slice.map((d) => `
      <article class="dash-bid-card">
        <div class="dash-bid-top">
          <span class="req-id">${d.id}</span>
          <span class="status-badge ${badgeClass(d.status)}">${d.status}</span>
        </div>
        <span class="provider-cell"><span class="ico-wrap">${d.type === "org" ? orgIco() : personIco()}</span>${d.party}</span>
        <dl class="list-kv">
          <dt>Pair</dt><dd>${d.pair}</dd>
          <dt>You pay</dt><dd>${d.pay}</dd>
          <dt>You receive</dt><dd class="recv-amt">${d.recv}</dd>
          <dt>Rate</dt><dd>${d.rate}</dd>
        </dl>
        <div class="fund-cell">
          <span>${d.funded}% funded</span>
          <div class="bar-track bar-tiny"><div class="bar-fill ${barClass(d.funded)}" style="width:${d.funded}%"></div></div>
        </div>
        <a class="enter-cta" href="deal-flow.html">Enter Room</a>
      </article>`).join("");
    const end = start + slice.length;
    document.getElementById("deal-count").textContent = `Showing ${rows.length ? start + 1 : 0}-${end} of ${rows.length} deals`;
    document.getElementById("deal-pages").innerHTML = Array.from({ length: pages }, (_, i) => {
      const n = i + 1;
      return `<button type="button" class="${n === page ? "is-on" : ""}" data-page="${n}">${n}</button>`;
    }).join("");
  }

  document.getElementById("deal-tabs").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tab]");
    if (!btn) return;
    tab = btn.dataset.tab;
    page = 1;
    renderTabs();
    render();
  });

  document.getElementById("deal-pages").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn) return;
    page = Number(btn.dataset.page);
    render();
  });

  renderTabs();
  render();
})();
