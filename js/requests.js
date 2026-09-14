(function () {
  const PAGE = 8;
  const seed = [
    { id: "REQ-9902", pair: "GBP/USD", from: "GBP 5,000", to: "USD 6,450", bids: "5 bids", rate: "1.2900", status: "Bidding", when: "10 min ago" },
    { id: "REQ-9901", pair: "USD/NGN", from: "USD 10,000", to: "NGN 16,500,000", bids: "12 bids", rate: "1,650.00", status: "Bid Selected", when: "1h ago" },
    { id: "REQ-9884", pair: "GBP/EUR", from: "GBP 3,500", to: "EUR 4,130", bids: "2 bids", status: "Open", rate: "1.1800", when: "3h ago" },
    { id: "REQ-9870", pair: "GBP/NGN", from: "GBP 12,000", to: "NGN 22,560,000", bids: "8 bids", rate: "1,880.00", status: "Completed", when: "Yesterday" },
    { id: "REQ-9861", pair: "USD/NGN", from: "USD 25,000", to: "NGN 41,250,000", bids: "0 bids", rate: "—", status: "Expired", when: "2 days ago" },
    { id: "REQ-9850", pair: "EUR/USD", from: "EUR 15,000", to: "USD 16,200", bids: "4 bids", rate: "1.0800", status: "Completed", when: "3 days ago" },
    { id: "REQ-9842", pair: "GBP/USD", from: "GBP 8,000", to: "USD 10,320", bids: "1 bid", rate: "1.2900", status: "Cancelled", when: "4 days ago" },
    { id: "REQ-9833", pair: "USD/NGN", from: "USD 50,000", to: "NGN 82,500,000", bids: "19 bids", rate: "1,650.00", status: "Completed", when: "1 week ago" }
  ];

  const extra = [
    ["REQ-9820", "GBP/USD", "GBP 2,000", "USD 2,560", "3 bids", "1.2800", "Bidding", "1 week ago"],
    ["REQ-9811", "GBP/EUR", "GBP 6,000", "EUR 7,020", "6 bids", "1.1700", "Open", "8 days ago"],
    ["REQ-9804", "USD/NGN", "USD 4,000", "NGN 6,600,000", "2 bids", "1,650.00", "Completed", "9 days ago"],
    ["REQ-9798", "EUR/USD", "EUR 9,000", "USD 9,720", "1 bid", "1.0800", "Expired", "10 days ago"],
    ["REQ-9785", "GBP/NGN", "GBP 1,500", "NGN 2,820,000", "4 bids", "1,880.00", "Bid Selected", "11 days ago"],
    ["REQ-9772", "GBP/USD", "GBP 20,000", "USD 25,800", "9 bids", "1.2900", "Completed", "12 days ago"],
    ["REQ-9760", "USD/NGN", "USD 7,500", "NGN 12,375,000", "0 bids", "—", "Cancelled", "2 weeks ago"],
    ["REQ-9748", "GBP/EUR", "GBP 4,200", "EUR 4,914", "5 bids", "1.1700", "Bidding", "2 weeks ago"],
    ["REQ-9731", "EUR/USD", "EUR 11,000", "USD 11,880", "3 bids", "1.0800", "Open", "2 weeks ago"],
    ["REQ-9719", "GBP/NGN", "GBP 9,000", "NGN 16,920,000", "7 bids", "1,880.00", "Completed", "3 weeks ago"],
    ["REQ-9705", "GBP/USD", "GBP 1,200", "USD 1,548", "2 bids", "1.2900", "Expired", "3 weeks ago"],
    ["REQ-9690", "USD/NGN", "USD 15,000", "NGN 24,750,000", "11 bids", "1,650.00", "Bid Selected", "3 weeks ago"],
    ["REQ-9677", "GBP/EUR", "GBP 750", "EUR 885", "1 bid", "1.1800", "Cancelled", "4 weeks ago"],
    ["REQ-9662", "EUR/USD", "EUR 5,500", "USD 5,940", "4 bids", "1.0800", "Completed", "4 weeks ago"],
    ["REQ-9648", "GBP/NGN", "GBP 3,000", "NGN 5,640,000", "6 bids", "1,880.00", "Open", "1 month ago"],
    ["REQ-9630", "GBP/USD", "GBP 16,000", "USD 20,640", "8 bids", "1.2900", "Completed", "1 month ago"]
  ].map((r) => ({ id: r[0], pair: r[1], from: r[2], to: r[3], bids: r[4], rate: r[5], status: r[6], when: r[7] }));

  const ALL = seed.concat(extra);
  let page = 1;
  let query = "";
  let status = "all";
  let pair = "all";

  function badgeClass(s) {
    if (s === "Open") return "status-open";
    if (s === "Expired") return "status-expired";
    if (s === "Cancelled") return "status-cancelled";
    if (s === "Completed") return "status-complete";
    return "status-bid";
  }

  function filtered() {
    const q = query.toLowerCase();
    return ALL.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (pair !== "all" && r.pair !== pair) return false;
      if (q && !r.id.toLowerCase().includes(q) && !r.pair.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function render() {
    const rows = filtered();
    const pages = Math.max(1, Math.ceil(rows.length / PAGE));
    if (page > pages) page = pages;
    const start = (page - 1) * PAGE;
    const slice = rows.slice(start, start + PAGE);
    document.getElementById("req-body").innerHTML = slice.map((r) => `
      <tr>
        <td class="req-id">${r.id}</td>
        <td>${r.pair}</td>
        <td>${r.from}</td>
        <td>${r.to}</td>
        <td>${r.bids}</td>
        <td>${r.rate}</td>
        <td><span class="status-badge ${badgeClass(r.status)}">${r.status}</span></td>
        <td>${r.when}</td>
        <td><a class="view-cta" href="${r.status === "Bid Selected" || r.status === "Completed" ? "deal-flow.html" : "dashboard.html"}">View Details</a></td>
      </tr>`).join("");
    const end = start + slice.length;
    document.getElementById("req-count").textContent = `Showing ${rows.length ? start + 1 : 0}-${end} of ${rows.length} requests`;
    document.getElementById("req-pages").innerHTML = Array.from({ length: pages }, (_, i) => {
      const n = i + 1;
      return `<button type="button" class="${n === page ? "is-on" : ""}" data-page="${n}">${n}</button>`;
    }).join("");
  }

  document.getElementById("req-q").addEventListener("input", (e) => {
    query = e.target.value;
    page = 1;
    render();
  });
  document.getElementById("req-status").addEventListener("change", (e) => {
    status = e.target.value;
    page = 1;
    render();
  });
  document.getElementById("req-pair").addEventListener("change", (e) => {
    pair = e.target.value;
    page = 1;
    render();
  });
  document.getElementById("req-pages").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn) return;
    page = Number(btn.dataset.page);
    render();
  });

  render();
})();
