(function () {
  const PAGE = 10;
  const NOW = new Date("2026-06-18T12:00:00");
  const TYPES = ["Deal Escrow", "Deal Payout", "Refund", "Funding", "Funding Deposit", "Transaction Fee"];
  const PAIRS = ["GBP/USD", "USD/NGN", "EUR/USD", "GBP/EUR", "EUR/NGN", "GBP/NGN"];

  const seed = [
    { date: "Jun 18, 2026", ref: "TXN-18421", pair: "GBP/USD", amount: "GBP -5,050.00", type: "Deal Escrow", status: "Confirmed", bal: "GBP 12,450.00" },
    { date: "Jun 18, 2026", ref: "TXN-18422", pair: "GBP/USD", amount: "NGN +6,450,000", type: "Deal Payout", status: "Confirmed", bal: "NGN 41,200,000" },
    { date: "Jun 17, 2026", ref: "TXN-18410", pair: "USD/NGN", amount: "USD +1,262.50", type: "Refund", status: "Confirmed", bal: "USD 22,150.00" },
    { date: "Jun 16, 2026", ref: "TXN-18388", pair: "EUR/USD", amount: "EUR -15,000.00", type: "Funding", status: "Confirmed", bal: "EUR 4,500.00" },
    { date: "Jun 15, 2026", ref: "TXN-18371", pair: "GBP/USD", amount: "GBP -50.00", type: "Transaction Fee", status: "Confirmed", bal: "GBP 17,500.00" },
    { date: "Jun 14, 2026", ref: "TXN-18340", pair: "USD/NGN", amount: "USD -10,000.00", type: "Deal Escrow", status: "Confirmed", bal: "USD 20,887.50" },
    { date: "Jun 14, 2026", ref: "TXN-18341", pair: "USD/NGN", amount: "NGN +16,500,000", type: "Deal Payout", status: "Confirmed", bal: "NGN 34,750,000" },
    { date: "Jun 12, 2026", ref: "TXN-18290", pair: "GBP/EUR", amount: "GBP +3,500.00", type: "Funding Deposit", status: "Confirmed", bal: "GBP 17,550.00" },
    { date: "Jun 10, 2026", ref: "TXN-18211", pair: "EUR/NGN", amount: "EUR -20.00", type: "Transaction Fee", status: "Confirmed", bal: "EUR 19,500.00" },
    { date: "Jun 09, 2026", ref: "TXN-18180", pair: "GBP/NGN", amount: "GBP -12,000.00", type: "Deal Escrow", status: "Confirmed", bal: "GBP 14,050.00" }
  ];

  function fmtDate(d) {
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  }

  function extra() {
    const rows = [];
    const amts = [
      ["GBP -2,020.00", "GBP 11,200.00"],
      ["USD +4,000.00", "USD 18,400.00"],
      ["EUR -750.00", "EUR 3,800.00"],
      ["NGN +2,200,000", "NGN 28,100,000"],
      ["GBP +1,000.00", "GBP 15,050.00"],
      ["USD -250.00", "USD 19,900.00"]
    ];
    for (let i = 0; i < 114; i++) {
      const day = new Date(NOW);
      day.setDate(NOW.getDate() - 10 - (i % 18));
      const amt = amts[i % amts.length];
      rows.push({
        date: fmtDate(day),
        ref: "TXN-" + (18100 - i),
        pair: PAIRS[i % PAIRS.length],
        amount: amt[0],
        type: TYPES[i % TYPES.length],
        status: "Confirmed",
        bal: amt[1]
      });
    }
    [
      { date: "Jun 17, 2026", ref: "TXN-18405", pair: "GBP/USD", amount: "GBP -500.00", type: "Funding", status: "Pending", bal: "GBP 12,450.00" },
      { date: "Jun 16, 2026", ref: "TXN-18390", pair: "USD/NGN", amount: "USD -1,000.00", type: "Deal Escrow", status: "Pending", bal: "USD 22,150.00" },
      { date: "Jun 11, 2026", ref: "TXN-18240", pair: "EUR/USD", amount: "EUR -80.00", type: "Transaction Fee", status: "Failed", bal: "EUR 4,500.00" },
      { date: "Jun 08, 2026", ref: "TXN-18150", pair: "GBP/EUR", amount: "GBP +200.00", type: "Refund", status: "Failed", bal: "GBP 14,050.00" }
    ].forEach((r) => rows.push(r));
    return rows;
  }

  const ALL = seed.concat(extra());
  let page = 1;

  function parseDate(label) {
    return new Date(label + " 12:00:00");
  }

  function inRange(row, days) {
    if (days === "all") return true;
    const d = parseDate(row.date);
    const from = new Date(NOW);
    from.setDate(NOW.getDate() - Number(days));
    return d >= from && d <= NOW;
  }

  function filtered() {
    const range = document.getElementById("st-range").value;
    const ccy = document.getElementById("st-ccy").value;
    const type = document.getElementById("st-type").value;
    const status = document.getElementById("st-status").value;
    return ALL.filter((r) => {
      if (!inRange(r, range)) return false;
      if (ccy !== "all" && !r.pair.includes(ccy) && !r.amount.startsWith(ccy) && !r.bal.startsWith(ccy)) return false;
      if (type !== "all" && r.type !== type) return false;
      if (status !== "all" && r.status !== status) return false;
      return true;
    });
  }

  function statusClass(s) {
    if (s === "Pending") return "status-open";
    if (s === "Failed") return "status-cancelled";
    return "status-progress";
  }

  function dlIco() {
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v12M7 11l5 5 5-5M5 20h14" stroke="#7B5EA7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function csvEscape(v) {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }

  function toCSV(rows) {
    const head = ["Date", "Reference", "Currency Pair", "Amount", "Type", "Status", "Running Balance"];
    return [head.join(",")].concat(rows.map((r) =>
      [r.date, r.ref, r.pair, r.amount, r.type, r.status, r.bal].map(csvEscape).join(",")
    )).join("\n");
  }

  function download(name, text, mime) {
    const blob = new Blob([text], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function render() {
    const rows = filtered();
    const pages = Math.max(1, Math.ceil(rows.length / PAGE));
    if (page > pages) page = pages;
    const start = (page - 1) * PAGE;
    const slice = rows.slice(start, start + PAGE);
    document.getElementById("st-body").innerHTML = slice.map((r) => `
      <tr>
        <td class="st-date">${r.date}</td>
        <td class="req-id">${r.ref}</td>
        <td>${r.pair}</td>
        <td>${r.amount}</td>
        <td><span class="type-chip">${r.type}</span></td>
        <td><span class="status-badge ${statusClass(r.status)}">${r.status}</span></td>
        <td>${r.bal}</td>
        <td><button class="st-dl" type="button" data-ref="${r.ref}" aria-label="Download ${r.ref}">${dlIco()}</button></td>
      </tr>`).join("");
    const end = start + slice.length;
    document.getElementById("st-count").textContent =
      `Showing ${rows.length ? start + 1 : 0}-${end} of ${rows.length} transactions`;
    document.getElementById("st-pages").innerHTML = Array.from({ length: pages }, (_, i) => {
      const n = i + 1;
      return `<button type="button" class="${n === page ? "is-on" : ""}" data-page="${n}">${n}</button>`;
    }).join("");
  }

  ["st-range", "st-ccy", "st-type", "st-status"].forEach((id) => {
    document.getElementById(id).addEventListener("change", () => {
      page = 1;
      render();
    });
  });

  document.getElementById("st-pages").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn) return;
    page = Number(btn.dataset.page);
    render();
  });

  document.getElementById("st-body").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-ref]");
    if (!btn) return;
    const row = ALL.find((r) => r.ref === btn.dataset.ref);
    if (!row) return;
    download(`${row.ref}.csv`, toCSV([row]), "text/csv");
  });

  document.getElementById("st-csv").addEventListener("click", () => {
    download("forexbid-statement.csv", toCSV(filtered()), "text/csv");
  });

  document.getElementById("st-pdf").addEventListener("click", () => {
    const rows = filtered();
    const html = `<!DOCTYPE html><html><head><title>ForexBid statement</title>
      <style>body{font-family:Geist,Segoe UI,sans-serif;padding:24px;color:#2d2a26}
      h1{font-size:20px}table{width:100%;border-collapse:collapse;font-size:12px}
      th,td{text-align:left;padding:8px;border-bottom:1px solid #e2dce5}</style></head>
      <body><h1>ForexBid statement</h1><p>Mock export · ${rows.length} transactions</p>
      <table><thead><tr><th>Date</th><th>Reference</th><th>Pair</th><th>Amount</th><th>Type</th><th>Status</th><th>Balance</th></tr></thead>
      <tbody>${rows.map((r) => `<tr><td>${r.date}</td><td>${r.ref}</td><td>${r.pair}</td><td>${r.amount}</td><td>${r.type}</td><td>${r.status}</td><td>${r.bal}</td></tr>`).join("")}</tbody></table>
      <script>window.onload=function(){window.print()}<\/script></body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
    } else {
      download("forexbid-statement.html", html, "text/html");
    }
  });

  render();
})();
